import { BUSINESS } from "@/config/business";
import { SaveContactButton } from "./SaveContactButton";

export const Footer = () => (
  <>
  <section aria-label="Licensed and insured" className="bg-ink px-6 md:px-10 py-10 border-t border-steel">
    <div className="max-w-6xl mx-auto">
      <div className="bg-iron border border-steel rounded-xl p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-start gap-4">
            <div
              className="shrink-0 flex items-center justify-center rounded-full bg-fire/10 border border-fire"
              style={{ width: 52, height: 52 }}
              aria-hidden
            >
              <span style={{ fontSize: 26 }}>🛡️</span>
            </div>
            <div>
              <div className="font-eyebrow" style={{ color: "hsl(var(--fire))" }}>TRUST &amp; COMPLIANCE</div>
              <h2 className="font-display text-chalk mt-1" style={{ fontSize: 28, letterSpacing: 2, lineHeight: 1 }}>
                FULLY LICENSED &amp; INSURED
              </h2>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3 md:gap-4 md:max-w-xl w-full">
            <div className="bg-ink border border-steel rounded-lg px-4 py-3">
              <div className="font-condensed uppercase text-fire" style={{ fontSize: 10, letterSpacing: 2 }}>
                General Liability
              </div>
              <div className="text-chalk mt-1" style={{ fontSize: 13, fontWeight: 500, lineHeight: 1.35 }}>
                Berkshire Hathaway Direct Insurance
              </div>
              <div className="text-fog" style={{ fontSize: 11 }}>Rated A++ (AM Best)</div>
            </div>
            <div className="bg-ink border border-steel rounded-lg px-4 py-3">
              <div className="font-condensed uppercase text-fire" style={{ fontSize: 10, letterSpacing: 2 }}>
                PA Contractor License
              </div>
              <div className="text-chalk mt-1" style={{ fontSize: 13, fontWeight: 500, lineHeight: 1.35 }}>
                PA HIC #{BUSINESS.paLicense ?? "—"}
              </div>
              <div className="text-fog" style={{ fontSize: 11 }}>Registered Home Improvement Contractor</div>
            </div>
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-steel text-fog" style={{ fontSize: 12 }}>
          Certificate of insurance available on request.
        </div>
      </div>
    </div>
  </section>

  <footer className="bg-iron px-6 md:px-10 pt-16 pb-10" style={{ borderTop: "3px solid hsl(var(--fire))" }}>
    <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12">
      <div>
        <div className="font-display text-chalk" style={{ fontSize: 32, letterSpacing: 2 }}>DiAntonio's</div>
        <div className="font-condensed text-fire mt-0.5 uppercase" style={{ fontSize: 11, letterSpacing: 3 }}>
          DEMO &amp; HAULING LLC
        </div>
        <div className="mt-2" style={{ fontSize: 13, color: "#6a6058" }}>
          Licensed &amp; Insured · {BUSINESS.cityState}
        </div>
        <a href={`https://instagram.com/${BUSINESS.instagram}`} className="text-fire hover:text-ember block mt-2" style={{ fontSize: 13 }}>
          @{BUSINESS.instagram}
        </a>
      </div>

      <div>
        <div className="font-condensed text-fire uppercase mb-4" style={{ fontSize: 11, letterSpacing: 3 }}>QUICK LINKS</div>
        {[
          { l: "Services", h: "#services" },
          { l: "Why Choose Us", h: "#why-us" },
          { l: "Before & After", h: "#before-after" },
          { l: "Reviews", h: "#reviews" },
          { l: "Get a Free Quote", h: "#quote-form" },
        ].map((x) => (
          <a key={x.l} href={x.h} className="block text-fog hover:text-chalk mb-2.5" style={{ fontSize: 14 }}>
            {x.l}
          </a>
        ))}
      </div>

      <div>
        <div className="font-condensed text-fire uppercase mb-4" style={{ fontSize: 11, letterSpacing: 3 }}>CONTACT US</div>
        <a href={`tel:${BUSINESS.phoneTel}`} className="block text-fog hover:text-fire mb-2.5" style={{ fontSize: 14 }}>📞 {BUSINESS.phone}</a>
        <a href={`mailto:${BUSINESS.email}`} className="block text-fog hover:text-fire mb-2.5" style={{ fontSize: 14 }}>📧 {BUSINESS.email}</a>
        <div className="text-fog mb-2.5" style={{ fontSize: 14 }}>📍 {BUSINESS.cityState} &amp; Surrounding Areas</div>
        <div className="text-fog" style={{ fontSize: 14 }}>⏰ Mon–Sat 7AM–6PM · Sun by appt</div>
        <SaveContactButton variant="solid" label="📇 Save to Contacts" className="mt-4" />
      </div>
    </div>

    <div className="text-center mt-10 pt-6 border-t border-steel" style={{ fontSize: 12, color: "#6a6058" }}>
      © 2025 DiAntonio's Demo &amp; Hauling LLC · All Rights Reserved · Licensed &amp; Insured
    </div>
  </footer>
  </>
);