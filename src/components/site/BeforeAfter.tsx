import { useState } from "react";
import tubBefore from "@/assets/real/tub-before.webp";
import tubAfter from "@/assets/real/tub-after.webp";

// Only genuine same-job pairs belong here. Add more as Corey posts them.
const PAIRS = [
  {
    title: "Master bathroom demo",
    caption: "Jacuzzi tub, tile surround, and vanity out — room cleared and swept for the remodel crew.",
    before: tubBefore,
    after: tubAfter,
  },
];

export const BeforeAfter = () => {
  const [active, setActive] = useState(0);
  const showAfter = true;
  const p = PAIRS[active];

  return (
    <section id="before-after" className="bg-ink px-6 md:px-10 py-24">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-[0.8fr_1.2fr] gap-12 items-center">
        <div>
          <div className="font-eyebrow mb-3">THE WORK SPEAKS</div>
          <h2 className="font-display text-chalk text-[44px] md:text-[64px] leading-[0.95]">BEFORE &amp; AFTER.</h2>
          <p className="text-fog mt-4" style={{ fontSize: 15 }}>
            Real jobs, real photos. What you see is what we leave behind — cleared, swept, and ready for what's next.
          </p>

          {PAIRS.length > 1 && <div className="mt-8 space-y-2">
            {PAIRS.map((pair, i) => (
              <button
                key={pair.title}
                onClick={() => setActive(i)}
                className={`w-full text-left rounded-xl px-5 py-4 transition-all border ${
                  i === active ? "bg-iron border-fire" : "bg-transparent border-steel hover:border-fog"
                }`}
              >
                <div className="font-display text-chalk" style={{ fontSize: 22, letterSpacing: 1 }}>{pair.title}</div>
                <div className="text-fog" style={{ fontSize: 13.5, lineHeight: 1.5 }}>{pair.caption}</div>
              </button>
            ))}
          </div>}
          {PAIRS.length === 1 && (
            <div className="mt-8 border-l-4 border-fire pl-5">
              <div className="font-display text-chalk" style={{ fontSize: 24, letterSpacing: 1 }}>{p.title}</div>
              <div className="text-fog" style={{ fontSize: 14.5 }}>{p.caption}</div>
            </div>
          )}
        </div>

        <div>
          <div className="grid grid-cols-2 gap-3">
            {(["before", "after"] as const).map((k) => (
              <figure
                key={k}
                className={`relative aspect-[3/4] rounded-2xl overflow-hidden transition-all duration-500 ${
                  (k === "after") === showAfter ? "ring-2 ring-fire" : "opacity-80"
                }`}
              >
                <img src={p[k]} alt={`${p.title} — ${k}`} loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
                <span
                  className={`absolute top-3 left-3 font-condensed uppercase rounded px-3 py-1 ${
                    k === "after" ? "bg-fire text-white" : "bg-white text-black"
                  }`}
                  style={{ fontSize: 11, letterSpacing: 2, fontWeight: 700 }}
                >
                  {k}
                </span>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
