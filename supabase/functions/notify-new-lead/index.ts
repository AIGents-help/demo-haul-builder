// Emails Corey when a new quote request lands. Called by the quote_requests
// insert trigger (pg_net). Safe to expose without a JWT: it only ever emails
// a fixed address, only for a lead created in the last 10 minutes, and only once.
import { createClient } from "npm:@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const NOTIFY_EMAIL = Deno.env.get("NOTIFY_EMAIL") ?? "coreydiantonio18@icloud.com";
const FROM = Deno.env.get("NOTIFY_FROM") ?? "DiAntonio's Website Leads <leads@aigents.help>";

const esc = (s: unknown) =>
  String(s ?? "—").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));

Deno.serve(async (req) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });
  if (!RESEND_API_KEY) return new Response(JSON.stringify({ error: "RESEND_API_KEY not set" }), { status: 500 });

  const { id } = await req.json().catch(() => ({}));
  if (typeof id !== "string" || !/^[0-9a-f-]{36}$/i.test(id)) {
    return new Response(JSON.stringify({ error: "bad id" }), { status: 400 });
  }

  const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const since = new Date(Date.now() - 10 * 60 * 1000).toISOString();

  // Claim the lead atomically so it can only be notified once.
  const { data: lead, error } = await db
    .from("quote_requests")
    .update({ notified_at: new Date().toISOString() })
    .eq("id", id)
    .is("notified_at", null)
    .gte("created_at", since)
    .select("name, phone, service, zip, message, source, created_at")
    .maybeSingle();

  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  if (!lead) return new Response(JSON.stringify({ skipped: true }), { status: 200 });

  const tel = String(lead.phone).replace(/[^\d+]/g, "");
  const html = `
  <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#0a0a0a">
    <h1 style="font-size:22px;margin:0 0 6px">New quote request</h1>
    <p style="color:#555;margin:0 0 18px">Call back within 15 minutes for the best shot at booking it.</p>
    <table style="width:100%;border-collapse:collapse;font-size:15px">
      ${[["Name", lead.name], ["Phone", lead.phone], ["Service", lead.service], ["ZIP", lead.zip], ["Details", lead.message], ["Source", lead.source]]
        .map(([k, v]) => `<tr><td style="padding:8px 0;color:#1B5E38;font-weight:bold;width:90px;vertical-align:top">${k}</td><td style="padding:8px 0">${esc(v)}</td></tr>`).join("")}
    </table>
    <a href="tel:${esc(tel)}" style="display:inline-block;margin-top:20px;background:#1B5E38;color:#fff;text-decoration:none;padding:14px 22px;border-radius:8px;font-weight:bold">Call ${esc(lead.name)} now</a>
    <p style="margin-top:24px;font-size:12px;color:#888">Manage leads at https://www.diantoniosdemo.com/dashboard</p>
  </div>`;

  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: FROM,
      to: [NOTIFY_EMAIL],
      subject: `New lead: ${lead.name} — ${lead.service ?? "quote request"}`,
      html,
    }),
  });

  if (!r.ok) {
    // Release the claim so a retry can send it.
    await db.from("quote_requests").update({ notified_at: null }).eq("id", id);
    return new Response(JSON.stringify({ error: await r.text() }), { status: 502 });
  }
  return new Response(JSON.stringify({ sent: true }), { status: 200 });
});
