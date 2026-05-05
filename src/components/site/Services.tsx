const SERVICES = [
  {
    icon: "🏗️",
    title: "DEMOLITION SERVICES",
    body: "Interior demo, wall removal, structure teardown, and site clearing. We handle the heavy work so your project can move forward.",
    tag: "Residential & Commercial",
  },
  {
    icon: "♻️",
    title: "JUNK REMOVAL",
    body: "Full property cleanouts, appliance removal, furniture hauling, estate cleanouts, and debris removal. We load it, haul it, and dispose of it responsibly.",
    tag: "Same-Day Available",
  },
  {
    icon: "🚛",
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
            className="bg-ink p-8 hover:bg-[#0F0F0F] transition-colors group"
            style={{ borderTop: "3px solid hsl(var(--fire))" }}
          >
            <div style={{ fontSize: 40 }}>{s.icon}</div>
            <h3 className="font-display text-chalk mt-2" style={{ fontSize: 26 }}>
              {s.title}
            </h3>
            <p className="text-fog mt-3" style={{ fontSize: 14, lineHeight: 1.7 }}>
              {s.body}
            </p>
            <div className="font-condensed text-fire mt-4 uppercase" style={{ fontSize: 11, letterSpacing: 1 }}>
              {s.tag}
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);