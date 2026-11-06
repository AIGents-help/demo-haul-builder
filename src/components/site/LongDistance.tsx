import { BUSINESS } from "@/config/business";
import truckFlorida from "@/assets/real/truck-branded-florida.webp";
import truckWisconsin from "@/assets/real/truck-sunset-wisconsin.webp";
import truckCali from "@/assets/real/owner-truck-palms.webp";

// Destinations pulled from completed moves posted on Instagram.
const STATES = ["California", "Florida", "Texas", "Wisconsin", "South Carolina", "Alabama"];

export const LongDistance = () => (
  <section id="moving" className="relative bg-forest overflow-hidden px-6 md:px-10 py-24 scroll-mt-16">
    <div
      className="absolute inset-0 opacity-[0.07]"
      style={{ backgroundImage: "repeating-linear-gradient(-45deg,#fff 0 2px,transparent 2px 22px)" }}
      aria-hidden
    />
    <div className="relative max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
      <div>
        <div className="font-condensed uppercase text-white/70" style={{ fontSize: 12, letterSpacing: 4, fontWeight: 700 }}>
          Long-distance moving
        </div>
        <h2 className="font-display text-white mt-3 text-[48px] md:text-[72px]" style={{ lineHeight: 0.9 }}>
          PA <span className="text-[#9be3b4]">→</span> ANYWHERE.
        </h2>
        <p className="text-white/85 mt-5 max-w-lg" style={{ fontSize: 17, lineHeight: 1.7, fontWeight: 400 }}>
          Most junk guys stop at the county line. We load your truck in Pennsylvania and drive it to your new front door —
          same crew that packed it, start to finish.
        </p>

        <div className="mt-8">
          <div className="font-condensed uppercase text-white/60 mb-3" style={{ fontSize: 11, letterSpacing: 3 }}>
            Recent moves delivered to
          </div>
          <div className="flex flex-wrap gap-2">
            {STATES.map((s) => (
              <span key={s} className="bg-white/10 border border-white/20 text-white rounded-full px-4 py-2 font-condensed uppercase" style={{ fontSize: 13, letterSpacing: 1.5, fontWeight: 600 }}>
                ✓ {s}
              </span>
            ))}
          </div>
        </div>

        <a
          href={`sms:${BUSINESS.phoneTel}`}
          className="inline-block mt-10 bg-white hover:bg-[#e9f7ee] text-forest rounded-lg px-7 py-4 font-display transition-colors"
          style={{ fontSize: 22, letterSpacing: 1 }}
        >
          GET A MOVING QUOTE →
        </a>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <img src={truckFlorida} alt="DiAntonio's truck delivering a move in Florida" loading="lazy" className="row-span-2 w-full h-full object-cover rounded-2xl shadow-2xl" />
        <img src={truckCali} alt="Truck arriving in California after a move from Pennsylvania" loading="lazy" className="w-full aspect-[4/5] object-cover rounded-2xl shadow-2xl" />
        <img src={truckWisconsin} alt="Truck at sunrise in Elkhorn, Wisconsin" loading="lazy" className="w-full aspect-[4/5] object-cover rounded-2xl shadow-2xl" />
      </div>
    </div>
  </section>
);
