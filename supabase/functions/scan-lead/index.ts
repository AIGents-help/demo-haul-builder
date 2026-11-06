// Reads a photo of a handwritten note / business card and returns lead fields.
// Admin-only. Uses OpenAI (OPENAI_API_KEY secret).
import { createClient } from "npm:@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });

  const authHeader = req.headers.get("Authorization") ?? "";
  const userClient = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, {
    global: { headers: { Authorization: authHeader } },
  });
  const { data: userData } = await userClient.auth.getUser();
  if (!userData?.user) return json({ error: "Not signed in" }, 401);
  const { data: isAdmin } = await userClient.rpc("has_role", { _user_id: userData.user.id, _role: "admin" });
  if (!isAdmin) return json({ error: "Admins only" }, 403);

  const apiKey = Deno.env.get("OPENAI_API_KEY");
  if (!apiKey) return json({ error: "AI not configured (OPENAI_API_KEY missing)" }, 500);

  try {
    const { imageBase64, mimeType } = await req.json();
    if (!imageBase64 || typeof imageBase64 !== "string") return json({ error: "imageBase64 required" }, 400);
    if (imageBase64.length > 8_000_000) return json({ error: "Image too large" }, 413);

    const aiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: Deno.env.get("OPENAI_MODEL") ?? "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You extract contact/lead info from a photo (handwritten note, business card, napkin, paper form). Use null for missing fields. Normalize phone to digits with dashes like 555-123-4567. Service must be one of: Demolition, Junk Removal, Hauling, Not Sure.",
          },
          {
            role: "user",
            content: [
              { type: "text", text: "Extract lead info from this image." },
              { type: "image_url", image_url: { url: `data:${mimeType || "image/jpeg"};base64,${imageBase64}` } },
            ],
          },
        ],
        tools: [{
          type: "function",
          function: {
            name: "save_lead",
            description: "Save extracted lead fields",
            parameters: {
              type: "object",
              properties: {
                name: { type: ["string", "null"] },
                phone: { type: ["string", "null"] },
                address: { type: ["string", "null"] },
                zip: { type: ["string", "null"] },
                service: { type: ["string", "null"], enum: ["Demolition", "Junk Removal", "Hauling", "Not Sure", null] },
                notes: { type: ["string", "null"] },
              },
              required: ["name", "phone", "address", "zip", "service", "notes"],
              additionalProperties: false,
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "save_lead" } },
      }),
    });

    if (aiRes.status === 429) return json({ error: "Rate limit hit. Try again in a moment." }, 429);
    if (!aiRes.ok) return json({ error: `AI error: ${(await aiRes.text()).slice(0, 200)}` }, 500);

    const data = await aiRes.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) return json({ error: "Could not read image. Try a clearer photo." }, 422);
    return json(JSON.parse(toolCall.function.arguments));
  } catch (err) {
    return json({ error: String(err) }, 500);
  }
});
