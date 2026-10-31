"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Sliders, Camera, ZoomIn, Play, Sparkles, Move, Eye } from "lucide-react";

export function ThreeCameraPlayground() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [tiltAngle, setTiltAngle] = useState<number>(24);
  const [zoomLevel, setZoomLevel] = useState<number>(2.0);
  const [smoothing, setSmoothing] = useState<number>(0.08);
  const [activeFocalPoint, setActiveFocalPoint] = useState<string>("Code Editor");
  const [autoOrbit, setAutoOrbit] = useState<boolean>(true);

  // References for render loop
  const tiltRef = useRef<number>(tiltAngle);
  tiltRef.current = tiltAngle;

  const zoomRef = useRef<number>(zoomLevel);
  zoomRef.current = zoomLevel;

  const smoothingRef = useRef<number>(smoothing);
  smoothingRef.current = smoothing;

  const autoOrbitRef = useRef<boolean>(autoOrbit);
  autoOrbitRef.current = autoOrbit;

  const focalTargetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const setTarget = (name: string, x: number, y: number) => {
    setActiveFocalPoint(name);
    focalTargetRef.current = { x, y };
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    try {
      const test = document.createElement("canvas");
      if (!window.WebGLRenderingContext || (!test.getContext("webgl") && !test.getContext("experimental-webgl"))) {
        return;
      }
    } catch {
      return;
    }

    let isVisible = true;
    let animId: number;
    const clock = new THREE.Clock();

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / Math.max(container.clientHeight, 1),
      0.1,
      100
    );
    camera.position.set(0, 0, 7.5);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current || undefined,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.8));

    // Lighting
    const amb = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(amb);

    const dir = new THREE.DirectionalLight(0xffedd5, 2.5);
    dir.position.set(4, 8, 6);
    scene.add(dir);

    const point = new THREE.PointLight(0xff6b2c, 3, 15);
    point.position.set(-4, -2, 3);
    scene.add(point);

    // 3D Canvas Mockup
    const stageGroup = new THREE.Group();
    scene.add(stageGroup);

    // Layer 1: Base Screen Board
    const boardGeo = new THREE.BoxGeometry(5.2, 3.2, 0.12);
    const boardMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.8,
      roughness: 0.25,
    });
    const board = new THREE.Mesh(boardGeo, boardMat);
    stageGroup.add(board);

    // Layer 2: Floating UI Panels
    const panelGeo = new THREE.PlaneGeometry(2.3, 2.6);
    const panelMat1 = new THREE.MeshBasicMaterial({
      color: 0x1e293b,
      transparent: true,
      opacity: 0.9,
    });
    const panel1 = new THREE.Mesh(panelGeo, panelMat1);
    panel1.position.set(-1.25, 0, 0.08);
    stageGroup.add(panel1);

    const panelMat2 = new THREE.MeshBasicMaterial({
      color: 0x111c33,
      transparent: true,
      opacity: 0.9,
    });
    const panel2 = new THREE.Mesh(panelGeo, panelMat2);
    panel2.position.set(1.25, 0, 0.08);
    stageGroup.add(panel2);

    // Layer 3: Glowing Focal Target Rings
    const ringGeo = new THREE.RingGeometry(0.2, 0.25, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xff6b2c,
      side: THREE.DoubleSide,
    });
    const focusRing = new THREE.Mesh(ringGeo, ringMat);
    focusRing.position.set(0, 0, 0.16);
    stageGroup.add(focusRing);

    // Subtle 3D Wireframe Frustum
    const frustumGeo = new THREE.ConeGeometry(0.8, 1.4, 4, 1, true);
    const frustumMat = new THREE.MeshBasicMaterial({
      color: 0xff6b2c,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const frustum = new THREE.Mesh(frustumGeo, frustumMat);
    frustum.rotation.x = -Math.PI / 2;
    frustum.position.set(0, 0, 1.8);
    stageGroup.add(frustum);

    // Resize Observer
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = Math.max(container.clientHeight, 1);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(container);

    const intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        isVisible = entry.isIntersecting;
      });
    }, { threshold: 0.05, rootMargin: "150px" });
    intersectionObserver.observe(container);

    let angle = 0;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (!isVisible) return;

      const delta = clock.getDelta();
      const currentSmoothing = smoothingRef.current;

      if (autoOrbitRef.current) {
        angle += delta * 0.4;
      }

      // Smooth target interpolation
      const tx = focalTargetRef.current.x;
      const ty = focalTargetRef.current.y;
      focusRing.position.x += (tx - focusRing.position.x) * currentSmoothing;
      focusRing.position.y += (ty - focusRing.position.y) * currentSmoothing;
      focusRing.scale.setScalar(1 + Math.sin(clock.getElapsedTime() * 4) * 0.12);

      // Frustum orientation
      frustum.position.x = focusRing.position.x;
      frustum.position.y = focusRing.position.y;

      // 3D Tilt calculation
      const radTilt = (tiltRef.current * Math.PI) / 180;
      const targetRotX = -radTilt * 0.7;
      const targetRotY = (autoOrbitRef.current ? Math.sin(angle) * 0.35 : 0) + (radTilt * 0.4);

      stageGroup.rotation.x += (targetRotX - stageGroup.rotation.x) * currentSmoothing;
      stageGroup.rotation.y += (targetRotY - stageGroup.rotation.y) * currentSmoothing;

      // Camera dolly zoom
      const targetDist = 7.5 / Math.max(1, zoomRef.current * 0.6);
      camera.position.z += (targetDist - camera.position.z) * currentSmoothing;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();

      boardGeo.dispose();
      boardMat.dispose();
      panelGeo.dispose();
      panelMat1.dispose();
      panelMat2.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      frustumGeo.dispose();
      frustumMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <section className="relative overflow-hidden bg-white py-20 border-y border-[#E5E7EB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF1E8] border border-[#FF6B2C]/20 text-xs font-semibold text-[#FF6B2C] mb-4">
            <Sparkles size={13} />
            <span>Interactive 3D Technology</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#111318]">
            Directly test our <span className="text-[#FF6B2C]">3D Camera Physics</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#667085]">
            Adjust the live Three.js camera parameters below to feel how FucuFlow simulates silky cinematic dollies and tilts.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Controls Panel (Left) */}
          <div className="lg:col-span-5 bg-[#F8F9FB] p-6 sm:p-8 rounded-3xl border border-[#E5E7EB] space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#E5E7EB]">
              <div className="flex items-center gap-2 font-bold text-[#111318]">
                <Sliders size={18} className="text-[#FF6B2C]" />
                <span>3D Dolly Parameters</span>
              </div>
              <button
                type="button"
                onClick={() => setAutoOrbit(!autoOrbit)}
                className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-all cursor-pointer ${
                  autoOrbit
                    ? "bg-[#FFF1E8] text-[#FF6B2C] border-[#FF6B2C]/30"
                    : "bg-white text-[#667085] border-[#E5E7EB]"
                }`}
              >
                {autoOrbit ? "Auto Orbit: On" : "Auto Orbit: Off"}
              </button>
            </div>

            {/* Slider 1: Tilt Angle */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold text-[#111318]">
                <span className="flex items-center gap-1.5">
                  <Move size={13} className="text-[#FF6B2C]" />
                  <span>3D Tilt Angle</span>
                </span>
                <span className="font-mono text-[#FF6B2C]">{tiltAngle}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="45"
                step="1"
                value={tiltAngle}
                onChange={(e) => setTiltAngle(Number(e.target.value))}
                className="w-full accent-[#FF6B2C] cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-[#667085]">
                <span>0° (Flat Top)</span>
                <span>22.5° (Cinematic)</span>
                <span>45° (Dramatic)</span>
              </div>
            </div>

            {/* Slider 2: Auto Zoom Multiplier */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold text-[#111318]">
                <span className="flex items-center gap-1.5">
                  <ZoomIn size={13} className="text-[#FF6B2C]" />
                  <span>Dolly Zoom Multiplier</span>
                </span>
                <span className="font-mono text-[#FF6B2C]">{zoomLevel.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="3.0"
                step="0.1"
                value={zoomLevel}
                onChange={(e) => setZoomLevel(Number(e.target.value))}
                className="w-full accent-[#FF6B2C] cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-[#667085]">
                <span>1.0x (Wide)</span>
                <span>2.0x (Standard Focus)</span>
                <span>3.0x (Ultra Macro)</span>
              </div>
            </div>

            {/* Slider 3: SmoothDamp Spring */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold text-[#111318]">
                <span className="flex items-center gap-1.5">
                  <Camera size={13} className="text-[#FF6B2C]" />
                  <span>Spring Damping Velocity</span>
                </span>
                <span className="font-mono text-[#FF6B2C]">{smoothing < 0.07 ? "Silky Smooth" : "Snappy Focus"}</span>
              </div>
              <input
                type="range"
                min="0.04"
                max="0.15"
                step="0.01"
                value={smoothing}
                onChange={(e) => setSmoothing(Number(e.target.value))}
                className="w-full accent-[#FF6B2C] cursor-pointer"
              />
            </div>

            {/* Focal Point Presets */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-semibold text-[#111318]">Click a Focal Target:</span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { name: "Code Editor", x: -1.2, y: 0.4 },
                  { name: "Terminal Output", x: -1.2, y: -0.6 },
                  { name: "Video Preview", x: 1.2, y: 0.5 },
                  { name: "PiP Facecam", x: 1.5, y: -0.8 },
                ].map((tgt) => (
                  <button
                    key={tgt.name}
                    type="button"
                    onClick={() => setTarget(tgt.name, tgt.x, tgt.y)}
                    className={`px-3 py-2 rounded-xl text-xs font-medium text-left transition-all cursor-pointer border ${
                      activeFocalPoint === tgt.name
                        ? "bg-white text-[#FF6B2C] border-[#FF6B2C] shadow-xs font-bold"
                        : "bg-white text-[#667085] border-[#E5E7EB] hover:text-[#111318]"
                    }`}
                  >
                    {tgt.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Three.js Interactive 3D Canvas Viewport (Right) */}
          <div className="lg:col-span-7">
            <div
              ref={containerRef}
              className="relative w-full aspect-[4/3] sm:aspect-[16/10] rounded-3xl overflow-hidden bg-radial from-[#131b2e] via-[#0b101d] to-[#05080f] border border-[#E5E7EB] shadow-xl"
              style={{
                contentVisibility: "auto",
                containIntrinsicSize: "auto none auto 480px",
              }}
            >
              <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />

              <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-xs text-white">
                <span className="w-2 h-2 rounded-full bg-[#FF6B2C] animate-ping" />
                <span className="font-mono">Focal Focus: {activeFocalPoint}</span>
              </div>

              <div className="absolute bottom-4 right-4 z-10 px-3 py-1 rounded-lg bg-black/50 backdrop-blur-md border border-white/10 text-[11px] font-mono text-white/70">
                FOV: 45° • Three.js WebGL
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
