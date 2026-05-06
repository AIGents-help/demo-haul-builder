import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { BUSINESS } from "@/config/business";

const schema = z.object({
  name: z.string().trim().min(1, "Name required").max(120),
  phone: z.string().trim().min(7, "Valid phone required").max(30),
  service: z.string().trim().max(80).optional(),
  zip: z.string().trim().max(12).optional(),
  message: z.string().trim().max(2000).optional(),
});

const Label = ({ children }: { children: React.ReactNode }) => (
  <div className="font-condensed text-fire mb-1.5 uppercase" style={{ fontSize: 11, letterSpacing: 2 }}>
    {children}
  </div>
);

const inputClass =
  "w-full bg-ink border border-steel text-chalk p-3.5 focus:outline-none focus:border-fire transition-colors";

export const QuoteForm = () => {
  const [formData, setFormData] = useState({ name: "", phone: "", service: "", zip: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (k: string, v: string) => setFormData((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const parsed = schema.safeParse(formData);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Please check your info.");
      return;
    }
    setSubmitting(true);
    try {
      const { error: dbError } = await supabase.from("quote_requests").insert([
        {
          name: parsed.data.name,
          phone: parsed.data.phone,
          service: parsed.data.service || null,
          zip: parsed.data.zip || null,
          message: parsed.data.message || null,
          source: "website",
        },
      ]);
      if (dbError) throw dbError;

      try {
        await supabase.functions.invoke("send-transactional-email", {
          body: {
            templateName: "quote-request",
            recipientEmail: "contact@diantoniosdemo.com",
            templateData: { ...parsed.data, source: "website" },
          },
        });
      } catch (_) { /* notification optional */ }

      setSubmitted(true);
    } catch (err) {
      console.error("Submission error:", err);
      setError("Something went wrong. Please call us instead.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <section id="quote-form" className="bg-iron px-6 md:px-10 py-20">
        <div className="max-w-xl mx-auto bg-ink p-10 text-center" style={{ border: "2px solid hsl(var(--avail-green))" }}>
          <div style={{ fontSize: 48 }}>✅</div>
          <h2 className="font-display text-chalk mt-2" style={{ fontSize: 48 }}>WE GOT IT.</h2>
          <p className="text-fog mt-2" style={{ fontSize: 16 }}>Expect a text from us within 15 minutes.</p>
          <p className="mt-3" style={{ fontSize: 14, color: "#6a6058" }}>
            In the meantime, follow us on Instagram for our latest work.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="quote-form" className="bg-iron px-6 md:px-10 py-20">
      <div className="max-w-3xl mx-auto">
        <div className="font-eyebrow mb-3">GET STARTED</div>
        <h2 className="font-display text-chalk text-[40px] md:text-[52px] leading-none">FREE QUOTE. NO OBLIGATION.</h2>
        <p className="text-fog mt-3" style={{ fontSize: 15 }}>
          Fill out the form below and we'll get back to you within 15 minutes. Rather call?{" "}
          <a href={`tel:${BUSINESS.phoneTel}`} className="text-fire">📞 {BUSINESS.phone}</a>
        </p>

        <form onSubmit={submit} className="max-w-xl mt-10 space-y-4">
          <div>
            <Label>NAME</Label>
            <input className={inputClass} placeholder="First & Last Name" value={formData.name} onChange={(e) => set("name", e.target.value)} required />
          </div>
          <div>
            <Label>PHONE</Label>
            <input type="tel" className={inputClass} placeholder="(555) 555-5555" value={formData.phone} onChange={(e) => set("phone", e.target.value)} required />
          </div>
          <div>
            <Label>SERVICE</Label>
            <select className={inputClass} value={formData.service} onChange={(e) => set("service", e.target.value)}>
              <option value="">Select a service...</option>
              <option>Demolition</option>
              <option>Junk Removal</option>
              <option>Hauling & Moving</option>
              <option>Not Sure — Need a Quote</option>
            </select>
          </div>
          <div>
            <Label>ZIP CODE</Label>
            <input type="text" maxLength={5} className={inputClass} placeholder="ZIP Code" value={formData.zip} onChange={(e) => set("zip", e.target.value)} />
          </div>
          <div>
            <Label>TELL US MORE (OPTIONAL)</Label>
            <textarea
              rows={4} className={inputClass}
              placeholder="Briefly describe the job — what needs to go, rough size, any access issues, etc."
              value={formData.message}
              onChange={(e) => set("message", e.target.value)}
            />
          </div>

          {error && <div className="text-avail-red" style={{ fontSize: 14 }}>{error}</div>}

          <button
            type="submit" disabled={submitting}
            className="w-full bg-fire hover:bg-ember text-white font-display py-4 disabled:opacity-50 transition-colors"
            style={{ fontSize: 22 }}
          >
            {submitting ? "SENDING..." : "SEND MY FREE QUOTE REQUEST →"}
          </button>

          <p className="text-center" style={{ fontSize: 12, color: "#6a6058" }}>
            We respond within 15 minutes during business hours. Your info is never shared or sold.
          </p>
        </form>
      </div>
    </section>
  );
};