## Goal

Turn `/dashboard` into a real field-ready business suite for DiAntonio's: usable on a phone in the truck and on a laptop in the office. New visual system (black / grey / green / white), responsive shell (bottom nav on mobile, sidebar on desktop), and 8 functional modules.

This is too large for a single pass. Below is the build broken into 4 phases. Each phase is shippable on its own. After you approve the plan I'll start with Phase 1 and check in before moving on.

## Design system

New palette (HSL tokens in `index.css` + `tailwind.config.ts`):

- `--ink` near-black background
- `--surface` charcoal card
- `--line` grey hairline
- `--fg` white text
- `--muted` grey-400 text
- `--accent` green primary (success / CTA / brand)
- `--danger` red, `--warn` amber for status only

Type: keep Anton/display for numbers + headers, Inter/Barlow for UI. Tighter, denser, less "industrial poster" — closer to Linear / Notion / Jobber. Big tap targets (44px min) for field use.

Replace the current `fire/iron/steel/fog/chalk` tokens with the new ones via the same names where possible so existing components keep compiling, then sweep components.

## Responsive shell

```text
Mobile (<768px)               Desktop (≥768px)
┌──────────────────┐          ┌────┬───────────────────────┐
│ greeting · alert │          │    │  topbar · search · me │
│                  │          │ S  ├───────────────────────┤
│   module view    │          │ I  │                       │
│                  │          │ D  │   module view         │
│                  │          │ E  │                       │
├──────────────────┤          │    │                       │
│ ⌂ 📋 📅 💵 ⚙    │          └────┴───────────────────────┘
└──────────────────┘
```

- Same React components, two layouts via `useIsMobile`.
- Desktop uses the shadcn `Sidebar` pattern (collapsible icon rail).
- Mobile keeps a bottom tab bar.

## Modules (phased)

### Phase 1 — Foundation + redesign (ship first)
1. New design tokens + responsive shell (sidebar/topbar on desktop, bottom nav on mobile).
2. Redesign existing **Home / Leads / Jobs / Customers / Settings** with the new system. Same data, better UI: cleaner cards, swipe-friendly rows, sticky filter bar, empty states, skeletons, command-K search on desktop.
3. **Photo capture per job**: upload to existing `job-photos` bucket, attach before/after, gallery viewer. (DB already supports this.)

### Phase 2 — Schedule + Quotes/Invoices
4. **Calendar / Schedule**: month + day view of `jobs.job_date`, drag to reschedule on desktop, tap-and-pick on mobile, "today's route" list with map links.
5. **Quotes**: build a quote in the field (line items, taxes, totals), send to customer by SMS/email link, convert to job on accept.
6. **Invoices**: from a completed job, generate invoice, mark paid, record payment method. PDF download.

New tables: `quotes`, `quote_line_items`, `invoices`, `invoice_line_items`, `payments`.

### Phase 3 — Payments + Crew/Time
7. **Payments**: enable Lovable's built-in Stripe payments so invoice links collect card payments; webhook auto-marks invoice paid. (Will run `recommend_payment_provider` first.)
8. **Crew & Time tracking**: `crew_members`, `time_entries` (clock in/out per job, GPS optional), assign crew to jobs, daily hours report.

### Phase 4 — Expenses + Reports
9. **Expenses / Job P&L**: `expenses` table (fuel, dump fees, materials) tied to a job; per-job profit, per-week profit.
10. **Reports**: revenue by week/month, conversion rate (leads → booked → paid), top services, average ticket, AR aging.

## Technical notes

- All new tables get RLS with `has_role(auth.uid(), 'admin')` for write, owner-only read where appropriate.
- Re-enable auth on `/dashboard` once Phase 1 ships — currently public per earlier request. Confirm before re-enabling.
- File splits: each module lives under `src/components/dashboard/<module>/`. Shell lives in `src/components/dashboard/shell/`.
- Add `framer-motion` for tab transitions and sheet animations (already common in the project).
- Keep `Toaster` + `sonner` for notifications.
- Use shadcn `Sidebar`, `Dialog`, `Sheet`, `Tabs`, `Table`, `Calendar`, `Command`, `DropdownMenu`.

## What I'll do now if you approve

Start **Phase 1 only**:
- New tokens + responsive shell
- Redesigned Home / Leads / Jobs / Customers / Settings
- Photo capture on jobs

Then stop and show you before moving to Phase 2. Phases 2–4 each need their own migration + UI pass and I'd rather get the foundation right than ship a half-baked everything.

**Confirm to proceed with Phase 1, or tell me which phase to prioritize differently.**