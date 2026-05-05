# DiAntonio's Demo & Hauling — Full Site Build

A mobile-first, conversion-focused single-page site for a demolition/hauling contractor, with a live availability system, instant quote calculator, photo-to-quote flow, quote form wired to Supabase, and a phone-friendly admin page.

## What gets built

**Single-page site (`/`)** with these sections, in order:
1. Sticky header — logo + "Free Quote" CTA
2. Hero — "We Haul. We Demo. We Handle It." + pulsing call button + trust pills + live availability card
3. 15-Minute Response Guarantee banner (orange band)
4. Photo-to-Quote — text-a-photo flow with tap-to-text number
5. Services — Demolition / Junk Removal / Hauling & Moving (3 cards)
6. Instant Quote Calculator — 3 steps (service → size/sqft → ZIP → price range result)
7. Why Choose Us — 4 trust blocks (licensed, fast, fair pricing, cleanup)
8. Before & After — 3 placeholder image cards with captions
9. Reviews — 3 Google review cards
10. Quote Form — saves to Supabase + calls notification function
11. Service Area — city/county pills + call CTA
12. Footer — brand, quick links, contact

**Plus:**
- Sticky mobile bottom bar showing live availability + "Book Now"
- `/admin` route — password-gated page to update availability status (open / filling / full) and custom message from a phone

## Backend (Lovable Cloud / Supabase)

Two tables:
- `availability` — single-row pattern: `status` (open/filling/full), `message`, `updated_at`. Read publicly on every page load (hero card + sticky mobile bar). Updated from `/admin`.
- `quote_requests` — `name`, `phone`, `service`, `zip`, `message`, `source`, `created_at`. Inserted from the quote form.

RLS:
- `availability` — public read; writes restricted (admin uses service-side or a simple password gate; for v1, write policy will allow anon updates since access is gated by the admin password — noted as a known limitation to revisit if a real admin login is added later).
- `quote_requests` — public insert only; no public read.

Edge function `send-quote-notification` — stub that accepts the form payload and returns 200. Real email/SMS sending (Resend or Twilio) is wired in a later step once API keys are provided. The form gracefully ignores failures so submissions are never lost.

## Design system

Locked to the spec exactly:
- Colors: ink `#0D0D0D`, iron `#1C1C1C`, steel `#2A2A2A`, fire `#E85D0A`, ember `#F07230`, gold `#D4A017`, chalk `#F0ECE4`, fog `#A09890`, plus green/red for availability states
- Fonts (Google Fonts): Bebas Neue (headings), Barlow + Barlow Condensed (body/labels)
- All values mapped into the Tailwind config + index.css design tokens (no hard-coded hex in components)
- No border-radius, no white backgrounds, diagonal texture on hero only
- Pulse animations on the primary call CTA and availability dot

## Placeholders left in code

The following strings will appear as literal placeholders for you to find-and-replace after the build (the spec lists them):
`[PHONE NUMBER]`, `[EMAIL ADDRESS]`, `[CITY, STATE]`, `[CITY]`, `[COUNTY]`, `[Neighboring City]`.

I'll centralize these in a single `src/config/business.ts` file so you can update them in one place instead of hunting through components.

## Technical notes

- Stack: existing React + Vite + Tailwind + shadcn setup
- Supabase client: created at `src/lib/supabase.ts` using Lovable Cloud (the publishable key in the prompt is replaced with the auto-injected Lovable Cloud env vars — same effect, no manual key paste needed)
- Admin password: stored as `VITE_ADMIN_PASSWORD` env var, default `demo2025`
- Calculator: pure client-side pricing logic per the ranges in the spec
- Routing: `/` for the site, `/admin` for the updater, existing 404 kept
- Smooth scroll between sections via anchor IDs (`#quote-form`, `#services`, etc.)
- Mobile sticky bar adds bottom padding to the last section so nothing is hidden

## Out of scope for this build (can be added next)

- Real Resend/Twilio integration for the 15-minute notification (needs API key)
- Real before/after photos (placeholders shown until images are provided)
- Real Google Reviews link
