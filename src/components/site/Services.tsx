import demoImg from "@/assets/real/bath-gut-studs.webp";
import junkImg from "@/assets/real/cleanout-before-1.webp";
import haulImg from "@/assets/real/owner-truck-texas.webp";

const SERVICES = [
  {
    image: demoImg,
    alt: "Bathroom demoed down to the studs",
    title: "DEMOLITION",
    body: "Kitchens, bathrooms, full interior guts, carpet, drop ceilings, and commercial build-outs — taken down to the studs and hauled off the same visit.",
    bullets: ["Interior & selective demo", "Full commercial guts", "Debris hauled away"],
    tag: "Residential & Commercial",
  },
  {
    image: junkImg,
    alt: "Packed room before a full cleanout",
    title: "CLEANOUTS & JUNK REMOVAL",
    body: "Hoarder houses, estates, basements, garages, and single items. We load it, haul it, and leave the space broom-clean.",
    bullets: ["Whole-house cleanouts", "Furniture & appliances", "Estate & rental turnovers"],
    tag: "Same-Day Available",
  },
  {
    image: haulImg,
    alt: "Owner with moving truck after a Texas to Pennsylvania move",
    title: "HAULING & LONG-DISTANCE MOVES",
    body: "Local hauls and full moves — from across town to across the country. Florida, Texas, California, Wisconsin, and more.",
    bullets: ["Local & regional hauling", "Out-of-state moves", "Owner drives your load"],
    tag: "PA → Anywhere",
  },
];

export const Services = () => (
  <section id="services" className="bg-iron px-6 md:px-10 py-24 scroll-mt-16">
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <div className="font-eyebrow mb-3">WHAT WE DO</div>
          <h2 className="font-display text-chalk text-[44px] md:text-[64px] leading-[0.95]">
            THREE SERVICES.<br className="hidden md:block" /> ONE CALL.
          </h2>
        </div>
        <p className="text-fog max-w-md" style={{ fontSize: 15 }}>
          Every photo on this site is a real DiAntonio's job — no stock images, no staged crews.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mt-12">
        {SERVICES.map((s) => (
          <article
            key={s.title}
            className="group bg-ink rounded-2xl overflow-hidden ring-1 ring-white/5 hover:ring-fire/60 transition-all hover:-translate-y-1 shadow-[0_20px_50px_-30px_rgba(0,0,0,0.9)]"
          >
            <div className="relative aspect-[4/3] overflow-hidden photo-grain">
              <img
                src={s.image}
                alt={s.alt}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <span
                className="absolute top-4 left-4 z-10 bg-white text-[#0a0a0a] font-condensed uppercase rounded-full px-3 py-1"
                style={{ fontSize: 10, letterSpacing: 2, fontWeight: 700 }}
              >
                {s.tag}
              </span>
            </div>
            <div className="p-7">
              <h3 className="font-display text-chalk" style={{ fontSize: 28, lineHeight: 1 }}>
                {s.title}
              </h3>
              <p className="text-fog mt-3" style={{ fontSize: 14.5, lineHeight: 1.7 }}>
                {s.body}
              </p>
              <ul className="mt-5 space-y-2">
                {s.bullets.map((b) => (
                  <li key={b} className="flex items-center gap-2 text-chalk" style={{ fontSize: 14, fontWeight: 500 }}>
                    <span className="text-fire" aria-hidden>✓</span> {b}
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </div>
  </section>
);
