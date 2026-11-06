import { BUSINESS } from "@/config/business";
import ownerImg from "@/assets/real/owner-truck-alabama.webp";
import { Logo } from "./Logo";

export const Owner = () => (
  <section id="about" className="bg-white text-[#0a0a0a] px-6 md:px-10 py-24 scroll-mt-16">
    <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
      <div className="relative">
        <div className="absolute -inset-3 bg-forest rounded-3xl rotate-[-2deg]" aria-hidden />
        <img
          src={ownerImg}
          alt="Corey DiAntonio, owner of DiAntonio's Demo & Hauling, with his truck"
          loading="lazy"
          width={1100}
          height={1100}
          className="relative z-10 w-full aspect-square object-cover rounded-2xl shadow-2xl"
        />
      </div>

      <div>
        <Logo size="md" />
        <h2 className="font-display mt-6 text-[40px] md:text-[56px]" style={{ lineHeight: 0.95, color: "#0a0a0a" }}>
          YOU CALL THE OWNER.<br />THE OWNER SHOWS UP.
        </h2>
        <p className="mt-5 text-[#3a3a3a]" style={{ fontSize: 16.5, lineHeight: 1.75, fontWeight: 400 }}>
          I'm Corey DiAntonio. I started this company to be the guy contractors and homeowners can count on:
          answer the phone, show up when I say, quote it straight, and leave the place cleaner than I found it.
          No call centers, no franchise, no strangers in your house — just me and my crew doing the work.
        </p>
        <div className="grid grid-cols-2 gap-3 mt-8">
          {["Licensed & fully insured", "Upfront, honest pricing", "Clean job sites", "Residential & commercial"].map((t) => (
            <div key={t} className="flex items-center gap-2 bg-[#f4f2ee] rounded-lg px-4 py-3" style={{ fontSize: 14, fontWeight: 600 }}>
              <span className="text-forest" aria-hidden>✓</span> {t}
            </div>
          ))}
        </div>
        <a
          href={`tel:${BUSINESS.phoneTel}`}
          className="inline-flex items-center gap-3 mt-8 bg-[#0a0a0a] hover:bg-forest text-white rounded-lg px-6 py-4 font-display transition-colors text-[19px] sm:text-[22px] whitespace-nowrap"
          style={{ letterSpacing: 1 }}
        >
          📞 TALK TO COREY — {BUSINESS.phone}
        </a>
      </div>
    </div>
  </section>
);
