import { BUSINESS } from "@/config/business";

export const PhotoToQuote = () => (
  <section className="bg-ink px-6 md:px-10 py-20">
    <div className="max-w-6xl mx-auto">
      <div className="font-eyebrow mb-3">THE EASIEST QUOTE IN THE BUSINESS</div>
      <h2 className="font-display text-chalk text-[40px] md:text-[52px] leading-none">
        SEND US A PHOTO. GET A PRICE.
      </h2>

      <div className="grid md:grid-cols-2 gap-12 mt-10">
        <div>
          <p className="text-fog" style={{ fontSize: 15, lineHeight: 1.8 }}>
            Don't know how to describe the job? You don't have to. Just take a photo of whatever needs to go or come down, text it to us, and we'll send you a price — usually within minutes.
          </p>
          <ul className="mt-6 space-y-2.5">
            {[
              "No phone calls required",
              "No explaining a pile of junk with words",
              "No waiting days for someone to call back",
            ].map((item) => (
              <li key={item} className="text-chalk" style={{ fontSize: 15 }}>
                <span className="text-fire mr-2">→</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-iron p-9 text-center" style={{ borderTop: "3px solid hsl(var(--fire))" }}>
          <div style={{ fontSize: 52 }}>📸</div>
          <div className="font-condensed mt-4 text-fire" style={{ fontSize: 12, letterSpacing: 3 }}>
            TEXT YOUR PHOTO TO:
          </div>
          <a
            href={`sms:${BUSINESS.phoneTel}`}
            className="font-display text-fire block mt-2"
            style={{ fontSize: 52 }}
          >
            {BUSINESS.phone}
          </a>
          <p className="text-fog mt-2" style={{ fontSize: 13, lineHeight: 1.7 }}>
            Include your ZIP code and what service you need. We'll respond with a ballpark price within 15 minutes during business hours.
          </p>
          <p className="text-chalk mt-4" style={{ fontSize: 14, fontWeight: 600 }}>
            It really is that easy.
          </p>
        </div>
      </div>
    </div>
  </section>
);