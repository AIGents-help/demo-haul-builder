import { BUSINESS } from "@/config/business";
import areaImg from "@/assets/service-area.jpg";

export const ServiceArea = () => {
  const pills = [...BUSINESS.serviceAreas, "And More"];
  return (
    <section className="relative bg-ink px-6 md:px-10 py-24 overflow-hidden">
      <img
        src={areaImg}
        alt="Aerial view of Greater Philadelphia neighborhoods we serve"
        loading="lazy"
        width={1600}
        height={900}
        className="absolute inset-0 w-full h-full object-cover opacity-25"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink/70 to-ink" />
      <div className="relative max-w-3xl mx-auto text-center">
        <div className="font-eyebrow mb-3">WHERE WE WORK</div>
        <h2 className="font-display text-chalk text-[40px] md:text-[52px] leading-none">
          SERVING GREATER PHILLY &amp; BEYOND.
        </h2>
        <p className="text-fog mt-4" style={{ fontSize: 15 }}>
          We serve Montgomery, Delaware, Chester, Berks, Philadelphia, Lancaster, and New Castle counties. Not sure if we cover your area? Call us — if we can get there, we will.
        </p>
        <div className="flex flex-wrap gap-2 justify-center mt-6">
          {pills.map((p, i) => (
            <span key={i} className="bg-steel text-fog font-condensed uppercase"
                  style={{ fontSize: 12, letterSpacing: 1, padding: "8px 18px" }}>
              {p}
            </span>
          ))}
        </div>
        <p className="mt-6 text-fire" style={{ fontWeight: 600, fontSize: 16 }}>
          📞 Call to confirm your area —{" "}
          <a href={`tel:${BUSINESS.phoneTel}`} className="hover:underline">{BUSINESS.phone}</a>
        </p>
      </div>
    </section>
  );
};