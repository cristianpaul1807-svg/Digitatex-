import type { CanvasRenderer } from '@/components/sections/ProductScroll';

type V3 = [number, number, number];

/**
 * A procedural product for the Product Scroll demo.
 *
 * Generated rather than an asset, deliberately. It proves the point the skill
 * makes — the stage does not care what draws it — and it keeps the repository
 * free of client renders, which are the kind of asset that ends up in a demo by
 * accident and then stays there.
 *
 * The maths is a minimal 3D pipeline: rotate the eight corners of a box,
 * project them, sort the faces back to front and shade each by how squarely it
 * faces the light. No library, no WebGL context, no shader — a 2D canvas is
 * plenty for one convex solid, and it starts instantly.
 */

const BOX: V3[] = [
  [-1, -0.62, -0.62], [1, -0.62, -0.62], [1, 0.62, -0.62], [-1, 0.62, -0.62],
  [-1, -0.62, 0.62], [1, -0.62, 0.62], [1, 0.62, 0.62], [-1, 0.62, 0.62],
];

const FACES: [number, number, number, number][] = [
  [0, 1, 2, 3], [5, 4, 7, 6], [4, 0, 3, 7], [1, 5, 6, 2], [3, 2, 6, 7], [4, 5, 1, 0],
];

const LIGHT: V3 = [-0.45, -0.75, 0.5];

function rotate([x, y, z]: V3, ry: number, rx: number): V3 {
  const cy = Math.cos(ry), sy = Math.sin(ry);
  const x1 = x * cy - z * sy;
  const z1 = x * sy + z * cy;
  const cx = Math.cos(rx), sx = Math.sin(rx);
  return [x1, y * cx - z1 * sx, y * sx + z1 * cx];
}

function normal(a: V3, b: V3, c: V3): V3 {
  const u: V3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
  const v: V3 = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];
  const n: V3 = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
  const len = Math.hypot(n[0], n[1], n[2]) || 1;
  return [n[0] / len, n[1] / len, n[2] / len];
}

const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

export const renderProduct: CanvasRenderer = (ctx, t, { w, h }) => {
  const cx = w * 0.63;
  const cy = h * 0.5;
  const unit = Math.min(w, h) * (0.18 + easeInOut(Math.min(1, t * 1.6)) * 0.07);

  // Three acts: assemble (0–0.35), turn, then settle and light.
  const assemble = easeInOut(Math.min(1, t / 0.35));
  const spin = t * Math.PI * 1.9;
  const tilt = -0.34 + Math.sin(t * Math.PI) * 0.12;

  const projected = BOX.map((p) => {
    // During the assemble phase the corners fly in from an exploded position.
    const e: V3 = [p[0] * 2.4, p[1] * 2.4, p[2] * 2.4];
    const l: V3 = [
      e[0] + (p[0] - e[0]) * assemble,
      e[1] + (p[1] - e[1]) * assemble,
      e[2] + (p[2] - e[2]) * assemble,
    ];
    const r = rotate(l, spin, tilt);
    // Weak perspective: enough to read as depth, not enough to distort.
    const persp = 3.4 / (3.4 - r[2]);
    return { x: cx + r[0] * unit * persp, y: cy + r[1] * unit * persp, z: r[2] };
  });

  // Contact shadow, so the object sits in a space instead of floating in one.
  //
  // Kept small and reasonably opaque on purpose. A wide, very low-alpha
  // gradient over a near-black background makes Chromium's 256px raster tiles
  // visible as faint rectangles — it reads as a rendering bug rather than as
  // shade. Less area and more contrast per pixel removes it.
  const sy = cy + unit * 1.2;
  const shadow = ctx.createRadialGradient(cx, sy, 0, cx, sy, unit * 1.35);
  shadow.addColorStop(0, 'rgba(0,0,0,0.62)');
  shadow.addColorStop(0.5, 'rgba(0,0,0,0.26)');
  shadow.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.save();
  ctx.translate(cx, sy);
  ctx.scale(1, 0.32);
  ctx.translate(-cx, -sy);
  ctx.fillStyle = shadow;
  ctx.beginPath();
  ctx.arc(cx, sy, unit * 1.35, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  const faces = FACES.map((f) => {
    const pts = f.map((i) => projected[i]!);
    const depth = pts.reduce((s, p) => s + p.z, 0) / 4;
    const rot = f.map((i) => rotate(BOX[i]!, spin, tilt));
    const n = normal(rot[0]!, rot[1]!, rot[2]!);
    const lambert = Math.max(0, n[0] * LIGHT[0] + n[1] * LIGHT[1] + n[2] * LIGHT[2]);
    return { pts, depth, lambert };
  }).sort((a, b) => a.depth - b.depth);

  for (const face of faces) {
    // Ambient floor of 0.10 so an unlit face is still a surface and not a hole,
    // and a wide range above it so the turn actually reads as a turn.
    const shade = 0.10 + face.lambert * 0.62;
    ctx.beginPath();
    face.pts.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
    ctx.closePath();
    ctx.fillStyle = `rgba(${Math.round(196 * shade + 16)},${Math.round(222 * shade + 18)},${Math.round(140 * shade + 20)},0.97)`;
    ctx.fill();
    ctx.strokeStyle = `rgba(200,242,74,${0.14 + face.lambert * 0.62})`;
    ctx.lineWidth = 1.2;
    ctx.stroke();
  }

  // Rim light in the final act, once the object has stopped introducing itself.
  const rim = Math.max(0, (t - 0.72) / 0.28);
  if (rim > 0) {
    // Bounded to the object's own neighbourhood rather than the whole canvas,
    // for the same tile-seam reason as the shadow above.
    const r = unit * 2.6;
    const g = ctx.createRadialGradient(cx, cy, unit * 0.5, cx, cy, r);
    g.addColorStop(0, `rgba(200,242,74,${0.2 * rim})`);
    g.addColorStop(0.55, `rgba(200,242,74,${0.06 * rim})`);
    g.addColorStop(1, 'rgba(200,242,74,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
  }
};
