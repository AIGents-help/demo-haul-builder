import { BUSINESS } from "@/config/business";

const scrollTo = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
};

export const Header = () => (
  <header className="fixed top-0 left-0 right-0 z-[100] bg-ink border-b border-steel">
    <div className="flex items-center justify-between px-6 py-3">
      <div className="leading-none">
        <div className="font-display text-[22px] text-chalk" style={{ letterSpacing: "2px" }}>
          DiAntonio's
        </div>
        <div className="font-condensed text-fire" style={{ fontSize: 10, letterSpacing: 3 }}>
          DEMO &amp; HAULING LLC
        </div>
      </div>
      <button
        onClick={() => scrollTo("quote-form")}
        className="bg-fire hover:bg-ember text-white font-condensed font-bold uppercase px-5 py-2.5 transition-colors"
        style={{ fontSize: 13, letterSpacing: 1 }}
        aria-label="Get a free quote"
      >
        📞 FREE QUOTE
      </button>
    </div>
  </header>
);