"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { ClickEvent, ClickTarget, CursorPoint, CanvasConfig, FramePreset } from "@/types/editor";
import { applyEasing, sineEaseInOut, cubicEaseInOut, clamp } from "@/utils/easing";

interface ThreeCameraState {
  scale: number;
  camX: number;
  camY: number;
  isZoomed: boolean;
  activeEvent: ClickEvent | null;
  dollyDistance: number;
}

/**
 * Evaluates the cursor position (x, y) at a specific time:
 * 1. Using real recorded cursor trajectory if available (anchored to event.x, event.y).
/**
 * Critically-damped spring follower (SmoothDamp)
 * Gradually changes a value towards a desired goal over time, with zero initial jolt and smooth deceleration.
 */
function smoothDamp(
  current: number,
  target: number,
  vel: { current: number },
  smoothTime: number,
  deltaTime: number,
  maxSpeed = Infinity
): number {
  smoothTime = Math.max(0.0001, smoothTime);
  const omega = 2 / smoothTime;
  const x = omega * deltaTime;
  const exp = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x);
  let change = current - target;
  const originalTo = target;

  const maxChange = maxSpeed * smoothTime;
  change = clamp(change, -maxChange, maxChange);
  const tempTarget = current - change;

  const temp = (vel.current + omega * change) * deltaTime;
  vel.current = (vel.current - omega * temp) * exp;
  let output = tempTarget + (change + temp) * exp;

  if ((originalTo - current > 0) === (output > originalTo)) {
    output = originalTo;
    vel.current = (output - originalTo) / Math.max(0.0001, deltaTime);
  }
  return output;
}

/**
 * Samples a continuous cursor trajectory using Catmull-Rom cubic spline interpolation
 * across adjacent neighbor points [pPrev, p0, p1, pNext] for smooth velocity curves.
 */
function sampleTrajectoryFromPoints(
  effectiveTime: number,
  trail: CursorPoint[]
): { x: number; y: number } {
  if (!trail || trail.length === 0) return { x: 0.5, y: 0.5 };
  if (trail.length === 1) return { x: trail[0].x, y: trail[0].y };

  if (effectiveTime <= trail[0].timestamp) {
    return {
      x: clamp(trail[0].x, 0.02, 0.98),
      y: clamp(trail[0].y, 0.02, 0.98),
    };
  }
  if (effectiveTime >= trail[trail.length - 1].timestamp) {
    const last = trail[trail.length - 1];
    return {
      x: clamp(last.x, 0.02, 0.98),
      y: clamp(last.y, 0.02, 0.98),
    };
  }

  // Binary search to find segment
  let low = 0;
  let high = trail.length - 1;
  while (low <= high) {
    const mid = (low + high) >> 1;
    if (trail[mid].timestamp < effectiveTime) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  const idx1 = Math.max(1, Math.min(trail.length - 1, low));
  const idx0 = idx1 - 1;
  const p0 = trail[idx0];
  const p1 = trail[idx1];
  const span = p1.timestamp - p0.timestamp;
  if (span <= 0.0001) {
    return {
      x: clamp(p0.x, 0.02, 0.98),
      y: clamp(p0.y, 0.02, 0.98),
    };
  }

  const tNorm = clamp((effectiveTime - p0.timestamp) / span, 0, 1);

  // Smooth Catmull-Rom spline interpolation with 4 control points [pPrev, p0, p1, pNext]
  const pPrev = idx0 > 0 ? trail[idx0 - 1] : p0;
  const pNext = idx1 < trail.length - 1 ? trail[idx1 + 1] : p1;

  const interpCatmullRom = (v0: number, v1: number, v2: number, v3: number, u: number) => {
    const u2 = u * u;
    const u3 = u2 * u;
    return 0.5 * (
      (2 * v1) +
      (-v0 + v2) * u +
      (2 * v0 - 5 * v1 + 4 * v2 - v3) * u2 +
      (-v0 + 3 * v1 - 3 * v2 + v3) * u3
    );
  };

  const smoothX = interpCatmullRom(pPrev.x, p0.x, p1.x, pNext.x, tNorm);
  const smoothY = interpCatmullRom(pPrev.y, p0.y, p1.y, pNext.y, tNorm);

  return {
    x: clamp(smoothX, 0.02, 0.98),
    y: clamp(smoothY, 0.02, 0.98),
  };
}

/**
 * Evaluates the cursor position (x, y) at a specific time:
 * 1. Using real recorded cursor trajectory if available (event.cursorTrail or global cursorTrail).
 * 2. Or smoothly gliding between sequential click targets (clustered clicks) in advance of each click.
 * 3. Or returning the exact target position (event.x, event.y).
 */
function sampleCursorTrajectory(
  effectiveTime: number,
  event: ClickEvent,
  globalTrail?: CursorPoint[]
): { x: number; y: number } {
  const baseTargetX = typeof event.x === "number" ? event.x : 0.5;
  const baseTargetY = typeof event.y === "number" ? event.y : 0.5;

  // 1. If event has its own recorded cursor trajectory attached
  if (event.cursorTrail && event.cursorTrail.length > 0) {
    return sampleTrajectoryFromPoints(effectiveTime, event.cursorTrail);
  }

  // 2. If global recording cursor trajectory is provided
  if (globalTrail && globalTrail.length > 0) {
    return sampleTrajectoryFromPoints(effectiveTime, globalTrail);
  }

  // 3. Sequential click targets (clustered clicks)
  if (event.targets && event.targets.length > 0) {
    const seqTargets = event.targets;
    if (seqTargets.length === 1) {
      return { x: seqTargets[0].x, y: seqTargets[0].y };
    }

    if (effectiveTime <= seqTargets[0].timestamp) {
      return {
        x: clamp(seqTargets[0].x, 0.02, 0.98),
        y: clamp(seqTargets[0].y, 0.02, 0.98),
      };
    }
    if (effectiveTime >= seqTargets[seqTargets.length - 1].timestamp) {
      const last = seqTargets[seqTargets.length - 1];
      return {
        x: clamp(last.x, 0.02, 0.98),
        y: clamp(last.y, 0.02, 0.98),
      };
    }

    for (let i = 0; i < seqTargets.length - 1; i++) {
      const tA = seqTargets[i].timestamp;
      const tB = seqTargets[i + 1].timestamp;
      if (effectiveTime >= tA && effectiveTime <= tB) {
        const segSpan = tB - tA;
        if (segSpan <= 0.001) {
          return {
            x: clamp(seqTargets[i].x, 0.02, 0.98),
            y: clamp(seqTargets[i].y, 0.02, 0.98),
          };
        }
        // Pan in advance towards target B so camera is already centered on the target at click timestamp tB
        const panDuration = Math.min(0.8, segSpan * 0.75);
        const panStartTime = tB - panDuration;
        if (effectiveTime < panStartTime) {
          // Hold at target A
          return {
            x: clamp(seqTargets[i].x, 0.02, 0.98),
            y: clamp(seqTargets[i].y, 0.02, 0.98),
          };
        }
        const p = (effectiveTime - panStartTime) / panDuration;
        const smoothP = cubicEaseInOut(clamp(p, 0, 1));
        const interpX = seqTargets[i].x + (seqTargets[i + 1].x - seqTargets[i].x) * smoothP;
        const interpY = seqTargets[i].y + (seqTargets[i + 1].y - seqTargets[i].y) * smoothP;
        return {
          x: clamp(interpX, 0.02, 0.98),
          y: clamp(interpY, 0.02, 0.98),
        };
      }
    }

    const lastTarget = seqTargets[seqTargets.length - 1];
    return {
      x: clamp(lastTarget.x, 0.02, 0.98),
      y: clamp(lastTarget.y, 0.02, 0.98),
    };
  }

  // 4. Single discrete keyframe target point
  return { x: baseTargetX, y: baseTargetY };
}

export function useThreeAnimationEngine(
  videoRef: React.RefObject<HTMLVideoElement>,
  canvasRef: React.RefObject<HTMLCanvasElement>,
  videoSrc: string | null,
  events: ClickEvent[],
  config: CanvasConfig,
  mousePosRef: React.RefObject<{ x: number; y: number }>,
  cursorTrail?: CursorPoint[]
) {
  const [cameraState, setCameraState] = useState<ThreeCameraState>({
    scale: 1.0,
    camX: 0.5,
    camY: 0.5,
    isZoomed: false,
    activeEvent: null,
    dollyDistance: 1.95,
  });

  const smoothStateRef = useRef({
    camX: 0,
    camY: 0,
    camZ: 1.95,
    velCamX: 0,
    velCamY: 0,
    velCamZ: 0,
    lookAtX: 0,
    lookAtY: 0,
    lookAtZ: 0,
    velLookX: 0,
    velLookY: 0,
    rotX: 0,
    rotY: 0,
    rotZ: 0,
    haloScale: 0,
    haloOpacity: 0,
    cursorX: 0,
    cursorY: 0,
  });

  // Precise sub-frame timing and throttled React update refs
  const lastEffectiveTimeRef = useRef<number>(0);
  const smoothedTimeRef = useRef<number>(0);
  const lastPerfTimeRef = useRef<number>(0);
  const lastStateUpdateRef = useRef<number>(0);
  const lastZoomedRef = useRef<boolean>(false);
  const lastScaleRef = useRef<number>(1.0);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const screenMeshRef = useRef<THREE.Mesh | null>(null);
  const bezelMeshRef = useRef<THREE.Mesh | null>(null);
  const shadowMeshRef = useRef<THREE.Mesh | null>(null);
  const shadowTexRef = useRef<THREE.CanvasTexture | null>(null);
  const backdropMeshRef = useRef<THREE.Mesh | null>(null);
  const haloMeshRef = useRef<THREE.Mesh | null>(null);
  const haloMatRef = useRef<THREE.MeshBasicMaterial | null>(null);
  const cursorSpriteRef = useRef<THREE.Sprite | null>(null);
  const cursorMatRef = useRef<THREE.SpriteMaterial | null>(null);
  const screenMatRef = useRef<THREE.MeshPhysicalMaterial | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const raycasterRef = useRef<THREE.Raycaster>(new THREE.Raycaster());
  const lastUploadedVideoTimeRef = useRef<number>(-1);

  // Mutable refs for zero-overhead dynamic updates without tearing down WebGL
  const configRef = useRef(config);
  configRef.current = config;
  const eventsRef = useRef(events);
  eventsRef.current = events;
  const cursorTrailRef = useRef(cursorTrail);
  cursorTrailRef.current = cursorTrail;
  const mousePosRefCurrent = useRef(mousePosRef);
  mousePosRefCurrent.current = mousePosRef;

  // Helper to create rounded rectangle shape in Three.js
  const createRoundedRectShape = (width: number, height: number, radius: number) => {
    const shape = new THREE.Shape();
    const x = -width / 2;
    const y = -height / 2;
    const r = Math.max(0, Math.min(radius, width / 2, height / 2));

    if (r <= 0.0001) {
      shape.moveTo(x, y);
      shape.lineTo(x + width, y);
      shape.lineTo(x + width, y + height);
      shape.lineTo(x, y + height);
      shape.closePath();
      return shape;
    }

    shape.moveTo(x + r, y);
    shape.lineTo(x + width - r, y);
    shape.quadraticCurveTo(x + width, y, x + width, y + r);
    shape.lineTo(x + width, y + height - r);
    shape.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
    shape.lineTo(x + r, y + height);
    shape.quadraticCurveTo(x, y + height, x, y + height - r);
    shape.lineTo(x, y + r);
    shape.quadraticCurveTo(x, y, x + r, y);
    return shape;
  };

  // Helper to generate a background gradient canvas texture
  const createGradientTexture = (preset: FramePreset, customFrom?: string, customTo?: string) => {
    const c = document.createElement("canvas");
    c.width = 1024;
    c.height = 1024;
    const ctx = c.getContext("2d");
    if (!ctx) return new THREE.CanvasTexture(c);

    switch (preset) {
      case "mesh-purple": {
        const grad = ctx.createRadialGradient(512, 300, 50, 512, 512, 700);
        grad.addColorStop(0, "#2e1065");
        grad.addColorStop(0.4, "#1e1b4b");
        grad.addColorStop(0.8, "#0f172a");
        grad.addColorStop(1, "#08090d");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 1024, 1024);

        const glow = ctx.createRadialGradient(800, 800, 20, 800, 800, 450);
        glow.addColorStop(0, "rgba(168, 85, 247, 0.28)");
        glow.addColorStop(1, "transparent");
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, 1024, 1024);
        break;
      }
      case "cosmic-blue": {
        const grad = ctx.createRadialGradient(400, 300, 40, 512, 512, 750);
        grad.addColorStop(0, "#0369a1");
        grad.addColorStop(0.4, "#1e3a8a");
        grad.addColorStop(0.8, "#090d1f");
        grad.addColorStop(1, "#06070a");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 1024, 1024);
        break;
      }
      case "obsidian-dark": {
        const grad = ctx.createRadialGradient(512, 350, 30, 512, 512, 800);
        grad.addColorStop(0, "#1e2438");
        grad.addColorStop(0.5, "#101322");
        grad.addColorStop(1, "#06070a");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 1024, 1024);
        break;
      }
      case "emerald-matrix": {
        const grad = ctx.createRadialGradient(512, 400, 30, 512, 512, 700);
        grad.addColorStop(0, "#064e3b");
        grad.addColorStop(0.5, "#022c22");
        grad.addColorStop(1, "#040807");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 1024, 1024);
        break;
      }
      case "midnight-titanium": {
        const grad = ctx.createLinearGradient(0, 0, 1024, 1024);
        grad.addColorStop(0, "#334155");
        grad.addColorStop(0.3, "#1e293b");
        grad.addColorStop(0.7, "#0f172a");
        grad.addColorStop(1, "#020617");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 1024, 1024);
        break;
      }
      case "aurora-glow": {
        const grad = ctx.createLinearGradient(0, 0, 1024, 1024);
        grad.addColorStop(0, "#042f2e");
        grad.addColorStop(0.3, "#064e3b");
        grad.addColorStop(0.7, "#0f172a");
        grad.addColorStop(1, "#06080e");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 1024, 1024);

        const accent = ctx.createRadialGradient(600, 300, 20, 600, 300, 400);
        accent.addColorStop(0, "rgba(20, 184, 166, 0.3)");
        accent.addColorStop(1, "transparent");
        ctx.fillStyle = accent;
        ctx.fillRect(0, 0, 1024, 1024);
        break;
      }
      case "sunset": {
        const grad = ctx.createLinearGradient(0, 0, 1024, 1024);
        grad.addColorStop(0, "#4c0519");
        grad.addColorStop(0.4, "#451a03");
        grad.addColorStop(0.8, "#18181b");
        grad.addColorStop(1, "#09090b");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 1024, 1024);
        break;
      }
      case "hyper-neon": {
        const grad = ctx.createLinearGradient(0, 0, 1024, 1024);
        grad.addColorStop(0, "#083344");
        grad.addColorStop(0.3, "#164e63");
        grad.addColorStop(0.7, "#701a75");
        grad.addColorStop(1, "#4a044e");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 1024, 1024);

        const cyan = ctx.createRadialGradient(250, 250, 10, 250, 250, 450);
        cyan.addColorStop(0, "rgba(251, 113, 133, 0.4)");
        cyan.addColorStop(1, "transparent");
        ctx.fillStyle = cyan;
        ctx.fillRect(0, 0, 1024, 1024);
        break;
      }
      case "solar-flare": {
        const grad = ctx.createLinearGradient(0, 0, 1024, 1024);
        grad.addColorStop(0, "#7c2d12");
        grad.addColorStop(0.4, "#991b1b");
        grad.addColorStop(0.7, "#450a0a");
        grad.addColorStop(1, "#0f0505");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 1024, 1024);
        break;
      }
      case "pastel-dream": {
        const grad = ctx.createLinearGradient(0, 0, 1024, 1024);
        grad.addColorStop(0, "#312e81");
        grad.addColorStop(0.4, "#4c1d95");
        grad.addColorStop(0.7, "#831843");
        grad.addColorStop(1, "#0f172a");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 1024, 1024);
        break;
      }
      default: {
        const grad = ctx.createLinearGradient(0, 0, 1024, 1024);
        grad.addColorStop(0, customFrom || "#1e1b4b");
        grad.addColorStop(1, customTo || "#fb7185");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 1024, 1024);
        break;
      }
    }

    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  };

  // Helper to create a soft, feathered drop shadow texture with matching rounded corners
  const createSoftShadowTexture = (cornerRadiusNorm: number, shadowType: string) => {
    const c = document.createElement("canvas");
    c.width = 512;
    c.height = 512;
    const ctx = c.getContext("2d");
    if (!ctx) return new THREE.CanvasTexture(c);

    ctx.clearRect(0, 0, 512, 512);

    const isNeon = shadowType === "neon";
    const shadowColor = isNeon ? "rgba(251, 113, 133, 0.7)" : "rgba(0, 0, 0, 0.75)";
    const blurAmount = isNeon ? 36 : shadowType === "cinematic" ? 48 : 28;

    ctx.shadowColor = shadowColor;
    ctx.shadowBlur = blurAmount;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 12;

    const pad = 64;
    const w = 512 - pad * 2;
    const h = 512 - pad * 2;
    const r = Math.max(0, Math.min(w / 2, h / 2, cornerRadiusNorm * 380));

    ctx.fillStyle = shadowColor;
    ctx.beginPath();
    ctx.roundRect(pad, pad, w, h, r);
    ctx.fill();

    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  };

  // Helper to create a sleek 3D pointer cursor sprite with precise hotspot anchor
  const createCursorTexture = (
    style: string,
    color: string
  ): { texture: THREE.CanvasTexture; anchorU: number; anchorV: number } => {
    const c = document.createElement("canvas");
    c.width = 128;
    c.height = 128;
    const ctx = c.getContext("2d");
    if (!ctx) {
      return {
        texture: new THREE.CanvasTexture(c),
        anchorU: 0.5,
        anchorV: 0.5,
      };
    }

    ctx.clearRect(0, 0, 128, 128);
    let anchorU = 0.5;
    let anchorV = 0.5;

    if (style === "neon-dot") {
      ctx.shadowColor = color || "#fb7185";
      ctx.shadowBlur = 18;
      ctx.fillStyle = color || "#fb7185";
      ctx.beginPath();
      ctx.arc(64, 64, 24, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(64, 64, 10, 0, Math.PI * 2);
      ctx.fill();
    } else if (style === "cyber-ring") {
      ctx.strokeStyle = color || "#8b5cf6";
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.arc(64, 64, 30, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(64, 64, 8, 0, Math.PI * 2);
      ctx.fill();
    } else if (style === "crosshair") {
      ctx.strokeStyle = color || "#10b981";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(64, 64, 26, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(64, 20);
      ctx.lineTo(64, 108);
      ctx.moveTo(20, 64);
      ctx.lineTo(108, 64);
      ctx.stroke();
    } else {
      // macOS sleek pointer arrow - hotspot tip at exactly (24, 20)
      anchorU = 24 / 128; // 0.1875
      anchorV = 1 - 20 / 128; // 0.84375

      ctx.shadowColor = "rgba(0, 0, 0, 0.6)";
      ctx.shadowBlur = 12;
      ctx.shadowOffsetY = 4;

      ctx.fillStyle = "#ffffff";
      ctx.strokeStyle = "#090a10";
      ctx.lineWidth = 5;
      ctx.lineJoin = "round";

      ctx.beginPath();
      ctx.moveTo(24, 20);
      ctx.lineTo(84, 80);
      ctx.lineTo(54, 85);
      ctx.lineTo(69, 115);
      ctx.lineTo(54, 122);
      ctx.lineTo(39, 92);
      ctx.lineTo(24, 105);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }

    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return { texture: tex, anchorU, anchorV };
  };

  // Synchronize dynamic background changes without tearing down WebGL
  const updateBackdrop = useCallback((cfg: CanvasConfig) => {
    const scene = sceneRef.current;
    const renderer = rendererRef.current;
    const backdropMesh = backdropMeshRef.current;
    if (!scene || !backdropMesh || !renderer) return;

    if (cfg.backgroundType === "transparent") {
      renderer.setClearColor(0x000000, 0);
      backdropMesh.visible = false;
      return;
    }

    backdropMesh.visible = true;
    const bgMat = backdropMesh.material as THREE.MeshBasicMaterial;

    if (cfg.backgroundType === "solid") {
      const col = new THREE.Color(cfg.solidBackgroundColor || "#06402B");
      renderer.setClearColor(col, 1);
      if (bgMat.map) {
        bgMat.map.dispose();
        bgMat.map = null;
      }
      bgMat.color = col;
      bgMat.needsUpdate = true;
    } else if (cfg.backgroundType === "gradient") {
      renderer.setClearColor(0x06402B, 1);
      if (bgMat.map) bgMat.map.dispose();
      const newTex = createGradientTexture(cfg.backgroundPreset, cfg.customGradientFrom, cfg.customGradientTo);
      bgMat.color.set(0xffffff);
      bgMat.map = newTex;
      bgMat.needsUpdate = true;
    } else if (cfg.backgroundType === "image" && cfg.customBackgroundImage) {
      renderer.setClearColor(0x06402B, 1);
      if (bgMat.map) bgMat.map.dispose();
      const loader = new THREE.TextureLoader();
      const newTex = loader.load(cfg.customBackgroundImage);
      newTex.colorSpace = THREE.SRGBColorSpace;
      bgMat.color.set(0xffffff);
      bgMat.map = newTex;
      bgMat.needsUpdate = true;
    }
  }, []);

  // Synchronize corner radius and shadow without tearing down WebGL
  const updateCornerRadiusAndShadow = useCallback((cornerRadius: number, shadowIntensity: string) => {
    const screenMesh = screenMeshRef.current;
    const bezelMesh = bezelMeshRef.current;
    const shadowMesh = shadowMeshRef.current;
    if (!screenMesh || !bezelMesh) return;

    const screenW = 2.4;
    const screenH = 1.35;
    const cornerRadiusPx = typeof cornerRadius === "number" ? cornerRadius : 20;
    const radiusNorm = (cornerRadiusPx / 64) * 0.22;

    const screenShape = createRoundedRectShape(screenW, screenH, radiusNorm);
    const newScreenGeo = new THREE.ShapeGeometry(screenShape, 32);

    const posAttr = newScreenGeo.attributes.position;
    const uvs: number[] = [];
    for (let i = 0; i < posAttr.count; i++) {
      const px = posAttr.getX(i);
      const py = posAttr.getY(i);
      uvs.push((px + screenW / 2) / screenW, (py + screenH / 2) / screenH);
    }
    newScreenGeo.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));

    screenMesh.geometry.dispose();
    screenMesh.geometry = newScreenGeo;

    const newBezelGeo = new THREE.ExtrudeGeometry(screenShape, { depth: 0.03, bevelEnabled: false, steps: 1 });
    bezelMesh.geometry.dispose();
    bezelMesh.geometry = newBezelGeo;

    if (shadowMesh) {
      if (shadowIntensity === "none") {
        shadowMesh.visible = false;
      } else {
        if (shadowTexRef.current) shadowTexRef.current.dispose();
        const newShadowTex = createSoftShadowTexture(radiusNorm, shadowIntensity);
        shadowTexRef.current = newShadowTex;
        const sMat = shadowMesh.material as THREE.MeshBasicMaterial;
        sMat.map = newShadowTex;
        sMat.opacity = shadowIntensity === "cinematic" ? 0.7 : shadowIntensity === "neon" ? 0.8 : 0.4;
        sMat.needsUpdate = true;
        shadowMesh.visible = true;
      }
    }
  }, []);

  // Synchronize cursor pointer styling
  const updateCursor = useCallback((style: string, color: string) => {
    const cursorSprite = cursorSpriteRef.current;
    const cursorMat = cursorMatRef.current;
    if (!cursorSprite || !cursorMat) return;

    const cursorInfo = createCursorTexture(style, color);
    if (cursorMat.map) cursorMat.map.dispose();
    cursorMat.map = cursorInfo.texture;
    cursorMat.needsUpdate = true;
    cursorSprite.center.set(cursorInfo.anchorU, cursorInfo.anchorV);
  }, []);

  // Synchronize screen material clearcoat reflections and ripple color
  const updateMaterials = useCallback((cfg: CanvasConfig) => {
    if (screenMatRef.current) {
      const reflectionStrength = cfg.glassReflectionIntensity ?? 0.85;
      screenMatRef.current.clearcoat = 0.9 * reflectionStrength;
      screenMatRef.current.reflectivity = 0.7 * reflectionStrength;
      screenMatRef.current.needsUpdate = true;
    }
    if (haloMatRef.current) {
      haloMatRef.current.color.set(new THREE.Color(cfg.rippleColor || "#fb7185"));
    }
  }, []);

  // Dedicated light effect: only re-applies updated properties to Three.js objects without tearing down WebGL
  useEffect(() => {
    updateBackdrop(configRef.current);
    updateCornerRadiusAndShadow(config.cornerRadius ?? 20, config.shadowIntensity ?? "cinematic");
    updateCursor(config.cursorStyle, config.cursorColor);
    updateMaterials(configRef.current);
  }, [
    config.backgroundType,
    config.backgroundPreset,
    config.customGradientFrom,
    config.customGradientTo,
    config.solidBackgroundColor,
    config.customBackgroundImage,
    config.cornerRadius,
    config.shadowIntensity,
    config.glassReflectionIntensity,
    config.rippleColor,
    config.cursorStyle,
    config.cursorColor,
    updateBackdrop,
    updateCornerRadiusAndShadow,
    updateCursor,
    updateMaterials,
    // eslint-disable-next-line react-hooks/exhaustive-deps
  ]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    let animId: number;

    // 1. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(canvas.width, canvas.height, false);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    // 2. Scene & Perspective Camera
    const scene = new THREE.Scene();
    const aspect = canvas.width / canvas.height;
    const camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 100);

    // Calculate initial camera distance so video occupies ~80-84% by default (or up to 96% at 0px padding)
    const initialPad = Math.max(0, Math.min(120, config.padding ?? 36));
    const initialFill = 0.96 - (initialPad / 120) * 0.41;
    const initVFovRad = (45 * Math.PI) / 180;
    const initTanHalfFov = Math.tan(initVFovRad / 2);
    const initialBaseZ = Math.max(
      2.4 / (2 * initTanHalfFov * aspect * initialFill),
      1.35 / (2 * initTanHalfFov * initialFill)
    );

    camera.position.set(0, 0, initialBaseZ);
    cameraRef.current = camera;
    smoothStateRef.current.camZ = initialBaseZ;

    // 3. Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    // Key Light (Main soft specular caster)
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
    keyLight.position.set(3, 4, 4);
    scene.add(keyLight);

    // Rim / Back Lights (Electric Cyan and Purple for high-end studio gloss)
    const cyanRim = new THREE.PointLight(0x06b6d4, 1.8, 15);
    cyanRim.position.set(-3.5, 2.5, 2.5);
    scene.add(cyanRim);

    const purpleRim = new THREE.PointLight(0xa855f7, 1.4, 15);
    purpleRim.position.set(3.5, -2, 2);
    scene.add(purpleRim);

    // 4. 3D Backdrop / Background Plate (Gradient, Solid, Custom Image, or Transparent)
    let backdropMesh: THREE.Mesh | null = null;
    let customImageTex: THREE.Texture | null = null;

    if (config.backgroundType !== "transparent") {
      let bgTexture: THREE.Texture | null = null;
      if (config.backgroundType === "gradient") {
        bgTexture = createGradientTexture(config.backgroundPreset, config.customGradientFrom, config.customGradientTo);
      } else if (config.backgroundType === "image" && config.customBackgroundImage) {
        customImageTex = new THREE.TextureLoader().load(config.customBackgroundImage);
        customImageTex.colorSpace = THREE.SRGBColorSpace;
        bgTexture = customImageTex;
      }

      const bgGeo = new THREE.PlaneGeometry(60, 60);
      const bgMat = new THREE.MeshBasicMaterial({
        map: bgTexture,
        color: config.backgroundType === "solid" ? new THREE.Color(config.solidBackgroundColor || "#06402B") : 0xffffff,
        depthWrite: false,
      });
      backdropMesh = new THREE.Mesh(bgGeo, bgMat);
      backdropMesh.position.set(0, 0, -2.5);
      scene.add(backdropMesh);
    }

    // 5. 3D Screen Group (Video Plane + Bezel Slab + Drop Shadow + Cursor)
    const screenGroup = new THREE.Group();
    scene.add(screenGroup);

    // Physical dimensions of the floating 3D screen
    const screenW = 2.4;
    const screenH = 1.35; // 16:9 base
    const cornerRadiusPx = typeof config.cornerRadius === "number" ? config.cornerRadius : 20;
    // Map 0px -> 0.0 (sharp square), 64px -> 0.22 (smooth pill radius)
    const radiusNorm = (cornerRadiusPx / 64) * 0.22;

    // Create front video screen mesh with rounded corners
    const screenShape = createRoundedRectShape(screenW, screenH, radiusNorm);
    const screenGeo = new THREE.ShapeGeometry(screenShape, 32);

    // Compute proper UV mapping for the video texture
    const posAttr = screenGeo.attributes.position;
    const uvs = [];
    for (let i = 0; i < posAttr.count; i++) {
      const px = posAttr.getX(i);
      const py = posAttr.getY(i);
      const u = (px + screenW / 2) / screenW;
      const v = (py + screenH / 2) / screenH;
      uvs.push(u, v);
    }
    screenGeo.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));

    // Video Texture
    const videoTexture = new THREE.VideoTexture(video);
    videoTexture.colorSpace = THREE.SRGBColorSpace;
    videoTexture.minFilter = THREE.LinearFilter;
    videoTexture.magFilter = THREE.LinearFilter;
    videoTexture.generateMipmaps = false;

    // Luxury Screen Material (Clearcoat Glass Sheen + Specular Reflections)
    const reflectionStrength = config.glassReflectionIntensity ?? 0.85;
    const screenMat = new THREE.MeshPhysicalMaterial({
      map: videoTexture,
      roughness: 0.18,
      metalness: 0.05,
      clearcoat: 0.9 * reflectionStrength,
      clearcoatRoughness: 0.08,
      reflectivity: 0.7 * reflectionStrength,
      transparent: true,
    });

    const screenMesh = new THREE.Mesh(screenGeo, screenMat);
    screenMesh.visible = false; // Hidden until video is verified readyState >= 2
    screenMeshRef.current = screenMesh;
    screenGroup.add(screenMesh);

    // Beveled Backing / Metal Chassis Slab (strictly flush with screenShape, no hard black bulge)
    const bezelExtrudeSettings = {
      depth: 0.03,
      bevelEnabled: false, // Flush geometry ensures zero dark borders poke out of rounded corners
      steps: 1,
    };
    const bezelGeo = new THREE.ExtrudeGeometry(screenShape, bezelExtrudeSettings);
    const bezelMat = new THREE.MeshStandardMaterial({
      color: 0x181c2e,
      metalness: 0.85,
      roughness: 0.25,
      transparent: true,
      opacity: 0.7,
    });
    const bezelMesh = new THREE.Mesh(bezelGeo, bezelMat);
    bezelMesh.position.z = -0.045;
    bezelMesh.visible = false;
    screenGroup.add(bezelMesh);

    // Ambient 3D Drop Shadow with Soft Feathered Edges (NO hard black rectangle)
    let shadowMesh: THREE.Mesh | null = null;
    let shadowTex: THREE.CanvasTexture | null = null;
    if (config.shadowIntensity !== "none") {
      const shadowGeo = new THREE.PlaneGeometry(screenW * 1.35, screenH * 1.35);
      shadowTex = createSoftShadowTexture(radiusNorm, config.shadowIntensity);
      const shadowOpacity =
        config.shadowIntensity === "cinematic"
          ? 0.7
          : config.shadowIntensity === "neon"
          ? 0.8
          : 0.4;

      const shadowMat = new THREE.MeshBasicMaterial({
        map: shadowTex,
        transparent: true,
        opacity: shadowOpacity,
        depthWrite: false,
      });
      shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
      shadowMesh.position.set(0, -0.04, -0.08);
      shadowMesh.visible = false;
      screenGroup.add(shadowMesh);
    }

    // 6. 3D Animated Halo Ring on Click Events
    const haloGeo = new THREE.RingGeometry(0.01, 0.08, 48);
    const haloColor = new THREE.Color(config.rippleColor || "#fb7185");
    const haloMat = new THREE.MeshBasicMaterial({
      color: haloColor,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const haloMesh = new THREE.Mesh(haloGeo, haloMat);
    haloMesh.position.z = 0.012;
    screenGroup.add(haloMesh);

    // 7. 3D Cursor Sprite with accurate hotspot anchor
    const cursorInfo = createCursorTexture(config.cursorStyle, config.cursorColor);
    const cursorMat = new THREE.SpriteMaterial({
      map: cursorInfo.texture,
      transparent: true,
      depthWrite: false,
    });
    const cursorSprite = new THREE.Sprite(cursorMat);
    cursorSprite.center.set(cursorInfo.anchorU, cursorInfo.anchorV);
    const cursorScale = (config.cursorSize || 22) / 220;
    cursorSprite.scale.set(cursorScale, cursorScale, 1);
    cursorSprite.position.z = 0.018;
    screenGroup.add(cursorSprite);

    // Save Three.js object references for zero-teardown dynamic synchronization
    rendererRef.current = renderer;
    sceneRef.current = scene;
    screenMeshRef.current = screenMesh;
    bezelMeshRef.current = bezelMesh;
    shadowMeshRef.current = shadowMesh;
    shadowTexRef.current = shadowTex;
    backdropMeshRef.current = backdropMesh;
    haloMeshRef.current = haloMesh;
    haloMatRef.current = haloMat;
    cursorSpriteRef.current = cursorSprite;
    cursorMatRef.current = cursorMat;
    screenMatRef.current = screenMat;

    // Video event listeners ensuring immediate GPU texture upload upon load or seek
    const handleVideoEvent = () => {
      lastUploadedVideoTimeRef.current = -1;
      if (videoTexture) {
        videoTexture.needsUpdate = true;
      }
    };
    video.addEventListener("loadeddata", handleVideoEvent);
    video.addEventListener("loadedmetadata", handleVideoEvent);
    video.addEventListener("canplay", handleVideoEvent);
    video.addEventListener("seeked", handleVideoEvent);
    video.addEventListener("playing", handleVideoEvent);

    // Main 60 FPS Render Loop
    const clock = new THREE.Clock();

    const render = () => {
      const now = performance.now();
      if (!lastPerfTimeRef.current) lastPerfTimeRef.current = now;
      const dt = Math.min((now - lastPerfTimeRef.current) / 1000, 0.05);
      lastPerfTimeRef.current = now;

      clock.getDelta();
      const t = clock.getElapsedTime();

      // Frame-accurate playhead time directly locked to the active video frame
      // Eliminates the progressive 150-300ms drift and delay over long recordings
      const effectiveTime = video.currentTime;
      smoothedTimeRef.current = effectiveTime;

      // Dynamically sync WebGL buffer size, camera frustum, and aspect ratio on every frame
      const currentCanvasAspect = canvas.width / canvas.height;
      if (
        Math.abs(camera.aspect - currentCanvasAspect) > 0.001 ||
        renderer.domElement.width !== canvas.width ||
        renderer.domElement.height !== canvas.height
      ) {
        camera.aspect = currentCanvasAspect;
        camera.updateProjectionMatrix();
        renderer.setSize(canvas.width, canvas.height, false);
      }

      // Update Video Texture strictly when video is actively ready (readyState >= 2)
      const isVideoReady =
        video.readyState >= 2 &&
        video.videoWidth > 0 &&
        video.videoHeight > 0;

      let screenW = 2.4;
      let screenH = 1.35;

      if (isVideoReady) {
        // Upload to GPU when playing, scrubbing, or on initial load / state change (lastUploadedVideoTimeRef.current === -1)
        const isPlaying = !video.paused && !video.ended;
        const timeChanged = Math.abs(video.currentTime - lastUploadedVideoTimeRef.current) > 0.0005;
        if (isPlaying || timeChanged || lastUploadedVideoTimeRef.current === -1) {
          videoTexture.needsUpdate = true;
          lastUploadedVideoTimeRef.current = video.currentTime;
        }
        screenMesh.visible = true;
        if (bezelMesh) bezelMesh.visible = true;
        if (shadowMesh) shadowMesh.visible = true;

        // Dynamic aspect ratio scaling to match recorded laptop video frame
        const videoRatio = video.videoWidth / video.videoHeight;
        if (videoRatio >= 1.0) {
          screenW = 2.4;
          screenH = 2.4 / videoRatio;
        } else {
          screenH = 1.8;
          screenW = 1.8 * videoRatio;
        }

        const scaleX = screenW / 2.4;
        const scaleY = screenH / 1.35;
        screenMesh.scale.set(scaleX, scaleY, 1);
        if (bezelMesh) bezelMesh.scale.set(scaleX, scaleY, 1);
        if (shadowMesh) shadowMesh.scale.set(scaleX, scaleY, 1);
      } else {
        // When video is not ready, keep screen hidden so the background gradient renders cleanly without any black rectangle
        screenMesh.visible = false;
        if (bezelMesh) bezelMesh.visible = false;
        if (shadowMesh) shadowMesh.visible = false;
      }

      // 1. Identify Active Zoom / Keyframe Event with Smooth Transition Window
      let targetDollyScale = 1.0;
      let targetFocalX = 0.5;
      let targetFocalY = 0.5;
      let zoomProgress = 0.0;
      let activeEvent: ClickEvent | null = null;
      let activeTargetX = 0.5;
      let activeTargetY = 0.5;
      let activeTargets: ClickTarget[] = [];

      // Read mutable refs for zero-overhead dynamic updates without tearing down WebGL
      const curEvents = eventsRef.current;
      const curConfig = configRef.current;
      const curCursorTrail = cursorTrailRef.current;

      // Zero-heap allocation loop across keyframe events
      for (let i = 0; i < curEvents.length; i++) {
        const event = curEvents[i];
        if (!event.enabled) continue;

        const zoomInDuration = Math.max(0.15, event.zoomInDuration ?? curConfig.zoomDuration ?? 0.45);
        const holdDuration = Math.max(0.2, event.holdDuration ?? curConfig.zoomHoldDuration ?? 1.2);
        const zoomOutDuration = Math.max(0.15, event.zoomOutDuration ?? curConfig.zoomOutDuration ?? curConfig.zoomDuration ?? 0.45);
        const startTime = event.timestamp; // Begins precisely when the keyframe timestamp is hit
        const peakTime = startTime + zoomInDuration;
        const holdEndTime = peakTime + holdDuration;
        const endTime = holdEndTime + zoomOutDuration;

        if (effectiveTime >= startTime && effectiveTime <= endTime) {
          activeEvent = event;
          const peakScale = event.zoom || curConfig.defaultZoomScale || 2.2;

          activeTargets =
            event.targets && event.targets.length > 0
              ? event.targets
              : [{ timestamp: event.timestamp, x: event.x, y: event.y, label: event.label }];

          // Dynamically track the cursor position at this exact video frame
          const cursorPosition = sampleCursorTrajectory(effectiveTime, event, curCursorTrail);
          activeTargetX = cursorPosition.x;
          activeTargetY = cursorPosition.y;

          if (effectiveTime < peakTime) {
            // Smooth acceleration into initial zoom target
            const prog = (effectiveTime - startTime) / zoomInDuration;
            zoomProgress = applyEasing(prog, curConfig.zoomEasing);
          } else if (effectiveTime <= holdEndTime) {
            // Steady hold at peak zoom magnification - DO NOT ZOOM OUT BETWEEN CLICKS!
            // Camera smoothly glides and follows the cursor wherever it moves
            zoomProgress = 1.0;
          } else {
            // Smooth deceleration easing back to wide view after the entire sequence ends
            const prog = (effectiveTime - holdEndTime) / zoomOutDuration;
            zoomProgress = 1.0 - sineEaseInOut(prog);
          }

          zoomProgress = clamp(zoomProgress, 0, 1);
          targetDollyScale = 1.0 + (peakScale - 1.0) * zoomProgress;
          targetFocalX = 0.5 + (activeTargetX - 0.5) * zoomProgress;
          targetFocalY = 0.5 + (activeTargetY - 0.5) * zoomProgress;
          break;
        }
      }

      // Convert focal point to 3D screen plane coordinates with sub-pixel precision
      const focus3DX = (targetFocalX - 0.5) * screenW;
      const focus3DY = -(targetFocalY - 0.5) * screenH;

      // 2. Physical 3D Camera Dolly Zoom & Dynamic Viewport Sizing
      const clampedPad = Math.max(0, Math.min(120, curConfig.padding ?? 36));
      // Dynamic fill factor: 0.96 at 0px padding down to 0.55 at 120px padding
      const targetFill = 0.96 - (clampedPad / 120) * 0.41;

      const vFovRad = (camera.fov * Math.PI) / 180;
      const tanHalfFov = Math.tan(vFovRad / 2);
      const curAspect = currentCanvasAspect;

      const zForWidth = screenW / (2 * tanHalfFov * curAspect * targetFill);
      const zForHeight = screenH / (2 * tanHalfFov * targetFill);
      const baseZ = Math.max(zForWidth, zForHeight);

      const targetZ = baseZ / targetDollyScale;

      // Dynamic Cursor Tracking: Camera moves directly to the user's cursor position
      // Clamped to 48% of screen boundaries so it never drifts into empty space while fully reaching the edges
      const maxReachX = screenW * 0.48;
      const maxReachY = screenH * 0.48;
      const targetCamX = clamp(focus3DX, -maxReachX, maxReachX);
      const targetCamY = clamp(focus3DY, -maxReachY, maxReachY);

      const targetLookX = targetCamX;
      const targetLookY = targetCamY;

      // Frame seek or sudden jump detection to snap camera immediately without lag
      const timeDelta = Math.abs(effectiveTime - lastEffectiveTimeRef.current);
      const isSeek = timeDelta > 0.35;
      lastEffectiveTimeRef.current = effectiveTime;

      if (isSeek || (effectiveTime <= 0.05 && zoomProgress === 0.0)) {
        smoothStateRef.current.camX = targetCamX;
        smoothStateRef.current.camY = targetCamY;
        smoothStateRef.current.camZ = targetZ;
        smoothStateRef.current.lookAtX = targetLookX;
        smoothStateRef.current.lookAtY = targetLookY;
        smoothStateRef.current.velCamX = 0;
        smoothStateRef.current.velCamY = 0;
        smoothStateRef.current.velCamZ = 0;
        smoothStateRef.current.velLookX = 0;
        smoothStateRef.current.velLookY = 0;
      } else {
        // Silky smooth critically damped spring follower
        const camSmoothTime = zoomProgress > 0.05 ? 0.20 : 0.26;
        const velXObj = { current: smoothStateRef.current.velCamX };
        const velYObj = { current: smoothStateRef.current.velCamY };
        const velZObj = { current: smoothStateRef.current.velCamZ };
        const velLookXObj = { current: smoothStateRef.current.velLookX };
        const velLookYObj = { current: smoothStateRef.current.velLookY };

        smoothStateRef.current.camX = smoothDamp(
          smoothStateRef.current.camX,
          targetCamX,
          velXObj,
          camSmoothTime,
          dt
        );
        smoothStateRef.current.camY = smoothDamp(
          smoothStateRef.current.camY,
          targetCamY,
          velYObj,
          camSmoothTime,
          dt
        );
        smoothStateRef.current.camZ = smoothDamp(
          smoothStateRef.current.camZ,
          targetZ,
          velZObj,
          camSmoothTime,
          dt
        );
        smoothStateRef.current.lookAtX = smoothDamp(
          smoothStateRef.current.lookAtX,
          targetLookX,
          velLookXObj,
          camSmoothTime,
          dt
        );
        smoothStateRef.current.lookAtY = smoothDamp(
          smoothStateRef.current.lookAtY,
          targetLookY,
          velLookYObj,
          camSmoothTime,
          dt
        );

        smoothStateRef.current.velCamX = velXObj.current;
        smoothStateRef.current.velCamY = velYObj.current;
        smoothStateRef.current.velCamZ = velZObj.current;
        smoothStateRef.current.velLookX = velLookXObj.current;
        smoothStateRef.current.velLookY = velLookYObj.current;
      }

      camera.position.set(
        smoothStateRef.current.camX,
        smoothStateRef.current.camY,
        smoothStateRef.current.camZ
      );
      camera.lookAt(
        smoothStateRef.current.lookAtX,
        smoothStateRef.current.lookAtY,
        0
      );

      // 3. Organic 3D Floating / Breathing Hover Animation (optional)
      let floatY = 0;
      let floatRotX = 0;
      let floatRotY = 0;

      if (curConfig.enableFloatingMotion) {
        floatY = Math.sin(t * 1.5) * 0.032;
        floatRotX = Math.sin(t * 1.1) * 0.016;
        floatRotY = Math.cos(t * 0.8) * 0.022;
      }

      // 4. Interactive Mouse Parallax (optional)
      let parallaxRotX = 0;
      let parallaxRotY = 0;

      const activeMousePos = mousePosRefCurrent.current?.current;
      if (curConfig.enableMouseParallax && activeMousePos) {
        const pIntensity = curConfig.mouseParallaxIntensity ?? 0.65;
        parallaxRotY = activeMousePos.x * 0.18 * pIntensity;
        parallaxRotX = -activeMousePos.y * 0.12 * pIntensity;
      }

      // 5. Dynamic 3D Cursor Tracking Tilt:
      // When user clicks on the left side, the 3D plane tilts toward the left.
      // When user clicks on the right, it tilts toward the right.
      const cursorDeltaX = targetFocalX - 0.5;
      const cursorDeltaY = targetFocalY - 0.5;
      // Corrected 3D tilt: clicking left tilts the left side forward; clicking right tilts the right side forward
      const cursorTrackingYaw = cursorDeltaX * 0.35;
      const cursorTrackingPitch = -cursorDeltaY * 0.22;
      const cursorTrackingRoll = cursorDeltaX * 0.05;

      // Evaluate 3D angle preset specifically for the active zoom event so editing one effect doesn't distort all
      const effectiveAnglePreset =
        (activeEvent && activeEvent.screenAnglePreset) ||
        curConfig.screenAnglePreset ||
        "studio-front";

      let eventPitch = 0;
      let eventYaw = 0;
      let eventRoll = 0;
      let allow3DTilt = true;

      switch (effectiveAnglePreset) {
        case "simple-smooth":
          // Pure, smooth flat zoom in and zoom out without any 3D angle tilt or skew
          eventPitch = 0;
          eventYaw = 0;
          eventRoll = 0;
          allow3DTilt = false;
          break;
        case "studio-front":
          eventPitch = 0;
          eventYaw = 0;
          eventRoll = 0;
          allow3DTilt = true;
          break;
        case "isometric":
          eventPitch = 0.18;
          eventYaw = -0.25;
          eventRoll = 0.06;
          allow3DTilt = true;
          break;
        case "cinematic-slant":
          eventPitch = 0.1;
          eventYaw = 0.15;
          eventRoll = -0.03;
          allow3DTilt = true;
          break;
        case "floating-dynamic":
          eventPitch = 0.04;
          eventYaw = -0.06;
          eventRoll = 0.01;
          allow3DTilt = true;
          break;
        default:
          eventPitch = 0;
          eventYaw = 0;
          eventRoll = 0;
          allow3DTilt = true;
      }

      const activePitch = allow3DTilt ? cursorTrackingPitch : 0;
      const activeYaw = allow3DTilt ? cursorTrackingYaw : 0;
      const activeRoll = allow3DTilt ? cursorTrackingRoll : 0;
      const activeFloatX = allow3DTilt ? floatRotX : 0;
      const activeFloatY = allow3DTilt ? floatRotY : 0;

      const finalRotX = (eventPitch + activeFloatX + parallaxRotX + activePitch) * zoomProgress;
      const finalRotY = (eventYaw + activeFloatY + parallaxRotY + activeYaw) * zoomProgress;
      const finalRotZ = (eventRoll + activeRoll) * zoomProgress;
      const currentFloatY = (allow3DTilt ? floatY : 0) * zoomProgress;

      // Fast snap to pristine flat overview when at 00:00 or when completely dormant
      if (effectiveTime <= 0.05 && zoomProgress === 0.0) {
        smoothStateRef.current.camX = 0;
        smoothStateRef.current.camY = 0;
        smoothStateRef.current.camZ = baseZ;
        smoothStateRef.current.lookAtX = 0;
        smoothStateRef.current.lookAtY = 0;
        smoothStateRef.current.rotX = 0;
        smoothStateRef.current.rotY = 0;
        smoothStateRef.current.rotZ = 0;
      } else {
        const rotLerpFactor = 1.0 - Math.exp(-10.0 * dt);
        smoothStateRef.current.rotX += (finalRotX - smoothStateRef.current.rotX) * rotLerpFactor;
        smoothStateRef.current.rotY += (finalRotY - smoothStateRef.current.rotY) * rotLerpFactor;
        smoothStateRef.current.rotZ += (finalRotZ - smoothStateRef.current.rotZ) * rotLerpFactor;
      }

      screenGroup.rotation.set(
        smoothStateRef.current.rotX,
        smoothStateRef.current.rotY,
        smoothStateRef.current.rotZ
      );
      screenGroup.position.y = currentFloatY;

      // 5. 3D Cursor & Animated Luminous Halo Rings (Rock-solid transformed alignment)
      if (activeEvent && zoomProgress > 0.02) {
        const evX = (activeTargetX - 0.5) * screenW;
        const evY = -(activeTargetY - 0.5) * screenH;

        cursorSprite.visible = curConfig.showCursor !== false;
        cursorSprite.position.set(evX, evY, 0.022);

        // Maintain sharp, natural cursor scale during camera dolly zoom
        const baseCursorScale = (curConfig.cursorSize || 22) / 220;
        const distFactor = Math.pow(smoothStateRef.current.camZ / baseZ, 0.65);
        const dynamicScale = baseCursorScale * distFactor;
        cursorSprite.scale.set(dynamicScale, dynamicScale, 1);

        // Click Ripple Wave calculation across all sequential click targets
        const haloDuration = 0.85;
        let activeHaloTarget: ClickTarget | null = null;
        let activeDelta = 999;

        const checkTargets = activeTargets.length > 0 ? activeTargets : [activeEvent];
        for (const tgt of checkTargets) {
          const delta = effectiveTime - tgt.timestamp;
          if (delta >= 0 && delta < haloDuration && delta < activeDelta) {
            activeDelta = delta;
            activeHaloTarget = tgt;
          }
        }

        if (activeHaloTarget && curConfig.showRipple) {
          const prog = activeDelta / haloDuration;
          const fade = 1.0 - prog;
          const hX = (activeHaloTarget.x - 0.5) * screenW;
          const hY = -(activeHaloTarget.y - 0.5) * screenH;

          haloMesh.visible = true;
          haloMesh.position.set(hX, hY, 0.015);
          haloMesh.scale.set(1 + prog * 4.5, 1 + prog * 4.5, 1);
          haloMat.opacity = fade * 0.85;
        } else {
          haloMesh.visible = false;
        }
      } else {
        cursorSprite.visible = false;
        haloMesh.visible = false;
      }

      // 6. Render the 3D Scene
      if (curConfig.backgroundType === "transparent") {
        renderer.setClearColor(0x000000, 0);
        if (backdropMesh) backdropMesh.visible = false;
      } else if (curConfig.backgroundType === "solid") {
        renderer.setClearColor(new THREE.Color(curConfig.solidBackgroundColor || "#06402B"), 1);
        if (backdropMesh) backdropMesh.visible = true;
      } else {
        renderer.setClearColor(0x06402B, 1);
        if (backdropMesh) backdropMesh.visible = true;
      }

      renderer.render(scene, camera);

      // Throttled UI state updates (only update React state on meaningful change to avoid GC pauses)
      const nowMs = performance.now();
      if (nowMs - lastStateUpdateRef.current > 180) {
        lastStateUpdateRef.current = nowMs;
        const isCurrentlyZoomed = targetDollyScale > 1.02;
        if (
          isCurrentlyZoomed !== lastZoomedRef.current ||
          Math.abs(lastScaleRef.current - targetDollyScale) > 0.03
        ) {
          lastZoomedRef.current = isCurrentlyZoomed;
          lastScaleRef.current = targetDollyScale;
          setCameraState({
            scale: targetDollyScale,
            camX: targetFocalX,
            camY: targetFocalY,
            isZoomed: isCurrentlyZoomed,
            activeEvent,
            dollyDistance: smoothStateRef.current.camZ,
          });
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      renderer.dispose();
      screenGeo.dispose();
      screenMat.dispose();
      bezelGeo.dispose();
      bezelMat.dispose();
      haloGeo.dispose();
      haloMat.dispose();
      videoTexture.dispose();
      cursorMat.dispose();
      if (customImageTex) {
        customImageTex.dispose();
      }
      if (backdropMesh) {
        backdropMesh.geometry.dispose();
        if (Array.isArray(backdropMesh.material)) {
          backdropMesh.material.forEach((m) => m.dispose());
        } else {
          backdropMesh.material.dispose();
        }
      }
      if (shadowMesh) {
        shadowMesh.geometry.dispose();
        (shadowMesh.material as THREE.Material).dispose();
      }
      if (shadowTex) {
        shadowTex.dispose();
      }
      video.removeEventListener("loadeddata", handleVideoEvent);
      video.removeEventListener("loadedmetadata", handleVideoEvent);
      video.removeEventListener("canplay", handleVideoEvent);
      video.removeEventListener("seeked", handleVideoEvent);
      video.removeEventListener("playing", handleVideoEvent);
      rendererRef.current = null;
      sceneRef.current = null;
      screenMeshRef.current = null;
      bezelMeshRef.current = null;
      shadowMeshRef.current = null;
      shadowTexRef.current = null;
      backdropMeshRef.current = null;
      haloMeshRef.current = null;
      haloMatRef.current = null;
      cursorSpriteRef.current = null;
      cursorMatRef.current = null;
      screenMatRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoRef, canvasRef, videoSrc]);

  const captureSnapshot = useCallback((): string | null => {
    if (!canvasRef.current) return null;
    return canvasRef.current.toDataURL("image/png");
  }, [canvasRef]);

  // Raycasts from 2D canvas mouse coords to the exact 3D video frame UV texture space
  const getVideoCoordinatesAtCanvasPos = useCallback(
    (clientX: number, clientY: number): { x: number; y: number } | null => {
      const canvas = canvasRef.current;
      const camera = cameraRef.current;
      const screenMesh = screenMeshRef.current;
      if (!canvas || !camera || !screenMesh) return null;

      const rect = canvas.getBoundingClientRect();
      const ndcX = ((clientX - rect.left) / rect.width) * 2 - 1;
      const ndcY = -(((clientY - rect.top) / rect.height) * 2 - 1);

      raycasterRef.current.setFromCamera(new THREE.Vector2(ndcX, ndcY), camera);
      const intersects = raycasterRef.current.intersectObject(screenMesh, false);

      if (intersects.length > 0 && intersects[0].uv) {
        const uv = intersects[0].uv;
        return {
          x: Math.max(0.02, Math.min(0.98, Math.round(uv.x * 1000) / 1000)),
          y: Math.max(0.02, Math.min(0.98, Math.round((1.0 - uv.y) * 1000) / 1000)),
        };
      }

      const rawX = (clientX - rect.left) / rect.width;
      const rawY = (clientY - rect.top) / rect.height;
      return {
        x: Math.max(0.05, Math.min(0.95, Math.round(rawX * 1000) / 1000)),
        y: Math.max(0.05, Math.min(0.95, Math.round(rawY * 1000) / 1000)),
      };
    },
    [canvasRef]
  );

  return {
    cameraState,
    captureSnapshot,
    getVideoCoordinatesAtCanvasPos,
  };
}
