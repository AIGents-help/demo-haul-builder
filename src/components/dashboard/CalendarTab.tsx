import { useMemo, useState } from "react";
import { Job, JOB_STATUS_COLOR, JOB_STATUS_LABEL, formatMoney } from "./types";

const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);
const addMonths = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth() + n, 1);
const sameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
const ymd = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export const CalendarTab = ({ jobs }: { jobs: Job[] }) => {
  const [cursor, setCursor] = useState(startOfMonth(new Date()));
  const [selected, setSelected] = useState<Date>(new Date());

  const byDate = useMemo(() => {
    const m = new Map<string, Job[]>();
    jobs.forEach((j) => {
      if (!j.job_date) return;
      const k = j.job_date.slice(0, 10);
      if (!m.has(k)) m.set(k, []);
      m.get(k)!.push(j);
    });
    return m;
  }, [jobs]);

  const cells = useMemo(() => {
    const first = startOfMonth(cursor);
    const startWeekday = first.getDay();
    const daysInMonth = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();
    const cells: (Date | null)[] = [];
    for (let i = 0; i < startWeekday; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(cursor.getFullYear(), cursor.getMonth(), d));
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  }, [cursor]);

  const monthLabel = cursor.toLocaleDateString(undefined, { month: "long", year: "numeric" });
  const selectedJobs = byDate.get(ymd(selected)) ?? [];
  const today = new Date();

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="font-display text-chalk" style={{ fontSize: 26 }}>CALENDAR</h1>
        <div className="flex gap-1">
          <button onClick={() => setCursor(addMonths(cursor, -1))} className="bg-steel text-chalk px-3 py-1.5 font-condensed" style={{ fontSize: 14 }}>‹</button>
          <button onClick={() => { const t = new Date(); setCursor(startOfMonth(t)); setSelected(t); }} className="bg-steel text-chalk px-3 py-1.5 font-condensed uppercase" style={{ fontSize: 11, letterSpacing: 1.5 }}>Today</button>
          <button onClick={() => setCursor(addMonths(cursor, 1))} className="bg-steel text-chalk px-3 py-1.5 font-condensed" style={{ fontSize: 14 }}>›</button>
        </div>
      </div>

      <div className="bg-iron p-3 mb-4">
        <div className="text-chalk font-display text-center mb-2" style={{ fontSize: 16, letterSpacing: 1 }}>{monthLabel.toUpperCase()}</div>
        <div className="grid grid-cols-7 gap-1 text-center text-fog font-condensed uppercase mb-1" style={{ fontSize: 10, letterSpacing: 1 }}>
          {["S","M","T","W","T","F","S"].map((d, i) => <div key={i}>{d}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {cells.map((d, i) => {
            if (!d) return <div key={i} className="aspect-square" />;
            const dayJobs = byDate.get(ymd(d)) ?? [];
            const isToday = sameDay(d, today);
            const isSelected = sameDay(d, selected);
            return (
              <button
                key={i}
                onClick={() => setSelected(d)}
                className="aspect-square flex flex-col items-center justify-start p-1 transition-colors"
                style={{
                  backgroundColor: isSelected ? "hsl(var(--fire))" : "hsl(var(--steel) / 0.4)",
                  color: isSelected ? "white" : isToday ? "hsl(var(--fire))" : "hsl(var(--chalk))",
                  border: isToday && !isSelected ? "1px solid hsl(var(--fire))" : "1px solid transparent",
                }}
              >
                <span className="font-semibold" style={{ fontSize: 13 }}>{d.getDate()}</span>
                {dayJobs.length > 0 && (
                  <div className="flex gap-0.5 mt-0.5">
                    {dayJobs.slice(0, 3).map((j, k) => (
                      <span key={k} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: JOB_STATUS_COLOR[j.status] }} />
                    ))}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <div className="text-fog font-condensed uppercase mb-2" style={{ fontSize: 11, letterSpacing: 1.5 }}>
          {selected.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
        </div>
        {selectedJobs.length === 0 ? (
          <div className="bg-iron p-6 text-center text-fog" style={{ fontSize: 13 }}>No jobs scheduled.</div>
        ) : (
          <div className="space-y-2">
            {selectedJobs.map((j) => (
              <div key={j.id} className="bg-iron p-3" style={{ borderLeft: `4px solid ${JOB_STATUS_COLOR[j.status]}` }}>
                <div className="flex justify-between items-start">
                  <div className="text-chalk font-semibold" style={{ fontSize: 14 }}>#{j.job_number} · {j.job_name}</div>
                  <div className="text-fog" style={{ fontSize: 11 }}>{JOB_STATUS_LABEL[j.status]}</div>
                </div>
                <div className="text-fog mt-1" style={{ fontSize: 12 }}>{j.customer_name}{j.job_address ? ` · ${j.job_address}` : ""}</div>
                <div className="text-chalk mt-1" style={{ fontSize: 12 }}>{formatMoney(j.quoted_amount)}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};