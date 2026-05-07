import { useState } from "react";
import { Lead, LeadStatus, LEAD_STATUS_COLOR, LEAD_STATUS_LABEL, timeAgo, formatMoney } from "./types";
import { supabase } from "@/integrations/supabase/client";
import { BottomSheet } from "./Sheet";
import { toast } from "sonner";

const STATUS_OPTIONS: LeadStatus[] = ["new", "contacted", "quoted", "booked", "follow_up", "closed"];

export const LeadsTab = ({
  leads, refresh, initialFilter,
}: { leads: Lead[]; refresh: () => void; initialFilter?: string }) => {
  const [filter, setFilter] = useState<string>(initialFilter ?? "all");
  const [showAdd, setShowAdd] = useState(false);

  const filtered = filter === "all" ? leads : leads.filter((l) => l.status === filter);

  const updateStatus = async (id: string, status: LeadStatus) => {
    const { error } = await supabase.from("quote_requests").update({ status }).eq("id", id);
    if (error) toast.error("Update failed"); else { toast.success("Lead updated"); refresh(); }
  };

  const deleteLead = async (id: string) => {
    if (!confirm("Delete this lead?")) return;
    const { error } = await supabase.from("quote_requests").delete().eq("id", id);
    if (error) toast.error("Delete failed"); else { toast.success("Lead deleted"); refresh(); }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="font-display text-chalk" style={{ fontSize: 26 }}>LEADS</h1>
        <button onClick={() => setShowAdd(true)} className="border border-fire text-fire font-condensed uppercase px-3 py-1.5" style={{ fontSize: 12, letterSpacing: 1.5 }}>+ Add</button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 mb-4">
        {(["all", ...STATUS_OPTIONS] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="font-condensed uppercase whitespace-nowrap px-3 py-1.5"
            style={{
              fontSize: 11, letterSpacing: 1.5,
              backgroundColor: filter === f ? "hsl(var(--fire))" : "hsl(var(--steel))",
              color: filter === f ? "white" : "hsl(var(--fog))",
            }}
          >
            {f === "all" ? "All" : LEAD_STATUS_LABEL[f as LeadStatus]}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <div style={{ fontSize: 48 }}>📋</div>
          <div className="font-display text-chalk mt-2" style={{ fontSize: 22 }}>NO LEADS</div>
          <div className="text-fog mt-1" style={{ fontSize: 13 }}>Try a different filter or add one.</div>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((l) => (
            <div key={l.id} className="bg-iron p-4" style={{ borderLeft: `4px solid ${LEAD_STATUS_COLOR[l.status]}` }}>
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-chalk font-semibold" style={{ fontSize: 15 }}>{l.name}</div>
                  <div className="text-fog" style={{ fontSize: 13 }}>{l.service ?? "—"}</div>
                </div>
                <div className="text-fog italic text-right" style={{ fontSize: 11 }}>{timeAgo(l.created_at)}</div>
              </div>
              <div className="text-fog mt-2" style={{ fontSize: 13 }}>
                📞 {l.phone}{l.zip ? ` · 📍 ${l.zip}` : ""}{l.source ? ` · ${l.source}` : ""}
              </div>
              {(l.estimate_low || l.estimate_high) && (
                <div className="text-chalk mt-1" style={{ fontSize: 13 }}>
                  Est: {formatMoney(l.estimate_low)} – {formatMoney(l.estimate_high)}
                </div>
              )}
              {(l.lead_notes || l.message) && (
                <div className="text-fog mt-2 line-clamp-2" style={{ fontSize: 13 }}>{l.lead_notes ?? l.message}</div>
              )}
              <div className="flex gap-2 mt-3">
                <a href={`tel:${l.phone}`} className="flex-1 bg-fire text-white text-center font-display py-2 active:opacity-80" style={{ fontSize: 13 }}>📞 CALL</a>
                <a href={`sms:${l.phone}`} className="flex-1 bg-steel text-chalk text-center font-display py-2 active:opacity-80" style={{ fontSize: 13 }}>💬 TEXT</a>
                <select
                  value={l.status}
                  onChange={(e) => updateStatus(l.id, e.target.value as LeadStatus)}
                  className="flex-1 bg-steel text-chalk px-2 py-2 border-0 focus:outline-none"
                  style={{ fontSize: 12 }}
                >
                  {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{LEAD_STATUS_LABEL[s]}</option>)}
                </select>
                <button onClick={() => deleteLead(l.id)} className="bg-steel text-fog px-3 active:opacity-80" style={{ fontSize: 16 }}>🗑</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <BottomSheet open={showAdd} onClose={() => setShowAdd(false)} title="ADD LEAD">
        <AddLeadForm onDone={() => { setShowAdd(false); refresh(); }} />
      </BottomSheet>
    </div>
  );
};

const AddLeadForm = ({ onDone }: { onDone: () => void }) => {
  const [form, setForm] = useState({
    name: "", phone: "", service: "", source: "Website",
    estimate_low: "", estimate_high: "", lead_notes: "", follow_up_date: "",
  });
  const [saving, setSaving] = useState(false);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const save = async () => {
    if (!form.name || !form.phone) { toast.error("Name and phone required"); return; }
    setSaving(true);
    const { error } = await supabase.from("quote_requests").insert({
      name: form.name,
      phone: form.phone,
      service: form.service || null,
      source: form.source || null,
      estimate_low: form.estimate_low ? Number(form.estimate_low) : null,
      estimate_high: form.estimate_high ? Number(form.estimate_high) : null,
      lead_notes: form.lead_notes || null,
      follow_up_date: form.follow_up_date || null,
      status: "new",
    });
    setSaving(false);
    if (error) toast.error(error.message); else { toast.success("Lead saved"); onDone(); }
  };

  const inp = "w-full bg-steel border border-steel text-chalk p-3 focus:outline-none focus:border-fire";
  return (
    <div className="space-y-3">
      <input className={inp} placeholder="Name" value={form.name} onChange={(e) => set("name", e.target.value)} />
      <input className={inp} type="tel" placeholder="Phone" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
      <select className={inp} value={form.service} onChange={(e) => set("service", e.target.value)}>
        <option value="">Service...</option>
        <option>Demolition</option><option>Junk Removal</option><option>Hauling</option><option>Not Sure</option>
      </select>
      <select className={inp} value={form.source} onChange={(e) => set("source", e.target.value)}>
        {["Website","Instagram","Photo Text","Phone","Referral","Nextdoor","Google"].map((s) => <option key={s}>{s}</option>)}
      </select>
      <div className="grid grid-cols-2 gap-2">
        <input className={inp} type="number" placeholder="Est. Low $" value={form.estimate_low} onChange={(e) => set("estimate_low", e.target.value)} />
        <input className={inp} type="number" placeholder="Est. High $" value={form.estimate_high} onChange={(e) => set("estimate_high", e.target.value)} />
      </div>
      <textarea className={inp} rows={3} placeholder="Notes" value={form.lead_notes} onChange={(e) => set("lead_notes", e.target.value)} />
      <input className={inp} type="date" value={form.follow_up_date} onChange={(e) => set("follow_up_date", e.target.value)} />
      <button onClick={save} disabled={saving} className="w-full bg-fire text-white font-display py-3 disabled:opacity-50" style={{ fontSize: 18 }}>
        {saving ? "SAVING..." : "SAVE LEAD →"}
      </button>
    </div>
  );
};