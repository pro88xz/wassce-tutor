// Edge Function: WASSCE Tutor chat via Groq (Llama 3.3 70B)
// Verifies user, checks subscription, enforces daily rate limit,
// saves both messages to DB, returns the AI reply.

const GROQ_API = 'https://api.groq.com/openai/v1/chat/completions'
const MODEL = 'llama-3.3-70b-versatile'
const DAILY_LIMIT = 20
const MAX_HISTORY = 20

const LESSON_SYSTEM_PROMPT = `You are an expert WASSCE curriculum writer for Sierra Leonean secondary school students preparing for the West African Senior School Certificate Examination.

Write a complete lesson in clean Markdown. Target length 600 to 900 words. Use these sections in order:

1. **Introduction** (2 to 3 sentences orienting the student to why this matters)
2. **Key Concepts** (the core ideas, defined plainly)
3. **Worked Examples** (1 to 3 step-by-step examples; show the working, not just the answer)
4. **Common Mistakes** (2 to 4 things students get wrong)
5. **Summary** (3 to 5 bullet points the student should remember)

Rules:
- Use KaTeX inline math like $x = 5$ and block math like $$\\frac{a}{b}$$ for any math
- Use simple, direct English a Form 5 student understands
- No padding, no introductions like "In this lesson we will...". Get straight into teaching
- Use markdown headers (##, ###) for sections, **bold** for emphasis, lists for enumerations
- Write FOR Sierra Leonean students: use local examples where natural (currency, place names, contexts students will recognize)
- Output ONLY the lesson markdown. No preamble, no "Here is your lesson:", no closing comments.`

const SYSTEM_PROMPT = `You are a patient WASSCE tutor for Sierra Leonean secondary school students preparing for the West African Senior School Certificate Examination.

Your job:
- Explain concepts clearly, step-by-step, in simple English a Form 5 student can follow.
- For math/physics/chemistry: show working line by line, not just the answer. Use KaTeX inline ($x = 5$) and block ($$\\frac{a}{b}$$) syntax — the app renders this.
- For essays/literature/government: give clear structure, key points, example phrasing — not full essays the student can copy.
- For history/geography/biology: explain causes and effects, not just facts.
- Be encouraging. "Good question" not "wrong". When they're confused, slow down.
- If a student asks something off-topic (entertainment, personal advice, anything not WASSCE-related), gently redirect: "Let's keep this focused on your studies — what subject are you working on?"
- Keep responses focused — aim for 100-300 words unless they ask for more detail. No padding, no preambles like "Great question!".

You're built for Sierra Leone. WASSCE is a real exam they're sitting. Take them seriously.`

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) return json({ error: 'Missing Authorization' }, 401)

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseAnon = Deno.env.get('SUPABASE_ANON_KEY')!
    const supabaseService = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

    // 1. Verify user
    const userRes = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: { Authorization: authHeader, apikey: supabaseAnon },
    })
    if (!userRes.ok) return json({ error: 'Invalid session' }, 401)
    const userData = await userRes.json()
    const userId = userData.id as string

    // 2. Load profile
    const profileRes = await fetch(
      `${supabaseUrl}/rest/v1/profiles?id=eq.${userId}&select=is_admin,subscription_active,subscription_expires_at,tutor_questions_today,tutor_questions_date`,
      { headers: { apikey: supabaseService, Authorization: `Bearer ${supabaseService}` } },
    )
    const profiles = await profileRes.json()
    const profile = profiles[0]
    if (!profile) return json({ error: 'Profile not found' }, 404)

    // 3. Subscription gate
    const isAdmin = profile.is_admin === true
    const subActive =
      profile.subscription_active === true &&
      profile.subscription_expires_at &&
      new Date(profile.subscription_expires_at).getTime() > Date.now()
    if (!isAdmin && !subActive) {
      return json({ error: 'Tutor is for subscribers only.', code: 'subscription_required' }, 403)
    }

    // 4. Rate limit
    const today = new Date().toISOString().slice(0, 10)
    let questionsToday = profile.tutor_questions_today ?? 0
    if (profile.tutor_questions_date !== today) questionsToday = 0
    if (!isAdmin && questionsToday >= DAILY_LIMIT) {
      return json({
        error: `Daily limit reached (${DAILY_LIMIT}/day). Come back tomorrow.`,
        code: 'rate_limit',
      }, 429)
    }

    // 5. Validate input + branch on mode
    const body = await req.json().catch(() => ({}))
    const mode = (body.mode as string | undefined) ?? 'chat'
    const userMessage = (body.message as string | undefined)?.trim()
    if (!userMessage) return json({ error: 'Empty message' }, 400)
    if (userMessage.length > 4000) return json({ error: 'Message too long' }, 400)

    // Lesson draft mode: admin-only, no rate limit, no history save, different prompt
    if (mode === 'lesson_draft') {
      if (!isAdmin) return json({ error: 'Admin only' }, 403)
    }

    // 6. Load recent history
    const histRes = await fetch(
      `${supabaseUrl}/rest/v1/tutor_messages?user_id=eq.${userId}&select=role,content&order=created_at.desc&limit=${MAX_HISTORY}`,
      { headers: { apikey: supabaseService, Authorization: `Bearer ${supabaseService}` } },
    )
    const recentMessages = ((await histRes.json()) as { role: string; content: string }[]).reverse()

    // 7. Call Groq (OpenAI-compatible API)
    const groqKey = Deno.env.get('GROQ_API_KEY')!
    const sysPrompt = mode === 'lesson_draft' ? LESSON_SYSTEM_PROMPT : SYSTEM_PROMPT
    const includeHistory = mode === 'chat'
    const messages = [
      { role: 'system', content: sysPrompt },
      ...(includeHistory ? recentMessages.map((m) => ({ role: m.role, content: m.content })) : []),
      { role: 'user', content: userMessage },
    ]

    const groqRes = await fetch(GROQ_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${groqKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages,
        temperature: 0.7,
        max_tokens: 1500,
      }),
    })

    if (!groqRes.ok) {
      const errBody = await groqRes.text()
      console.error('Groq error:', groqRes.status, errBody)
      return json({ error: 'Tutor is having a moment. Try again.', detail: errBody }, 502)
    }

    const groqData = await groqRes.json()
    const reply = groqData?.choices?.[0]?.message?.content?.trim()
    if (!reply) {
      console.error('Groq empty reply:', JSON.stringify(groqData))
      return json({ error: 'Tutor returned no answer.' }, 502)
    }

    // 8. Save both messages
    await fetch(`${supabaseUrl}/rest/v1/tutor_messages`, {
      method: 'POST',
      headers: {
        apikey: supabaseService,
        Authorization: `Bearer ${supabaseService}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify([
        { user_id: userId, role: 'user', content: userMessage },
        { user_id: userId, role: 'assistant', content: reply },
      ]),
    })

    // 9. Bump counter
    const newCount = questionsToday + 1
    await fetch(`${supabaseUrl}/rest/v1/profiles?id=eq.${userId}`, {
      method: 'PATCH',
      headers: {
        apikey: supabaseService,
        Authorization: `Bearer ${supabaseService}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({
        tutor_questions_today: newCount,
        tutor_questions_date: today,
      }),
    })

    return json({
      reply,
      remaining: isAdmin ? null : Math.max(0, DAILY_LIMIT - newCount),
      limit: DAILY_LIMIT,
    })
  } catch (e) {
    console.error('Unhandled error:', e)
    return json({ error: e instanceof Error ? e.message : 'Unknown error' }, 500)
  }
})

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}
