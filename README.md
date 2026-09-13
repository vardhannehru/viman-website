# VIMAN

The VIMAN website — the DGCA pilot pathway from the first enquiry to the flight deck.

## Folders

| Folder | What's in it |
|---|---|
| `frontend/` | The website (Next.js). Everything a visitor sees. |
| `backend/` | Reserved for server code. Empty for now — see its README. |

## Run the website

```bash
cd frontend
```

```bash
npm install
```

```bash
npm run dev
```

Then open <http://localhost:3000>.

## Where things live in `frontend/`

| Path | What it is |
|---|---|
| `src/lib/site.ts` | **All the website text**, including every step page. Edit this to change copy. |
| `src/app/` | Pages: the home page (`page.tsx`), step pages (`steps/[slug]`), legal pages |
| `src/app/globals.css` | Colours, fonts and the light/dark themes |
| `src/components/home/` | Home page sections — hero, checklist, timeline, cadet vs traditional |
| `src/components/steps/` | Step page parts — boarding pass, "Did you complete this step?", turbulence animation |
| `src/components/layout/` | Navbar, footer, logo, loading screen |
| `src/components/three/` | The 3D aeroplane and airfield |
| `src/components/ui/` | Shared buttons, cards and headings |
| `src/components/motion/`, `providers/` | Scroll and reveal animations |
| `src/lib/` (other files) | Legal text, the flight animation timeline, saved checklist progress |
| `public/` | Files served as they are (the 3D aeroplane model) |
| `assets/` | Source files the site does not serve |
| `README.md`, `DESIGN.md` | The detailed frontend guide and design notes |
