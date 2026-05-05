import { useAvailability, statusColor } from "@/hooks/useAvailability";

export const MobileBar = () => {
  const a = useAvailability();
  const color = statusColor(a.status);
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-[1000] bg-iron flex items-center justify-between px-5 py-3"
         style={{ borderTop: "2px solid hsl(var(--fire))" }}>
      <div className="flex items-center gap-2 min-w-0">
        <span className="pulse-dot" style={{ backgroundColor: color }} />
        <div className="min-w-0">
          <div className="font-condensed text-fog uppercase" style={{ fontSize: 10, letterSpacing: 2 }}>NEXT AVAILABLE:</div>
          <div className="text-chalk truncate" style={{ fontSize: 13, fontWeight: 600 }}>{a.message}</div>
        </div>
      </div>
      <button
        onClick={() => document.getElementById("quote-form")?.scrollIntoView({ behavior: "smooth" })}
        className="bg-fire text-white font-condensed font-bold uppercase px-4 py-2.5 shrink-0"
        style={{ fontSize: 13 }}
      >
        BOOK NOW
      </button>
    </div>
  );
};