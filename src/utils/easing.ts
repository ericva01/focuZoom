import { EasingType } from "@/types/editor";

export function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

export function cubicEaseOut(t: number): number {
  const p = clamp(t, 0, 1);
  return 1 - Math.pow(1 - p, 3);
}

export function cubicEaseInOut(t: number): number {
  const p = clamp(t, 0, 1);
  return p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
}

export function smoothStep(t: number): number {
  const p = clamp(t, 0, 1);
  return p * p * (3 - 2 * p);
}

/**
 * Perlin's C2-continuous smootherstep: 6t^5 - 15t^4 + 10t^3
 * Zero 1st and 2nd derivatives at t=0 and t=1, completely eliminating acceleration jolts.
 */
export function smootherStep(t: number): number {
  const p = clamp(t, 0, 1);
  return p * p * p * (p * (p * 6 - 15) + 10);
}

export function quinticEaseInOut(t: number): number {
  const p = clamp(t, 0, 1);
  return p < 0.5 ? 16 * p * p * p * p * p : 1 - Math.pow(-2 * p + 2, 5) / 2;
}

export function sineEaseInOut(t: number): number {
  const p = clamp(t, 0, 1);
  return -(Math.cos(Math.PI * p) - 1) / 2;
}

export function sineEaseOut(t: number): number {
  const p = clamp(t, 0, 1);
  return Math.sin((p * Math.PI) / 2);
}

export function springEase(t: number): number {
  const p = clamp(t, 0, 1);
  if (p >= 1) return 1;
  // Overdamped smooth harmonic spring with zero high-frequency jitter
  return 1 - Math.exp(-5.5 * p) * Math.cos(p * Math.PI * 1.5);
}

export function applyEasing(t: number, type: EasingType): number {
  switch (type) {
    case "cubic-out":
      return cubicEaseInOut(t);
    case "spring":
      return springEase(t);
    case "smooth-step":
      return smootherStep(t);
    case "linear":
      return clamp(t, 0, 1);
    default:
      return smootherStep(t);
  }
}

/**
 * Formats seconds into MM:SS.ms (e.g. 01:23.45)
 */
export function formatTimecode(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return "00:00.00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 100);
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}.${ms.toString().padStart(2, "0")}`;
}

/**
 * Computes camera pan bounds so video does not show gaps when zoomed
 */
export function getClampedCameraCenter(
  targetX: number, // 0.0 to 1.0
  targetY: number, // 0.0 to 1.0
  scale: number
): { camX: number; camY: number } {
  if (scale <= 1.001) {
    return { camX: 0.5, camY: 0.5 };
  }
  // Allow full reach to left/right/top/bottom edges for true cursor tracking
  const margin = Math.max(0.04, 0.35 / scale);
  const minX = margin;
  const maxX = 1 - margin;
  const minY = margin;
  const maxY = 1 - margin;

  return {
    camX: clamp(targetX, minX, maxX),
    camY: clamp(targetY, minY, maxY),
  };
}
