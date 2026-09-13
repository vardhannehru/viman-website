# VIMAN — frontend

The VIMAN website: the DGCA pilot pathway from the first enquiry to a Junior
First Officer seat. Design language: **[DESIGN.md](./DESIGN.md)**.

Every command below runs from this `frontend/` folder.

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

## Pages

| Route | What it is |
|---|---|
| `/` | Home: hero and 3D flight, "Which stage are you in?", pre-flight, the 8-step Checklist, prerequisites, timeline & approx. investment, cadet vs traditional |
| `/steps/<step>` | One guide page per checklist step, generated from `stepGuides` in `src/lib/site.ts` |
| `/privacy-policy`, `/terms-and-conditions`, `/cookie-policy`, `/disclaimer` | Legal pages |

## Where things live

| I want to change… | Edit |
|---|---|
| Any website text, including the step pages | `src/lib/site.ts` |
| Legal page text | `src/app/<page>/page.tsx` and `src/lib/legal.ts` |
| Colours, fonts, themes, CSS animations | `src/app/globals.css` |
| A home page section | `src/components/home/` |
| Boarding pass, "Did you complete this step?", turbulence animation | `src/components/steps/` |
| Navbar, footer, logo, loading screen | `src/components/layout/` |
| What the aeroplane does as you scroll | `src/lib/storyboard.ts` |
| The 3D aeroplane and airfield | `src/components/three/` |
| Saved checklist progress | `src/lib/progress.ts` |

## Content

Content comes from the VIMAN pathway document, from the official portals the
step pages link to (every link was opened before it was added), and from copy
written for VIMAN. Check any aviation fact against the DGCA before publishing.

## Stack

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · GSAP +
ScrollTrigger · Motion · React Three Fiber + Drei + postprocessing · Lenis ·
Radix Slot · Lucide.

The aeroplane is a real Airbus A320 model (`public/models/a320.glb`); the
airfield, clouds and sky are generated in code. `assets/A320.glb` is an
identical source copy that the site does not serve.

## Performance & accessibility

- WebGL is client-only and lazy-loaded; the document indexes without it.
- A capability probe selects a quality tier; the render loop suspends entirely
  when the 3D stage leaves the viewport.
- `prefers-reduced-motion` disables smooth scroll, the preloader, magnetic
  hovers and the animation loop.
- Skip link, semantic landmarks, visible focus rings, native cursor preserved.
