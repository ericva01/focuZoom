// The 3D "studio stage" used on the website: a sample screen recording seen
// through a virtual camera that travels between click keyframes.
// Progress runs from 0 to 1 across five camera poses; everything is a pure
// function of progress, so scrubbing backwards works.
import {
  WebGLRenderer, Scene, PerspectiveCamera, Mesh, MeshBasicMaterial, PlaneGeometry,
  CircleGeometry, RingGeometry, ShapeGeometry, Shape, CanvasTexture, Vector3,
  SRGBColorSpace, LinearFilter, DoubleSide,
} from "three";

export type StudioStageListener = (progress: number, playing: boolean) => void;

export interface StudioStageOptions {
  /** Starting progress, 0 to 1. */
  start?: number;
  /** Length of the full move in seconds. */
  duration?: number;
}

export interface StudioStageHandle {
  duration: number;
  getProgress: () => number;
  isPlaying: () => boolean;
  setProgress: (p: number) => void;
  play: () => void;
  pause: () => void;
  animateTo: (p: number, seconds?: number) => void;
  onUpdate: (fn: StudioStageListener) => void;
  dispose: () => void;
}

const INK = "#1C2733";
const SLATE = "#55636F";
const RAIL = "#C9CFD4";
const KEY = "#F26A21";
const W = 6.4, H = 4.0, TW = 1600, TH = 1000;

// Camera keyframes: where the camera stands and what it looks at.
const POSES: { pos: number[]; look: number[] }[] = [
  { pos: [-4.2, 1.8, 10.6], look: [0.2, -0.1, 0] },
  { pos: [-0.5, 1.5, 4.3], look: [-1.2, 1.1, 0] },
  { pos: [3.5, 0.5, 4.6], look: [1.5, -0.1, 0] },
  { pos: [-0.9, -2.1, 4.6], look: [0.2, -1.3, 0] },
  { pos: [4.0, 1.4, 10.8], look: [-0.1, 0, 0] },
];
// Where the cursor rests at each keyframe (screen-plane coordinates).
const CURSOR: number[][] = [[-2.6, -1.6], [-1.2, 1.1], [1.5, -0.1], [0.2, -1.3], [0.2, -1.3]];

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const ease = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function rr(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function drawScreen(ctx: CanvasRenderingContext2D) {
  const f = (w: number, s: number) => `${w} ${s}px Jost, "Century Gothic", "Trebuchet MS", sans-serif`;
  ctx.clearRect(0, 0, TW, TH);
  rr(ctx, 3, 3, TW - 6, TH - 6, 30);
  ctx.fillStyle = "#FFFFFF"; ctx.fill();
  ctx.save(); ctx.clip();
  // title bar
  ctx.fillStyle = "#F3F5F6"; ctx.fillRect(0, 0, TW, 66);
  ctx.fillStyle = RAIL;
  [40, 72, 104].forEach((x) => { ctx.beginPath(); ctx.arc(x, 33, 9, 0, 7); ctx.fill(); });
  rr(ctx, 560, 16, 480, 34, 17); ctx.fillStyle = "#FFFFFF"; ctx.fill();
  ctx.fillStyle = SLATE; ctx.font = f(400, 20); ctx.textAlign = "center";
  ctx.fillText("harbor.example/projects", 800, 40);
  ctx.textAlign = "left";
  // sidebar
  ctx.fillStyle = "#F7F8F9"; ctx.fillRect(0, 66, 300, TH);
  ctx.fillStyle = INK; ctx.font = f(600, 30); ctx.fillText("Harbor", 44, 132);
  const nav = ["Projects", "Deployments", "Logs", "Secrets", "Team", "Settings"];
  nav.forEach((n, i) => {
    const y = 180 + i * 62;
    if (i === 0) { rr(ctx, 28, y, 244, 48, 10); ctx.fillStyle = "#E6EAED"; ctx.fill(); }
    ctx.fillStyle = i === 0 ? INK : SLATE; ctx.font = f(i === 0 ? 500 : 400, 24);
    ctx.fillText(n, 48, y + 32);
  });
  ctx.fillStyle = RAIL; ctx.fillRect(300, 66, 2, TH);
  // heading and primary button
  ctx.fillStyle = INK; ctx.font = f(500, 46); ctx.fillText("Projects", 380, 150);
  rr(ctx, 380, 184, 240, 58, 12); ctx.fillStyle = INK; ctx.fill();
  ctx.fillStyle = "#FFFFFF"; ctx.font = f(500, 24); ctx.fillText("New project", 436, 221);
  // recent list card
  ctx.strokeStyle = RAIL; ctx.lineWidth = 2;
  rr(ctx, 380, 290, 440, 350, 16); ctx.stroke();
  ctx.fillStyle = INK; ctx.font = f(500, 24); ctx.fillText("Recent", 408, 336);
  ["api-gateway", "billing-service", "web-dashboard", "search-index"].forEach((n, i) => {
    const y = 388 + i * 60;
    ctx.fillStyle = "#E6EAED"; ctx.beginPath(); ctx.arc(424, y - 8, 12, 0, 7); ctx.fill();
    ctx.fillStyle = INK; ctx.font = f(400, 22); ctx.fillText(n, 452, y);
    ctx.fillStyle = "#EEF1F3"; rr(ctx, 700, y - 22, 92, 26, 13); ctx.fill();
  });
  // chart card
  rr(ctx, 860, 290, 660, 350, 16); ctx.stroke();
  ctx.fillStyle = INK; ctx.font = f(500, 24); ctx.fillText("Deployments this week", 888, 336);
  const bars = [0.42, 0.6, 0.35, 0.78, 1, 0.55, 0.3];
  bars.forEach((v, i) => {
    const x = 900 + i * 86, h = v * 210;
    rr(ctx, x, 600 - h, 50, h, 8);
    ctx.fillStyle = i === 3 ? KEY : "#C3CCD3"; ctx.fill();
  });
  ctx.fillStyle = SLATE; ctx.font = f(400, 18); ctx.textAlign = "center";
  ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].forEach((d, i) => ctx.fillText(d, 925 + i * 86, 626));
  ctx.textAlign = "left";
  // table
  rr(ctx, 380, 680, 1140, 280, 16); ctx.stroke();
  const rows = [["web-dashboard", "main", "Live"], ["api-gateway", "release-2.4", "Building"], ["billing-service", "main", "Live"], ["search-index", "fix-timeouts", "Queued"]];
  rows.forEach((r, i) => {
    const y = 700 + i * 62;
    if (i === 1) { ctx.fillStyle = "#F1F4F6"; ctx.fillRect(382, y - 4, 1136, 60); }
    ctx.fillStyle = INK; ctx.font = f(i === 1 ? 500 : 400, 22); ctx.fillText(r[0], 412, y + 34);
    ctx.fillStyle = SLATE; ctx.font = f(400, 22); ctx.fillText(r[1], 780, y + 34); ctx.fillText(r[2], 1340, y + 34);
    if (i < 3) { ctx.fillStyle = "#E6EAED"; ctx.fillRect(400, y + 57, 1100, 2); }
  });
  ctx.restore();
  rr(ctx, 3, 3, TW - 6, TH - 6, 30);
  ctx.strokeStyle = "#BCC4CA"; ctx.lineWidth = 3; ctx.stroke();
}

function canvasTex(w: number, h: number, draw: (ctx: CanvasRenderingContext2D) => void) {
  const c = document.createElement("canvas");
  c.width = w; c.height = h;
  const ctx = c.getContext("2d") as CanvasRenderingContext2D;
  draw(ctx);
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  t.minFilter = LinearFilter; t.generateMipmaps = false;
  return { tex: t, ctx, draw };
}

export function createStudioStage(canvas: HTMLCanvasElement, opts: StudioStageOptions = {}): StudioStageHandle | null {
  let renderer: WebGLRenderer;
  try {
    renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true });
  } catch { return null; }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);

  const scene = new Scene();
  const camera = new PerspectiveCamera(32, 1.5, 0.1, 100);

  // soft shadow thrown on the studio wall behind the screen
  const shadow = canvasTex(256, 256, (ctx) => {
    const g = ctx.createRadialGradient(128, 128, 20, 128, 128, 128);
    g.addColorStop(0, "rgba(28,39,51,0.30)"); g.addColorStop(0.6, "rgba(28,39,51,0.10)"); g.addColorStop(1, "rgba(28,39,51,0)");
    ctx.fillStyle = g; ctx.fillRect(0, 0, 256, 256);
  });
  const shadowMesh = new Mesh(new PlaneGeometry(W * 1.7, H * 1.9), new MeshBasicMaterial({ map: shadow.tex, transparent: true, depthWrite: false }));
  shadowMesh.position.set(0.2, -0.7, -1.1);
  scene.add(shadowMesh);

  // the recording itself
  const screen = canvasTex(TW, TH, drawScreen);
  screen.tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
  const screenMesh = new Mesh(new PlaneGeometry(W, H), new MeshBasicMaterial({ map: screen.tex, transparent: true }));
  scene.add(screenMesh);

  // click ripple
  const ring = new Mesh(new RingGeometry(0.82, 1, 48), new MeshBasicMaterial({ color: KEY, transparent: true, opacity: 0, depthWrite: false }));
  ring.position.z = 0.03;
  scene.add(ring);
  const dot = new Mesh(new CircleGeometry(0.07, 24), new MeshBasicMaterial({ color: KEY, transparent: true, opacity: 0, depthWrite: false }));
  dot.position.z = 0.035;
  scene.add(dot);

  // cursor: white-edged ink arrow, tip at local origin
  const arrow = (s: number) => {
    const sh = new Shape();
    sh.moveTo(0, 0); sh.lineTo(0, -0.34 * s); sh.lineTo(0.09 * s, -0.26 * s); sh.lineTo(0.15 * s, -0.4 * s);
    sh.lineTo(0.2 * s, -0.378 * s); sh.lineTo(0.14 * s, -0.24 * s); sh.lineTo(0.25 * s, -0.24 * s); sh.lineTo(0, 0);
    return new ShapeGeometry(sh);
  };
  const cursorEdge = new Mesh(arrow(1.22), new MeshBasicMaterial({ color: 0xffffff, side: DoubleSide }));
  const cursorFill = new Mesh(arrow(1), new MeshBasicMaterial({ color: INK, side: DoubleSide }));
  cursorEdge.position.set(-0.022, 0.03, 0.06); cursorFill.position.set(0, 0, 0.07);
  const cursor = new Mesh();
  cursor.add(cursorEdge); cursor.add(cursorFill);
  scene.add(cursor);

  // webcam bubble floating in front of the recording
  const pipShadow = new Mesh(new CircleGeometry(0.62, 48), new MeshBasicMaterial({ color: INK, transparent: true, opacity: 0.14, depthWrite: false }));
  pipShadow.position.set(2.5, -1.4, 0.02);
  scene.add(pipShadow);
  const pip = canvasTex(256, 256, (ctx) => {
    ctx.clearRect(0, 0, 256, 256);
    ctx.beginPath(); ctx.arc(128, 128, 126, 0, 7); ctx.fillStyle = "#FFFFFF"; ctx.fill();
    ctx.save(); ctx.beginPath(); ctx.arc(128, 128, 114, 0, 7); ctx.clip();
    ctx.fillStyle = "#3A4A5A"; ctx.fillRect(0, 0, 256, 256);
    ctx.fillStyle = "#C9CFD4";
    ctx.beginPath(); ctx.arc(128, 106, 40, 0, 7); ctx.fill();
    ctx.beginPath(); ctx.ellipse(128, 236, 84, 78, 0, 0, 7); ctx.fill();
    ctx.restore();
  });
  const pipMesh = new Mesh(new PlaneGeometry(1.1, 1.1), new MeshBasicMaterial({ map: pip.tex, transparent: true }));
  pipMesh.position.set(2.45, -1.3, 0.38);
  scene.add(pipMesh);

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => { drawScreen(screen.ctx); screen.tex.needsUpdate = true; render(); });
  }

  let progress = 0, playing = false, raf = 0, last = 0, aspect = 1.5, disposed = false;
  let tween: { from: number; to: number; t: number; dur: number } | null = null;
  const listeners: StudioStageListener[] = [];
  const duration = opts.duration || 12;
  const a = new Vector3(), b = new Vector3();

  function apply() {
    const n = POSES.length - 1;
    const x = clamp01(progress) * n;
    const i = Math.min(n - 1, Math.floor(x));
    const s = x - i;
    const e = ease(clamp01((s - 0.12) / 0.76));
    const pull = aspect < 1.35 ? Math.min(2.1, 1.35 / aspect) : 1;
    const p0 = POSES[i], p1 = POSES[i + 1];
    a.set(lerp(p0.look[0], p1.look[0], e), lerp(p0.look[1], p1.look[1], e), 0);
    b.set(lerp(p0.pos[0], p1.pos[0], e), lerp(p0.pos[1], p1.pos[1], e), lerp(p0.pos[2], p1.pos[2], e));
    b.sub(a).multiplyScalar(pull).add(a);
    camera.position.copy(b);
    camera.lookAt(a);
    // cursor glides to the next click a little ahead of the camera
    const ce = ease(clamp01((s - 0.04) / 0.52));
    const c0 = CURSOR[i], c1 = CURSOR[i + 1];
    cursor.position.set(lerp(c0[0], c1[0], ce), lerp(c0[1], c1[1], ce), 0);
    // click ripple when the cursor lands (no click on the final pull back)
    const k = i < n - 1 ? clamp01((s - 0.56) / 0.4) : 0;
    const on = k > 0 && k < 1;
    ring.position.x = dot.position.x = c1[0]; ring.position.y = dot.position.y = c1[1];
    const sc = 0.12 + k * 0.5;
    ring.scale.set(sc, sc, 1);
    ring.material.opacity = on ? 1 - k : 0;
    dot.material.opacity = on ? Math.min(1, (1 - k) * 2) : 0;
  }

  function render() {
    if (disposed) return;
    apply();
    renderer.render(scene, camera);
  }

  function emit() { listeners.forEach((fn) => fn(progress, playing)); }

  function tick(now: number) {
    raf = 0;
    if (disposed) return;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (tween) {
      tween.t += dt / tween.dur;
      const k = ease(clamp01(tween.t));
      progress = lerp(tween.from, tween.to, k);
      if (tween.t >= 1) tween = null;
    } else if (playing) {
      progress += dt / duration;
      if (progress >= 1) { progress = 1; playing = false; }
    }
    render(); emit();
    if (playing || tween) loop();
  }
  function loop() { if (!raf) { last = performance.now(); raf = requestAnimationFrame(tick); } }

  function resize() {
    const box = canvas.parentElement || canvas;
    const w = Math.max(1, box.clientWidth), h = Math.max(1, box.clientHeight);
    aspect = w / h;
    renderer.setSize(w, h, false);
    camera.aspect = aspect; camera.updateProjectionMatrix();
    render();
  }
  let ro: ResizeObserver | null = null;
  if (typeof ResizeObserver !== "undefined") { ro = new ResizeObserver(resize); ro.observe(canvas.parentElement || canvas); }
  window.addEventListener("resize", resize);
  if (typeof opts.start === "number") progress = clamp01(opts.start);
  resize();

  return {
    duration,
    getProgress: () => progress,
    isPlaying: () => playing,
    setProgress(p: number) { tween = null; playing = false; progress = clamp01(p); render(); emit(); },
    play() { tween = null; if (progress >= 1) progress = 0; playing = true; emit(); loop(); },
    pause() { playing = false; tween = null; emit(); },
    animateTo(p: number, seconds?: number) { playing = false; tween = { from: progress, to: clamp01(p), t: 0, dur: seconds || 1.6 }; loop(); },
    onUpdate(fn: StudioStageListener) { listeners.push(fn); },
    dispose() {
      disposed = true; if (raf) cancelAnimationFrame(raf); if (ro) ro.disconnect();
      window.removeEventListener("resize", resize); renderer.dispose();
    },
  };
}

