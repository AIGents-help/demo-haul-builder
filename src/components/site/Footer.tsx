import { BUSINESS } from "@/config/business";

export const Footer = () => (
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
      </div>
    </div>

    <div className="text-center mt-10 pt-6 border-t border-steel" style={{ fontSize: 12, color: "#6a6058" }}>
      © 2025 DiAntonio's Demo &amp; Hauling LLC · All Rights Reserved · Licensed &amp; Insured
    </div>
  </footer>
);