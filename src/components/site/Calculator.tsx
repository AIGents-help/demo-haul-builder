import { useState } from "react";
import { BUSINESS } from "@/config/business";

type Service = "demolition" | "junk" | "hauling" | "";

const priceRange = (service: Service, sqft: number, size: string) => {
  if (service === "demolition") {
    if (sqft <= 500) return { low: 300, high: 800 };
    if (sqft <= 1000) return { low: 700, high: 1800 };
    if (sqft <= 2000) return { low: 1500, high: 4000 };
    return { low: 3500, high: 8000 };
  }
  if (service === "junk") {
    const map: Record<string, { low: number; high: number }> = {
      small: { low: 75, high: 175 },
      medium: { low: 175, high: 350 },
      full: { low: 350, high: 600 },
      estate: { low: 500, high: 1200 },
    };
    return map[size] ?? { low: 75, high: 600 };
  }
  if (service === "hauling") {
    const map: Record<string, { low: number; high: number }> = {
      single: { low: 75, high: 200 },
      small: { low: 150, high: 350 },
      large: { low: 300, high: 800 },
    };
    return map[size] ?? { low: 75, high: 800 };
  }
  return { low: 0, high: 0 };
};

const SelectCard = ({
  selected,
  onClick,
  icon,
  title,
  sub,
}: {
  selected: boolean;
  onClick: () => void;
  icon: string;
  title: string;
  sub: string;
}) => (
  <button
    onClick={onClick}
    className="text-left p-5 bg-ink transition-all w-full"
    style={{
      border: `2px solid ${selected ? "hsl(var(--fire))" : "hsl(var(--steel))"}`,
      backgroundColor: selected ? "rgba(232,93,10,0.06)" : undefined,
    }}
  >
    <div style={{ fontSize: 24 }}>{icon}</div>
    <div className="font-display text-chalk mt-1" style={{ fontSize: 22 }}>{title}</div>
    <div className="text-fog" style={{ fontSize: 13 }}>{sub}</div>
  </button>
);

const Label = ({ children }: { children: React.ReactNode }) => (
  <div className="font-condensed text-fire mb-2 uppercase" style={{ fontSize: 11, letterSpacing: 3 }}>
    {children}
  </div>
);

const PrimaryBtn = ({ children, onClick, disabled }: any) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="w-full bg-fire hover:bg-ember text-white font-display py-4 mt-5 disabled:opacity-50"
    style={{ fontSize: 20 }}
  >
    {children}
  </button>
);

export const Calculator = () => {
  const [step, setStep] = useState(1);
  const [service, setService] = useState<Service>("");
  const [size, setSize] = useState("");
  const [sqft, setSqft] = useState(500);
  const [zip, setZip] = useState("");
  const [estimate, setEstimate] = useState<{ low: number; high: number } | null>(null);
  const [needsZip, setNeedsZip] = useState(false);

  const reset = () => {
    setStep(1); setService(""); setSize(""); setSqft(500); setZip(""); setEstimate(null); setNeedsZip(false);
  };

  const calculate = () => {
    setEstimate(priceRange(service, sqft, size));
    setStep(3);
  };

  return (
    <section id="quote-calculator" className="bg-iron px-6 md:px-10 py-20">
      <div className="max-w-3xl mx-auto">
        <div className="font-eyebrow mb-3">KNOW BEFORE YOU CALL</div>
        <h2 className="font-display text-chalk text-[40px] md:text-[52px] leading-none">
          GET AN INSTANT ESTIMATE.
        </h2>
        <p className="text-fog mt-3" style={{ fontSize: 15 }}>
          Not a binding quote — just an honest ballpark so you know what to expect.
        </p>

        <div className="max-w-2xl mt-10">
          {step >= 1 && (
            <div>
              <Label>WHAT DO YOU NEED?</Label>
              <div className="grid md:grid-cols-3 gap-2">
                <SelectCard selected={service === "demolition"} onClick={() => { setService("demolition"); setStep(2); setSize(""); setEstimate(null); }} icon="🏗️" title="DEMOLITION" sub="Interior demo, walls, structure" />
                <SelectCard selected={service === "junk"} onClick={() => { setService("junk"); setStep(2); setSize(""); setEstimate(null); }} icon="♻️" title="JUNK REMOVAL" sub="Cleanouts, furniture, debris" />
                <SelectCard selected={service === "hauling"} onClick={() => { setService("hauling"); setStep(2); setSize(""); setEstimate(null); }} icon="🚛" title="HAULING" sub="Moving, transport, materials" />
              </div>
            </div>
          )}

          {step >= 2 && service === "demolition" && (
            <div className="mt-8 animate-in fade-in duration-300">
              <Label>APPROXIMATE SQUARE FOOTAGE</Label>
              <div className="font-display text-fire text-center" style={{ fontSize: 48 }}>{sqft} sq ft</div>
              <input
                type="range" min={100} max={3000} step={50} value={sqft}
                onChange={(e) => setSqft(Number(e.target.value))}
                className="w-full accent-fire"
              />
              <div className="flex justify-between text-fog mt-1" style={{ fontSize: 11 }}>
                <span>Small Room</span><span>Full Floor</span><span>Whole Structure</span>
              </div>
              <PrimaryBtn onClick={calculate}>CALCULATE MY ESTIMATE →</PrimaryBtn>
            </div>
          )}

          {step >= 2 && service === "junk" && (
            <div className="mt-8 animate-in fade-in duration-300">
              <Label>HOW MUCH STUFF?</Label>
              <div className="grid gap-2">
                {[
                  { v: "small", icon: "🪣", t: "Small Load", s: "Fits in a pickup bed · 1–5 items" },
                  { v: "medium", icon: "📦", t: "Medium Load", s: "Half a truck · furniture, boxes" },
                  { v: "full", icon: "🚛", t: "Full Load", s: "Full truck · major cleanout" },
                  { v: "estate", icon: "🏠", t: "Whole Property", s: "Estate cleanout · multiple rooms" },
                ].map((o) => (
                  <SelectCard key={o.v} selected={size === o.v} onClick={() => { setSize(o.v); setNeedsZip(true); }} icon={o.icon} title={o.t} sub={o.s} />
                ))}
              </div>
              {needsZip && (
                <div className="mt-6">
                  <Label>YOUR ZIP CODE</Label>
                  <input
                    type="text" maxLength={5} value={zip} onChange={(e) => setZip(e.target.value)}
                    placeholder="Enter ZIP"
                    className="w-full bg-ink border border-steel text-chalk p-3.5 focus:outline-none focus:border-fire"
                  />
                  <PrimaryBtn onClick={calculate} disabled={!size}>GET MY ESTIMATE →</PrimaryBtn>
                </div>
              )}
            </div>
          )}

          {step >= 2 && service === "hauling" && (
            <div className="mt-8 animate-in fade-in duration-300">
              <Label>WHAT ARE YOU MOVING?</Label>
              <div className="grid gap-2">
                {[
                  { v: "single", icon: "📦", t: "Single Items", s: "Appliance, furniture, equipment" },
                  { v: "small", icon: "🚛", t: "Small Haul", s: "Several items, short distance" },
                  { v: "large", icon: "🏗️", t: "Large / Commercial", s: "Materials, equipment, bulk" },
                ].map((o) => (
                  <SelectCard key={o.v} selected={size === o.v} onClick={() => { setSize(o.v); setNeedsZip(true); }} icon={o.icon} title={o.t} sub={o.s} />
                ))}
              </div>
              {needsZip && (
                <div className="mt-6">
                  <Label>YOUR ZIP CODE</Label>
                  <input
                    type="text" maxLength={5} value={zip} onChange={(e) => setZip(e.target.value)}
                    placeholder="Enter ZIP"
                    className="w-full bg-ink border border-steel text-chalk p-3.5 focus:outline-none focus:border-fire"
                  />
                  <PrimaryBtn onClick={calculate} disabled={!size}>GET MY ESTIMATE →</PrimaryBtn>
                </div>
              )}
            </div>
          )}

          {step === 3 && estimate && (
            <div className="mt-8 bg-ink p-9 text-center border-2 border-fire animate-in fade-in duration-300">
              <div className="font-condensed text-fire" style={{ fontSize: 11, letterSpacing: 3 }}>
                YOUR INSTANT ESTIMATE
              </div>
              <div className="font-display text-chalk mt-2 text-[48px] md:text-[72px] leading-none">
                ${estimate.low.toLocaleString()} – ${estimate.high.toLocaleString()}
              </div>
              <p className="text-fog mt-3" style={{ fontSize: 14 }}>
                {service === "demolition"
                  ? `Based on ~${sqft} sq ft. Final price depends on materials, access, and disposal needs.`
                  : "Based on your job size. Final price confirmed during your free on-site quote."}
              </p>
              <div className="text-fog mt-4 space-y-1" style={{ fontSize: 13 }}>
                <div>✓ Free on-site quotes always available</div>
                <div>✓ Final price locked in before we start — no surprises</div>
              </div>
              <div className="flex flex-col md:flex-row gap-3 mt-6">
                <a href={`tel:${BUSINESS.phoneTel}`} className="flex-1 bg-fire hover:bg-ember text-white font-display py-3.5" style={{ fontSize: 18 }}>
                  📞 CALL NOW TO BOOK
                </a>
                <button
                  onClick={() => document.getElementById("quote-form")?.scrollIntoView({ behavior: "smooth" })}
                  className="flex-1 border-2 border-fire text-fire hover:bg-fire hover:text-white font-display py-3.5 transition-colors"
                  style={{ fontSize: 18 }}
                >
                  GET EXACT QUOTE →
                </button>
              </div>
              <button onClick={reset} className="mt-4" style={{ fontSize: 12, color: "#6a6058" }}>
                ← Start over
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};