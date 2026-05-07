import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Toaster } from "@/components/ui/sonner";
import { Lead, Job } from "@/components/dashboard/types";
import { HomeTab } from "@/components/dashboard/HomeTab";
import { LeadsTab } from "@/components/dashboard/LeadsTab";
import { JobsTab } from "@/components/dashboard/JobsTab";
import { CustomersTab } from "@/components/dashboard/CustomersTab";
import { SettingsTab } from "@/components/dashboard/SettingsTab";

type Tab = "home" | "leads" | "jobs" | "customers" | "settings";

const greeting = () => {
  const h = new Date().getHours();
  if (h >= 5 && h < 11) return "Good morning, Corey ⚡";
  if (h >= 11 && h < 17) return "Good afternoon, Corey ⚡";
  if (h >= 17 && h < 21) return "Good evening, Corey ⚡";
  return "Still working? 💪";
};

const todayLabel = () =>
  new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });

const NAV: { id: Tab; icon: string; label: string }[] = [
  { id: "home", icon: "🏠", label: "Home" },
  { id: "leads", icon: "📋", label: "Leads" },
  { id: "jobs", icon: "🔨", label: "Jobs" },
  { id: "customers", icon: "👥", label: "Customers" },
  { id: "settings", icon: "⚙️", label: "Settings" },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [authChecked, setAuthChecked] = useState(false);
  const [hasSession, setHasSession] = useState(false);
  const [email, setEmail] = useState("");
  const [tab, setTab] = useState<Tab>("home");
  const [leadFilter, setLeadFilter] = useState<string | undefined>();
  const [jobFilter, setJobFilter] = useState<string | undefined>();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const check = async () => {
      const { data: s } = await supabase.auth.getSession();
      if (!s.session) { navigate("/auth", { replace: true }); return; }
      setEmail(s.session.user.email ?? "");
      setHasSession(true);
      setAuthChecked(true);
    };
    check();
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session) navigate("/auth", { replace: true });
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  const refresh = useCallback(async () => {
    setLoading(true);
    const [l, j] = await Promise.all([
      supabase.from("quote_requests").select("*").order("created_at", { ascending: false }).limit(500),
      supabase.from("jobs").select("*").order("job_date", { ascending: false, nullsFirst: false }).limit(500),
    ]);
    setLeads((l.data as Lead[]) ?? []);
    setJobs((j.data as Job[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { if (hasSession) refresh(); }, [hasSession, refresh]);

  const signOut = async () => { await supabase.auth.signOut(); };

  const switchTab = (t: Tab) => { setTab(t); setLeadFilter(undefined); setJobFilter(undefined); };
  const switchTabFiltered = (t: "leads" | "jobs", filter: string) => {
    setTab(t);
    if (t === "leads") setLeadFilter(filter); else setJobFilter(filter);
  };

  const newLeadCount = leads.filter((l) => l.status === "new").length;

  if (!authChecked) {
    return <div className="bg-ink min-h-screen p-10 text-fog">Loading...</div>;
  }

  if (!hasSession) return null;

  return (
    <div className="bg-ink min-h-screen flex flex-col">
      <Toaster />
      <header className="bg-iron border-b border-steel px-5 py-4 flex justify-between items-center">
        <div>
          <div className="font-display text-chalk" style={{ fontSize: 18 }}>{greeting()}</div>
          <div className="text-fog" style={{ fontSize: 12 }}>{todayLabel()}</div>
        </div>
        {newLeadCount > 0 && (
          <div className="relative">
            <span className="bg-fire text-white font-display px-2 py-1" style={{ fontSize: 12 }}>
              {newLeadCount} NEW
            </span>
            <span className="pulse-dot absolute -top-1 -right-1 bg-fire" />
          </div>
        )}
      </header>

      <main className="flex-1 overflow-y-auto px-4 pt-4 pb-24">
        {loading && jobs.length === 0 && leads.length === 0 ? (
          <div className="space-y-2">
            {[0,1,2,3].map((i) => <div key={i} className="h-24 bg-iron animate-pulse" />)}
          </div>
        ) : (
          <>
            {tab === "home" && <HomeTab leads={leads} jobs={jobs} refresh={refresh} onSwitchTab={switchTab} onSwitchTabFiltered={switchTabFiltered} />}
            {tab === "leads" && <LeadsTab leads={leads} refresh={refresh} initialFilter={leadFilter} />}
            {tab === "jobs" && <JobsTab jobs={jobs} refresh={refresh} initialFilter={jobFilter} />}
            {tab === "customers" && <CustomersTab jobs={jobs} />}
            {tab === "settings" && <SettingsTab onSignOut={signOut} />}
          </>
        )}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-iron border-t-2 border-steel flex z-40">
        {NAV.map((n) => {
          const active = tab === n.id;
          return (
            <button
              key={n.id}
              onClick={() => switchTab(n.id)}
              className="flex-1 flex flex-col items-center py-2 transition-colors"
              style={{
                color: active ? "hsl(var(--fire))" : "hsl(var(--fog))",
                borderTop: active ? "2px solid hsl(var(--fire))" : "2px solid transparent",
                marginTop: -2,
              }}
            >
              <span style={{ fontSize: 22 }}>{n.icon}</span>
              <span className="font-condensed uppercase mt-0.5" style={{ fontSize: 10, letterSpacing: 1 }}>
                {n.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Dashboard;