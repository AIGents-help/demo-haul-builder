import crewImg from "@/assets/crew.jpg";

const BLOCKS = [
  { n: "01", t: "LICENSED & FULLY INSURED", b: "You're protected. Every job we take is covered — no liability risk to you or your property." },
  { n: "02", t: "FAST RESPONSE & SAME-DAY SERVICE", b: "Call us and we'll tell you exactly when we can be there — often the same day. No long wait windows." },
  { n: "03", t: "FAIR, UPFRONT PRICING", b: "No surprise fees. We give you a quote before we start and we stick to it. Period." },
  { n: "04", t: "WE CLEAN UP AFTER OURSELVES", b: "When we leave, the job is done. Area cleared, debris gone, property left better than we found it." },
];

export const WhyUs = () => (
  <section id="why-us" className="bg-ink px-6 md:px-10 py-20">
    <div className="max-w-6xl mx-auto">
      <div className="font-eyebrow mb-3">WHY DiANTONIO'S</div>
      <h2 className="font-display text-chalk text-[40px] md:text-[52px] leading-none">
        BUILT ON TRUST. BACKED BY RESULTS.
      </h2>
      <div className="grid lg:grid-cols-[1fr_1fr] gap-8 mt-10 items-start">
        <div className="relative overflow-hidden">
          <img
            src={crewImg}
            alt="The DiAntonio's Demo & Hauling crew"
            loading="lazy"
            width={1600}
            height={1067}
            className="w-full h-full object-cover"
            style={{ minHeight: 360 }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 right-6">
            <div className="font-condensed text-fire uppercase" style={{ fontSize: 11, letterSpacing: 1 }}>
              THE CREW
            </div>
            <div className="font-display text-chalk mt-1" style={{ fontSize: 22 }}>
              FAMILY-OWNED. LOCALLY OPERATED.
            </div>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-0.5">
        {BLOCKS.map((bk) => (
          <div key={bk.n} className="bg-iron p-8 group transition-all"
               style={{ borderLeft: "3px solid hsl(var(--steel))" }}
               onMouseEnter={(e) => (e.currentTarget.style.borderLeftColor = "hsl(var(--fire))")}
               onMouseLeave={(e) => (e.currentTarget.style.borderLeftColor = "hsl(var(--steel))")}>
            <div className="font-display text-fire" style={{ fontSize: 56, opacity: 0.25, lineHeight: 1 }}>{bk.n}</div>
            <div className="text-chalk uppercase mt-2" style={{ fontFamily: "Barlow", fontWeight: 600, fontSize: 16 }}>{bk.t}</div>
            <p className="text-fog mt-2" style={{ fontSize: 14, lineHeight: 1.7 }}>{bk.b}</p>
          </div>
        ))}
        </div>
      </div>
    </div>
  </section>
);