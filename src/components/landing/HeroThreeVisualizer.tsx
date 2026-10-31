"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import {
  Play,
  Pause,
  Compass,
  Sparkles,
  MousePointer,
  RotateCw,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

type CameraMode = "cinematic" | "dolly" | "front" | "orbit";

interface FocalTarget {
  name: string;
  x: number; // 0 to 1 normalized
  y: number; // 0 to 1 normalized
  zoom: number;
  tilt: number;
  codeSnippet: string;
}

export function HeroThreeVisualizer() {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // User UI controls state
  const [cameraMode, setCameraMode] = useState<CameraMode>("cinematic");
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentZoomLevel, setCurrentZoomLevel] = useState<number>(2.0);
  const [activeTargetIndex, setActiveTargetIndex] = useState<number>(0);
  const [fpsCount, setFpsCount] = useState<number>(60);

  // References to communicate with Three.js render loop without re-triggering useEffect
  const modeRef = useRef<CameraMode>(cameraMode);
  modeRef.current = cameraMode;

  const isPlayingRef = useRef<boolean>(isPlaying);
  isPlayingRef.current = isPlaying;

  const zoomFactorRef = useRef<number>(currentZoomLevel);
  zoomFactorRef.current = currentZoomLevel;

  const activeIndexRef = useRef<number>(activeTargetIndex);
  activeIndexRef.current = activeTargetIndex;

  // External trigger to switch target manually
  const switchTarget = useCallback((index: number) => {
    setActiveTargetIndex(index);
    activeIndexRef.current = index;
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check WebGL availability safely
    try {
      const test = document.createElement("canvas");
      if (!window.WebGLRenderingContext || (!test.getContext("webgl") && !test.getContext("experimental-webgl"))) {
        return;
      }
    } catch {
      return;
    }

    let isVisible = true;
    let animationFrameId: number;
    const clock = new THREE.Clock();

    // Scene setup
    const scene = new THREE.Scene();

    const aspect = container.clientWidth / Math.max(container.clientHeight, 1);
    const camera = new THREE.PerspectiveCamera(36, aspect, 0.1, 100);
    camera.position.set(0, 0.2, 8.8);

    // Renderer (High DPI, Antialiased, No Blurring)
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current || undefined,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    // Lighting (Crisp studio lighting)
    const ambientLight = new THREE.AmbientLight(0xffffff, 2.2);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffeedd, 2.0);
    dirLight.position.set(5, 10, 8);
    scene.add(dirLight);

    // Orange rim light
    const orangeRimLight = new THREE.PointLight(0xff6b2c, 2.5, 16);
    orangeRimLight.position.set(-5, -2, 4);
    scene.add(orangeRimLight);

    // -------------------------------------------------------------
    // Screen Offscreen Canvas & Ultra-Sharp 2K Texture (No Mipmap Blur)
    // -------------------------------------------------------------
    const screenWidth = 2560;
    const screenHeight = 1600;
    const screenCanvas = document.createElement("canvas");
    screenCanvas.width = screenWidth;
    screenCanvas.height = screenHeight;
    const ctx = screenCanvas.getContext("2d", { alpha: false })!;

    const screenTexture = new THREE.CanvasTexture(screenCanvas);
    // CRITICAL: Disable mipmaps to prevent text downsampling blur in Three.js
    screenTexture.generateMipmaps = false;
    screenTexture.minFilter = THREE.LinearFilter;
    screenTexture.magFilter = THREE.LinearFilter;
    if (renderer.capabilities.getMaxAnisotropy) {
      screenTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    }

    // Defined focal targets representing editing keyframes
    const targets: FocalTarget[] = [
      {
        name: "3D Camera Dolly",
        x: 0.32,
        y: 0.38,
        zoom: 2.0,
        tilt: 0.12,
        codeSnippet: "const cameraDolly = new SmoothDampCamera({ fov: 42, ease: 'cubic' });",
      },
      {
        name: "Click Trajectory",
        x: 0.68,
        y: 0.40,
        zoom: 2.4,
        tilt: -0.10,
        codeSnippet: "timeline.addKeyframe({ autoZoom: 2.4, rippleScale: 1.5 });",
      },
      {
        name: "PiP Webcam Bubble",
        x: 0.82,
        y: 0.76,
        zoom: 1.8,
        tilt: 0.08,
        codeSnippet: "facecam.setPreset('circle', { vuMeter: true, border: '#FF6B2C' });",
      },
      {
        name: "VP9 Hardware Export",
        x: 0.48,
        y: 0.72,
        zoom: 2.0,
        tilt: -0.06,
        codeSnippet: "webCodecs.encodeLosslessStream({ format: 'webm', fps: 60 });",
      },
    ];

    // Texture drawing state
    let simTime = 0;
    let cursorX = targets[0].x * screenWidth;
    let cursorY = targets[0].y * screenHeight;
    let targetCursorX = cursorX;
    let targetCursorY = cursorY;
    let clickRippleRadius = 0;
    let clickRippleAlpha = 0;

    // Draw the procedural UI onto the crisp screen texture
    const renderScreenTexture = (tDelta: number) => {
      simTime += tDelta;

      // Solid dark studio background
      ctx.fillStyle = "#0c111d";
      ctx.fillRect(0, 0, screenWidth, screenHeight);

      // Top Window Controls Bar (Height: 88px)
      ctx.fillStyle = "#161f33";
      ctx.fillRect(0, 0, screenWidth, 88);
      ctx.strokeStyle = "#27354f";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, 88);
      ctx.lineTo(screenWidth, 88);
      ctx.stroke();

      // Window dots (Crisp red, yellow, green)
      const dots = ["#ef4444", "#f59e0b", "#10b981"];
      dots.forEach((color, i) => {
        ctx.beginPath();
        ctx.arc(46 + i * 36, 44, 11, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
      });

      // Window Title (Bold, Sharp, Large)
      ctx.fillStyle = "#f8fafc";
      ctx.font = "bold 26px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("FucuFlow Studio — 3D Dolly Recording.webm", screenWidth / 2, 53);

      // Mode Badge Top Right
      ctx.fillStyle = "rgba(255, 107, 44, 0.25)";
      ctx.fillRect(screenWidth - 340, 20, 290, 48);
      ctx.strokeStyle = "#FF6B2C";
      ctx.lineWidth = 2;
      ctx.strokeRect(screenWidth - 340, 20, 290, 48);
      ctx.fillStyle = "#FF6B2C";
      ctx.font = "bold 20px monospace";
      ctx.textAlign = "center";
      ctx.fillText("● 3D CAMERA ACTIVE", screenWidth - 195, 51);

      // Left Workspace: Code Editor (Large, High-Contrast)
      ctx.fillStyle = "#101726";
      ctx.fillRect(60, 130, 1060, 980);
      ctx.strokeStyle = "#334155";
      ctx.lineWidth = 2;
      ctx.strokeRect(60, 130, 1060, 980);

      // Code Tab Bar
      ctx.fillStyle = "#1e293b";
      ctx.fillRect(60, 130, 1060, 70);
      ctx.fillStyle = "#FF8A4C";
      ctx.font = "bold 24px monospace";
      ctx.textAlign = "left";
      ctx.fillText("src/engine/cameraDolly.ts", 100, 174);

      // Code Lines (Font: 26px Bold, Line Height: 50px, Crisp High-Contrast)
      const lines = [
        "// FucuFlow Cinematic 3D Camera Engine",
        "import { WebGLRenderer, PerspectiveCamera } from 'three';",
        "",
        "export function applyCameraDolly(clickEvent: ClickTarget) {",
        "  const { focalX, focalY, zoomLevel } = clickEvent;",
        "  ",
        "  // Calculate 3D spring damped trajectory",
        "  camera.dollyTo({",
        `    target: [${(cursorX / screenWidth).toFixed(2)}, ${(cursorY / screenHeight).toFixed(2)}],`,
        `    zoom: ${zoomFactorRef.current.toFixed(1)}x,`,
        "    tiltAngle: 22.5 * Math.PI / 180,",
        "    smoothDampTime: 0.35,",
        "  });",
        "}",
      ];

      lines.forEach((line, idx) => {
        const yPos = 260 + idx * 52;
        ctx.font = "bold 24px Consolas, Monaco, monospace";
        ctx.fillStyle = "#64748b";
        ctx.fillText(`${idx + 1}`.padStart(2, " "), 90, yPos);

        ctx.font = "bold 25px Consolas, Monaco, monospace";
        if (line.startsWith("//")) {
          ctx.fillStyle = "#94a3b8";
        } else if (line.includes("import") || line.includes("export") || line.includes("function") || line.includes("const")) {
          ctx.fillStyle = "#f43f5e";
        } else if (line.includes("'") || line.includes('"')) {
          ctx.fillStyle = "#38bdf8";
        } else if (line.includes("camera") || line.includes("timeline")) {
          ctx.fillStyle = "#fbbf24";
        } else {
          ctx.fillStyle = "#ffffff";
        }
        ctx.fillText(line, 150, yPos);
      });

      // Right Main Studio Stage Preview
      ctx.fillStyle = "#0a0f1d";
      ctx.fillRect(1180, 130, 1320, 980);
      ctx.strokeStyle = "#3b4d6e";
      ctx.lineWidth = 2;
      ctx.strokeRect(1180, 130, 1320, 980);

      // Studio Preview Grid
      ctx.strokeStyle = "#1a2538";
      ctx.lineWidth = 1.5;
      for (let x = 1220; x < 2460; x += 70) {
        ctx.beginPath();
        ctx.moveTo(x, 150);
        ctx.lineTo(x, 1070);
        ctx.stroke();
      }
      for (let y = 150; y < 1070; y += 70) {
        ctx.beginPath();
        ctx.moveTo(1220, y);
        ctx.lineTo(2460, y);
        ctx.stroke();
      }

      // Focal Target Markers on the canvas
      targets.forEach((tgt, idx) => {
        const tx = tgt.x * screenWidth;
        const ty = tgt.y * screenHeight;
        const isActive = idx === activeIndexRef.current;

        // Glowing node ring
        ctx.beginPath();
        ctx.arc(tx, ty, isActive ? 28 : 16, 0, Math.PI * 2);
        ctx.fillStyle = isActive ? "rgba(255, 107, 44, 0.4)" : "rgba(255, 255, 255, 0.12)";
        ctx.fill();

        ctx.beginPath();
        ctx.arc(tx, ty, isActive ? 14 : 8, 0, Math.PI * 2);
        ctx.fillStyle = isActive ? "#FF6B2C" : "#94a3b8";
        ctx.fill();

        // Target label (Bold, clear)
        ctx.font = "bold 22px sans-serif";
        ctx.fillStyle = isActive ? "#FF8A4C" : "#cbd5e1";
        ctx.textAlign = "left";
        ctx.fillText(tgt.name, tx + 36, ty + 8);
      });

      // Bottom Timeline Bar (Height: 380px)
      ctx.fillStyle = "#111827";
      ctx.fillRect(60, 1160, 2440, 380);
      ctx.strokeStyle = "#334155";
      ctx.lineWidth = 2;
      ctx.strokeRect(60, 1160, 2440, 380);

      // Timeline track rows
      const tracks = ["Track 1: Screen Video", "Track 2: 3D Dolly Zoom", "Track 3: Cursor Ripples", "Track 4: Webcam PiP"];
      tracks.forEach((track, i) => {
        const rowY = 1210 + i * 76;
        ctx.fillStyle = "#1a2336";
        ctx.fillRect(80, rowY, 2400, 56);

        ctx.fillStyle = "#cbd5e1";
        ctx.font = "bold 22px sans-serif";
        ctx.textAlign = "left";
        ctx.fillText(track, 110, rowY + 36);

        // Timeline keyframe clips
        const clipX = 540 + i * 260;
        const clipW = 420 + ((i * 90) % 300);
        ctx.fillStyle = i === 1 ? "rgba(255, 107, 44, 0.4)" : "rgba(56, 189, 248, 0.3)";
        ctx.fillRect(clipX, rowY + 6, clipW, 44);
        ctx.strokeStyle = i === 1 ? "#FF6B2C" : "#38bdf8";
        ctx.lineWidth = 2;
        ctx.strokeRect(clipX, rowY + 6, clipW, 44);
      });

      // Timeline Playhead
      const playheadX = 540 + (Math.sin(simTime * 0.8) * 0.5 + 0.5) * 1200;
      ctx.strokeStyle = "#FF6B2C";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(playheadX, 1160);
      ctx.lineTo(playheadX, 1540);
      ctx.stroke();

      // Floating Webcam PiP Facecam (Bottom Right of Preview)
      const pipX = 2100;
      const pipY = 900;
      ctx.save();
      ctx.beginPath();
      ctx.arc(pipX, pipY, 100, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();

      // PiP gradient background
      const pipGrad = ctx.createLinearGradient(pipX - 100, pipY - 100, pipX + 100, pipY + 100);
      pipGrad.addColorStop(0, "#2563eb");
      pipGrad.addColorStop(1, "#7c3aed");
      ctx.fillStyle = pipGrad;
      ctx.fill();

      // Facecam avatar mockup
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(pipX, pipY - 16, 40, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(pipX, pipY + 80, 70, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // PiP Orange Border Accent
      ctx.strokeStyle = "#FF6B2C";
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.arc(pipX, pipY, 103, 0, Math.PI * 2);
      ctx.stroke();

      // PiP live VU meter bars
      for (let b = 0; b < 6; b++) {
        const barH = 14 + Math.abs(Math.sin(simTime * 4 + b)) * 36;
        ctx.fillStyle = "#10b981";
        ctx.fillRect(pipX - 60 + b * 20, pipY + 125 - barH / 2, 10, barH);
      }

      // Draw Expanding Click Ripple
      if (clickRippleAlpha > 0.01) {
        ctx.strokeStyle = `rgba(255, 107, 44, ${clickRippleAlpha})`;
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.arc(cursorX, cursorY, clickRippleRadius, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = `rgba(255, 140, 75, ${clickRippleAlpha * 0.7})`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(cursorX, cursorY, clickRippleRadius * 1.5, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Draw Large Crisp Cursor on the Texture
      ctx.save();
      ctx.translate(cursorX, cursorY);
      ctx.fillStyle = "#ffffff";
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, 36);
      ctx.lineTo(10, 27);
      ctx.lineTo(21, 38);
      ctx.lineTo(26, 33);
      ctx.lineTo(15, 22);
      ctx.lineTo(26, 22);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      screenTexture.needsUpdate = true;
    };

    // -------------------------------------------------------------
    // 3D Meshes: Device Screen, Stand & Floating Layers
    // -------------------------------------------------------------
    const studioGroup = new THREE.Group();
    scene.add(studioGroup);

    // Screen bezel (Sleek dark metallic frame)
    const bezelWidth = 6.4;
    const bezelHeight = 4.0;
    const bezelDepth = 0.14;

    const bezelGeo = new THREE.BoxGeometry(bezelWidth, bezelHeight, bezelDepth);
    const bezelMat = new THREE.MeshStandardMaterial({
      color: 0x111624,
      metalness: 0.85,
      roughness: 0.2,
    });
    const bezelMesh = new THREE.Mesh(bezelGeo, bezelMat);
    studioGroup.add(bezelMesh);

    // Screen display plane (where crisp 2K texture is mapped)
    const screenGeo = new THREE.PlaneGeometry(bezelWidth - 0.16, bezelHeight - 0.16);
    const screenMat = new THREE.MeshBasicMaterial({
      map: screenTexture,
    });
    const screenMesh = new THREE.Mesh(screenGeo, screenMat);
    screenMesh.position.z = bezelDepth / 2 + 0.002;
    studioGroup.add(screenMesh);

    // Glowing Edge Accent Line
    const edgeGeo = new THREE.BoxGeometry(bezelWidth + 0.02, bezelHeight + 0.02, 0.02);
    const edgeMat = new THREE.MeshBasicMaterial({
      color: 0xff6b2c,
      transparent: true,
      opacity: 0.4,
    });
    const edgeMesh = new THREE.Mesh(edgeGeo, edgeMat);
    edgeMesh.position.z = -bezelDepth / 2;
    studioGroup.add(edgeMesh);

    // 3D Holographic Focus Indicator Bracket [ + ]
    const focusGroup = new THREE.Group();
    const bracketMat = new THREE.MeshBasicMaterial({
      color: 0xff6b2c,
      transparent: true,
      opacity: 0.9,
    });

    const createBracketLine = (w: number, h: number) => {
      const geo = new THREE.PlaneGeometry(w, h);
      return new THREE.Mesh(geo, bracketMat);
    };

    // 4 corners of focus box
    const cornerSize = 0.35;
    const thickness = 0.03;
    const bracketCorners = [
      { x: -1, y: 1 },
      { x: 1, y: 1 },
      { x: -1, y: -1 },
      { x: 1, y: -1 },
    ];

    bracketCorners.forEach((c) => {
      const hLine = createBracketLine(cornerSize, thickness);
      hLine.position.set(c.x * 0.7 - (c.x * cornerSize) / 2, c.y * 0.7, 0);
      focusGroup.add(hLine);

      const vLine = createBracketLine(thickness, cornerSize);
      vLine.position.set(c.x * 0.7, c.y * 0.7 - (c.y * cornerSize) / 2, 0);
      focusGroup.add(vLine);
    });

    focusGroup.position.z = bezelDepth / 2 + 0.08;
    studioGroup.add(focusGroup);

    // Studio Floor Grid (Clean, crisp lines)
    const gridHelper = new THREE.GridHelper(16, 20, 0xff6b2c, 0xd1d5db);
    gridHelper.position.y = -2.6;
    gridHelper.material.opacity = 0.3;
    gridHelper.material.transparent = true;
    scene.add(gridHelper);

    // -------------------------------------------------------------
    // Mouse Interaction & Raycasting
    // -------------------------------------------------------------
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0, isDragging: false, prevX: 0, prevY: 0 };
    const raycaster = new THREE.Raycaster();
    const mouseVec = new THREE.Vector2();

    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouse.targetX = nx;
      mouse.targetY = ny;

      if (mouse.isDragging && modeRef.current === "orbit") {
        const dx = e.clientX - mouse.prevX;
        const dy = e.clientY - mouse.prevY;
        studioGroup.rotation.y += dx * 0.008;
        studioGroup.rotation.x += dy * 0.008;
        mouse.prevX = e.clientX;
        mouse.prevY = e.clientY;
      }
    };

    const handlePointerDown = (e: MouseEvent) => {
      mouse.isDragging = true;
      mouse.prevX = e.clientX;
      mouse.prevY = e.clientY;

      // Check click raycast onto the screen mesh
      const rect = container.getBoundingClientRect();
      mouseVec.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseVec.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      raycaster.setFromCamera(mouseVec, camera);
      const intersects = raycaster.intersectObject(screenMesh);

      if (intersects.length > 0 && intersects[0].uv) {
        const uv = intersects[0].uv;
        // User clicked directly on the 3D screen!
        targetCursorX = uv.x * screenWidth;
        targetCursorY = (1 - uv.y) * screenHeight;
        clickRippleRadius = 6;
        clickRippleAlpha = 1;
      }
    };

    const handlePointerUp = () => {
      mouse.isDragging = false;
    };

    container.addEventListener("mousemove", handlePointerMove, { passive: true });
    container.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("mouseup", handlePointerUp);

    // Resize Observer
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const width = container.clientWidth;
      const height = Math.max(container.clientHeight, 1);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(container);

    // Performance Observer
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
        });
      },
      { threshold: 0.05, rootMargin: "150px" }
    );
    intersectionObserver.observe(container);

    // -------------------------------------------------------------
    // Main Three.js Animation Loop
    // -------------------------------------------------------------
    let targetHoldTimer = 0;
    let frames = 0;
    let lastFpsTime = performance.now();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (!isVisible) return;

      const delta = clock.getDelta();
      const now = performance.now();

      // FPS calculation
      frames++;
      if (now - lastFpsTime >= 1000) {
        setFpsCount(frames);
        frames = 0;
        lastFpsTime = now;
      }

      // Smooth mouse damping
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      // Handle Automated Cursor Motion between focal targets
      if (isPlayingRef.current) {
        targetHoldTimer += delta;

        // Switch to next target every 3.2 seconds
        if (targetHoldTimer > 3.2) {
          targetHoldTimer = 0;
          const nextIdx = (activeIndexRef.current + 1) % targets.length;
          activeIndexRef.current = nextIdx;
          setActiveTargetIndex(nextIdx);

          targetCursorX = targets[nextIdx].x * screenWidth;
          targetCursorY = targets[nextIdx].y * screenHeight;

          // Trigger click ripple
          clickRippleRadius = 6;
          clickRippleAlpha = 1;
        }

        // Smooth cursor interpolation
        cursorX += (targetCursorX - cursorX) * 0.12;
        cursorY += (targetCursorY - cursorY) * 0.12;

        // Animate ripple expansion
        if (clickRippleAlpha > 0) {
          clickRippleRadius += delta * 140;
          clickRippleAlpha = Math.max(0, clickRippleAlpha - delta * 1.5);
        }
      }

      // Update 2D procedural canvas on the 3D texture
      renderScreenTexture(delta);

      // -------------------------------------------------------------
      // 3D Camera & Studio Dolly Dynamics
      // -------------------------------------------------------------
      const normalizedNormX = (cursorX / screenWidth - 0.5) * 2;
      const normalizedNormY = -(cursorY / screenHeight - 0.5) * 2;

      // Position 3D holographic focus bracket above the cursor
      const bracketTargetX = normalizedNormX * ((bezelWidth - 0.4) / 2);
      const bracketTargetY = normalizedNormY * ((bezelHeight - 0.4) / 2);
      focusGroup.position.x += (bracketTargetX - focusGroup.position.x) * 0.15;
      focusGroup.position.y += (bracketTargetY - focusGroup.position.y) * 0.15;
      focusGroup.rotation.z = Math.sin(simTime * 2) * 0.06;

      // Determine camera angle and position based on selected mode
      let targetCamX = 0;
      let targetCamY = 0.2;
      let targetCamZ = 8.6;
      let targetRotX = 0;
      let targetRotY = 0;

      if (modeRef.current === "cinematic") {
        // Gentle, crisp 3D perspective (No extreme tilt that causes blur)
        const zoomOffset = (zoomFactorRef.current - 1) * 0.8;
        targetCamX = normalizedNormX * 0.4 + mouse.x * 0.3;
        targetCamY = 0.3 + normalizedNormY * 0.3 - mouse.y * 0.2;
        targetCamZ = 8.4 - zoomOffset;

        targetRotX = -0.06 + mouse.y * 0.1 + normalizedNormY * 0.04;
        targetRotY = 0.08 + mouse.x * 0.12 + normalizedNormX * 0.06;

        studioGroup.rotation.x += (targetRotX - studioGroup.rotation.x) * 0.08;
        studioGroup.rotation.y += (targetRotY - studioGroup.rotation.y) * 0.08;
      } else if (modeRef.current === "dolly") {
        // Dynamic Dolly: Camera closely tracks the active clicked target in 3D
        const zoomOffset = zoomFactorRef.current * 1.6;
        targetCamX = bracketTargetX * 0.6;
        targetCamY = bracketTargetY * 0.6;
        targetCamZ = 6.2 - zoomOffset * 0.7;

        targetRotX = normalizedNormY * 0.08;
        targetRotY = normalizedNormX * 0.1;

        studioGroup.rotation.x += (targetRotX - studioGroup.rotation.x) * 0.08;
        studioGroup.rotation.y += (targetRotY - studioGroup.rotation.y) * 0.08;
      } else if (modeRef.current === "front") {
        // Flat Studio Alignment (100% razor sharp 0° front view)
        targetCamX = 0;
        targetCamY = 0;
        targetCamZ = 8.2;

        studioGroup.rotation.x += (0 - studioGroup.rotation.x) * 0.08;
        studioGroup.rotation.y += (0 - studioGroup.rotation.y) * 0.08;
      }

      // Smooth camera position damping
      camera.position.x += (targetCamX - camera.position.x) * 0.08;
      camera.position.y += (targetCamY - camera.position.y) * 0.08;
      camera.position.z += (targetCamZ - camera.position.z) * 0.08;
      camera.lookAt(0, 0, 0);

      // Idle gentle levitation
      studioGroup.position.y = Math.sin(simTime * 1.2) * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup resources
    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener("mousemove", handlePointerMove);
      container.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("mouseup", handlePointerUp);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();

      screenTexture.dispose();
      bezelGeo.dispose();
      bezelMat.dispose();
      screenGeo.dispose();
      screenMat.dispose();
      edgeGeo.dispose();
      edgeMat.dispose();
      bracketMat.dispose();
      gridHelper.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full max-w-6xl mx-auto mt-12 select-none">
      {/* Visualizer Shell Container (Crisp border, solid clean styling, no blur) */}
      <div className="relative rounded-3xl bg-white p-2 sm:p-3 border border-[#E5E7EB] shadow-[0_20px_50px_rgba(17,19,24,0.06)]">
        {/* Top Floating Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-[#F8F9FB] rounded-2xl border border-[#E5E7EB] mb-2 text-xs">
          {/* Left: Active 3D Engine Status Pill */}
          <div className="flex items-center gap-2.5">
            <span className="flex h-2.5 w-2.5 rounded-full bg-[#FF6B2C] animate-pulse" />
            <div className="flex items-center gap-1.5 font-semibold text-[#111318]">
              <Sparkles size={14} className="text-[#FF6B2C]" />
              <span>Three.js 3D Camera Engine</span>
            </div>
            <span className="hidden sm:inline-block text-[#667085]">•</span>
            <span className="hidden sm:inline-block font-mono text-[#667085]">
              {fpsCount} FPS • Ultra-Crisp WebGL
            </span>
          </div>

          {/* Center: Camera Angle Switcher */}
          <div className="flex items-center bg-white p-1 rounded-xl border border-[#E5E7EB]">
            <button
              type="button"
              onClick={() => setCameraMode("cinematic")}
              className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                cameraMode === "cinematic"
                  ? "bg-[#FF6B2C] text-white font-semibold"
                  : "text-[#667085] hover:text-[#111318]"
              }`}
            >
              Cinematic 3D
            </button>
            <button
              type="button"
              onClick={() => setCameraMode("dolly")}
              className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                cameraMode === "dolly"
                  ? "bg-[#FF6B2C] text-white font-semibold"
                  : "text-[#667085] hover:text-[#111318]"
              }`}
            >
              Dynamic Dolly
            </button>
            <button
              type="button"
              onClick={() => setCameraMode("front")}
              className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                cameraMode === "front"
                  ? "bg-[#FF6B2C] text-white font-semibold"
                  : "text-[#667085] hover:text-[#111318]"
              }`}
            >
              Studio Front
            </button>
            <button
              type="button"
              onClick={() => setCameraMode("orbit")}
              title="Click and drag to rotate the 3D model freely"
              className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer flex items-center gap-1 ${
                cameraMode === "orbit"
                  ? "bg-[#FF6B2C] text-white font-semibold"
                  : "text-[#667085] hover:text-[#111318]"
              }`}
            >
              <RotateCw size={12} />
              <span className="hidden md:inline">3D Orbit</span>
            </button>
          </div>

          {/* Right: Simulation Controls */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-[#E5E7EB] bg-white font-medium text-[#111318] hover:bg-[#F8F9FB] transition-all cursor-pointer"
            >
              {isPlaying ? (
                <>
                  <Pause size={12} className="text-[#FF6B2C]" />
                  <span>Pause Demo</span>
                </>
              ) : (
                <>
                  <Play size={12} className="text-[#FF6B2C]" />
                  <span>Play Demo</span>
                </>
              )}
            </button>

            {/* Zoom Factor Buttons */}
            <div className="hidden lg:flex items-center gap-1 bg-white p-0.5 rounded-lg border border-[#E5E7EB]">
              {[1.8, 2.0, 2.6].map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setCurrentZoomLevel(lvl)}
                  className={`px-2 py-0.5 rounded-md text-[11px] font-mono transition-all cursor-pointer ${
                    currentZoomLevel === lvl
                      ? "bg-[#FF6B2C] text-white font-bold"
                      : "text-[#667085] hover:text-[#111318]"
                  }`}
                >
                  {lvl}x
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 3D WebGL Canvas Viewport (Solid background, crisp, no blur) */}
        <div
          ref={containerRef}
          className="relative w-full aspect-[16/10] sm:aspect-[16/9] min-h-[420px] sm:min-h-[500px] rounded-2xl overflow-hidden bg-[#0d121f] border border-[#1e293b] cursor-grab active:cursor-grabbing"
          style={{
            contentVisibility: "auto",
            containIntrinsicSize: "auto none auto 520px",
          }}
        >
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />

          {/* Interactive Hint Overlay */}
          <div className="pointer-events-none absolute bottom-4 left-4 z-10 flex items-center gap-2 rounded-xl bg-[#111827] px-3 py-1.5 border border-[#374151] text-[11px] text-white">
            <MousePointer size={12} className="text-[#FF6B2C] animate-bounce" />
            <span>Click screen to focus • Move mouse for 3D parallax tilt</span>
          </div>

          {/* Focal Target Navigation Pills */}
          <div className="absolute top-4 right-4 z-10 flex flex-col gap-1.5">
            {["3D Dolly", "Trajectory", "Webcam PiP", "VP9 Render"].map((name, idx) => (
              <button
                key={name}
                type="button"
                onClick={() => switchTarget(idx)}
                className={`px-3 py-1 rounded-xl text-xs font-medium transition-all text-left flex items-center justify-between gap-3 cursor-pointer ${
                  activeTargetIndex === idx
                    ? "bg-[#FF6B2C] text-white font-semibold shadow-md"
                    : "bg-[#1e293b] hover:bg-[#334155] text-white/80 border border-[#475569]"
                }`}
              >
                <span>{name}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-white/50" />
              </button>
            ))}
          </div>

          {/* Live HUD telemetry in top-left */}
          <div className="pointer-events-none absolute top-4 left-4 z-10 rounded-xl bg-[#111827] p-2.5 border border-[#374151] text-white font-mono text-[10px] space-y-1">
            <div className="flex items-center gap-2 text-[#FF8A4C]">
              <Compass size={12} />
              <span>3D DOLLY HUD</span>
            </div>
            <div className="text-white/70">Zoom Scale: <span className="text-white font-bold">{currentZoomLevel.toFixed(1)}x</span></div>
            <div className="text-white/70">Perspective: <span className="text-white uppercase">{cameraMode}</span></div>
          </div>
        </div>

        {/* Bottom Feature Badges under the 3D canvas */}
        <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs text-[#667085]">
          <div className="p-2.5 rounded-xl bg-[#F8F9FB] border border-[#E5E7EB]">
            <span className="font-semibold text-[#111318]">3D Camera Tilt:</span> Dynamic WebGL
          </div>
          <div className="p-2.5 rounded-xl bg-[#F8F9FB] border border-[#E5E7EB]">
            <span className="font-semibold text-[#111318]">Spring Easing:</span> SmoothDamp Dilation
          </div>
          <div className="p-2.5 rounded-xl bg-[#F8F9FB] border border-[#E5E7EB]">
            <span className="font-semibold text-[#111318]">Webcam PiP:</span> 3D Corner Layer
          </div>
          <div className="p-2.5 rounded-xl bg-[#F8F9FB] border border-[#E5E7EB]">
            <span className="font-semibold text-[#111318]">Click Waves:</span> Radial Ripple Shaders
          </div>
        </div>
      </div>
    </div>
  );
}
