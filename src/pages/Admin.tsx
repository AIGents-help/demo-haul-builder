import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ADMIN_PASSWORD } from "@/config/business";
import { AvailabilityStatus, statusColor } from "@/hooks/useAvailability";

const STATUSES: { v: AvailabilityStatus; label: string }[] = [
  { v: "open", label: "✓ OPEN" },
  { v: "filling", label: "⚡ FILLING UP" },
  { v: "full", label: "⚠ FULLY BOOKED" },
];

const Admin = () => {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [status, setStatus] = useState<AvailabilityStatus>("open");
  const [message, setMessage] = useState("This week — openings available");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!authed) return;
    supabase.from("availability").select("status, message").order("updated_at", { ascending: false }).limit(1).maybeSingle()
      .then(({ data }) => {
        if (data) {
          setStatus(data.status as AvailabilityStatus);
          setMessage(data.message);
        }
      });
  }, [authed]);

  const save = async () => {
    setSaving(true);
    await supabase
      .from("availability")
      .update({ status, message, updated_at: new Date().toISOString() })
      .neq("id", "00000000-0000-0000-0000-000000000000");
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (!authed) {
    return (
      <div className="bg-ink min-h-screen px-6 py-10">
        <div className="max-w-sm mx-auto">
          <h1 className="font-display text-fire" style={{ fontSize: 36 }}>AVAILABILITY ADMIN</h1>
          <input
            type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="Password"
            className="w-full mt-6 bg-iron border border-steel text-chalk p-3.5 focus:outline-none focus:border-fire"
          />
          <button
            onClick={() => setAuthed(pw === ADMIN_PASSWORD)}
            className="w-full mt-3 bg-fire hover:bg-ember text-white font-display py-3.5"
            style={{ fontSize: 20 }}
          >
            ENTER
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-ink min-h-screen px-6 py-10">
      <div className="max-w-md mx-auto">
        <h1 className="font-display text-fire" style={{ fontSize: 36 }}>AVAILABILITY ADMIN</h1>

        <div className="mt-6 space-y-1">
          {STATUSES.map((s) => (
            <button
              key={s.v}
              onClick={() => setStatus(s.v)}
              className="w-full font-display py-4 transition-colors"
              style={{
                fontSize: 20,
                backgroundColor: status === s.v ? statusColor(s.v) : "hsl(var(--steel))",
                color: "white",
              }}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="mt-6">
          <div className="font-condensed text-fire uppercase mb-2" style={{ fontSize: 11, letterSpacing: 2 }}>CUSTOM MESSAGE</div>
          <input
            value={message} onChange={(e) => setMessage(e.target.value)}
            placeholder="e.g. Thursday & Friday — 2 slots open"
            className="w-full bg-iron border border-steel text-chalk p-3.5 focus:outline-none focus:border-fire"
          />
        </div>

        <button
          onClick={save} disabled={saving}
          className="w-full mt-4 bg-fire hover:bg-ember text-white font-display py-4 disabled:opacity-50"
          style={{ fontSize: 20 }}
        >
          {saving ? "SAVING..." : "SAVE AVAILABILITY →"}
        </button>

        {saved && <div className="text-avail-green mt-3" style={{ fontSize: 14 }}>✓ Updated — site reflects this now</div>}

        <div className="mt-8 bg-iron p-5" style={{ borderLeft: `4px solid ${statusColor(status)}` }}>
          <div className="font-condensed text-fog uppercase" style={{ fontSize: 10, letterSpacing: 2 }}>PREVIEW</div>
          <div className="font-display text-chalk mt-1" style={{ fontSize: 20 }}>{message}</div>
        </div>
      </div>
    </div>
  );
};

export default Admin;