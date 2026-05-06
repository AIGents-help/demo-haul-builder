import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

type Quote = {
  id: string; created_at: string; name: string; phone: string;
  service: string | null; zip: string | null; message: string | null; source: string | null;
};

type EmailLog = {
  message_id: string | null; template_name: string; recipient_email: string;
  status: string; error_message: string | null; created_at: string;
};

const STATUS_COLORS: Record<string, string> = {
  sent: "hsl(var(--avail-green))",
  pending: "hsl(var(--steel))",
  failed: "hsl(var(--avail-red))",
  dlq: "hsl(var(--avail-red))",
  suppressed: "#caa84a",
  bounced: "hsl(var(--avail-red))",
  complained: "hsl(var(--avail-red))",
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [authChecked, setAuthChecked] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [email, setEmail] = useState<string>("");
  const [tab, setTab] = useState<"quotes" | "emails">("quotes");
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [emails, setEmails] = useState<EmailLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    const check = async () => {
      const { data: s } = await supabase.auth.getSession();
      if (!s.session) { navigate("/auth", { replace: true }); return; }
      setEmail(s.session.user.email ?? "");
      const { data: roles } = await supabase
        .from("user_roles").select("role").eq("user_id", s.session.user.id);
      const admin = !!roles?.some((r) => r.role === "admin");
      setIsAdmin(admin);
      setAuthChecked(true);
    };
    check();
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session) navigate("/auth", { replace: true });
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (!isAdmin) return;
    setLoading(true);
    Promise.all([
      supabase.from("quote_requests").select("*").order("created_at", { ascending: false }).limit(200),
      supabase.from("email_send_log").select("*").order("created_at", { ascending: false }).limit(500),
    ]).then(([q, e]) => {
      setQuotes((q.data as Quote[]) ?? []);
      setEmails((e.data as EmailLog[]) ?? []);
      setLoading(false);
    });
  }, [isAdmin]);

  // Deduplicate emails by message_id, keeping latest
  const dedupedEmails = useMemo(() => {
    const map = new Map<string, EmailLog>();
    for (const row of emails) {
      const key = row.message_id ?? `${row.created_at}-${row.recipient_email}`;
      if (!map.has(key)) map.set(key, row);
    }
    return Array.from(map.values());
  }, [emails]);

  const filteredEmails = useMemo(() => {
    if (statusFilter === "all") return dedupedEmails;
    return dedupedEmails.filter((e) => e.status === statusFilter);
  }, [dedupedEmails, statusFilter]);

  const stats = useMemo(() => {
    const total = dedupedEmails.length;
    const count = (s: string) => dedupedEmails.filter((e) => e.status === s).length;
    return {
      total,
      sent: count("sent"),
      failed: count("failed") + count("dlq"),
      suppressed: count("suppressed"),
    };
  }, [dedupedEmails]);

  const signOut = async () => { await supabase.auth.signOut(); };

  if (!authChecked) {
    return <div className="bg-ink min-h-screen p-10 text-fog">Loading...</div>;
  }

  if (!isAdmin) {
    return (
      <div className="bg-ink min-h-screen p-10">
        <div className="max-w-md mx-auto">
          <h1 className="font-display text-fire" style={{ fontSize: 32 }}>NOT AUTHORIZED</h1>
          <p className="text-fog mt-3">This account ({email}) doesn't have dashboard access.</p>
          <button onClick={signOut} className="mt-6 bg-iron border border-steel text-chalk px-4 py-2">
            Sign out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-ink min-h-screen">
      <header className="border-b border-steel px-6 py-4 flex justify-between items-center">
        <div>
          <div className="font-display text-fire" style={{ fontSize: 24 }}>OWNER DASHBOARD</div>
          <div className="text-fog" style={{ fontSize: 12 }}>{email}</div>
        </div>
        <button onClick={signOut} className="bg-iron border border-steel text-chalk px-4 py-2" style={{ fontSize: 13 }}>
          Sign out
        </button>
      </header>

      <div className="px-6 pt-6 flex gap-2">
        {(["quotes", "emails"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="font-display py-2 px-4 transition-colors"
            style={{
              fontSize: 14,
              backgroundColor: tab === t ? "hsl(var(--fire))" : "hsl(var(--iron))",
              color: tab === t ? "white" : "hsl(var(--fog))",
              border: "1px solid hsl(var(--steel))",
            }}
          >
            {t === "quotes" ? `QUOTE REQUESTS (${quotes.length})` : `EMAIL ACTIVITY (${stats.total})`}
          </button>
        ))}
      </div>

      <main className="p-6">
        {loading && <div className="text-fog">Loading...</div>}

        {!loading && tab === "quotes" && (
          <div className="space-y-3">
            {quotes.length === 0 && <div className="text-fog">No quote requests yet.</div>}
            {quotes.map((q) => (
              <div key={q.id} className="bg-iron border border-steel p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-display text-chalk" style={{ fontSize: 18 }}>{q.name}</div>
                    <a href={`tel:${q.phone}`} className="text-fire" style={{ fontSize: 14 }}>📞 {q.phone}</a>
                  </div>
                  <div className="text-fog text-right" style={{ fontSize: 12 }}>
                    {new Date(q.created_at).toLocaleString()}
                  </div>
                </div>
                <div className="mt-2 flex gap-3 flex-wrap" style={{ fontSize: 13 }}>
                  {q.service && <span className="text-chalk">🔧 {q.service}</span>}
                  {q.zip && <span className="text-chalk">📍 {q.zip}</span>}
                </div>
                {q.message && <div className="text-fog mt-2" style={{ fontSize: 14 }}>{q.message}</div>}
              </div>
            ))}
          </div>
        )}

        {!loading && tab === "emails" && (
          <div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
              {[
                { label: "Total", value: stats.total },
                { label: "Sent", value: stats.sent },
                { label: "Failed", value: stats.failed },
                { label: "Suppressed", value: stats.suppressed },
              ].map((s) => (
                <div key={s.label} className="bg-iron border border-steel p-4">
                  <div className="text-fog uppercase" style={{ fontSize: 11, letterSpacing: 1.5 }}>{s.label}</div>
                  <div className="font-display text-chalk mt-1" style={{ fontSize: 28 }}>{s.value}</div>
                </div>
              ))}
            </div>

            <div className="mb-3 flex gap-2 flex-wrap">
              {["all", "sent", "pending", "failed", "dlq", "suppressed"].map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className="px-3 py-1.5 border border-steel uppercase"
                  style={{
                    fontSize: 11, letterSpacing: 1.5,
                    backgroundColor: statusFilter === s ? "hsl(var(--fire))" : "hsl(var(--iron))",
                    color: statusFilter === s ? "white" : "hsl(var(--fog))",
                  }}
                >
                  {s}
                </button>
              ))}
            </div>

            <div className="bg-iron border border-steel overflow-x-auto">
              <table className="w-full" style={{ fontSize: 13 }}>
                <thead>
                  <tr className="text-fog uppercase border-b border-steel" style={{ fontSize: 11, letterSpacing: 1.5 }}>
                    <th className="text-left p-3">Template</th>
                    <th className="text-left p-3">Recipient</th>
                    <th className="text-left p-3">Status</th>
                    <th className="text-left p-3">When</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmails.length === 0 && (
                    <tr><td colSpan={4} className="text-fog p-4 text-center">No emails match.</td></tr>
                  )}
                  {filteredEmails.map((e, i) => (
                    <tr key={`${e.message_id}-${i}`} className="border-b border-steel">
                      <td className="p-3 text-chalk">{e.template_name}</td>
                      <td className="p-3 text-chalk">{e.recipient_email}</td>
                      <td className="p-3">
                        <span
                          className="px-2 py-1 uppercase"
                          style={{
                            fontSize: 10, letterSpacing: 1.2,
                            backgroundColor: STATUS_COLORS[e.status] ?? "hsl(var(--steel))",
                            color: "white",
                          }}
                        >
                          {e.status}
                        </span>
                        {e.error_message && (
                          <div className="text-avail-red mt-1" style={{ fontSize: 11 }}>{e.error_message}</div>
                        )}
                      </td>
                      <td className="p-3 text-fog">{new Date(e.created_at).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;