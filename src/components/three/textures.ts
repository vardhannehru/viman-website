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
