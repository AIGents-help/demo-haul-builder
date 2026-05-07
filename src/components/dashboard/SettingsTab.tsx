import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AvailabilityStatus, statusColor } from "@/hooks/useAvailability";
import { toast } from "sonner";

const STATUSES: { v: AvailabilityStatus; label: string }[] = [
  { v: "open", label: "✓ OPEN" },
  { v: "filling", label: "⚡ FILLING UP" },
  { v: "full", label: "⚠ FULLY BOOKED" },
];

const SCRIPTS = [
  { title: "New Lead Response", text: "Hey [Name]! This is Corey from DiAntonio's Demo & Hauling. Thanks for reaching out! I'd love to get you a quote. Can you tell me more about the job, or send a photo if easier? I can usually come take a look same day or next." },
  { title: "Quote Follow-Up", text: "Hey [Name], just following up on the quote I sent for [service]. Any questions I can answer? Happy to adjust if needed. — Corey, DiAntonio's" },
  { title: "Google Review Request", text: "Hey [Name]! Really appreciate you trusting us today. If you have 30 seconds, a Google review helps us out more than you know: [GBP LINK]. Thanks! — Corey" },
  { title: "Referral Ask", text: "Hey [Name]! Glad we could help. If you know anyone who needs demo, junk removal, or hauling — send them our way! We always take great care of referrals. — DiAntonio's Demo & Hauling" },
];

const PRICES = [
  ["Small junk load", "$75", "$175"],
  ["Medium load", "$175", "$350"],
  ["Full truck", "$350", "$600"],
  ["Estate cleanout", "$500", "$1,200+"],
  ["Small demo (<500 sqft)", "$300", "$800"],
  ["Medium demo (500–1k)", "$700", "$1,800"],
  ["Large demo (1k–2k)", "$1,500", "$4,000"],
  ["Single item haul", "$75", "$200"],
  ["Small haul", "$150", "$350"],
  ["Large/commercial", "$300", "$800+"],
];

export const SettingsTab = ({ onSignOut }: { onSignOut: () => void }) => {
  const [status, setStatus] = useState<AvailabilityStatus>("open");
  const [message, setMessage] = useState("This week — openings available");
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState<number | null>(null);

  useEffect(() => {
    supabase.from("availability").select("status, message").order("updated_at", { ascending: false }).limit(1).maybeSingle()
      .then(({ data }) => {
        if (data) {
          setStatus(data.status as AvailabilityStatus);
          setMessage(data.message);
        }
      });
  }, []);

  const save = async () => {
    setSaving(true);
    const { error } = await supabase.from("availability")
      .update({ status, message, updated_at: new Date().toISOString() })
      .neq("id", "00000000-0000-0000-0000-000000000000");
    setSaving(false);
    if (error) toast.error(error.message); else toast.success("✓ Site updated");
  };

  const copy = (i: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(i);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="space-y-8">
      <section>
        <h2 className="font-display text-chalk mb-3" style={{ fontSize: 22 }}>WEBSITE AVAILABILITY</h2>
        <div className="space-y-2">
          {STATUSES.map((s) => (
            <button
              key={s.v}
              onClick={() => setStatus(s.v)}
              className="w-full font-display py-4"
              style={{
                fontSize: 18,
                backgroundColor: status === s.v ? statusColor(s.v) : "hsl(var(--steel))",
                color: status === s.v ? "white" : "hsl(var(--fog))",
              }}
            >
              {s.label}
            </button>
          ))}
        </div>
        <input
          value={message} onChange={(e) => setMessage(e.target.value)}
          placeholder="e.g. Thursday & Friday — slots open"
          className="w-full mt-3 bg-iron border border-steel text-chalk p-3 focus:outline-none focus:border-fire"
        />
        <div className="bg-iron p-4 mt-3" style={{ borderLeft: `4px solid ${statusColor(status)}` }}>
          <div className="font-condensed text-fog uppercase" style={{ fontSize: 10, letterSpacing: 2 }}>PREVIEW</div>
          <div className="font-display text-chalk mt-1" style={{ fontSize: 18 }}>{message}</div>
        </div>
        <button onClick={save} disabled={saving}
          className="w-full mt-3 bg-fire text-white font-display py-3 disabled:opacity-50" style={{ fontSize: 18 }}>
          {saving ? "SAVING..." : "SAVE AVAILABILITY →"}
        </button>
      </section>

      <section>
        <h2 className="font-display text-chalk mb-3" style={{ fontSize: 22 }}>COPY-PASTE SCRIPTS</h2>
        <div className="space-y-2">
          {SCRIPTS.map((s, i) => (
            <div key={i} className="bg-iron p-4">
              <div className="text-chalk font-semibold mb-1" style={{ fontSize: 14 }}>{s.title}</div>
              <div className="text-fog line-clamp-3" style={{ fontSize: 13 }}>{s.text}</div>
              <button
                onClick={() => copy(i, s.text)}
                className="mt-3 border border-fire text-fire font-condensed uppercase px-3 py-1.5"
                style={{ fontSize: 11, letterSpacing: 1.5 }}
              >
                {copied === i ? "✓ COPIED" : "COPY"}
              </button>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-display text-chalk mb-3" style={{ fontSize: 22 }}>QUICK PRICE GUIDE</h2>
        <div className="bg-iron overflow-x-auto">
          <table className="w-full" style={{ fontSize: 13 }}>
            <thead>
              <tr className="bg-fire text-white font-condensed uppercase" style={{ fontSize: 11, letterSpacing: 1.5 }}>
                <th className="text-left p-2">Job</th>
                <th className="text-left p-2">Low</th>
                <th className="text-left p-2">High</th>
              </tr>
            </thead>
            <tbody>
              {PRICES.map(([j, l, h], i) => (
                <tr key={i} className="border-b border-steel">
                  <td className="p-2 text-chalk">{j}</td>
                  <td className="p-2 text-fog">{l}</td>
                  <td className="p-2 text-fog">{h}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="text-fog italic mt-2" style={{ fontSize: 12 }}>
          Final price always confirmed on-site before work begins.
        </div>
      </section>

      <button onClick={onSignOut} className="w-full bg-steel text-fog font-display py-3" style={{ fontSize: 16 }}>
        SIGN OUT
      </button>
    </div>
  );
};