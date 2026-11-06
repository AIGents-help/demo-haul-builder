import { BUSINESS } from "@/config/business";
import { AvailabilityCard } from "./AvailabilityCard";
import heroImage from "@/assets/real/hero-commercial-gut.webp";
import ownerImage from "@/assets/real/owner-truck-palms.webp";
import tubAfter from "@/assets/real/tub-after.webp";

const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

export const Hero = () => (
  <section className="relative min-h-[100svh] bg-ink overflow-hidden pt-[76px]">
    {/* Real job: full commercial gut on Main Street */}
    <img
      src={heroImage}
      alt="Commercial space fully gutted by DiAntonio's Demo & Hauling"
      width={1800}
      height={2039}
      fetchPriority="high"
      className="absolute inset-0 w-full h-full object-cover object-center"
    />
    <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/80 to-black/30" />
    <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent" />

    <div className="relative max-w-7xl mx-auto px-6 md:px-10 grid lg:grid-cols-[1.15fr_0.85fr] gap-12 items-center min-h-[calc(100svh-76px)] py-14">
      <div>
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/15 rounded-full px-4 py-1.5">
          <span className="pulse-dot bg-avail-green" />
          <span className="font-condensed uppercase text-chalk" style={{ fontSize: 11, letterSpacing: 3, fontWeight: 600 }}>
            Owner-operated · Licensed &amp; Insured
          </span>
        </div>

        <h1 className="font-display mt-6" style={{ lineHeight: 0.88, letterSpacing: "1px" }}>
          <span className="block text-chalk text-[64px] sm:text-[84px] md:text-[112px]">GUTTED.</span>
          <span className="block text-chalk text-[64px] sm:text-[84px] md:text-[112px]">HAULED.</span>
          <span className="block text-fire text-[64px] sm:text-[84px] md:text-[112px]">GONE.</span>
        </h1>

        <p className="text-[#d6d6d6] mt-6 max-w-[520px]" style={{ fontSize: 18, fontWeight: 400, lineHeight: 1.6 }}>
          Interior demolition, full cleanouts, junk removal, and moves across the country.
          You deal with the owner from first call to final sweep.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 mt-8 max-w-[560px]">
          <a
            href={`tel:${BUSINESS.phoneTel}`}
            className="group flex-1 bg-fire hover:bg-ember text-white rounded-lg px-6 py-4 flex items-center justify-center gap-3 shadow-[0_14px_40px_-12px_hsl(var(--fire)/0.7)] transition-all hover:-translate-y-0.5"
          >
            <span className="text-xl group-hover:rotate-12 transition-transform" aria-hidden>📞</span>
            <span className="leading-none text-left">
              <span className="block font-condensed uppercase text-white/80" style={{ fontSize: 10, letterSpacing: 2 }}>
                Call or text now
              </span>
              <span className="block font-display" style={{ fontSize: 26, letterSpacing: 1 }}>{BUSINESS.phone}</span>
            </span>
          </a>
          <button
            onClick={() => scrollTo("photo-quote")}
            className="flex-1 border-2 border-white/70 hover:bg-white hover:text-black text-white rounded-lg px-6 py-4 font-display transition-colors"
            style={{ fontSize: 22, letterSpacing: 1 }}
          >
            TEXT A PHOTO → QUOTE
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3 sm:gap-4 mt-10 max-w-[520px] border-t border-white/15 pt-6">
          {[
            ["Same-day", "Service available"],
            ["6+ States", "Long-distance moves"],
            ["Free", "Upfront quotes"],
          ].map(([big, small]) => (
            <div key={big}>
              <div className="font-display text-chalk text-[22px] sm:text-[28px]" style={{ lineHeight: 1 }}>{big}</div>
              <div className="font-condensed uppercase text-fog mt-1" style={{ fontSize: 11, letterSpacing: 1.5 }}>{small}</div>
            </div>
          ))}
        </div>

        <div className="lg:hidden">
          <AvailabilityCard />
        </div>
      </div>

      {/* Desktop photo stack — the real owner + a real result */}
      <div className="relative hidden lg:block h-[620px]">
        <figure className="absolute right-0 top-0 w-[78%] h-[480px] rounded-2xl overflow-hidden ring-1 ring-white/20 shadow-2xl rotate-[2deg]">
          <img src={ownerImage} alt="Owner Corey DiAntonio with the moving truck" className="w-full h-full object-cover" loading="eager" />
          <figcaption className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 to-transparent p-5">
            <div className="font-script brand-script-dark" style={{ fontSize: 30 }}>Corey DiAntonio</div>
            <div className="font-condensed uppercase text-chalk/80" style={{ fontSize: 11, letterSpacing: 2 }}>Owner · On every job</div>
          </figcaption>
        </figure>
        <figure className="absolute left-0 bottom-0 w-[52%] h-[300px] rounded-2xl overflow-hidden ring-4 ring-ink shadow-2xl -rotate-[3deg]">
          <img src={tubAfter} alt="Bathroom fully demoed and ready for renovation" className="w-full h-full object-cover" loading="eager" />
          <span className="absolute top-3 left-3 bg-fire text-white font-condensed uppercase rounded px-2.5 py-1" style={{ fontSize: 10, letterSpacing: 2 }}>
            Bathroom demo · Done
          </span>
        </figure>
        <div className="absolute right-0 bottom-0 w-[280px]">
          <AvailabilityCard />
        </div>
      </div>
    </div>
  </section>
);
