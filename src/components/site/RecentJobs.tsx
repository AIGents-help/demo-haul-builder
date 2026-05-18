import { useEffect, useRef, useState } from "react";
import { BUSINESS } from "@/config/business";

// Replace PLACEHOLDERx with real Instagram shortcodes when ready.
const POSTS = [
  "PLACEHOLDER1",
  "PLACEHOLDER2",
  "PLACEHOLDER3",
  "PLACEHOLDER4",
  "PLACEHOLDER5",
  "PLACEHOLDER6",
];

type Props = { locationLabel?: string };

export const RecentJobs = ({ locationLabel = "the Lehigh Valley" }: Props) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!ref.current || inView) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px" },
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, [inView]);

  return (
    <section
      ref={ref}
      aria-label={`Recent jobs in ${locationLabel}`}
      className="px-6 md:px-10 py-20"
      style={{ backgroundColor: "#FAFAFA", color: "#1a1a1a" }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div
            className="font-condensed uppercase"
            style={{ fontSize: 11, letterSpacing: 4, color: "hsl(var(--fire))", fontWeight: 600 }}
          >
            REAL WORK, REAL RESULTS
          </div>
          <h2
            className="font-display mt-3"
            style={{ fontSize: 44, letterSpacing: 2, color: "#0a0a0a", lineHeight: 1 }}
          >
            RECENT JOBS ACROSS {locationLabel.toUpperCase()}
          </h2>
          <p
            className="mt-4 mx-auto"
            style={{ fontSize: 16, color: "#4a4a4a", maxWidth: 620, lineHeight: 1.6 }}
          >
            Every photo is a real DiAntonio's job. No stock photos, no stage props — just the work.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {POSTS.map((code, i) => (
            <a
              key={code + i}
              href={`https://www.instagram.com/p/${code}/`}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block rounded-xl overflow-hidden bg-white border transition-all duration-300 hover:-translate-y-1"
              style={{
                borderColor: "#e8e8e8",
                boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 18px 40px -12px rgba(0,0,0,0.25)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 1px 2px rgba(0,0,0,0.04)";
              }}
              aria-label={`View Instagram post ${i + 1} by @${BUSINESS.instagram}`}
            >
              <div className="relative w-full" style={{ aspectRatio: "1 / 1", backgroundColor: "#f0f0f0" }}>
                {inView ? (
                  <iframe
                    src={`https://www.instagram.com/p/${code}/embed/captioned`}
                    title={`Instagram post ${i + 1}`}
                    loading="lazy"
                    allow="encrypted-media"
                    scrolling="no"
                    className="absolute inset-0 w-full h-full pointer-events-none transition-transform duration-500 group-hover:scale-[1.03]"
                    style={{ border: 0 }}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center" style={{ color: "#bbb", fontSize: 12 }}>
                    Loading…
                  </div>
                )}
                {/* Click overlay so the whole tile is the link target */}
                <div className="absolute inset-0" aria-hidden />
              </div>
            </a>
          ))}
        </div>

        <div className="mt-12 text-center">
          <a
            href={`https://www.instagram.com/${BUSINESS.instagram}`}
            target="_blank"
            rel="noopener noreferrer"
            className="ig-cta inline-flex items-center gap-2 px-7 py-4 rounded-full font-condensed uppercase transition-all duration-300"
            style={{
              fontSize: 13,
              letterSpacing: 2,
              fontWeight: 700,
              color: "#fff",
              backgroundColor: "#1a1a1a",
            }}
          >
            <span aria-hidden>📸</span> Follow @{BUSINESS.instagram}
          </a>
          <style>{`
            .ig-cta:hover {
              background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%) !important;
              transform: translateY(-2px);
              box-shadow: 0 12px 28px -10px rgba(220,39,67,0.55);
            }
          `}</style>
        </div>
      </div>
    </section>
  );
};