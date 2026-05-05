import { BUSINESS } from "@/config/business";

const ITEMS = [
  "Full interior demo — walls, flooring, debris. Cleared in one day.",
  "Estate cleanout — 20+ years of items. Gone in 4 hours.",
  "Post-renovation debris removal — site cleared for final inspection.",
];

export const BeforeAfter = () => (
  <section id="before-after" className="bg-iron px-6 md:px-10 py-20">
    <div className="max-w-6xl mx-auto">
      <div className="font-eyebrow mb-3">THE WORK SPEAKS</div>
      <h2 className="font-display text-chalk text-[40px] md:text-[52px] leading-none">BEFORE &amp; AFTER.</h2>

      <div className="grid md:grid-cols-3 gap-0.5 mt-10">
        {ITEMS.map((cap, i) => (
          <div key={i} className="bg-ink overflow-hidden">
            <div className="flex">
              <div className="w-1/2 h-[180px] flex items-center justify-center bg-iron">
                <span className="bg-steel text-chalk font-condensed uppercase" style={{ fontSize: 10, padding: "4px 10px" }}>
                  BEFORE
                </span>
              </div>
              <div className="w-1/2 h-[180px] flex items-center justify-center bg-steel">
                <span className="bg-fire text-white font-condensed uppercase" style={{ fontSize: 10, padding: "4px 10px" }}>
                  AFTER
                </span>
              </div>
            </div>
            <p className="px-4 py-3" style={{ fontSize: 13, color: "#6a6058", fontStyle: "italic" }}>
              {cap}
            </p>
          </div>
        ))}
      </div>

      <p className="text-center mt-6" style={{ fontSize: 13, color: "#6a6058", fontStyle: "italic" }}>
        Photos updated regularly. Follow us on Instagram @{BUSINESS.instagram} for the latest work.
      </p>
    </div>
  </section>
);