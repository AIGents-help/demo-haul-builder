import { useMemo, useState } from "react";
import { Job, formatMoney } from "./types";
import { BUSINESS } from "@/config/business";

type Customer = {
  name: string;
  phone: string | null;
  zip: string | null;
  services: Set<string>;
  jobCount: number;
  revenue: number;
  lastJob: string | null;
  reviewRequested: boolean;
};

export const CustomersTab = ({ jobs }: { jobs: Job[] }) => {
  const [search, setSearch] = useState("");

  const customers: Customer[] = useMemo(() => {
    const map = new Map<string, Customer>();
    for (const j of jobs) {
      const key = `${j.customer_name.toLowerCase()}|${j.customer_phone ?? ""}`;
      if (!map.has(key)) {
        map.set(key, {
          name: j.customer_name, phone: j.customer_phone, zip: j.zip,
          services: new Set(), jobCount: 0, revenue: 0, lastJob: null,
          reviewRequested: false,
        });
      }
      const c = map.get(key)!;
      c.services.add(j.service_type);
      c.jobCount++;
      if (j.paid && j.final_amount) c.revenue += Number(j.final_amount);
      if (!c.lastJob || (j.job_date && j.job_date > c.lastJob)) c.lastJob = j.job_date;
      if (j.google_review_requested) c.reviewRequested = true;
    }
    return Array.from(map.values()).sort((a, b) => (b.lastJob ?? "").localeCompare(a.lastJob ?? ""));
  }, [jobs]);

  const filtered = customers.filter((c) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return c.name.toLowerCase().includes(q) || (c.phone ?? "").includes(q) || (c.zip ?? "").includes(q);
  });

  const reviewMessage = (name: string) =>
    `Hey ${name}! Really appreciate your business. If you have 30 seconds, a Google review means the world to us: ${BUSINESS.googleReviewsUrl}. Thanks! — Corey`;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="font-display text-chalk" style={{ fontSize: 26 }}>CUSTOMERS</h1>
        <span className="font-condensed text-fog uppercase" style={{ fontSize: 11, letterSpacing: 1.5 }}>
          {customers.length} total
        </span>
      </div>
      <input
        value={search} onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by name, phone, or ZIP..."
        className="w-full bg-iron border border-steel text-chalk p-3 mb-4 focus:outline-none focus:border-fire"
      />

      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <div style={{ fontSize: 48 }}>👥</div>
          <div className="font-display text-chalk mt-2" style={{ fontSize: 22 }}>NO CUSTOMERS</div>
          <div className="text-fog mt-1" style={{ fontSize: 13 }}>Add a job — customers appear here.</div>
        </div>
      ) : (
        <div className="space-y-1">
          {filtered.map((c, i) => (
            <div key={i} className="bg-iron p-4 border-b border-steel">
              <div className="flex justify-between items-start">
                <div className="text-chalk font-semibold" style={{ fontSize: 15 }}>{c.name}</div>
                <div className="text-fog text-right" style={{ fontSize: 12 }}>{c.lastJob ?? "—"}</div>
              </div>
              {c.phone && (
                <div className="text-fog mt-1" style={{ fontSize: 13 }}>
                  <a href={`tel:${c.phone}`} className="text-fire">📞 {c.phone}</a>
                  {" · "}
                  <a href={`sms:${c.phone}`} className="text-fire">💬 Text</a>
                </div>
              )}
              <div className="flex gap-1 mt-2 flex-wrap">
                {Array.from(c.services).map((s) => (
                  <span key={s} className="bg-steel text-chalk px-2 py-0.5" style={{ fontSize: 11 }}>{s}</span>
                ))}
              </div>
              <div className="text-fog mt-2" style={{ fontSize: 12 }}>
                {c.jobCount} job{c.jobCount === 1 ? "" : "s"} · Revenue {formatMoney(c.revenue)}
              </div>
              {c.phone && (
                <a
                  href={`sms:${c.phone}?body=${encodeURIComponent(reviewMessage(c.name))}`}
                  className="block w-full mt-3 border border-fire text-fire text-center font-display py-2 active:opacity-80"
                  style={{ fontSize: 13 }}
                >
                  ⭐ REQUEST GOOGLE REVIEW
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};