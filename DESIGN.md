# VIMAN — Design System

**one app · Zero to Cockpit**

## Source fidelity

The uploaded VIMAN pathway document is the single source of truth for content,
pages, features and flows. Every string on this site comes from it. Nothing is
invented, and gaps are left as gaps rather than filled with conventional
patterns.

The design layer — the 3D aircraft, the motion, the dark visual system — is
presentation only. It does not add product scope.

All copy lives in `src/lib/site.ts`, which is annotated with its provenance.

---

## 1. Information Architecture

```
/                        Single scroll, in the source's own order
  ├─ Hero        brand      "one app" / "Zero to Cockpit"
  ├─ Stages      #stages    "Which stage are you in?"  (static)
  ├─ Roadmap     #roadmap   "Steps to Become an Airline Pilot" (9)
  ├─ Prereqs     #prerequisites  "Prerequisites & Qualifications"
  ├─ Pathway     #pathway   "Step-by-Step Pilot Pathway" (7)
  ├─ Investment  #investment "Typical Timeline & Investment"
  ├─ Compare     #compare   Cadet vs Traditional + decision tree
  └─ Portals     #portals   "Key Application Links & Portals"

/login                   Username · Password · Log in · Forgot Password · Create
```

Navigation labels are taken from the source's own section headings. The source
is a mobile app flow with no navigation bar; the nav exists only because the web
version is one long document.

## 2. User journey

Brand → stage self-identification → roadmap → eligibility → the seven steps →
what it costs → which route to take → where to apply.

**The stages are static.** The source names four stages and gives a status
phrase for three of them, but provides no per-stage content or destination —
so they are rendered as display items, not controls.

**The roadmap is the runway.** Scroll progress across the nine steps of
"Steps to Become an Airline Pilot" is the flight timeline, and the six
aircraft states are placed against the steps that earn them:

| p | Step | Aircraft |
|---|---|---|
| 0.00 | 01 Complete 12th Board Exams | Cold & dark, parked, engines off |
| 0.16 | 02 Class 2 Medical | still cold — nothing has begun |
| 0.30 | 03 DGCA & RTR(A) prep | Engine start, nav lights, beacon, taxi |
| 0.50 | 04–05 Class 1 Medical, exams | Taxi, controls checked full and free |
| 0.62 | 06 DGCA Computer Number | Lined up on the centreline, holding |
| 0.78 | 07 CPL Flight Training | TOGA, roll, rotate |
| 0.89 | 08 CPL Licence & Conversion | Gear up, initial climb |
| 1.00 | 09 Type Rating | Cruise — "Congratulations" |

Steps light up as they are reached, like runway edge lighting.

## 3. Visual system

Dark-first. Glass over void. One accent per section, strictly rationed.

| Principle | Application |
|---|---|
| Depth over decoration | Layered glass, soft shadows, film grain against banding |
| Motion decelerates | `ease-out-expo` everywhere; nothing accelerates into a stop |
| Data reads as instrumentation | Mono microcopy, tabular figures, hairline rules |
| The source's words, verbatim | Headings are the document's own headings |

## 4. Colour tokens

```css
--color-void:      #04070E    --color-cloud:     #F4F8FF
--color-navy-950:  #060A14    --color-cloud-dim: #C7D4E8
--color-navy-900:  #0A1020    --color-mist:      #8DA0BF
--color-navy-800:  #111A2E    --color-mist-deep: #5C6E8C
--color-navy-700:  #1A2740

--color-brand:     #5271F5   /* the VIMAN delta — identity only */
--color-sky:       #5AA9FF   /* mid-pathway steps */
--color-cyan:      #22E0FF   /* progress, early steps */
--color-gold:      #E8C36A   /* licence, cost totals, cadet route */
```

## 5. Typography

| Family | Role |
|---|---|
| **Inter** | UI and headlines, −0.045em at display sizes |
| **Instrument Serif** *italic* | One accent line per heading; the step captions |
| **JetBrains Mono** | Uppercase 0.28em labels; all figures |

```
display  clamp(3.25rem, 11vw, 10.5rem)   lh 0.86   ls −0.045em
heading  clamp(1.875rem, 4vw, 3.25rem)   lh 1.04   ls −0.035em
subhead  clamp(1.25rem, 2.2vw, 1.75rem)  lh 1.30
lead     clamp(1.06rem, 1.35vw, 1.31rem) lh 1.62
label    0.6875rem  ls 0.28em  uppercase mono
```

> **Gradient headings.** `text-gradient` re-issues its background on descendant
> spans. Split-text reveals wrap each word in a `will-change: transform` span,
> which is its own containing block — an ancestor's `background-clip: text`
> cannot paint through it, and the glyphs render invisible. The nested rule in
> `globals.css` is load-bearing.

## 6. Components

```
ui/       Button · GlassCard (spotlight, tilt) · Pill · SectionHeading
          Field/Input · Magnetic
motion/   TextReveal · Reveal/RevealGroup/RevealItem · Parallax
layout/   Navbar · Footer · Preloader · CursorGlow · Logo · PageHero
three/    FlightCanvas · FlightScene · A320 · Atmosphere · textures
sections/ Hero · Stages · Roadmap · Prerequisites · PathwaySteps
          Investment · Pathways · Portals
```

**Identity.** `VIM` + delta + `N` + runway plate, scaled from one `font-size`
via `em`. The delta is a blue triangle with the aircraft **cut out** by an SVG
mask, so it works on any background; each instance generates unique gradient and
mask ids via `useId`.

## 7. Animation

One clock: **Lenis → GSAP ticker → ScrollTrigger**, so scroll-linked DOM and the
3D scene cannot disagree by a frame. Entrances are rise + de-blur.
`prefers-reduced-motion` disables Lenis, the preloader, magnetics and the render
loop, and the scene renders one static frame.

## 8. Scroll storyboard

`#flight-stage` wraps Hero + Stages + Roadmap so the canvas is behind all
three. The **flight** is driven by one ScrollTrigger on `#roadmap`
(`top 72%` → `bottom bottom`), so the aeroplane sits cold on the ramp through
the hero and flies across the nine steps.

The camera is one shot per beat — wide establishing, low tracking, side-on
taxi profile, head-on at the hold, dynamic low rotation shot, follow into the
climb, wide aerial at cruise — each an offset from the aeroplane in metres,
interpolated and damped. Nothing is keyframed in world space, so the shots
stay composed wherever along the runway the aeroplane is.

The world is at **1:1 metre scale**: A320 span 34 m, runway 45 × 3 000 m,
cruise at 2 400 m. Working at real scale means the aeroplane's size is legible
without ever having to be described.

## 9. 3D architecture

One persistent `<Canvas>`, fixed at `z-0`, lazy-loaded client-side so the
document indexes without three.js.

- **Aircraft** — a real Airbus A320 GLB (`/public/models/a320.glb`, 22.7k tris,
  111 named nodes). Nose is +X and span is Z in the export, so one wrapper
  group rotates it to +Z-forward and lifts it so the wheels rest on y = 0.
- **Control surfaces** — every one is a separate node, but they export with
  identity transforms, so each is re-pivoted at runtime onto its own hinge
  line before it can be deflected. Ailerons, elevators, rudder, flaps, slats
  and spoilers all drive off the flight state.
- **Landing gear** — the GLB is a clean-configuration model: gear doors and a
  nose-gear well, but no struts or wheels. The gear is built in code to A320
  dimensions (wheelbase 12.64 m, track 7.59 m, main tyres 1270 × 455 mm) and
  handles compression, wheel spin, nose steering and retraction.
- **Materials** — all 28 export as `metalness 0 / roughness 1`, i.e. matte
  plastic, so they are rebuilt as painted metal and collapsed to 9 shared
  finishes. The two airline liveries in the file are unused and disposed.
  Cabin windows get their own finish: they share the cockpit's material but
  are a 21.8 × 0.44 m sliver, which at mirror roughness reflects the key light
  as one continuous streak down the fuselage.
- **Lighting** — `Lightformer` area lights inside `Environment` (`frames={1}`).
  The sun is placed well off the camera axis on purpose; ahead of it, the sky
  shader's glow term plus bloom washes out every frame.
- **Performance** — capability probe picks a tier; dpr capped 1.75/1.25;
  runway light instance colours upload only when the aeroplane crosses one;
  `IntersectionObserver` suspends the render loop when the stage is off screen.

## 10. Folder structure

```
src/
├─ app/         layout · template · page · globals.css · icon.svg
│               login/ · not-found · sitemap · robots
├─ components/  auth · layout · motion · providers · sections · three · ui
├─ hooks/       use-media-query · use-magnetic
└─ lib/         site.ts (all content, annotated) · motion · utils
                validators · flight-state (3D ↔ DOM bridge) · storyboard
```

> `template.tsx` is opacity-only by design. A `transform` or `filter` there
> would make it a containing block for every `position: fixed` descendant,
> nailing the WebGL stage to the page instead of the viewport.

## Accessibility

Skip link · semantic landmarks · `aria-label` on split text · visible focus
rings · native cursor never hidden · full `prefers-reduced-motion` path ·
no element escapes the viewport at 375px.
