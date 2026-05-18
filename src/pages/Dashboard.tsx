import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Toaster } from "@/components/ui/sonner";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Lead, Job } from "@/components/dashboard/types";
import { HomeTab } from "@/components/dashboard/HomeTab";
import { LeadsTab } from "@/components/dashboard/LeadsTab";
import { JobsTab } from "@/components/dashboard/JobsTab";
import { CustomersTab } from "@/components/dashboard/CustomersTab";
import { SettingsTab } from "@/components/dashboard/SettingsTab";
import { SEO } from "@/components/SEO";
import { useIsMobile } from "@/hooks/use-mobile";
import { AppSidebar, type DashTab } from "@/components/dashboard/shell/AppSidebar";
import { Bell, Search } from "lucide-react";

type Tab = DashTab;

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
  const [tab, setTab] = useState<Tab>("home");
  const [leadFilter, setLeadFilter] = useState<string | undefined>();
  const [jobFilter, setJobFilter] = useState<string | undefined>();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();

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

  useEffect(() => { refresh(); }, [refresh]);

  const signOut = async () => { await supabase.auth.signOut(); };

  const switchTab = (t: Tab) => { setTab(t); setLeadFilter(undefined); setJobFilter(undefined); };
  const switchTabFiltered = (t: "leads" | "jobs", filter: string) => {
    setTab(t);
    if (t === "leads") setLeadFilter(filter); else setJobFilter(filter);
  };

  const newLeadCount = leads.filter((l) => l.status === "new").length;

  const content = (
    <>
      {loading && jobs.length === 0 && leads.length === 0 ? (
        <div className="space-y-2">
          {[0,1,2,3].map((i) => <div key={i} className="h-24 bg-iron rounded-lg animate-pulse" />)}
        </div>
      ) : (
        <>
          {tab === "home" && <HomeTab leads={leads} jobs={jobs} refresh={refresh} onSwitchTab={(t) => switchTab(t as Tab)} onSwitchTabFiltered={switchTabFiltered} />}
          {tab === "leads" && <LeadsTab leads={leads} refresh={refresh} initialFilter={leadFilter} />}
          {tab === "jobs" && <JobsTab jobs={jobs} refresh={refresh} initialFilter={jobFilter} />}
          {tab === "customers" && <CustomersTab jobs={jobs} />}
          {tab === "settings" && <SettingsTab onSignOut={signOut} />}
          {(tab === "calendar" || tab === "invoices" || tab === "reports") && (
            <ComingSoon label={tab} />
          )}
        </>
      )}
    </>
  );

  // ============ MOBILE LAYOUT ============
  if (isMobile) {
    return (
      <div className="bg-ink min-h-screen flex flex-col">
        <SEO title="Owner Dashboard — DiAntonio's" description="Leads, jobs, and customers dashboard." path="/dashboard" noindex />
        <Toaster />
        <header className="bg-iron border-b border-steel px-5 py-4 flex justify-between items-center">
          <div>
            <div className="font-display text-chalk" style={{ fontSize: 18 }}>{greeting()}</div>
            <div className="text-fog" style={{ fontSize: 12 }}>{todayLabel()}</div>
          </div>
          {newLeadCount > 0 && (
            <button onClick={() => switchTab("leads")} className="relative">
              <span className="bg-fire text-white font-display px-2 py-1 rounded-md" style={{ fontSize: 12 }}>
                {newLeadCount} NEW
              </span>
              <span className="pulse-dot absolute -top-1 -right-1 bg-fire" />
            </button>
          )}
        </header>
        <main className="flex-1 overflow-y-auto px-4 pt-4 pb-24">{content}</main>
        <nav className="fixed bottom-0 left-0 right-0 bg-iron border-t border-steel flex z-40">
          {NAV.map((n) => {
            const active = tab === n.id;
            return (
              <button
                key={n.id}
                onClick={() => switchTab(n.id as Tab)}
                className="flex-1 flex flex-col items-center py-2 transition-colors"
                style={{
                  color: active ? "hsl(var(--fire))" : "hsl(var(--fog))",
                  borderTop: active ? "2px solid hsl(var(--fire))" : "2px solid transparent",
                  marginTop: -1,
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
  }

  // ============ DESKTOP LAYOUT ============
  return (
    <SidebarProvider>
      <SEO title="Owner Dashboard — DiAntonio's" description="Leads, jobs, and customers dashboard." path="/dashboard" noindex />
      <Toaster />
      <div className="min-h-screen flex w-full bg-ink">
        <AppSidebar tab={tab} onSelect={(t) => switchTab(t)} newLeadCount={newLeadCount} />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-16 border-b border-steel bg-iron/60 backdrop-blur flex items-center gap-3 px-4 sticky top-0 z-30">
            <SidebarTrigger className="text-chalk" />
            <div className="hidden md:flex flex-col leading-tight">
              <span className="font-display text-chalk text-base tracking-wider">{tabTitle(tab)}</span>
              <span className="text-fog text-[11px]">{greeting()} · {todayLabel()}</span>
            </div>
            <div className="flex-1 max-w-md mx-auto relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-fog" />
              <input
                placeholder="Search leads, jobs, customers…"
                className="w-full bg-steel/50 border border-steel rounded-md pl-9 pr-3 py-2 text-sm text-chalk placeholder:text-fog focus:outline-none focus:border-fire"
              />
            </div>
            <button
              onClick={() => switchTab("leads")}
              className="relative p-2 rounded-md hover:bg-steel/60 text-fog hover:text-chalk transition-colors"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              {newLeadCount > 0 && (
                <span className="absolute top-1 right-1 bg-fire text-white text-[10px] font-semibold rounded-full h-4 min-w-4 px-1 flex items-center justify-center">
                  {newLeadCount}
                </span>
              )}
            </button>
          </header>
          <main className="flex-1 overflow-y-auto p-6 max-w-6xl w-full mx-auto">{content}</main>
        </div>
      </div>
    </SidebarProvider>
  );
};

const tabTitle = (t: Tab) =>
  ({ home: "Overview", leads: "Leads", jobs: "Jobs", calendar: "Schedule",
     customers: "Customers", invoices: "Invoices", reports: "Reports", settings: "Settings" }[t]);

const ComingSoon = ({ label }: { label: string }) => (
  <div className="border border-dashed border-steel rounded-lg p-16 text-center">
    <div className="font-display text-chalk text-2xl uppercase tracking-wider">{label}</div>
    <div className="text-fog mt-2">Coming in the next phase of the build.</div>
  </div>
);

/* end */
const _End = () => null;
void _End;

export default Dashboard;