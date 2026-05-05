import { useAvailability, statusColor } from "@/hooks/useAvailability";

export const AvailabilityCard = ({ floating = false }: { floating?: boolean }) => {
  const a = useAvailability();
  const color = statusColor(a.status);
  return (
    <div
      className={`bg-iron p-4 sm:p-5 max-w-[280px] ${
        floating ? "hidden lg:block absolute bottom-10 right-10" : "mx-auto mt-6"
      }`}
      style={{ borderLeft: `4px solid ${color}` }}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="pulse-dot" style={{ backgroundColor: color }} />
        <span className="font-condensed" style={{ fontSize: 10, letterSpacing: 2, color: "hsl(var(--fog))" }}>
          AVAILABILITY
        </span>
      </div>
      <div className="font-display text-chalk text-xl mb-1">{a.message}</div>
      <div style={{ fontSize: 12, color: "#6a6058", fontStyle: "italic" }}>Updated daily</div>
      <a
        href="#quote-form"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById("quote-form")?.scrollIntoView({ behavior: "smooth" });
        }}
        className="text-fire hover:text-ember inline-block mt-2"
        style={{ fontSize: 12 }}
      >
        Book a slot →
      </a>
    </div>
  );
};