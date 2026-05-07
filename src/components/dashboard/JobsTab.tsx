import { useState } from "react";
import { Job, JobStatus, JOB_STATUS_COLOR, JOB_STATUS_LABEL, SERVICE_LABEL, ServiceType, PaymentMethod, formatMoney } from "./types";
import { supabase } from "@/integrations/supabase/client";
import { BottomSheet } from "./Sheet";
import { toast } from "sonner";

const STATUS_FILTERS: (JobStatus | "all")[] = ["all", "scheduled", "in_progress", "completed", "paid", "issue"];

export const JobsTab = ({
  jobs, refresh, initialFilter,
}: { jobs: Job[]; refresh: () => void; initialFilter?: string }) => {
  const [filter, setFilter] = useState<string>(initialFilter ?? "all");
  const [showAdd, setShowAdd] = useState(false);
  const [payJob, setPayJob] = useState<Job | null>(null);
  const [photoJob, setPhotoJob] = useState<Job | null>(null);

  const filtered = filter === "all" ? jobs : jobs.filter((j) => j.status === filter);

  const updateStatus = async (id: string, status: JobStatus) => {
    const { error } = await supabase.from("jobs").update({ status }).eq("id", id);
    if (error) toast.error("Update failed"); else { toast.success("Job updated"); refresh(); }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="font-display text-chalk" style={{ fontSize: 26 }}>JOBS BOARD</h1>
        <button onClick={() => setShowAdd(true)} className="border border-fire text-fire font-condensed uppercase px-3 py-1.5" style={{ fontSize: 12, letterSpacing: 1.5 }}>+ Add</button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 mb-4">
        {STATUS_FILTERS.map((f) => (
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
            {f === "all" ? "All" : JOB_STATUS_LABEL[f]}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <div style={{ fontSize: 48 }}>🔨</div>
          <div className="font-display text-chalk mt-2" style={{ fontSize: 22 }}>NO JOBS</div>
          <button onClick={() => setShowAdd(true)} className="mt-4 bg-fire text-white font-display px-5 py-2.5" style={{ fontSize: 16 }}>+ ADD JOB</button>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((j) => (
            <div key={j.id} className="bg-iron p-4" style={{ borderLeft: `4px solid ${JOB_STATUS_COLOR[j.status]}` }}>
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-condensed text-fog uppercase" style={{ fontSize: 10, letterSpacing: 1.5 }}>JOB-{j.job_number}</div>
                  <div className="text-chalk font-semibold mt-1" style={{ fontSize: 15 }}>{j.job_name}</div>
                </div>
                <div className="text-fog text-right" style={{ fontSize: 12 }}>{j.job_date ?? ""}</div>
              </div>
              <div className="flex gap-2 mt-2">
                <span className="bg-steel text-chalk px-2 py-0.5" style={{ fontSize: 11 }}>{SERVICE_LABEL[j.service_type]}</span>
                <span className="px-2 py-0.5 text-white" style={{ fontSize: 11, background: JOB_STATUS_COLOR[j.status] }}>{JOB_STATUS_LABEL[j.status]}</span>
              </div>
              <div className="text-fog mt-2" style={{ fontSize: 13 }}>
                👤 {j.customer_name}{j.customer_phone ? ` · ` : ""}
                {j.customer_phone && <a href={`tel:${j.customer_phone}`} className="text-fire">📞 {j.customer_phone}</a>}
              </div>
              {j.job_address && <div className="text-fog" style={{ fontSize: 12 }}>📍 {j.job_address}</div>}
              <div className="text-chalk mt-2" style={{ fontSize: 14 }}>
                Quoted: <span className="text-fire">{formatMoney(j.quoted_amount)}</span>
                {j.final_amount != null && <> → Final: <span className="text-fire">{formatMoney(j.final_amount)}</span></>}
                {j.paid && j.payment_method && <span className="text-avail-green ml-2">· {j.payment_method.toUpperCase()}</span>}
              </div>
              <div className="flex gap-2 mt-3">
                <select
                  value={j.status}
                  onChange={(e) => updateStatus(j.id, e.target.value as JobStatus)}
                  className="flex-1 bg-steel text-chalk px-2 py-2 border-0 focus:outline-none"
                  style={{ fontSize: 12 }}
                >
                  {Object.entries(JOB_STATUS_LABEL).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
                {!j.paid && (
                  <button onClick={() => setPayJob(j)} className="bg-avail-green text-white font-display px-3 py-2 active:opacity-80" style={{ fontSize: 12 }}>
                    💰 PAID
                  </button>
                )}
                <button onClick={() => setPhotoJob(j)} className="bg-steel text-chalk px-3 py-2 active:opacity-80" style={{ fontSize: 14 }}>📷</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <BottomSheet open={showAdd} onClose={() => setShowAdd(false)} title="ADD JOB">
        <AddJobForm onDone={() => { setShowAdd(false); refresh(); }} />
      </BottomSheet>
      <BottomSheet open={!!payJob} onClose={() => setPayJob(null)} title="MARK PAID">
        {payJob && <MarkPaidForm job={payJob} onDone={() => { setPayJob(null); refresh(); }} />}
      </BottomSheet>
      <BottomSheet open={!!photoJob} onClose={() => setPhotoJob(null)} title="JOB PHOTOS">
        {photoJob && <PhotosForm job={photoJob} onDone={() => { setPhotoJob(null); refresh(); }} />}
      </BottomSheet>
    </div>
  );
};

const inp = "w-full bg-steel border border-steel text-chalk p-3 focus:outline-none focus:border-fire";

const AddJobForm = ({ onDone }: { onDone: () => void }) => {
  const [form, setForm] = useState({
    job_name: "", service_type: "demolition" as ServiceType, customer_name: "",
    customer_phone: "", job_address: "", zip: "",
    job_date: new Date().toISOString().slice(0, 10),
    quoted_amount: "", notes: "",
  });
  const [saving, setSaving] = useState(false);
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const save = async () => {
    if (!form.job_name || !form.customer_name) { toast.error("Job name and customer required"); return; }
    setSaving(true);
    const { error } = await supabase.from("jobs").insert({
      job_name: form.job_name,
      service_type: form.service_type,
      customer_name: form.customer_name,
      customer_phone: form.customer_phone || null,
      job_address: form.job_address || null,
      zip: form.zip || null,
      job_date: form.job_date || null,
      quoted_amount: form.quoted_amount ? Number(form.quoted_amount) : null,
      notes: form.notes || null,
    });
    setSaving(false);
    if (error) toast.error(error.message); else { toast.success("Job added"); onDone(); }
  };

  return (
    <div className="space-y-3">
      <input className={inp} placeholder="Job name (e.g. Smith Basement Demo)" value={form.job_name} onChange={(e) => set("job_name", e.target.value)} />
      <select className={inp} value={form.service_type} onChange={(e) => set("service_type", e.target.value)}>
        <option value="demolition">Demolition</option>
        <option value="junk_removal">Junk Removal</option>
        <option value="hauling">Hauling</option>
      </select>
      <input className={inp} placeholder="Customer name" value={form.customer_name} onChange={(e) => set("customer_name", e.target.value)} />
      <input className={inp} type="tel" placeholder="Customer phone" value={form.customer_phone} onChange={(e) => set("customer_phone", e.target.value)} />
      <input className={inp} placeholder="Address" value={form.job_address} onChange={(e) => set("job_address", e.target.value)} />
      <div className="grid grid-cols-2 gap-2">
        <input className={inp} placeholder="ZIP" value={form.zip} onChange={(e) => set("zip", e.target.value)} />
        <input className={inp} type="date" value={form.job_date} onChange={(e) => set("job_date", e.target.value)} />
      </div>
      <input className={inp} type="number" placeholder="Quoted $" value={form.quoted_amount} onChange={(e) => set("quoted_amount", e.target.value)} />
      <textarea className={inp} rows={3} placeholder="Notes" value={form.notes} onChange={(e) => set("notes", e.target.value)} />
      <button onClick={save} disabled={saving} className="w-full bg-fire text-white font-display py-3 disabled:opacity-50" style={{ fontSize: 18 }}>
        {saving ? "SAVING..." : "SAVE JOB →"}
      </button>
    </div>
  );
};

const MarkPaidForm = ({ job, onDone }: { job: Job; onDone: () => void }) => {
  const [amount, setAmount] = useState(String(job.final_amount ?? job.quoted_amount ?? ""));
  const [method, setMethod] = useState<PaymentMethod>("cash");
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    const { error } = await supabase.from("jobs").update({
      paid: true,
      status: "paid",
      final_amount: amount ? Number(amount) : null,
      payment_method: method,
    }).eq("id", job.id);
    setSaving(false);
    if (error) toast.error(error.message); else { toast.success("Job marked paid"); onDone(); }
  };

  return (
    <div className="space-y-3">
      <input className={inp} type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Final $" />
      <select className={inp} value={method} onChange={(e) => setMethod(e.target.value as PaymentMethod)}>
        {(["cash","card","venmo","zelle","check"] as const).map((m) => <option key={m} value={m}>{m.toUpperCase()}</option>)}
      </select>
      <button onClick={save} disabled={saving} className="w-full bg-avail-green text-white font-display py-3 disabled:opacity-50" style={{ fontSize: 18 }}>
        {saving ? "SAVING..." : "✓ CONFIRM PAYMENT"}
      </button>
    </div>
  );
};

const PhotosForm = ({ job, onDone }: { job: Job; onDone: () => void }) => {
  const [uploading, setUploading] = useState<"before" | "after" | null>(null);

  const upload = async (kind: "before" | "after", file: File) => {
    setUploading(kind);
    const path = `${job.id}/${kind}-${Date.now()}-${file.name}`;
    const { error: upErr } = await supabase.storage.from("job-photos").upload(path, file, { upsert: true });
    if (upErr) { toast.error(upErr.message); setUploading(null); return; }
    const { data } = supabase.storage.from("job-photos").getPublicUrl(path);
    const update = kind === "before"
      ? { before_photo_url: data.publicUrl }
      : { after_photo_url: data.publicUrl };
    const { error } = await supabase.from("jobs").update(update).eq("id", job.id);
    setUploading(null);
    if (error) toast.error(error.message); else { toast.success("Photo uploaded"); onDone(); }
  };

  const Slot = ({ kind, url }: { kind: "before" | "after"; url: string | null }) => (
    <div>
      <div className="font-condensed text-fog uppercase mb-2" style={{ fontSize: 11, letterSpacing: 1.5 }}>{kind}</div>
      {url && <img src={url} alt={kind} className="w-full h-40 object-cover mb-2" />}
      <label className="block w-full bg-steel border border-dashed border-fog text-chalk text-center p-4 cursor-pointer">
        {uploading === kind ? "Uploading..." : url ? "Replace photo" : "📷 Tap to add photo"}
        <input
          type="file" accept="image/*" capture="environment" className="hidden"
          onChange={(e) => e.target.files?.[0] && upload(kind, e.target.files[0])}
        />
      </label>
    </div>
  );

  return (
    <div className="space-y-4">
      <Slot kind="before" url={job.before_photo_url} />
      <Slot kind="after" url={job.after_photo_url} />
    </div>
  );
};