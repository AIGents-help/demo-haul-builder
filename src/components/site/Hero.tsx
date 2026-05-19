import { BUSINESS } from "@/config/business";
import { AvailabilityCard } from "./AvailabilityCard";
import heroImage from "@/assets/hero-demo.jpg";

export const Hero = () => (
  <section className="relative min-h-screen bg-ink flex flex-col items-center justify-center text-center px-6 pt-24 pb-16 overflow-hidden">
    <img
      src={heroImage}
      alt="DiAntonio's demolition crew at work on an interior demo"
      width={1920}
      height={1080}
      className="absolute inset-0 w-full h-full object-cover opacity-40"
    />
    <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/60 to-ink" />
    <div className="relative font-eyebrow mb-6">
      LICENSED &amp; INSURED · {BUSINESS.cityState} &amp; SURROUNDING AREAS
    </div>

    <h1 className="relative font-display" style={{ lineHeight: 0.9, letterSpacing: "2px" }}>
      <span className="block text-chalk text-[80px] md:text-[96px]">WE HAUL.</span>
      <span className="block text-chalk text-[80px] md:text-[96px]">WE DEMO.</span>
      <span className="block text-fire text-[80px] md:text-[96px]">WE HANDLE IT.</span>
    </h1>

    <p className="relative text-fog font-body mt-5 max-w-[480px] mx-auto" style={{ fontSize: 17, fontWeight: 300 }}>
      Fast, reliable demolition and junk removal. One call and we show up — licensed, insured, and ready to work.
    </p>

    <a
      href={`tel:${BUSINESS.phoneTel}`}
      className="group relative animate-pulse-cta bg-gradient-to-br from-fire to-ember hover:from-ember hover:to-fire text-white font-display flex flex-col items-center justify-center w-full max-w-[360px] mx-auto mt-8 py-5 px-8 rounded-xl shadow-[0_10px_40px_-10px_hsl(var(--fire)/0.6)] ring-1 ring-white/10 hover:ring-white/20 transition-all hover:-translate-y-0.5"
    >
      <span className="font-condensed text-white/80 uppercase mb-1" style={{ fontSize: 11, letterSpacing: 3 }}>
        Tap to call
      </span>
      <span className="flex items-center gap-3 whitespace-nowrap" style={{ fontSize: 26 }}>
        <span className="text-2xl group-hover:rotate-12 transition-transform">📞</span>
        {BUSINESS.phone}
      </span>
    </a>

    <button
      onClick={() => document.getElementById("quote-form")?.scrollIntoView({ behavior: "smooth" })}
      className="relative text-fog hover:text-chalk hover:underline mt-3.5"
      style={{ fontSize: 14 }}
    >
      or submit a quote request →
    </button>

    <div className="relative flex flex-wrap gap-2 justify-center mt-7">
      {["✓ Licensed", "✓ Insured", "✓ Free Quotes"].map((p) => (
        <span
          key={p}
          className="bg-steel/80 backdrop-blur text-fog font-condensed uppercase"
          style={{ fontSize: 11, letterSpacing: 1, padding: "6px 14px" }}
        >
          {p}
        </span>
      ))}
    </div>

    <div className="relative lg:hidden w-full">
      <AvailabilityCard />
    </div>
    <AvailabilityCard floating />
  </section>
);