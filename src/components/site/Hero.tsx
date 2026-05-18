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
      className="relative animate-pulse-cta bg-fire text-white font-display block w-full max-w-[340px] mx-auto mt-8 py-[18px] px-8"
      style={{ fontSize: 24 }}
    >
      📞 CALL NOW — {BUSINESS.phone}
    </a>

    <button
      onClick={() => document.getElementById("quote-form")?.scrollIntoView({ behavior: "smooth" })}
      className="relative text-fog hover:text-chalk hover:underline mt-3.5"
      style={{ fontSize: 14 }}
    >
      or submit a quote request →
    </button>

    <div className="relative flex flex-wrap gap-2 justify-center mt-7">
      {["✓ Licensed", "✓ Insured", "✓ Same-Day Available", "✓ Free Quotes"].map((p) => (
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