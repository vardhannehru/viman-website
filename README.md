# VIMAN — one app, Zero to Cockpit

A website built from the VIMAN pathway document: the DGCA route from first
enquiry to a Junior First Officer seat.

Design language: **[DESIGN.md](./DESIGN.md)**.

---

## Source fidelity

**The uploaded PDF is the single source of truth.** Every page, section and
string on this site comes from it. Nothing is invented.

This is enforced in one place: `src/lib/site.ts` holds all content and is
annotated with its provenance. If something is not in the source, it is not in
that file and it is not on the site.

**Deliberately absent** — none of these appear in the source, so none were
built: pricing, subscriptions, payments, dashboards, testimonials, blog, FAQ,
contact forms, notifications, achievements, analytics, programme pages, or a
separate sign-up screen.

**Known gaps in the source itself:**

- Roadmap content for the *Ground school*, *Flight school* and *Cpl* stages —
  only the *Thinking to become a pilot* roadmap is provided. The four stages are
  therefore rendered as **static, non-interactive items**.
- No Forgot Password screen (the link exists; its destination does not).
- No sign-up screen — the source puts **Log in** and **Create** on one screen,
  so the site does the same.
- No portal URLs. Portals are named; no links are fabricated.

## Getting started

```bash
npm install
```

```bash
npm run dev
```

Open <http://localhost:3000>.

> Don't run `npm run build` while `npm run dev` is running — they share `.next`
> and the production build overwrites the dev server's chunks. Stop the dev
> server first.

To view on a phone on the same Wi-Fi, allow the port through Windows Firewall
(Administrator PowerShell), then browse to your machine's LAN address on :3000:

```bash
New-NetFirewallRule -DisplayName "VIMAN dev 3000" -Direction Inbound -Protocol TCP -LocalPort 3000 -Action Allow -Profile Private
```

### Scripts

| Script | Purpose |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run typecheck` | `tsc --noEmit` |

## Routes

| Route | From |
|---|---|
| `/` | Brand · stages · roadmap · prerequisites · pathway · investment · comparison · portals |
| `/login` | The login screen |

## Stack

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · GSAP +
ScrollTrigger · Motion · React Three Fiber + Drei + postprocessing · Lenis ·
Radix Slot · React Hook Form + Zod · Lucide.

**No binary assets.** The aircraft, its livery, the clouds and the runway are
generated in code at runtime — no GLTF, no HDRI, no CDN fetch. The scene works
offline and the livery is a one-line change.

## Where things live

| I want to change… | Edit |
|---|---|
| Any copy | `src/lib/site.ts` |
| Colours, type scale, easings | `src/app/globals.css` (`@theme`) |
| Flight choreography | `AIRCRAFT_TRACK` / `CAMERA_TRACK` in `src/components/three/flight-scene.tsx` |
| Aircraft shape or livery | `src/components/three/aircraft.tsx`, `textures.ts` |
| Logo | `src/components/layout/logo.tsx`, `src/app/icon.svg` |

## Wiring it up

One integration point is stubbed and marked in the source:

- **Authentication** — `src/components/auth/login-form.tsx`. `Log in` and
  `Create` currently resolve locally. The source defines no password rules, no
  OAuth providers and no post-login screen, so none are implemented.

## Performance & accessibility

- WebGL is client-only and lazy-loaded; the document indexes without it.
- A capability probe selects a quality tier; the render loop suspends entirely
  when the 3D stage leaves the viewport.
- `prefers-reduced-motion` disables smooth scroll, the preloader, magnetic
  hovers and the animation loop.
- Skip link, semantic landmarks, visible focus rings, native cursor preserved.
- Verified: no element escapes the viewport at 375px.
