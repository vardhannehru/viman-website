import * as THREE from "three";

/**
 * Every texture in the scene is generated on a 2D canvas at runtime.
 * No CDN fetches, no binary assets, no loading waterfall — the aircraft is
 * fully described by code, which also means the livery is a one-line change.
 */

const canvas = (w: number, h: number) => {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return c;
};

const finish = (c: HTMLCanvasElement, srgb = true) => {
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  t.anisotropy = 8;
  t.needsUpdate = true;
  return t;
};

/* -------------------------------------------------------------------------- */
/*  FUSELAGE                                                                  */
/*  u = around the circumference, v = tail → nose.                            */
/*  u 0.00 = right flank · 0.25 = belly · 0.50 = left flank · 0.75 = spine    */
/* -------------------------------------------------------------------------- */

const W = 1024;
const H = 1024;

/** Runs a drawing routine at both flank positions, handling the u=0 seam. */
function atFlanks(ctx: CanvasRenderingContext2D, draw: (x: number) => void) {
  draw(0);
  draw(W);
  draw(W * 0.5);
}

export function createFuselageMaps() {
  /* ---- Albedo ---- */
  const cMap = canvas(W, H);
  const ctx = cMap.getContext("2d")!;

  // Polished aluminium base with a spine-to-belly falloff so the shading
  // reads even where the environment map has nothing to reflect.
  const base = ctx.createLinearGradient(0, 0, W, 0);
  base.addColorStop(0.0, "#e6edf7");
  base.addColorStop(0.25, "#aab9cd");
  base.addColorStop(0.5, "#e6edf7");
  base.addColorStop(0.75, "#fbfdff");
  base.addColorStop(1.0, "#e6edf7");
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, W, H);

  // Frame lines — faint transverse panel joints down the length.
  ctx.strokeStyle = "rgba(24,34,52,0.16)";
  ctx.lineWidth = 1.5;
  for (let v = 0.08; v < 0.98; v += 0.038) {
    ctx.beginPath();
    ctx.moveTo(0, v * H);
    ctx.lineTo(W, v * H);
    ctx.stroke();
  }

  // Cabin windows.
  const winTop = 0.3;
  const winBottom = 0.8;
  const winCount = 26;
  atFlanks(ctx, (x) => {
    for (let i = 0; i < winCount; i++) {
      const v = winTop + ((winBottom - winTop) * i) / (winCount - 1);
      ctx.fillStyle = "#0a1220";
      roundRect(ctx, x - 9, v * H - 7, 18, 14, 6);
      ctx.fill();
    }
  });

  // Cyan chine stripes — the brand mark, low on both flanks.
  const stripe = (x: number, color: string, width: number) => {
    const g = ctx.createLinearGradient(x - width, 0, x + width, 0);
    g.addColorStop(0, "rgba(0,0,0,0)");
    g.addColorStop(0.5, color);
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(x - width, 0.06 * H, width * 2, 0.86 * H);
  };
  stripe(W * 0.13, "#22e0ff", 16);
  stripe(W * 0.37, "#22e0ff", 16);
  stripe(W * 0.115, "#e8c36a", 4);
  stripe(W * 0.385, "#e8c36a", 4);

  // Nose radome and cockpit glass.
  ctx.fillStyle = "#0c1424";
  ctx.fillRect(0, 0.955 * H, W, 0.045 * H);
  atFlanks(ctx, (x) => {
    ctx.fillStyle = "#060a14";
    roundRect(ctx, x - 34, 0.9 * H, 68, 0.05 * H, 10);
    ctx.fill();
  });

  // Registration.
  ctx.save();
  ctx.translate(W * 0.5, H * 0.24);
  ctx.rotate(-Math.PI / 2);
  ctx.fillStyle = "rgba(16,26,44,0.75)";
  ctx.font = "600 34px ui-monospace, monospace";
  ctx.textAlign = "center";
  ctx.fillText("VT-VMN", 0, 12);
  ctx.restore();

  /* ---- Emissive ---- */
  const cEm = canvas(W, H);
  const ex = cEm.getContext("2d")!;
  ex.fillStyle = "#000000";
  ex.fillRect(0, 0, W, H);

  // Lit cabin.
  atFlanks(ex, (x) => {
    for (let i = 0; i < winCount; i++) {
      const v = winTop + ((winBottom - winTop) * i) / (winCount - 1);
      ex.fillStyle = i % 7 === 3 ? "rgba(20,28,44,1)" : "rgba(255,226,170,0.92)";
      roundRect(ex, x - 8, v * H - 6, 16, 12, 5);
      ex.fill();
    }
  });

  // Glowing chine.
  const emStripe = (x: number, color: string, width: number) => {
    const g = ex.createLinearGradient(x - width, 0, x + width, 0);
    g.addColorStop(0, "rgba(0,0,0,0)");
    g.addColorStop(0.5, color);
    g.addColorStop(1, "rgba(0,0,0,0)");
    ex.fillStyle = g;
    ex.fillRect(x - width, 0.06 * H, width * 2, 0.86 * H);
  };
  emStripe(W * 0.13, "#22e0ff", 13);
  emStripe(W * 0.37, "#22e0ff", 13);

  /* ---- Roughness ---- */
  const cR = canvas(256, 256);
  const rx = cR.getContext("2d")!;
  rx.fillStyle = "#2a2a2a";
  rx.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 2400; i++) {
    const v = 26 + Math.random() * 70;
    rx.fillStyle = `rgb(${v},${v},${v})`;
    rx.fillRect(Math.random() * 256, Math.random() * 256, 2, 2);
  }

  return {
    map: finish(cMap),
    emissiveMap: finish(cEm),
    roughnessMap: finish(cR, false),
  };
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/* -------------------------------------------------------------------------- */
/*  CLOUD SPRITE                                                              */
/* -------------------------------------------------------------------------- */

export function createCloudTexture() {
  const S = 256;
  const c = canvas(S, S);
  const ctx = c.getContext("2d")!;

  // A cluster of soft lobes reads far more like vapour than a single blur.
  const blob = (x: number, y: number, r: number, a: number) => {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, `rgba(255,255,255,${a})`);
    g.addColorStop(0.45, `rgba(226,238,255,${a * 0.5})`);
    g.addColorStop(1, "rgba(190,214,255,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  };

  ctx.clearRect(0, 0, S, S);
  blob(S * 0.5, S * 0.54, S * 0.4, 0.5);
  blob(S * 0.34, S * 0.6, S * 0.28, 0.42);
  blob(S * 0.66, S * 0.58, S * 0.3, 0.4);
  blob(S * 0.44, S * 0.42, S * 0.24, 0.36);
  blob(S * 0.6, S * 0.44, S * 0.2, 0.3);

  const t = finish(c);
  return t;
}

/* -------------------------------------------------------------------------- */
/*  RUNWAY                                                                    */
/* -------------------------------------------------------------------------- */

export function createRunwayTexture() {
  const w = 256;
  const h = 1024;
  const c = canvas(w, h);
  const ctx = c.getContext("2d")!;

  ctx.fillStyle = "#0a0e16";
  ctx.fillRect(0, 0, w, h);

  // Tyre-scrubbed asphalt variation.
  for (let i = 0; i < 1200; i++) {
    const v = 12 + Math.random() * 16;
    ctx.fillStyle = `rgba(${v},${v + 4},${v + 10},0.5)`;
    ctx.fillRect(Math.random() * w, Math.random() * h, 3, 3);
  }

  // Edge lines.
  ctx.fillStyle = "rgba(220,232,248,0.30)";
  ctx.fillRect(10, 0, 4, h);
  ctx.fillRect(w - 14, 0, 4, h);

  // Dashed centreline.
  ctx.fillStyle = "rgba(240,248,255,0.5)";
  for (let y = 0; y < h; y += 128) {
    ctx.fillRect(w / 2 - 3, y, 6, 72);
  }

  const t = finish(c);
  t.wrapS = THREE.RepeatWrapping;
  t.wrapT = THREE.RepeatWrapping;
  return t;
}
