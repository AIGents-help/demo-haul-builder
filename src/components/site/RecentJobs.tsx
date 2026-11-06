import { BUSINESS } from "@/config/business";
import commercialGut from "@/assets/real/hero-commercial-gut.webp";
import commercialFinished from "@/assets/real/commercial-finished.webp";
import bathStuds from "@/assets/real/bath-gut-studs.webp";
import cleanout1 from "@/assets/real/cleanout-before-1.webp";
import cleanout2 from "@/assets/real/cleanout-before-2.webp";
import bedroom from "@/assets/real/bedroom-demo-done.webp";
import tubAfter from "@/assets/real/tub-after.webp";
import truckFlorida from "@/assets/real/truck-branded-florida.webp";
import truckWisconsin from "@/assets/real/truck-sunset-wisconsin.webp";

// Real posts from @diantoniosdemoandhauling (used with the owner's permission).
// Photos are self-hosted so the gallery loads fast and doesn't depend on Instagram embeds.
const JOBS = [
  { img: commercialGut, post: "Dcyvr2iFF8r", caption: "2nd-floor commercial gut on Main Street", tag: "Demolition", span: "md:row-span-2" },
  { img: cleanout1, post: "DX5tmOZl2vh", caption: "1,800 sq ft house — completely gutted & cleaned out", tag: "Cleanout", span: "" },
  { img: truckFlorida, post: "DdaI2qcNLAs", caption: "PA → Florida move", tag: "Moving", span: "md:row-span-2" },
  { img: bathStuds, post: "De-tXQ7lzhN", caption: "Bathroom down to the studs, ready for a new look", tag: "Demolition", span: "md:row-span-2" },
  { img: bedroom, post: "DX7haG8lRde", caption: "Master bedroom demoed — carpets, stairs & drop ceiling out", tag: "Demolition", span: "" },
  { img: cleanout2, post: "DX5tmOZl2vh", caption: "Whole-house cleanout in progress", tag: "Cleanout", span: "" },
  { img: tubAfter, post: "DdFGLUUmo2x", caption: "Bathroom ready for renovation", tag: "Demolition", span: "" },
  { img: truckWisconsin, post: "DdO_W_WtUX3", caption: "PA → Wisconsin, delivered at sunrise", tag: "Moving", span: "" },
  { img: commercialFinished, post: "Dcyvr2iFF8r", caption: "Commercial floor cleared and swept", tag: "Demolition", span: "" },
];

type Props = { locationLabel?: string };

export const RecentJobs = ({ locationLabel }: Props) => (
  <section id="our-work" className="bg-[#f4f2ee] text-[#0a0a0a] px-6 md:px-10 py-24 scroll-mt-16">
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <div className="font-condensed uppercase text-forest" style={{ fontSize: 12, letterSpacing: 4, fontWeight: 700 }}>
            Real work · Real results
          </div>
          <h2 className="font-display mt-3 text-[44px] md:text-[64px]" style={{ lineHeight: 0.95, color: "#0a0a0a" }}>
            {locationLabel ? `RECENT JOBS IN ${locationLabel.toUpperCase()}` : "STRAIGHT FROM THE JOB SITE."}
          </h2>
        </div>
        <a
          href={`https://www.instagram.com/${BUSINESS.instagram}`}
          target="_blank"
          rel="noopener noreferrer"
          className="ig-cta self-start md:self-auto inline-flex items-center gap-2 px-6 py-3.5 rounded-full font-condensed uppercase text-white bg-[#0a0a0a] transition-all"
          style={{ fontSize: 13, letterSpacing: 2, fontWeight: 700 }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
          </svg>
          Follow @{BUSINESS.instagram}
        </a>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[180px] md:auto-rows-[220px] gap-3 md:gap-4 mt-12">
        {JOBS.map((j, i) => (
          <a
            key={i}
            href={`https://www.instagram.com/p/${j.post}/`}
            target="_blank"
            rel="noopener noreferrer"
            className={`group relative overflow-hidden rounded-xl bg-[#ddd] ${j.span} ${i === 0 ? "col-span-2 md:col-span-1" : ""}`}
          >
            <img
              src={j.img}
              alt={j.caption}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />
            <span
              className="absolute top-3 left-3 bg-white/95 text-[#0a0a0a] font-condensed uppercase rounded-full px-2.5 py-0.5"
              style={{ fontSize: 10, letterSpacing: 1.5, fontWeight: 700 }}
            >
              {j.tag}
            </span>
            <p className="absolute bottom-0 inset-x-0 p-3 md:p-4 text-white" style={{ fontSize: 13.5, fontWeight: 500, lineHeight: 1.35 }}>
              {j.caption}
            </p>
          </a>
        ))}
      </div>

      <div className="mt-14 rounded-2xl bg-[#0a0a0a] text-white p-8 md:p-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <h3 className="font-display" style={{ fontSize: 34, lineHeight: 1, letterSpacing: 1 }}>
            SEE SOMETHING LIKE YOUR PROJECT?
          </h3>
          <p className="mt-2 text-[#bdbdbd]" style={{ fontSize: 15 }}>
            Text a photo of the job and get a ballpark price — usually within 15 minutes.
          </p>
        </div>
        <a
          href={`sms:${BUSINESS.phoneTel}`}
          className="bg-fire hover:bg-ember text-white font-display rounded-lg px-7 py-4 text-center transition-colors whitespace-nowrap"
          style={{ fontSize: 22, letterSpacing: 1 }}
        >
          TEXT {BUSINESS.phone}
        </a>
      </div>
      <style>{`
        .ig-cta:hover {
          background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%) !important;
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  </section>
);
