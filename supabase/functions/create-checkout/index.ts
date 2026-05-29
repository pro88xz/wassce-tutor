// Edge Function: creates a Monime checkout session for the current user.
// Called from the React app when a student clicks "Subscribe".

const MONIME_API = 'https://api.monime.io/v1/checkout-sessions'
const MONIME_VERSION = 'caph.2025-08-23'
const PRICE_MINOR_UNITS = 7500 // 75 NLe in minor units (1 Leone = 100 cents)

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 1. Verify the caller is an authenticated Supabase user.
    //    The frontend passes the user's JWT in Authorization.
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return json({ error: 'Missing Authorization header' }, 401)
    }

    // Use the user's JWT to identify them via Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseAnon = Deno.env.get('SUPABASE_ANON_KEY')!
    const userRes = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: { Authorization: authHeader, apikey: supabaseAnon },
    })
    if (!userRes.ok) {
      return json({ error: 'Invalid session' }, 401)
    }
    const user = await userRes.json()
    const userId = user.id as string
    const userEmail = user.email as string | undefined

    // 2. Build the success/cancel URLs from the request origin
    const body = await req.json().catch(() => ({}))
    const origin = (body.origin as string | undefined) || req.headers.get('Origin') || ''
    const successUrl = `${origin}/?paid=1`
    const cancelUrl = `${origin}/subscribe?cancelled=1`

    // 3. Create the Monime checkout session
    const monimeToken = Deno.env.get('MONIME_ACCESS_TOKEN')!
    const spaceId = Deno.env.get('MONIME_SPACE_ID')!

    const idempotencyKey = `wt-${userId}-${Date.now()}`

    const monimeRes = await fetch(MONIME_API, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${monimeToken}`,
        'Content-Type': 'application/json',
        'Monime-Version': MONIME_VERSION,
        'Monime-Space-Id': spaceId,
        'Idempotency-Key': idempotencyKey,
      },
      body: JSON.stringify({
        name: 'WASSCE Tutor - 1 year subscription',
        description: 'Full access to all WASSCE Tutor content for one academic year.',
        successUrl,
        cancelUrl,
        reference: userId, // links the payment back to our user
        lineItems: [
          {
            type: 'custom',
            name: 'WASSCE Tutor - 1 year',
            price: { currency: 'SLE', value: PRICE_MINOR_UNITS },
            quantity: 1,
          },
        ],
        metadata: {
          user_id: userId,
          user_email: userEmail ?? '',
          plan: 'annual',
        },
      }),
    })

    const monimeData = await monimeRes.json()
    if (!monimeRes.ok || !monimeData.success) {
      console.error('Monime error:', monimeData)
      return json({ error: 'Failed to create checkout', detail: monimeData }, 502)
    }

    const session = monimeData.result
    return json({
      redirectUrl: session.redirectUrl,
      sessionId: session.id,
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
