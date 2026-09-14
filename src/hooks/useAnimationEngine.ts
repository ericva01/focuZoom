"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { ClickEvent, ClickTarget, CursorPoint, CanvasConfig } from "@/types/editor";
import { applyEasing, getClampedCameraCenter, sineEaseInOut, cubicEaseInOut, clamp } from "@/utils/easing";

interface CameraState {
  scale: number;
  camX: number;
  camY: number;
  isZoomed: boolean;
  activeEvent: ClickEvent | null;
}

/**
 * Evaluates the cursor position (x, y) at a specific time:
 * 1. Using real recorded cursor trajectory if available.
 * 2. Or smoothly gliding between sequential click targets.
 */
function sampleCursorTrajectory(
  effectiveTime: number,
  event: ClickEvent
): { x: number; y: number } {
  const baseTargetX = typeof event.x === "number" ? event.x : 0.5;
  const baseTargetY = typeof event.y === "number" ? event.y : 0.5;

  // 1. If event has a recorded cursor trajectory attached to it
  if (event.cursorTrail && event.cursorTrail.length > 0) {
    const trail = event.cursorTrail;
    const originX = trail[0].x;
    const originY = trail[0].y;
    const dx = baseTargetX - originX;
    const dy = baseTargetY - originY;

    if (effectiveTime <= trail[0].timestamp) {
      return {
        x: clamp(trail[0].x + dx, 0.02, 0.98),
        y: clamp(trail[0].y + dy, 0.02, 0.98),
      };
    }
    if (effectiveTime >= trail[trail.length - 1].timestamp) {
      const last = trail[trail.length - 1];
      return {
        x: clamp(last.x + dx, 0.02, 0.98),
        y: clamp(last.y + dy, 0.02, 0.98),
      };
    }

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
    const idx0 = Math.max(0, low - 1);
    const idx1 = Math.min(trail.length - 1, low);
    if (idx0 === idx1) {
      return {
        x: clamp(trail[idx0].x + dx, 0.02, 0.98),
        y: clamp(trail[idx0].y + dy, 0.02, 0.98),
      };
    }

    const p0 = trail[idx0];
    const p1 = trail[idx1];
    const span = p1.timestamp - p0.timestamp;
    if (span <= 0.0001) {
      return {
        x: clamp(p0.x + dx, 0.02, 0.98),
        y: clamp(p0.y + dy, 0.02, 0.98),
      };
    }

    const p = (effectiveTime - p0.timestamp) / span;
    const smoothP = clamp(p, 0, 1);
    const interpX = p0.x + (p1.x - p0.x) * smoothP + dx;
    const interpY = p0.y + (p1.y - p0.y) * smoothP + dy;
    return {
      x: clamp(interpX, 0.02, 0.98),
      y: clamp(interpY, 0.02, 0.98),
    };
  }

  // 2. Sequential click targets (clustered clicks)
  if (event.targets && event.targets.length > 0) {
    const seqTargets = event.targets;
    const originX = seqTargets[0].x;
    const originY = seqTargets[0].y;
    const dx = baseTargetX - originX;
    const dy = baseTargetY - originY;

    if (seqTargets.length === 1) {
      return { x: baseTargetX, y: baseTargetY };
    }

    if (effectiveTime <= seqTargets[0].timestamp) {
      return {
        x: clamp(seqTargets[0].x + dx, 0.02, 0.98),
        y: clamp(seqTargets[0].y + dy, 0.02, 0.98),
      };
    }
    if (effectiveTime >= seqTargets[seqTargets.length - 1].timestamp) {
      const last = seqTargets[seqTargets.length - 1];
      return {
        x: clamp(last.x + dx, 0.02, 0.98),
        y: clamp(last.y + dy, 0.02, 0.98),
      };
    }

    for (let i = 0; i < seqTargets.length - 1; i++) {
      const tA = seqTargets[i].timestamp;
      const tB = seqTargets[i + 1].timestamp;
      if (effectiveTime >= tA && effectiveTime <= tB) {
        const segSpan = tB - tA;
        if (segSpan <= 0.001) {
          return {
            x: clamp(seqTargets[i].x + dx, 0.02, 0.98),
            y: clamp(seqTargets[i].y + dy, 0.02, 0.98),
          };
        }
        const p = (effectiveTime - tA) / segSpan;
        const smoothP = cubicEaseInOut(clamp(p, 0, 1));
        const interpX = seqTargets[i].x + (seqTargets[i + 1].x - seqTargets[i].x) * smoothP + dx;
        const interpY = seqTargets[i].y + (seqTargets[i + 1].y - seqTargets[i].y) * smoothP + dy;
        return {
          x: clamp(interpX, 0.02, 0.98),
          y: clamp(interpY, 0.02, 0.98),
        };
      }
    }

    const lastTarget = seqTargets[seqTargets.length - 1];
    return {
      x: clamp(lastTarget.x + dx, 0.02, 0.98),
      y: clamp(lastTarget.y + dy, 0.02, 0.98),
    };
  }

  // 3. Single discrete keyframe target point
  return { x: baseTargetX, y: baseTargetY };
}

export function useAnimationEngine(
  videoRef: React.RefObject<HTMLVideoElement>,
  canvasRef: React.RefObject<HTMLCanvasElement>,
  events: ClickEvent[],
  config: CanvasConfig,
  cursorTrail?: CursorPoint[]
) {
  const cameraRef = useRef({
    scale: 1.0,
    camX: 0.5,
    camY: 0.5,
  });

  const smoothedTimeRef = useRef(0);
  const lastPerfTimeRef = useRef(0);
  const lastStateUpdateRef = useRef(0);
  const lastZoomedRef = useRef(false);
  const customBgImgRef = useRef<HTMLImageElement | null>(null);
  const customBgUrlRef = useRef<string | null>(null);

  const [cameraState, setCameraState] = useState<CameraState>({
    scale: 1.0,
    camX: 0.5,
    camY: 0.5,
    isZoomed: false,
    activeEvent: null,
  });

  // Main Render Loop
  useEffect(() => {
    let animationFrameId: number;

    // Background gradient / solid / transparent drawer
    const drawBackground = (
      ctx: CanvasRenderingContext2D,
      width: number,
      height: number
    ) => {
      // 1. Transparent background mode
      if (config.backgroundType === "transparent") {
        return; // Pixels remain completely clear (alpha: 0)
      }

      // 2. Solid color mode
      if (config.backgroundType === "solid") {
        ctx.fillStyle = config.solidBackgroundColor || "#06402B";
        ctx.fillRect(0, 0, width, height);
        return;
      }

      // 3. Custom image background mode
      if (config.backgroundType === "image" && config.customBackgroundImage) {
        if (customBgUrlRef.current !== config.customBackgroundImage) {
          customBgUrlRef.current = config.customBackgroundImage;
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.src = config.customBackgroundImage;
          customBgImgRef.current = img;
        }

        if (customBgImgRef.current && customBgImgRef.current.complete && customBgImgRef.current.naturalWidth > 0) {
          ctx.drawImage(customBgImgRef.current, 0, 0, width, height);
          return;
        }
      }

      // 3. Gradient presets mode
      switch (config.backgroundPreset) {
        case "mesh-purple": {
          const grad = ctx.createRadialGradient(width * 0.5, height * 0.2, 50, width * 0.5, height * 0.5, width * 0.8);
          grad.addColorStop(0, "#2e1065");
          grad.addColorStop(0.4, "#1e1b4b");
          grad.addColorStop(0.8, "#0f172a");
          grad.addColorStop(1, "#08090d");
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, width, height);

          const glow = ctx.createRadialGradient(width * 0.8, height * 0.8, 10, width * 0.8, height * 0.8, 400);
          glow.addColorStop(0, "rgba(168, 85, 247, 0.25)");
          glow.addColorStop(1, "transparent");
          ctx.fillStyle = glow;
          ctx.fillRect(0, 0, width, height);
          break;
        }
        case "cosmic-blue": {
          const grad = ctx.createRadialGradient(width * 0.3, height * 0.3, 40, width * 0.5, height * 0.5, width * 0.85);
          grad.addColorStop(0, "#0369a1");
          grad.addColorStop(0.4, "#1e3a8a");
          grad.addColorStop(0.8, "#090d1f");
          grad.addColorStop(1, "#06070a");
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, width, height);
          break;
        }
        case "obsidian-dark": {
          const grad = ctx.createRadialGradient(width * 0.5, height * 0.3, 20, width * 0.5, height * 0.5, width * 0.9);
          grad.addColorStop(0, "#1c2237");
          grad.addColorStop(0.5, "#101422");
          grad.addColorStop(1, "#07080d");
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, width, height);
          break;
        }
        case "emerald-matrix": {
          const grad = ctx.createRadialGradient(width * 0.5, height * 0.4, 30, width * 0.5, height * 0.5, width * 0.7);
          grad.addColorStop(0, "#064e3b");
          grad.addColorStop(0.5, "#022c22");
          grad.addColorStop(1, "#040807");
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, width, height);
          break;
        }
        case "midnight-titanium": {
          const grad = ctx.createLinearGradient(0, 0, width, height);
          grad.addColorStop(0, "#334155");
          grad.addColorStop(0.3, "#1e293b");
          grad.addColorStop(0.7, "#0f172a");
          grad.addColorStop(1, "#020617");
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, width, height);
          break;
        }
        case "aurora-glow": {
          const grad = ctx.createLinearGradient(0, 0, width, height);
          grad.addColorStop(0, "#042f2e");
          grad.addColorStop(0.3, "#064e3b");
          grad.addColorStop(0.7, "#0f172a");
          grad.addColorStop(1, "#06080e");
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, width, height);

          const accent = ctx.createRadialGradient(width * 0.6, height * 0.3, 20, width * 0.6, height * 0.3, 350);
          accent.addColorStop(0, "rgba(20, 184, 166, 0.28)");
          accent.addColorStop(1, "transparent");
          ctx.fillStyle = accent;
          ctx.fillRect(0, 0, width, height);
          break;
        }
        case "sunset": {
          const grad = ctx.createLinearGradient(0, 0, width, height);
          grad.addColorStop(0, "#4c0519");
          grad.addColorStop(0.4, "#451a03");
          grad.addColorStop(0.8, "#18181b");
          grad.addColorStop(1, "#09090b");
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, width, height);

          const orangeGlow = ctx.createRadialGradient(width * 0.5, height * 0.1, 20, width * 0.5, height * 0.1, 400);
          orangeGlow.addColorStop(0, "rgba(244, 63, 94, 0.3)");
          orangeGlow.addColorStop(1, "transparent");
          ctx.fillStyle = orangeGlow;
          ctx.fillRect(0, 0, width, height);
          break;
        }
        case "hyper-neon": {
          const grad = ctx.createLinearGradient(0, 0, width, height);
          grad.addColorStop(0, "#083344");
          grad.addColorStop(0.3, "#164e63");
          grad.addColorStop(0.7, "#701a75");
          grad.addColorStop(1, "#4a044e");
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, width, height);

          const cyanGlow = ctx.createRadialGradient(width * 0.2, height * 0.2, 10, width * 0.2, height * 0.2, 450);
          cyanGlow.addColorStop(0, "rgba(251, 113, 133, 0.35)");
          cyanGlow.addColorStop(1, "transparent");
          ctx.fillStyle = cyanGlow;
          ctx.fillRect(0, 0, width, height);
          break;
        }
        case "solar-flare": {
          const grad = ctx.createLinearGradient(0, 0, width, height);
          grad.addColorStop(0, "#7c2d12");
          grad.addColorStop(0.4, "#991b1b");
          grad.addColorStop(0.7, "#450a0a");
          grad.addColorStop(1, "#0f0505");
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, width, height);
          break;
        }
        case "pastel-dream": {
          const grad = ctx.createLinearGradient(0, 0, width, height);
          grad.addColorStop(0, "#312e81");
          grad.addColorStop(0.4, "#4c1d95");
          grad.addColorStop(0.7, "#831843");
          grad.addColorStop(1, "#0f172a");
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, width, height);
          break;
        }
        default: {
          if (config.customGradientFrom && config.customGradientTo) {
            const grad = ctx.createLinearGradient(0, 0, width, height);
            grad.addColorStop(0, config.customGradientFrom);
            grad.addColorStop(1, config.customGradientTo);
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, width, height);
          }
          break;
        }
      }
    };

    // Custom Cursor and Ripple Drawer
    const drawCursorAndRipples = (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      t: number,
      activeEvent: ClickEvent | null,
      currentScale: number = 1,
      targets: ClickTarget[] = [],
      frameW: number = 0,
      frameH: number = 0
    ) => {
      if (activeEvent && config.showRipple) {
        const rippleDuration = 0.8;
        const checkList = targets.length > 0 ? targets : [activeEvent];
        for (const tgt of checkList) {
          const clickDelta = t - tgt.timestamp;
          if (clickDelta >= 0 && clickDelta < rippleDuration) {
            const progress = clickDelta / rippleDuration;
            const fade = 1 - progress;
            const ripX = frameW > 0 ? (tgt.x - 0.5) * frameW : x;
            const ripY = frameH > 0 ? (tgt.y - 0.5) * frameH : y;

            ctx.save();
            ctx.strokeStyle = config.rippleColor || "#fb7185";

            // Ring 1
            ctx.lineWidth = 2.5 * fade;
            ctx.globalAlpha = fade * 0.8;
            ctx.beginPath();
            ctx.arc(ripX, ripY, 10 + progress * 50, 0, Math.PI * 2);
            ctx.stroke();

            // Ring 2
            ctx.lineWidth = 1.5 * fade;
            ctx.globalAlpha = fade * 0.5;
            ctx.beginPath();
            ctx.arc(ripX, ripY, 5 + progress * 32, 0, Math.PI * 2);
            ctx.stroke();

            // Central Flash Dot
            ctx.fillStyle = "#ffffff";
            ctx.globalAlpha = fade * 0.9;
            ctx.beginPath();
            ctx.arc(ripX, ripY, 4 * fade, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
          }
        }
      }

      if (config.showCursor !== false) {
        ctx.save();
        ctx.translate(x, y);
        if (currentScale > 1) {
          const damp = 1 / Math.pow(currentScale, 0.45);
          ctx.scale(damp, damp);
        }
        const size = config.cursorSize || 20;

        switch (config.cursorStyle) {
          case "neon-dot": {
            ctx.shadowColor = config.cursorColor || "#fb7185";
            ctx.shadowBlur = 12;
            ctx.fillStyle = config.cursorColor || "#fb7185";
            ctx.beginPath();
            ctx.arc(0, 0, size * 0.4, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = "#ffffff";
            ctx.beginPath();
            ctx.arc(0, 0, size * 0.18, 0, Math.PI * 2);
            ctx.fill();
            break;
          }
          case "cyber-ring": {
            ctx.shadowColor = config.cursorColor || "#fb7185";
            ctx.shadowBlur = 8;
            ctx.strokeStyle = config.cursorColor || "#fb7185";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(0, 0, size * 0.5, 0, Math.PI * 2);
            ctx.stroke();

            ctx.fillStyle = "#ffffff";
            ctx.beginPath();
            ctx.arc(0, 0, 3, 0, Math.PI * 2);
            ctx.fill();
            break;
          }
          case "crosshair": {
            ctx.shadowColor = config.cursorColor || "#fb7185";
            ctx.shadowBlur = 6;
            ctx.strokeStyle = config.cursorColor || "#fb7185";
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(0, 0, size * 0.45, 0, Math.PI * 2);
            ctx.moveTo(-size * 0.6, 0);
            ctx.lineTo(size * 0.6, 0);
            ctx.moveTo(0, -size * 0.6);
            ctx.lineTo(0, size * 0.6);
            ctx.stroke();
            break;
          }
          case "macos-arrow":
          default: {
            ctx.shadowColor = "rgba(0,0,0,0.5)";
            ctx.shadowBlur = 6;
            ctx.shadowOffsetY = 2;

            ctx.fillStyle = "#ffffff";
            ctx.strokeStyle = "#090a10";
            ctx.lineWidth = 1.8;
            ctx.lineJoin = "round";

            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(size * 0.6, size * 0.6);
            ctx.lineTo(size * 0.3, size * 0.65);
            ctx.lineTo(size * 0.45, size * 0.95);
            ctx.lineTo(size * 0.3, size * 1.02);
            ctx.lineTo(size * 0.15, size * 0.72);
            ctx.lineTo(0, size * 0.85);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            break;
          }
        }
        ctx.restore();
      }
    };

    const render = () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (!canvas || !video) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      const hasVideo = video.readyState >= 2 && video.videoWidth > 0 && video.videoHeight > 0;
      const width = canvas.width;
      const height = canvas.height;

      // 1. Clear Canvas (keeps transparency if background is transparent)
      ctx.clearRect(0, 0, width, height);
      drawBackground(ctx, width, height);

      if (!hasVideo) {
        ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
        ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
        ctx.lineWidth = 2;
        ctx.setLineDash([8, 8]);
        ctx.beginPath();
        ctx.roundRect(width * 0.1, height * 0.1, width * 0.8, height * 0.8, 16);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = "#94a3b8";
        ctx.font = "16px -apple-system, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("Upload a video or click 'Load Demo Recording' to start", width / 2, height / 2);

        animationFrameId = requestAnimationFrame(render);
        return;
      }

      // 2. Continuous smoothed playhead time
      const now = performance.now();
      if (!lastPerfTimeRef.current) lastPerfTimeRef.current = now;
      const dt = Math.min((now - lastPerfTimeRef.current) / 1000, 0.05);
      lastPerfTimeRef.current = now;

      if (!video.paused && !video.seeking) {
        smoothedTimeRef.current += dt * (video.playbackRate || 1.0);
        const diff = video.currentTime - smoothedTimeRef.current;
        if (Math.abs(diff) > 0.15) {
          smoothedTimeRef.current = video.currentTime;
        } else {
          smoothedTimeRef.current += diff * 0.15;
        }
      } else {
        smoothedTimeRef.current = video.currentTime;
      }
      const t = smoothedTimeRef.current;

      // Identify active zoom event based on current time with smooth gradual transition window
      let targetScale = 1.0;
      let targetCamX = 0.5;
      let targetCamY = 0.5;
      let zoomProgress = 0.0;
      let activeEvent: ClickEvent | null = null;
      let activeTargetX = 0.5;
      let activeTargetY = 0.5;
      let activeTargets: ClickTarget[] = [];

      const enabledEvents = events.filter((e) => e.enabled);

      for (const event of enabledEvents) {
        const zoomInDuration = Math.max(0.15, event.zoomInDuration ?? config.zoomDuration ?? 0.45);
        const holdDuration = Math.max(0.2, event.holdDuration ?? config.zoomHoldDuration ?? 1.2);
        const zoomOutDuration = Math.max(0.15, event.zoomOutDuration ?? config.zoomOutDuration ?? config.zoomDuration ?? 0.45);
        const startTime = event.timestamp; // Begins precisely when keyframe timestamp is hit
        const peakTime = startTime + zoomInDuration;
        const holdEndTime = peakTime + holdDuration;
        const endTime = holdEndTime + zoomOutDuration;

        if (t >= startTime && t <= endTime) {
          activeEvent = event;
          const peakScale = event.zoom || config.defaultZoomScale || 2.2;

          // Multi-target continuous cursor tracking list with user edit offset support
          const originX = event.targets && event.targets.length > 0 ? event.targets[0].x : event.x;
          const originY = event.targets && event.targets.length > 0 ? event.targets[0].y : event.y;
          const dx = (event.x ?? 0.5) - originX;
          const dy = (event.y ?? 0.5) - originY;
          const rawTargets =
            event.targets && event.targets.length > 0
              ? event.targets
              : [{ timestamp: event.timestamp, x: event.x, y: event.y, label: event.label }];
          activeTargets = rawTargets.map((tgt) => ({
            ...tgt,
            x: clamp(tgt.x + dx, 0.02, 0.98),
            y: clamp(tgt.y + dy, 0.02, 0.98),
          }));

          // Dynamically track the cursor position at this exact video frame
          const cursorPosition = sampleCursorTrajectory(t, event);
          activeTargetX = cursorPosition.x;
          activeTargetY = cursorPosition.y;

          if (t < peakTime) {
            const progress = (t - startTime) / zoomInDuration;
            zoomProgress = applyEasing(progress, config.zoomEasing);
          } else if (t <= holdEndTime) {
            zoomProgress = 1.0;
          } else {
            const progress = (t - holdEndTime) / zoomOutDuration;
            zoomProgress = 1.0 - sineEaseInOut(progress);
          }

          zoomProgress = clamp(zoomProgress, 0, 1);
          targetScale = 1.0 + (peakScale - 1.0) * zoomProgress;
          targetCamX = 0.5 + (activeTargetX - 0.5) * zoomProgress;
          targetCamY = 0.5 + (activeTargetY - 0.5) * zoomProgress;
          break;
        }
      }

      // Clamp camera coordinates
      const clamped = getClampedCameraCenter(targetCamX, targetCamY, targetScale);
      targetCamX = clamped.camX;
      targetCamY = clamped.camY;

      // Fast snap to pristine flat overview when at 00:00 or when completely dormant
      if (t <= 0.05 && zoomProgress === 0.0) {
        cameraRef.current.scale = 1.0;
        cameraRef.current.camX = 0.5;
        cameraRef.current.camY = 0.5;
      } else {
        // 3. Smooth camera values with frame-rate independent exponential lerp
        const lerpRate = 18.0;
        const lerpFactor = 1.0 - Math.exp(-lerpRate * dt);
        cameraRef.current.scale += (targetScale - cameraRef.current.scale) * lerpFactor;
        cameraRef.current.camX += (targetCamX - cameraRef.current.camX) * lerpFactor;
        cameraRef.current.camY += (targetCamY - cameraRef.current.camY) * lerpFactor;
      }

      const currentScale = cameraRef.current.scale;
      const currentCamX = cameraRef.current.camX;
      const currentCamY = cameraRef.current.camY;

      // Throttled UI state updates
      const nowMs = performance.now();
      if (nowMs - lastStateUpdateRef.current > 180) {
        lastStateUpdateRef.current = nowMs;
        const isCurrentlyZoomed = targetScale > 1.02;
        if (isCurrentlyZoomed !== lastZoomedRef.current) {
          lastZoomedRef.current = isCurrentlyZoomed;
          setCameraState({
            scale: currentScale,
            camX: currentCamX,
            camY: currentCamY,
            isZoomed: isCurrentlyZoomed,
            activeEvent,
          });
        }
      }

      // 4. Inner Frame with Dynamic Inset (0px to 120px) & Aspect Ratio
      const clampedPad = Math.max(0, Math.min(120, config.padding ?? 36));
      // Dynamic fill factor: 0.96 at 0px padding down to 0.55 at 120px padding
      // At default padding (36px), targetFill is ~0.837 (occupies a healthy 75% to 85% of viewport width)
      // When padding is set to lower values (like 0px to 24px), scales up dynamically to fill canvas
      const targetFill = 0.96 - (clampedPad / 120) * 0.41;
      const availableW = Math.max(10, width * targetFill);
      const availableH = Math.max(10, height * targetFill);

      const videoRatio = video.videoWidth / video.videoHeight;
      let frameW = availableW;
      let frameH = frameW / videoRatio;

      if (frameH > availableH) {
        frameH = availableH;
        frameW = frameH * videoRatio;
      }

      const frameX = (width - frameW) / 2;
      const frameY = (height - frameH) / 2;
      const radius = Math.max(0, Math.min(typeof config.cornerRadius === "number" ? config.cornerRadius : 20, frameW / 2, frameH / 2));

      // 5. Draw Shadow / Glow behind frame
      ctx.save();
      if (config.shadowIntensity !== "none") {
        if (config.shadowIntensity === "neon") {
          ctx.shadowColor = "rgba(251, 113, 133, 0.45)";
          ctx.shadowBlur = 45;
        } else if (config.shadowIntensity === "cinematic") {
          ctx.shadowColor = "rgba(0, 0, 0, 0.85)";
          ctx.shadowBlur = 50;
          ctx.shadowOffsetY = 20;
        } else {
          ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
          ctx.shadowBlur = 24;
          ctx.shadowOffsetY = 10;
        }
      }

      if (config.shadowIntensity !== "none") {
        ctx.fillStyle = "rgba(0, 0, 0, 0.01)";
        ctx.beginPath();
        ctx.roundRect(frameX, frameY, frameW, frameH, radius);
        ctx.fill();
      }
      ctx.restore();

      // 6. Draw Video transformed inside rounded clipping path with True Center Origin
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(frameX, frameY, frameW, frameH, radius);
      ctx.clip();

      // True center point of video frame on the canvas stage
      const centerX = frameX + frameW / 2;
      const centerY = frameY + frameH / 2;

      // Pan offset relative to true center of video (0.5, 0.5)
      // When currentCamX = 0.5, panOffsetX = 0 (perfect center alignment)
      const panOffsetX = -(currentCamX - 0.5) * frameW;
      const panOffsetY = -(currentCamY - 0.5) * frameH;

      ctx.translate(centerX, centerY);
      ctx.scale(currentScale, currentScale);
      ctx.translate(panOffsetX, panOffsetY);

      // Draw HTML5 Video centered at origin (-frameW / 2, -frameH / 2)
      ctx.drawImage(video, -frameW / 2, -frameH / 2, frameW, frameH);

      // 7. Draw Custom Cursor & Ripples relative to true center origin
      if (activeEvent) {
        const cursorTargetX = (activeTargetX - 0.5) * frameW;
        const cursorTargetY = (activeTargetY - 0.5) * frameH;
        drawCursorAndRipples(
          ctx,
          cursorTargetX,
          cursorTargetY,
          t,
          activeEvent,
          currentScale,
          activeTargets,
          frameW,
          frameH
        );
      }

      ctx.restore();

      // 8. Optional Window Bar (macOS Traffic Light Buttons)
      if (config.showWindowBar && radius > 0) {
        const barH = 26;
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(frameX, frameY, frameW, barH, [radius, radius, 0, 0]);
        ctx.fillStyle = "rgba(15, 23, 42, 0.75)";
        ctx.fill();

        // Close dot
        ctx.fillStyle = "#ef4444";
        ctx.beginPath();
        ctx.arc(frameX + 16, frameY + barH / 2, 4.5, 0, Math.PI * 2);
        ctx.fill();

        // Minimize dot
        ctx.fillStyle = "#eab308";
        ctx.beginPath();
        ctx.arc(frameX + 28, frameY + barH / 2, 4.5, 0, Math.PI * 2);
        ctx.fill();

        // Expand dot
        ctx.fillStyle = "#22c55e";
        ctx.beginPath();
        ctx.arc(frameX + 40, frameY + barH / 2, 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // 9. Subtle glass border around video frame
      ctx.save();
      ctx.strokeStyle = config.backgroundType === "transparent" ? "rgba(255, 255, 255, 0.2)" : "rgba(255, 255, 255, 0.12)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(frameX, frameY, frameW, frameH, radius);
      ctx.stroke();
      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameId);
  }, [videoRef, canvasRef, events, config, cursorTrail]);

  const captureSnapshot = useCallback((): string | null => {
    if (!canvasRef.current) return null;
    return canvasRef.current.toDataURL("image/png");
  }, [canvasRef]);

  return {
    cameraState,
    captureSnapshot,
  };
}
