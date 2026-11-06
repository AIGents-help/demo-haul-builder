import { BUSINESS } from "@/config/business";

// Paste REAL Google reviews here (copied word-for-word, first name + last initial).
// The section only shows quotes when this list has entries — no placeholder or invented reviews,
// which would violate the FTC rule on fake reviews and Google's policies.
type Review = { name: string; text: string; job?: string };
const REVIEWS: Review[] = [];

export const Reviews = () => (
  <section id="reviews" className="bg-ink px-6 md:px-10 py-24">
    <div className="max-w-6xl mx-auto">
      <div className="font-eyebrow mb-3">WHAT CUSTOMERS SAY</div>
      <h2 className="font-display text-chalk text-[44px] md:text-[64px] leading-[0.95]">
        DON'T TAKE OUR WORD FOR IT.
      </h2>

      {REVIEWS.length > 0 && (
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          {REVIEWS.map((r) => (
            <figure key={r.name} className="bg-iron rounded-2xl p-7 ring-1 ring-white/5">
              <div className="text-gold" style={{ fontSize: 16 }} aria-label="5 stars">★★★★★</div>
              <blockquote className="text-chalk/90 mt-4" style={{ fontSize: 15, lineHeight: 1.75 }}>"{r.text}"</blockquote>
              <figcaption className="mt-5">
                <div className="text-chalk" style={{ fontWeight: 600, fontSize: 14 }}>{r.name}</div>
                <div className="text-fog" style={{ fontSize: 12 }}>{r.job ? `${r.job} · ` : ""}Google review</div>
              </figcaption>
            </figure>
          ))}
        </div>
      )}

      <div className="mt-12 grid md:grid-cols-[1fr_auto] gap-6 items-center bg-iron rounded-2xl p-8 ring-1 ring-white/5">
        <div>
          <div className="text-gold" style={{ fontSize: 22 }} aria-hidden>★★★★★</div>
          <p className="text-chalk mt-2" style={{ fontSize: 17, fontWeight: 500 }}>
            Read what real customers say — or leave a review for your job.
          </p>
        </div>
        <a
          href={BUSINESS.googleReviewsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-fire hover:bg-ember text-white font-display rounded-lg px-7 py-4 text-center transition-colors"
          style={{ fontSize: 20, letterSpacing: 1 }}
        >
          GOOGLE REVIEWS →
        </a>
      </div>
    </div>
  </section>
);
