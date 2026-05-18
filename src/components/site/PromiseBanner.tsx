export const PromiseBanner = () => (
  <section className="bg-fire px-10 py-[18px]">
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <span style={{ fontSize: 28 }}>⚡</span>
        <h2 className="font-display text-white" style={{ fontSize: 28, letterSpacing: 1 }}>
          FAST RESPONSE · SAME-DAY SERVICE
        </h2>
      </div>
      <p className="text-white max-w-[400px]" style={{ fontSize: 14, opacity: 0.9 }}>
        Submit a quote request during business hours and we'll get back to you quickly — often the same day.
      </p>
      <div className="text-white" style={{ fontSize: 11, opacity: 0.7 }}>
        <div>Mon–Sat · 7AM–6PM</div>
        <div>Sun: by appointment</div>
      </div>
    </div>
  </section>
);