import demoImg from "@/assets/service-demolition.jpg";
import junkImg from "@/assets/service-junk.jpg";
import haulImg from "@/assets/service-hauling.jpg";

const SERVICES = [
  {
    image: demoImg,
    title: "DEMOLITION SERVICES",
    body: "Interior demo, wall removal, structure teardown, and site clearing. We handle the heavy work so your project can move forward.",
    tag: "Residential & Commercial",
  },
  {
    image: junkImg,
    title: "JUNK REMOVAL",
    body: "Full property cleanouts, appliance removal, furniture hauling, estate cleanouts, and debris removal. We load it, haul it, and dispose of it responsibly.",
    tag: "Same-Day Available",
  },
  {
    image: haulImg,
    title: "HAULING & MOVING",
    body: "Need something moved? We handle furniture, equipment, materials, and more. Local hauling and moving services for homeowners and businesses.",
    tag: "Local & Regional",
  },
];

export const Services = () => (
  <section id="services" className="bg-iron px-6 md:px-10 py-20">
    <div className="max-w-6xl mx-auto">
      <div className="font-eyebrow mb-3">WHAT WE DO</div>
      <h2 className="font-display text-chalk text-[40px] md:text-[52px] leading-none">
        THREE SERVICES. ONE CALL.
      </h2>

      <div className="grid md:grid-cols-3 gap-0.5 mt-10">
        {SERVICES.map((s) => (
          <div
            key={s.title}
            className="bg-ink hover:bg-[#0F0F0F] transition-colors group overflow-hidden"
            style={{ borderTop: "3px solid hsl(var(--fire))" }}
          >
            <div className="aspect-[4/3] overflow-hidden">
              <img
                src={s.image}
                alt={s.title}
                loading="lazy"
                width={1024}
                height={768}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="p-8">
              <h3 className="font-display text-chalk" style={{ fontSize: 26 }}>
                {s.title}
              </h3>
              <p className="text-fog mt-3" style={{ fontSize: 14, lineHeight: 1.7 }}>
                {s.body}
              </p>
              <div className="font-condensed text-fire mt-4 uppercase" style={{ fontSize: 11, letterSpacing: 1 }}>
                {s.tag}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);