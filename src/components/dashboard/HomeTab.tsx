import { Lead, Job, JOB_STATUS_COLOR, JOB_STATUS_LABEL, SERVICE_LABEL, formatMoney, timeAgo } from "./types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Card = ({ value, label, color, onClick }: { value: string | number; label: string; color: string; onClick?: () => void }) => (
  <button
    onClick={onClick}
    className="bg-iron p-4 text-left active:opacity-70 transition-opacity"
    style={{ borderTop: `3px solid ${color}` }}
  >
    <div className="font-display text-fire" style={{ fontSize: 42, lineHeight: 1, color }}>{value}</div>
    <div className="font-condensed text-fog uppercase mt-1" style={{ fontSize: 11, letterSpacing: 1 }}>{label}</div>
  </button>
);

const todayISO = () => new Date().toISOString().slice(0, 10);
const startOfWeek = () => {
  const d = new Date(); d.setDate(d.getDate() - d.getDay()); d.setHours(0,0,0,0); return d;
};

export const HomeTab = ({
  leads, jobs, refresh, onSwitchTab, onSwitchTabFiltered,
}: {
  leads: Lead[]; jobs: Job[]; refresh: () => void;
  onSwitchTab: (t: "leads" | "jobs") => void;
  onSwitchTabFiltered: (t: "leads" | "jobs", filter: string) => void;
}) => {
  const newLeads = leads.filter((l) => l.status === "new");
  const today = todayISO();
  const todaysJobs = jobs.filter((j) => j.job_date === today);
  const unpaidJobs = jobs.filter((j) => !j.paid && j.status === "completed");
  const weekStart = startOfWeek();
  const weekRevenue = jobs
    .filter((j) => j.paid && j.job_date && new Date(j.job_date) >= weekStart)
    .reduce((sum, j) => sum + (Number(j.final_amount) || 0), 0);

  const updateJobStatus = async (id: string, status: Job["status"]) => {
    const { error } = await supabase.from("jobs").update({ status }).eq("id", id);
    if (error) toast.error("Update failed"); else { toast.success("Job updated"); refresh(); }
  };

  const markContacted = async (id: string) => {
    const { error } = await supabase.from("quote_requests").update({ status: "contacted" }).eq("id", id);
    if (error) toast.error("Update failed"); else { toast.success("Lead updated"); refresh(); }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-2">
        <Card value={newLeads.length} label="New Leads" color="hsl(var(--fire))" onClick={() => onSwitchTabFiltered("leads", "new")} />
        <Card value={todaysJobs.length} label="Today's Jobs" color="#D4A017" onClick={() => onSwitchTab("jobs")} />
        <Card value={unpaidJobs.length} label="Unpaid Jobs" color="#dc2626" onClick={() => onSwitchTabFiltered("jobs", "completed")} />
        <Card value={formatMoney(weekRevenue)} label="Week Revenue" color="#22c55e" />
      </div>

      <section>
        <h2 className="font-display text-chalk mb-3" style={{ fontSize: 22 }}>TODAY'S JOBS</h2>
        {todaysJobs.length === 0 ? (
          <div className="text-fog italic" style={{ fontSize: 14 }}>No jobs scheduled today.</div>
        ) : (
          <div className="space-y-2">
            {todaysJobs.map((j) => (
              <div key={j.id} className="bg-iron p-4" style={{ borderLeft: `4px solid ${JOB_STATUS_COLOR[j.status]}` }}>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="text-chalk font-semibold" style={{ fontSize: 15 }}>{j.job_name}</div>
                    <div className="text-fog mt-1" style={{ fontSize: 13 }}>
                      {SERVICE_LABEL[j.service_type]} · {j.customer_name}
                    </div>
                    {j.job_address && <div className="text-fog" style={{ fontSize: 12 }}>📍 {j.job_address}</div>}
                  </div>
                  <div className="font-display text-fire ml-3" style={{ fontSize: 20 }}>
                    {formatMoney(j.final_amount ?? j.quoted_amount)}
                  </div>
                </div>
                <select
                  value={j.status}
                  onChange={(e) => updateJobStatus(j.id, e.target.value as Job["status"])}
                  className="mt-3 w-full bg-steel text-chalk px-2 py-2 border border-steel focus:border-fire focus:outline-none"
                  style={{ fontSize: 13 }}
                >
                  {Object.entries(JOB_STATUS_LABEL).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="font-display text-chalk mb-3" style={{ fontSize: 22 }}>NEW LEADS</h2>
        {newLeads.length === 0 ? (
          <div className="text-fog italic" style={{ fontSize: 14 }}>No new leads. 👌</div>
        ) : (
          <div className="space-y-2">
            {newLeads.map((l) => (
              <div key={l.id} className="bg-iron p-4" style={{ borderLeft: "4px solid hsl(var(--fire))" }}>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="text-chalk font-semibold" style={{ fontSize: 15 }}>{l.name}</div>
                    {l.service && <div className="text-fog" style={{ fontSize: 13 }}>🔧 {l.service}</div>}
                    {l.zip && <div className="text-fog" style={{ fontSize: 12 }}>📍 {l.zip}</div>}
                    <div className="text-fog italic mt-1" style={{ fontSize: 11 }}>{timeAgo(l.created_at)}</div>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <a href={`tel:${l.phone}`} className="flex-1 bg-fire text-white text-center font-display py-2.5 active:opacity-80" style={{ fontSize: 14 }}>
                    📞 CALL
                  </a>
                  <a href={`sms:${l.phone}`} className="flex-1 bg-steel text-chalk text-center font-display py-2.5 active:opacity-80" style={{ fontSize: 14 }}>
                    💬 TEXT
                  </a>
                  <button onClick={() => markContacted(l.id)} className="flex-1 border border-fire text-fire font-display py-2.5 active:opacity-80" style={{ fontSize: 12 }}>
                    ✓ DONE
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};