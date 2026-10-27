"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";

// Hand-drawn line figures for the Services section. Each has its own
// perspective and its own way of answering the pointer, and plays on a slow
// loop when left alone. Colours come from --fig-* custom properties so the
// section decides the palette.

const VB_W = 400;
const VB_H = 320;
const TAU = Math.PI * 2;

type Pt = [number, number];

const COLOR = {
  plate: "var(--fig-plate, #111111)",
  hi: "var(--fig-hi, #eeeeeb)",
  edge: "var(--fig-edge, #8a8a85)",
  mid: "var(--fig-mid, #55554f)",
  lo: "var(--fig-lo, #2c2c29)",
  accent: "var(--fig-accent, #1677ff)",
};

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
// Frame-rate independent ease toward a target
const approach = (cur: number, target: number, dt: number, rate = 7) =>
  cur + (target - cur) * (1 - Math.exp(-rate * dt));
// Coordinates rounded to 0.1: server and browser maths can differ in the last
// digits, which would break hydration
const r1 = (n: number) => Math.round(n * 10) / 10;
const poly = (ps: Pt[]) => ps.map(([a, b]) => `${a.toFixed(1)},${b.toFixed(1)}`).join(" ");

/* ---------------------------------------------------------------- loop --- */

type Input = { x: number; y: number; active: boolean; t: number; dt: number; still: boolean };

// Runs `step` every frame while the figure is on screen and re-renders with its result.
// `area` is a selector for an ancestor that tracks the pointer instead of the
// figure itself, for a bigger, easier hit area (x/y are then relative to it).
function useFigure<M>(initial: M, step: (prev: M, input: Input) => M, area?: string) {
  const ref = useRef<HTMLDivElement>(null);
  const [model, setModel] = useState(initial);
  const stepRef = useRef(step);
  useEffect(() => {
    stepRef.current = step;
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pointer = { x: 0.5, y: 0.5, active: false };
    const t0 = performance.now();
    let last = t0;
    let raf = 0;

    const frame = (now: number) => {
      // rAF timestamps can trail performance.now(), so never step backwards
      const dt = clamp((now - last) / 1000, 0, 0.05);
      last = now;
      const input = { ...pointer, t: (now - t0) / 1000, dt, still };
      setModel((prev) => stepRef.current(prev, input));
      raf = requestAnimationFrame(frame);
    };
    const io = new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(raf);
      if (entry.isIntersecting) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    });
    const target: HTMLElement = (area && el.closest<HTMLElement>(area)) || el;
    const onMove = (e: PointerEvent) => {
      const r = target.getBoundingClientRect();
      if (!r.width || !r.height) return;
      pointer.x = clamp((e.clientX - r.left) / r.width);
      pointer.y = clamp((e.clientY - r.top) / r.height);
      pointer.active = true;
    };
    const onLeave = () => {
      pointer.active = false;
    };

    io.observe(el);
    target.addEventListener("pointermove", onMove);
    target.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      target.removeEventListener("pointermove", onMove);
      target.removeEventListener("pointerleave", onLeave);
    };
  }, [area]);

  return [ref, model] as const;
}

function Frame({ label, className, children, figRef }: { label: string; className?: string; children: ReactNode; figRef: React.Ref<HTMLDivElement> }) {
  return (
    <div ref={figRef} className={className} style={{ aspectRatio: `${VB_W} / ${VB_H}`, touchAction: "pan-y" }}>
      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        role="img"
        aria-label={label}
        className="h-full w-full [&_*]:[vector-effect:non-scaling-stroke]"
        fill="none"
        strokeWidth={1}
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        {children}
      </svg>
    </div>
  );
}

// Ids for <mask>/<clipPath> must be valid inside url(#…)
const useSvgId = () => useId().replace(/[^a-zA-Z0-9_-]/g, "");

/* ------------------------------------------------- 01 · Web development --- */
// A finished web page seen straight on. The pointer is an X-ray lens: through
// it, the page shows the markup it is built from.

type WebModel = { lx: number; ly: number };
const LENS_R = 58;

const WEB_TAGS: { label: string; x: number; y: number; w: number; h: number }[] = [
  { label: "<nav>", x: 50, y: 68, w: 300, h: 20 },
  { label: "<h1>", x: 50, y: 94, w: 162, h: 40 },
  { label: "<p>", x: 50, y: 136, w: 152, h: 22 },
  { label: "<button>", x: 50, y: 162, w: 76, h: 28 },
  { label: "<img>", x: 224, y: 92, w: 122, h: 98 },
  { label: "<section>", x: 50, y: 198, w: 296, h: 76 },
];

export function WebFigure({ className, label }: { className?: string; label: string }) {
  const id = useSvgId();
  const [ref, m] = useFigure<WebModel>({ lx: 140, ly: 130 }, (prev, { x, y, active, t, dt, still }) => {
    const tx = active ? x * VB_W : still ? 200 : 200 + 105 * Math.sin(t * 0.45);
    const ty = active ? y * VB_H : still ? 165 : 168 + 68 * Math.sin(t * 0.9 + 1);
    return { lx: r1(approach(prev.lx, tx, dt, 9)), ly: r1(approach(prev.ly, ty, dt, 9)) };
  });

  const card = (x: number) => (
    <g key={x}>
      <rect x={x} y={206} width={88} height={62} rx={6} stroke={COLOR.edge} fill={COLOR.plate} />
      <rect x={x + 8} y={214} width={72} height={24} rx={3} stroke={COLOR.mid} />
      <line x1={x + 8} y1={248} x2={x + 62} y2={248} stroke={COLOR.mid} />
      <line x1={x + 8} y1={257} x2={x + 46} y2={257} stroke={COLOR.mid} />
    </g>
  );

  return (
    <Frame figRef={ref} className={className} label={label}>
      <defs>
        <clipPath id={`${id}-lens`}>
          <circle cx={m.lx} cy={m.ly} r={LENS_R} />
        </clipPath>
        <mask id={`${id}-page`}>
          <rect width={VB_W} height={VB_H} fill="#fff" />
          <circle cx={m.lx} cy={m.ly} r={LENS_R} fill="#000" />
        </mask>
      </defs>

      {/* Browser chrome */}
      <rect x={36} y={36} width={328} height={248} rx={10} stroke={COLOR.edge} fill={COLOR.plate} />
      <line x1={36} y1={60} x2={364} y2={60} stroke={COLOR.edge} />
      {[50, 62, 74].map((cx) => (
        <circle key={cx} cx={cx} cy={48} r={3} stroke={COLOR.mid} />
      ))}
      <rect x={110} y={42} width={180} height={12} rx={6} stroke={COLOR.mid} />

      {/* The page as visitors see it */}
      <g mask={`url(#${id}-page)`}>
        <rect x={54} y={73} width={12} height={10} rx={2} fill={COLOR.hi} />
        {[230, 264, 298].map((x) => (
          <line key={x} x1={x} y1={78} x2={x + 24} y2={78} stroke={COLOR.edge} />
        ))}
        <rect x={54} y={100} width={150} height={13} rx={2} fill={COLOR.hi} />
        <rect x={54} y={118} width={108} height={13} rx={2} fill={COLOR.hi} />
        <line x1={54} y1={142} x2={196} y2={142} stroke={COLOR.mid} />
        <line x1={54} y1={151} x2={170} y2={151} stroke={COLOR.mid} />
        <rect x={54} y={166} width={68} height={20} rx={10} fill={COLOR.accent} />
        <rect x={228} y={96} width={114} height={90} rx={6} stroke={COLOR.edge} />
        <circle cx={250} cy={118} r={8} stroke={COLOR.edge} />
        <polyline points="234,180 268,140 290,160 310,134 338,180" stroke={COLOR.edge} />
        {[54, 154, 254].map(card)}
      </g>

      {/* The same page through the lens: its markup */}
      <g clipPath={`url(#${id}-lens)`}>
        <circle cx={m.lx} cy={m.ly} r={LENS_R} fill={COLOR.accent} fillOpacity={0.08} />
        {Array.from({ length: 14 }, (_, i) => (
          <line key={i} x1={36} y1={64 + i * 16} x2={364} y2={64 + i * 16} stroke={COLOR.lo} />
        ))}
        {WEB_TAGS.map((tag) => (
          <g key={tag.label}>
            <rect x={tag.x} y={tag.y} width={tag.w} height={tag.h} stroke={COLOR.accent} strokeDasharray="3 3" />
            <text x={tag.x + 4} y={tag.y + 11} fontSize={10} fontFamily="ui-monospace, monospace" fill={COLOR.hi}>
              {tag.label}
            </text>
          </g>
        ))}
        <line x1={224} y1={92} x2={346} y2={190} stroke={COLOR.mid} />
        <line x1={346} y1={92} x2={224} y2={190} stroke={COLOR.mid} />
        {[56, 156, 256].map((x) => (
          <rect key={x} x={x - 2} y={204} width={92} height={66} stroke={COLOR.mid} strokeDasharray="2 3" />
        ))}
      </g>

      {/* Lens */}
      <circle cx={m.lx} cy={m.ly} r={LENS_R} stroke={COLOR.hi} />
      <circle cx={m.lx} cy={m.ly} r={LENS_R + 5} stroke={COLOR.lo} />
      <g transform={`translate(${m.lx} ${m.ly}) rotate(45)`}>
        <rect x={LENS_R + 5} y={-4} width={34} height={8} rx={4} stroke={COLOR.edge} fill={COLOR.plate} />
      </g>
    </Frame>
  );
}

/* -------------------------------------------- 02 · Software engineering --- */
// Gears lying on a table, seen from above at an angle. Circling the pointer
// around the big gear cranks the machine; raw blocks of code go in on one
// side and come out compiled on the other. Hold the pointer still and the
// machine stops under your hand.

const GX = 157;
const GY = 152;
const SCALE = 1.15;
const SQUASH = 0.52;
const THICK = 12;
const GEARS = [
  // Back to front. ratio = turns per turn of the big gear (teeth ratio, reversed)
  { u: 101.3, v: -58.5, r: 45, teeth: 10, ratio: -16 / 10, phase: Math.PI / 10 },
  { u: 0, v: 0, r: 72, teeth: 16, ratio: 1, phase: 0 },
  { u: 50.7, v: 95.4, r: 36, teeth: 8, ratio: -16 / 8, phase: Math.PI / 8 },
];
const BELT_STEP = 26;
const IN_BELT = { from: -125, to: -82, v: 0 };
const OUT_BELT = { from: 92, to: 200, v: 95.4 };

const plane = (u: number, v: number, z: number): Pt => [r1(GX + u * SCALE), r1(GY + v * SCALE * SQUASH - z)];

function gearOutline(g: (typeof GEARS)[number], angle: number, z: number): Pt[] {
  const pitch = TAU / g.teeth;
  const ro = g.r + 5;
  const rr = g.r - 4;
  const pts: Pt[] = [];
  for (let i = 0; i < g.teeth; i++) {
    const a = angle + i * pitch;
    for (const [da, rad] of [[-0.27, rr], [-0.14, ro], [0.14, ro], [0.27, rr]] as const) {
      const aa = a + da * pitch;
      pts.push(plane(g.u + Math.cos(aa) * rad, g.v + Math.sin(aa) * rad, z));
    }
  }
  return pts;
}

type GearModel = { theta: number; omega: number; prev: number | null; belt: number };

export function SoftwareFigure({ className, label }: { className?: string; label: string }) {
  const [ref, m] = useFigure<GearModel>({ theta: 0, omega: 0.7, prev: null, belt: 0 }, (s, { x, y, active, dt, still }) => {
    let omega: number;
    let prev: number | null = null;
    if (active) {
      // Pointer angle around the big gear, measured on the table (un-squashed)
      const angle = Math.atan2((y * VB_H - GY) / SQUASH, x * VB_W - GX);
      let crank = 0;
      if (s.prev !== null && dt > 0) {
        let d = angle - s.prev;
        if (d > Math.PI) d -= TAU;
        if (d < -Math.PI) d += TAU;
        crank = clamp(d / dt, -9, 9);
      }
      omega = approach(s.omega, crank, dt, 10);
      prev = angle;
    } else {
      omega = approach(s.omega, still ? 0 : 0.7, dt, 1.5);
    }
    if (!Number.isFinite(omega)) omega = 0;
    const theta = (s.theta + omega * dt) % TAU;
    // Teeth surfaces move together, so one belt speed fits both sides
    const belt = (s.belt + Math.abs(omega) * GEARS[1].r * dt) % (BELT_STEP * 1000);
    return { theta, omega, prev, belt };
  });

  const packets = (belt: typeof IN_BELT, done: boolean) => {
    const offset = m.belt % BELT_STEP;
    const out: ReactNode[] = [];
    for (let u = belt.from + offset; u < belt.to; u += BELT_STEP) {
      const sq = [plane(u - 5, belt.v - 5, 2), plane(u + 5, belt.v - 5, 2), plane(u + 5, belt.v + 5, 2), plane(u - 5, belt.v + 5, 2)];
      out.push(
        <polygon
          key={u.toFixed(1)}
          points={poly(sq)}
          stroke={done ? COLOR.accent : COLOR.mid}
          fill={done ? COLOR.accent : COLOR.plate}
        />,
      );
    }
    return out;
  };
  const rails = (belt: typeof IN_BELT) =>
    [-8, 8].map((dv) => {
      const [x1, y1] = plane(belt.from, belt.v + dv, 0);
      const [x2, y2] = plane(belt.to, belt.v + dv, 0);
      return <line key={dv} x1={x1} y1={y1} x2={x2} y2={y2} stroke={COLOR.lo} strokeDasharray="4 4" />;
    });

  return (
    <Frame figRef={ref} className={className} label={label}>
      {rails(IN_BELT)}
      {rails(OUT_BELT)}
      {packets(IN_BELT, false)}

      {GEARS.map((g, gi) => {
        const angle = m.theta * g.ratio + g.phase;
        const bottom = gearOutline(g, angle, 0);
        const top = gearOutline(g, angle, THICK);
        // Silhouette edges: the left- and rightmost points of the outline
        const left = bottom.reduce((a, b) => (b[0] < a[0] ? b : a));
        const right = bottom.reduce((a, b) => (b[0] > a[0] ? b : a));
        const big = gi === 1;
        const [hx, hy] = plane(g.u, g.v, THICK);
        return (
          <g key={gi}>
            <polygon points={poly(bottom)} stroke={COLOR.lo} fill={COLOR.plate} />
            <line x1={left[0]} y1={left[1]} x2={left[0]} y2={left[1] - THICK} stroke={COLOR.mid} />
            <line x1={right[0]} y1={right[1]} x2={right[0]} y2={right[1] - THICK} stroke={COLOR.mid} />
            <polygon points={poly(top)} stroke={big ? COLOR.hi : COLOR.edge} fill={COLOR.plate} />
            {/* Spokes make the turning readable */}
            {[0, 1, 2].map((k) => {
              const a = angle + (k * TAU) / 3;
              const [x1, y1] = plane(g.u + Math.cos(a) * 15, g.v + Math.sin(a) * 15, THICK);
              const [x2, y2] = plane(g.u + Math.cos(a) * (g.r - 12), g.v + Math.sin(a) * (g.r - 12), THICK);
              return <line key={k} x1={x1} y1={y1} x2={x2} y2={y2} stroke={COLOR.mid} />;
            })}
            <ellipse cx={hx} cy={hy} rx={15 * SCALE} ry={15 * SCALE * SQUASH} stroke={big ? COLOR.accent : COLOR.mid} fill={COLOR.plate} />
            {big && (
              <text x={hx} y={hy + 3.5} textAnchor="middle" fontSize={10} fontFamily="ui-monospace, monospace" fill={COLOR.hi}>
                {"</>"}
              </text>
            )}
          </g>
        );
      })}

      {packets(OUT_BELT, true)}
    </Frame>
  );
}

/* ------------------------------------------------------ 03 · UI / UX --- */
// A phone in true perspective that turns with the pointer anywhere over its
// column: across is almost a full turn, so its back comes round too. The more
// the screen leans, the further its interface rises off the glass, layer by
// layer, like a hologram.

const FOCAL = 520;
const PH_W = 124;
const PH_H = 236;
const PH_R = 18;
const PH_DEPTH = 12;
const YAW_RANGE = TAU * 0.9;

type PhoneModel = { ax: number; ay: number };

// Rounded rectangle outline in the phone's own plane
function roundRect(x: number, y: number, w: number, h: number, r: number): [number, number][] {
  const pts: [number, number][] = [];
  const corners: [number, number, number][] = [
    [x + w - r, y + r, -Math.PI / 2],
    [x + w - r, y + h - r, 0],
    [x + r, y + h - r, Math.PI / 2],
    [x + r, y + r, Math.PI],
  ];
  for (const [cx, cy, a0] of corners) {
    for (let i = 0; i <= 4; i++) {
      const a = a0 + (i / 4) * (Math.PI / 2);
      pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
    }
  }
  return pts;
}

const circle = (cx: number, cy: number, r: number): [number, number][] =>
  Array.from({ length: 20 }, (_, i) => [cx + Math.cos((i / 20) * TAU) * r, cy + Math.sin((i / 20) * TAU) * r]);

export function UiFigure({ className, label }: { className?: string; label: string }) {
  const [ref, m] = useFigure<PhoneModel>(
    { ax: 0, ay: 0 },
    (prev, { x, y, active, t, dt, still }) => {
      const ay = active ? (x - 0.5) * YAW_RANGE : still ? -0.3 : 0.55 * Math.sin(t * 0.5);
      const ax = active ? -(y - 0.5) * 1.1 : still ? 0.15 : 0.28 * Math.sin(t * 0.9 + 0.6);
      return { ax: approach(prev.ax, ax, dt, 6), ay: approach(prev.ay, ay, dt, 6) };
    },
    "article",
  );

  const cy = Math.cos(m.ay);
  const sy = Math.sin(m.ay);
  const cx = Math.cos(m.ax);
  const sx = Math.sin(m.ax);
  const P = (x: number, y: number, z: number): Pt => {
    const x1 = x * cy + z * sy;
    const z1 = -x * sy + z * cy;
    const y2 = y * cx - z1 * sx;
    const z2 = y * sx + z1 * cx;
    const k = FOCAL / (FOCAL + z2);
    return [r1(200 + x1 * k), r1(160 + y2 * k)];
  };
  const shape = (pts: [number, number][], z: number) => poly(pts.map(([x, y]) => P(x, y, z)));

  // The screen faces the viewer while its normal points toward us
  const facing = cy * cx > 0;
  // The more the screen leans, the further the interface lifts off the glass
  const spread = 0.35 + 1.5 * clamp((Math.abs(sy) + Math.abs(m.ax)) / 0.55);
  const zCard = -22 * spread;
  const zButton = -46 * spread;
  const zNote = -72 * spread;

  const outline = roundRect(-PH_W / 2, -PH_H / 2, PH_W, PH_H, PH_R);
  const screen = roundRect(-PH_W / 2 + 6, -PH_H / 2 + 6, PH_W - 12, PH_H - 12, PH_R - 5);
  const depthGuide = (x: number, y: number, z: number, key: string) => {
    const [x1, y1] = P(x, y, 0);
    const [x2, y2] = P(x, y, z);
    return <line key={key} x1={x1} y1={y1} x2={x2} y2={y2} stroke={COLOR.lo} strokeDasharray="2 3" />;
  };

  const sides = [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([sxn, syn]) => {
    const px = sxn * (PH_W / 2 - 5);
    const py = syn * (PH_H / 2 - 5);
    const [x1, y1] = P(px, py, PH_DEPTH);
    const [x2, y2] = P(px, py, 0);
    return <line key={`${sxn}${syn}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={COLOR.mid} />;
  });

  const front = (
    <g>
      <polygon points={shape(outline, 0)} stroke={COLOR.edge} fill={COLOR.plate} />
      <polygon points={shape(screen, 0)} stroke={COLOR.mid} />
      <polygon points={shape(roundRect(-16, -PH_H / 2 + 10, 32, 7, 3.5), 0)} stroke={COLOR.mid} />
      {Array.from({ length: 9 }, (_, i) => {
        const y = -PH_H / 2 + 30 + i * 22;
        const [x1, y1] = P(-PH_W / 2 + 6, y, 0);
        const [x2, y2] = P(PH_W / 2 - 6, y, 0);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={COLOR.lo} />;
      })}
    </g>
  );

  // Seen from behind: camera block and a mark. Its x runs mirrored, so the
  // camera sits top-left once the phone has turned round.
  const back = (
    <g>
      <polygon points={shape(outline, PH_DEPTH)} stroke={facing ? COLOR.lo : COLOR.edge} fill={COLOR.plate} />
      {!facing && (
        <>
          <polygon points={shape(roundRect(14, -PH_H / 2 + 12, 38, 42, 10), PH_DEPTH)} stroke={COLOR.edge} />
          <polygon points={shape(circle(26, -PH_H / 2 + 24, 7), PH_DEPTH)} stroke={COLOR.hi} />
          <polygon points={shape(circle(26, -PH_H / 2 + 42, 7), PH_DEPTH)} stroke={COLOR.hi} />
          <polygon points={shape(circle(42, -PH_H / 2 + 33, 2.5), PH_DEPTH)} stroke={COLOR.accent} fill={COLOR.accent} />
          <polygon points={shape(circle(0, 0, 12), PH_DEPTH)} stroke={COLOR.mid} />
        </>
      )}
    </g>
  );

  const card = (
    <g>
      {[[-48, -62], [48, -62], [-48, 32], [48, 32]].map(([x, y]) => depthGuide(x, y, zCard, `c${x}${y}`))}
      <polygon points={shape(roundRect(-48, -62, 96, 94, 8), zCard)} stroke={COLOR.edge} fill={COLOR.plate} />
      <polygon points={shape(roundRect(-40, -54, 80, 46, 4), zCard)} stroke={COLOR.mid} />
      <polyline points={poly([[-36, -12], [-14, -34], [0, -22], [14, -38], [36, -12]].map(([x, y]) => P(x, y, zCard)))} stroke={COLOR.mid} />
      {[[2, 62], [14, 44]].map(([y, w]) => {
        const [x1, y1] = P(-40, y, zCard);
        const [x2, y2] = P(-40 + w, y, zCard);
        return <line key={y} x1={x1} y1={y1} x2={x2} y2={y2} stroke={COLOR.mid} />;
      })}
    </g>
  );

  const actions = (
    <g>
      {[-30, 0, 30].map((x) => (
        <polygon key={x} points={shape(circle(x, 62, 9), zButton)} stroke={COLOR.edge} fill={COLOR.plate} />
      ))}
      <polygon points={shape(roundRect(-44, 82, 88, 22, 11), zButton)} stroke={COLOR.accent} fill={COLOR.accent} />
    </g>
  );

  const note = (
    <g>
      {[[-56, -106], [56, -106], [-56, -80], [56, -80]].map(([x, y]) => depthGuide(x, y, zNote, `n${x}${y}`))}
      <polygon points={shape(roundRect(-56, -106, 112, 26, 13), zNote)} stroke={COLOR.hi} fill={COLOR.plate} />
      <polygon points={shape(circle(-42, -93, 7), zNote)} stroke={COLOR.hi} />
      {[[-98, 52], [-89, 34]].map(([y, w]) => {
        const [x1, y1] = P(-30, y, zNote);
        const [x2, y2] = P(-30 + w, y, zNote);
        return <line key={y} x1={x1} y1={y1} x2={x2} y2={y2} stroke={COLOR.edge} />;
      })}
      <polygon points={shape(circle(44, -93, 3), zNote)} stroke={COLOR.accent} fill={COLOR.accent} />
    </g>
  );

  // Painter's order flips with the side we see: the floating layers sit in
  // front of the glass, so from behind they are the farthest things away.
  return (
    <Frame figRef={ref} className={className} label={label}>
      {facing ? (
        <>
          {back}
          {sides}
          {front}
          {card}
          {actions}
          {note}
        </>
      ) : (
        <>
          {note}
          {actions}
          {card}
          {front}
          {sides}
          {back}
        </>
      )}
    </Frame>
  );
}
