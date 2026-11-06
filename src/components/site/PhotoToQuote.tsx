import { BUSINESS } from "@/config/business";

const SMS_BODY = encodeURIComponent(
  "Hi DiAntonio's — here's a photo of the job. My ZIP is ___ and I need ___.",
);
const SMS_HREF = `sms:${BUSINESS.phoneTel}?&body=${SMS_BODY}`;
const QR_SRC = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=0&data=${encodeURIComponent(SMS_HREF)}`;

export const PhotoToQuote = () => (
  <section id="photo-quote" className="bg-ink px-6 md:px-10 py-20 scroll-mt-20">
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
            href={SMS_HREF}
            className="font-display text-white bg-fire hover:bg-ember block mt-3 py-4 px-4 underline-offset-4 transition-colors"
            style={{ fontSize: 40, lineHeight: 1.1 }}
          >
            📱 TAP TO TEXT<br />
            <span style={{ fontSize: 32 }}>{BUSINESS.phone}</span>
          </a>
          <p className="text-fog mt-2" style={{ fontSize: 13, lineHeight: 1.7 }}>
            Include your ZIP code and what service you need. We'll respond with a ballpark price within 15 minutes during business hours.
          </p>
          <p className="text-chalk mt-4" style={{ fontSize: 14, fontWeight: 600 }}>
            It really is that easy.
          </p>

          {/* QR code — handy on desktop, hidden on phones where Tap to Text already works */}
          <div className="hidden md:flex items-center gap-4 mt-6 pt-6 border-t border-steel text-left">
            <div className="bg-white p-2 rounded-md shrink-0" aria-hidden>
              <img
                src={QR_SRC}
                alt="QR code to text DiAntonio's from your phone"
                width={110}
                height={110}
                loading="lazy"
                style={{ display: "block", width: 110, height: 110 }}
              />
            </div>
            <div>
              <div className="font-condensed text-fire uppercase" style={{ fontSize: 11, letterSpacing: 3 }}>
                ON A COMPUTER?
              </div>
              <p className="text-chalk mt-1" style={{ fontSize: 13, lineHeight: 1.5 }}>
                Scan with your phone's camera to open a pre-filled text — just add your photo and hit send.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);