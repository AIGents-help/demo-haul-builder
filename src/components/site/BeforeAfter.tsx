import { BUSINESS } from "@/config/business";
import before1 from "@/assets/before-1.jpg";
import after1 from "@/assets/after-1.jpg";
import before2 from "@/assets/before-2.jpg";
import after2 from "@/assets/after-2.jpg";
import before3 from "@/assets/before-3.jpg";
import after3 from "@/assets/after-3.jpg";

const ITEMS = [
  { caption: "Full interior demo — walls, flooring, debris. Cleared in one day.", before: before1, after: after1 },
  { caption: "Estate cleanout — 20+ years of items. Gone in 4 hours.", before: before2, after: after2 },
  { caption: "Post-renovation debris removal — site cleared for final inspection.", before: before3, after: after3 },
];

export const BeforeAfter = () => (
  <section id="before-after" className="bg-iron px-6 md:px-10 py-20">
    <div className="max-w-6xl mx-auto">
      <div className="font-eyebrow mb-3">THE WORK SPEAKS</div>
      <h2 className="font-display text-chalk text-[40px] md:text-[52px] leading-none">BEFORE &amp; AFTER.</h2>

      <div className="grid md:grid-cols-3 gap-0.5 mt-10">
        {ITEMS.map((item, i) => (
          <div key={i} className="bg-ink overflow-hidden">
            <div className="flex">
              <div className="relative w-1/2 h-[180px] bg-iron overflow-hidden">
                <img src={item.before} alt="Before" loading="lazy" width={768} height={768} className="absolute inset-0 w-full h-full object-cover" />
                <span className="absolute top-2 left-2 bg-steel text-chalk font-condensed uppercase z-10" style={{ fontSize: 10, padding: "4px 10px" }}>
                  BEFORE
                </span>
              </div>
              <div className="relative w-1/2 h-[180px] bg-steel overflow-hidden">
                <img src={item.after} alt="After" loading="lazy" width={768} height={768} className="absolute inset-0 w-full h-full object-cover" />
                <span className="absolute top-2 left-2 bg-fire text-white font-condensed uppercase z-10" style={{ fontSize: 10, padding: "4px 10px" }}>
                  AFTER
                </span>
              </div>
            </div>
            <p className="px-4 py-3" style={{ fontSize: 13, color: "#6a6058", fontStyle: "italic" }}>
              {item.caption}
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