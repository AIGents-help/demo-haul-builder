import { BUSINESS } from "@/config/business";
import sarahImg from "@/assets/review-sarah.jpg";
import jamesImg from "@/assets/review-james.jpg";
import mikeImg from "@/assets/review-mike.jpg";

const REVIEWS = [
  { name: "Sarah M.", img: sarahImg, text: "DiAntonio's was at my house within hours of calling. They removed everything quickly, professionally, and left the space spotless. I'll be calling them for every project going forward." },
  { name: "James R.", img: jamesImg, text: "Great experience start to finish. Fair quote, showed up on time, and got the job done faster than I expected. Highly recommend for anyone needing demo or hauling work." },
  { name: "Mike T.", img: mikeImg, text: "These guys are the real deal. Licensed, insured, and they actually clean up after themselves. Used them for a full basement cleanout — couldn't be happier." },
];

export const Reviews = () => (
  <section id="reviews" className="bg-ink px-6 md:px-10 py-20">
    <div className="max-w-6xl mx-auto">
      <div className="font-eyebrow mb-3">WHAT CUSTOMERS SAY</div>
      <h2 className="font-display text-chalk text-[40px] md:text-[52px] leading-none">REAL REVIEWS. REAL RESULTS.</h2>

      <div className="grid md:grid-cols-3 gap-0.5 mt-10">
        {REVIEWS.map((r) => (
          <div key={r.name} className="bg-iron p-7 transition-all"
               style={{ borderTop: "3px solid hsl(var(--steel))" }}
               onMouseEnter={(e) => (e.currentTarget.style.borderTopColor = "hsl(var(--fire))")}
               onMouseLeave={(e) => (e.currentTarget.style.borderTopColor = "hsl(var(--steel))")}>
            <div className="text-gold" style={{ fontSize: 16 }}>⭐⭐⭐⭐⭐</div>
            <p className="text-fog mt-4 italic" style={{ fontSize: 14, lineHeight: 1.8 }}>"{r.text}"</p>
            <div className="flex items-center gap-3 mt-5">
              <img src={r.img} alt={r.name} loading="lazy" width={512} height={512} className="w-11 h-11 object-cover rounded-full" />
              <div>
                <div className="text-chalk" style={{ fontWeight: 600, fontSize: 14 }}>{r.name}</div>
                <div style={{ fontSize: 12, color: "#6a6058" }}>— Google Review</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-8">
        <a
          href={BUSINESS.googleReviewsUrl}
          className="inline-block border-2 border-fire text-fire hover:bg-fire hover:text-white font-display px-6 py-3 transition-colors"
          style={{ fontSize: 16 }}
        >
          SEE ALL REVIEWS ON GOOGLE →
        </a>
      </div>
    </div>
  </section>
);