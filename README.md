# DiAntonio's Demo & Hauling — diantoniosdemo.com

Website, lead capture, and owner dashboard for DiAntonio's Demo & Hauling LLC. Built and managed by AIGents LLC.

## Stack
- **Frontend:** Vite + React + TypeScript + Tailwind + shadcn/ui
- **Backend:** Supabase project `losvrrrhhwgfcmfgfyze` in the AIGents.Help org (database, auth, edge functions)
- **Email:** Resend (domain `diantoniosdemo.com`) — `notify-new-lead` emails Corey on every new quote request
- **AI:** OpenAI — `scan-lead` turns a photo of a note/business card into a lead
- **Hosting:** Vercel — every push to `main` deploys to production
- **Domain/DNS:** Namecheap (`@` A → 76.76.21.21, `www` CNAME → cname.vercel-dns.com)

## Workflow
All changes go through this GitHub repo → Vercel. Do not publish from any other builder; it will split the site.

```sh
npm install
npm run dev      # local dev on :8080
npm run build    # production build
```

## Content
- Job photos: `src/assets/real/` (real posts from @diantoniosdemoandhauling, EXIF stripped)
- Business info (phone, socials, hours): `src/config/business.ts`
- Reviews: `src/components/site/Reviews.tsx` — real Google reviews only
