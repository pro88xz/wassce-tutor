import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { notificationCopy, renderNotification } from "./email.ts";

const appOrigin = Deno.env.get("APP_ORIGIN") ?? "https://wasscetutor.com"
const allowedOrigins = new Set([
  appOrigin,
  "https://wassce-tutor-git-feature-tutor-affiliate-platform-dev-bangs.vercel.app",
  "capacitor://localhost",
  "http://localhost",
  "https://localhost",
])
const corsHeaders = (req: Request) => {
  const requestOrigin = req.headers.get("Origin")
  const allowedOrigin = requestOrigin && allowedOrigins.has(requestOrigin) ? requestOrigin : appOrigin
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Vary": "Origin",
  }
}

Deno.serve(async (req) => {
  const cors = corsHeaders(req)
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return Response.json({ error: "Method not allowed" }, { status: 405, headers: cors });

  const authorization = req.headers.get("Authorization");
  if (!authorization?.startsWith("Bearer ")) return Response.json({ error: "Authentication required" }, { status: 401, headers: cors });

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const resendKey = Deno.env.get("RESEND_API_KEY");
  const from = Deno.env.get("EMAIL_FROM");
  if (!supabaseUrl || !anonKey || !serviceKey || !resendKey || !from) {
    return Response.json({ error: "Email delivery is not configured" }, { status: 503, headers: cors });
  }

  const authClient = createClient(supabaseUrl, anonKey, { global: { headers: { Authorization: authorization } } });
  const { data: authData, error: authError } = await authClient.auth.getUser();
  if (authError || !authData.user) return Response.json({ error: "Invalid session" }, { status: 401, headers: cors });

  const body = await req.json().catch(() => ({}));
  const entityId = typeof body.entity_id === "string" ? body.entity_id : "";
  const eventType = typeof body.event_type === "string" ? body.event_type : "";
  if (!entityId || !eventType) return Response.json({ error: "entity_id and event_type are required" }, { status: 400, headers: cors });

  const admin = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data: events, error: eventError } = await admin
    .from("user_notifications")
    .select("id,recipient_id,title,body,event_type")
    .eq("actor_id", authData.user.id)
    .eq("entity_id", entityId)
    .eq("event_type", eventType)
    .order("created_at", { ascending: false })
    .limit(5);
  if (eventError) return Response.json({ error: "Could not load notification" }, { status: 500, headers: cors });
  if (!events?.length) return Response.json({ sent: 0 }, { headers: cors });

  const results = await Promise.all(events.map(async (event) => {
    const { data: recipient } = await admin.auth.admin.getUserById(event.recipient_id);
    const email = recipient.user?.email;
    if (!email) return { id: event.id, sent: false, reason: "No email address" };
    const { data: profile } = await admin.from("profiles").select("full_name").eq("id", event.recipient_id).maybeSingle();
    const isTutor = event.event_type.startsWith("booking_")
      ? Boolean((await admin.from("tutors").select("id").eq("user_id", event.recipient_id).maybeSingle()).data)
      : false;
    const firstName = String(profile?.full_name ?? "").trim().split(/\s+/)[0];
    const copy = notificationCopy(event, { firstName, isTutor });
    const { html, text } = renderNotification(copy, appOrigin.replace(/\/$/, ""));
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json", "Idempotency-Key": `wassce-notification-${event.id}` },
      body: JSON.stringify({ from, to: [email], subject: copy.subject, html, text }),
    });
    if (!response.ok) return { id: event.id, sent: false, reason: "Email provider rejected delivery" };
    return { id: event.id, sent: true };
  }));

  return Response.json({ sent: results.filter((r) => r.sent).length, results }, { headers: cors });
});
