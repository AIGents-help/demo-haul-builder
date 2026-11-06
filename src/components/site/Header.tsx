import { BUSINESS } from "@/config/business";
import { SaveContactButton } from "./SaveContactButton";
import { Logo } from "./Logo";

const scrollTo = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
};

const NAV = [
  { id: "services", label: "Services" },
  { id: "our-work", label: "Our Work" },
  { id: "moving", label: "Moving" },
  { id: "about", label: "About" },
];

// White header on purpose: it reproduces the shirt/truck branding (green script on white)
// and gives a crisp break from the dark, photo-heavy hero.
export const Header = () => (
  <header className="fixed top-0 left-0 right-0 z-[100] bg-white/95 backdrop-blur border-b border-black/10 shadow-[0_2px_20px_-8px_rgba(0,0,0,0.35)]">
    <div className="max-w-7xl mx-auto flex items-center justify-between px-5 md:px-8 py-2">
      <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="Back to top">
        <Logo size="sm" />
      </button>

      <nav className="hidden lg:flex items-center gap-7" aria-label="Main">
        {NAV.map((n) => (
          <button
            key={n.id}
            onClick={() => scrollTo(n.id)}
            className="font-condensed uppercase text-[#1a1a1a] hover:text-forest transition-colors"
            style={{ fontSize: 13, letterSpacing: 2, fontWeight: 700 }}
          >
            {n.label}
          </button>
        ))}
      </nav>

      <div className="flex items-center gap-2">
        <a
          href={`tel:${BUSINESS.phoneTel}`}
          className="hidden md:inline-flex flex-col items-end leading-none mr-2 text-[#0a0a0a] hover:text-forest"
        >
          <span className="font-condensed uppercase text-[#666]" style={{ fontSize: 10, letterSpacing: 2 }}>
            Call or text
          </span>
          <span className="font-display" style={{ fontSize: 22, letterSpacing: 1, color: "inherit" }}>
            {BUSINESS.phone}
          </span>
        </a>
        <SaveContactButton variant="outline" label="Save Contact" className="hidden xl:inline-flex" />
        <button
          onClick={() => scrollTo("quote-form")}
          className="bg-forest hover:bg-[#0f3f24] text-white font-condensed font-bold uppercase px-5 py-3 rounded-md transition-colors"
          style={{ fontSize: 13, letterSpacing: 1.5 }}
          aria-label="Get a free quote"
        >
          Free Quote
        </button>
      </div>
    </div>
  </header>
);
