"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import confetti from "canvas-confetti";
import {
  X,
  Download,
  CheckCircle2,
  Loader2,
  Film,
  Info,
  Folder,
  FolderOpen,
  ExternalLink,
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import { desktopBridge } from "@/lib/desktopBridge";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  videoRef: React.RefObject<HTMLVideoElement>;
  duration: number;
  projectName: string;
  webcamConfig?: import("@/types/editor").WebcamConfig;
  webcamUrl?: string | null;
}

export function ExportModal({
  isOpen,
  onClose,
  canvasRef,
  videoRef,
  duration,
  projectName,
  webcamConfig,
  webcamUrl,
}: ExportModalProps) {
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [exportedUrl, setExportedUrl] = useState<string | null>(null);
  const [exportedBlob, setExportedBlob] = useState<Blob | null>(null);
  const [savedFilePath, setSavedFilePath] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [exportFolder, setExportFolder] = useState<string | null>(null);
  const [isSelectingFolder, setIsSelectingFolder] = useState<boolean>(false);
  const [fileSize, setFileSize] = useState<string | null>(null);
  const [bitrate, setBitrate] = useState<number>(8000000); // 8 Mbps
  const [exportFps, setExportFps] = useState<30 | 60>(60);
  const [remainingSec, setRemainingSec] = useState<number>(Math.ceil(duration));

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const isExportingRef = useRef<boolean>(false);
  const isCancelledRef = useRef<boolean>(false);
  const activeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const safetyTimerRef = useRef<NodeJS.Timeout | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const cleanupsRef = useRef<(() => void) | null>(null);

  const cancelExport = useCallback(() => {
    isCancelledRef.current = true;
    isExportingRef.current = false;
    setIsExporting(false);
    setProgress(0);

    if (activeIntervalRef.current) {
      clearInterval(activeIntervalRef.current);
      activeIntervalRef.current = null;
    }
    if (safetyTimerRef.current) {
      clearTimeout(safetyTimerRef.current);
      safetyTimerRef.current = null;
    }
    if (animFrameIdRef.current) {
      cancelAnimationFrame(animFrameIdRef.current);
      animFrameIdRef.current = null;
    }
    if (cleanupsRef.current) {
      cleanupsRef.current();
      cleanupsRef.current = null;
    }

    const video = videoRef.current;
    if (video) {
      video.pause();
      video.currentTime = 0;
    }

    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== "inactive") {
      try {
        recorder.stop();
      } catch (err) {
        console.warn("Error stopping recorder on cancel:", err);
      }
    }
  }, [videoRef]);

  useEffect(() => {
    return () => {
      if (isExportingRef.current) {
        cancelExport();
      }
    };
  }, [cancelExport]);

  if (!isOpen) return null;

  const startExport = async () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    isCancelledRef.current = false;
    isExportingRef.current = true;
    setIsExporting(true);
    setProgress(0);
    setRemainingSec(Math.ceil(duration));
    setExportedUrl(null);

    // Pause video, ensure muted for uninterrupted playback, and seek to start
    video.pause();
    video.muted = true;
    video.currentTime = 0;

    // Wait for video seek to complete
    await new Promise<void>((resolve) => {
      let resolved = false;
      const onSeeked = () => {
        if (!resolved) {
          resolved = true;
          video.removeEventListener("seeked", onSeeked);
          resolve();
        }
      };
      video.addEventListener("seeked", onSeeked);
      setTimeout(onSeeked, 150);
    });

    if (isCancelledRef.current) return;

    // Setup export video stream: either direct canvas stream or composite canvas stream with webcam
    let exportStream: MediaStream;
    let exportCanvas: HTMLCanvasElement | null = null;
    let exportCtx: CanvasRenderingContext2D | null = null;
    let camVid: HTMLVideoElement | null = null;

    const hasWebcamOverlay =
      webcamConfig?.enabled !== false &&
      (webcamUrl || webcamConfig?.url);

    if (hasWebcamOverlay) {
      exportCanvas = document.createElement("canvas");
      exportCanvas.width = canvas.width;
      exportCanvas.height = canvas.height;
      exportCtx = exportCanvas.getContext("2d");

      camVid = document.createElement("video");
      camVid.src = webcamUrl || webcamConfig?.url || "";
      camVid.muted = true;
      camVid.playsInline = true;
      await camVid.play().catch(() => {});

      const wConfig = webcamConfig || {
        enabled: true,
        shape: "circle",
        position: "bottom-right",
        customX: 0.85,
        customY: 0.82,
        size: 180,
        borderColor: "#fb7185",
        borderWidth: 3,
        shadow: true,
        mirror: true,
      };

      const renderCompositeFrame = () => {
        if (!isExportingRef.current) return;
        if (!exportCtx || !exportCanvas) return;
        exportCtx.clearRect(0, 0, exportCanvas.width, exportCanvas.height);
        exportCtx.drawImage(canvas, 0, 0, exportCanvas.width, exportCanvas.height);

        // Draw webcam PiP overlay
        if (camVid && camVid.readyState >= 2) {
          const cW = exportCanvas.width;
          const cH = exportCanvas.height;
          // Scale bubble size proportional to export canvas
          const scaleFactor = cW / 1920;
          const bubbleSize = (wConfig.size || 180) * scaleFactor;
          const posX = (wConfig.customX ?? 0.85) * cW;
          const posY = (wConfig.customY ?? 0.82) * cH;

          exportCtx.save();
          exportCtx.translate(posX, posY);

          // Path clipping for shape
          exportCtx.beginPath();
          if (wConfig.shape === "circle") {
            exportCtx.arc(0, 0, bubbleSize / 2, 0, Math.PI * 2);
          } else if (wConfig.shape === "rounded-rect") {
            const rad = 24 * scaleFactor;
            exportCtx.roundRect(-bubbleSize / 2, -bubbleSize / 2, bubbleSize, bubbleSize, rad);
          } else {
            exportCtx.rect(-bubbleSize / 2, -bubbleSize / 2, bubbleSize, bubbleSize);
          }
          exportCtx.closePath();

          // Drop shadow
          if (wConfig.shadow) {
            exportCtx.shadowColor = "rgba(0, 0, 0, 0.65)";
            exportCtx.shadowBlur = 25 * scaleFactor;
            exportCtx.shadowOffsetY = 10 * scaleFactor;
          }

          exportCtx.clip();

          // Mirror if enabled
          if (wConfig.mirror) {
            exportCtx.scale(-1, 1);
          }

          exportCtx.drawImage(camVid, -bubbleSize / 2, -bubbleSize / 2, bubbleSize, bubbleSize);
          exportCtx.restore();

          // Draw border
          if (wConfig.borderWidth > 0) {
            exportCtx.save();
            exportCtx.translate(posX, posY);
            exportCtx.lineWidth = wConfig.borderWidth * scaleFactor;
            exportCtx.strokeStyle = wConfig.borderColor || "#fb7185";
            exportCtx.beginPath();
            if (wConfig.shape === "circle") {
              exportCtx.arc(0, 0, bubbleSize / 2, 0, Math.PI * 2);
            } else if (wConfig.shape === "rounded-rect") {
              const rad = 24 * scaleFactor;
              exportCtx.roundRect(-bubbleSize / 2, -bubbleSize / 2, bubbleSize, bubbleSize, rad);
            } else {
              exportCtx.rect(-bubbleSize / 2, -bubbleSize / 2, bubbleSize, bubbleSize);
            }
            exportCtx.stroke();
            exportCtx.restore();
          }
        }

        animFrameIdRef.current = requestAnimationFrame(renderCompositeFrame);
      };

      animFrameIdRef.current = requestAnimationFrame(renderCompositeFrame);
      exportStream = exportCanvas.captureStream(exportFps);
    } else {
      exportStream = canvas.captureStream(exportFps);
    }

    let mimeType = "video/webm;codecs=vp9";
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      mimeType = "video/webm;codecs=vp8";
    }
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      mimeType = "video/webm";
    }

    const recorder = new MediaRecorder(exportStream, {
      mimeType,
      videoBitsPerSecond: bitrate,
    });
    mediaRecorderRef.current = recorder;

    const chunks: Blob[] = [];
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };

    recorder.onstop = () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
        animFrameIdRef.current = null;
      }
      if (camVid) {
        camVid.pause();
        camVid.src = "";
      }

      try {
        exportStream.getTracks().forEach((track) => track.stop());
      } catch {}

      if (isCancelledRef.current) {
        isCancelledRef.current = false;
        return;
      }

      const blob = new Blob(chunks, { type: mimeType });
      const url = URL.createObjectURL(blob);
      setExportedUrl(url);
      setExportedBlob(blob);
      setSavedFilePath(null);

      const sizeMb = (blob.size / (1024 * 1024)).toFixed(2);
      setFileSize(`${sizeMb} MB`);

      isExportingRef.current = false;
      setIsExporting(false);
      setProgress(100);
      setRemainingSec(0);

      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.5 },
          colors: ["#fb7185", "#818cf8", "#c084fc"],
        });
      } catch {
        // ignore
      }
    };

    let hasEnded = false;
    const finish = () => {
      if (hasEnded) return;
      hasEnded = true;

      if (activeIntervalRef.current) {
        clearInterval(activeIntervalRef.current);
        activeIntervalRef.current = null;
      }
      if (safetyTimerRef.current) {
        clearTimeout(safetyTimerRef.current);
        safetyTimerRef.current = null;
      }
      if (cleanupsRef.current) {
        cleanupsRef.current();
        cleanupsRef.current = null;
      }

      video.pause();

      if (recorder.state !== "inactive") {
        try {
          recorder.stop();
        } catch (e) {
          console.warn("Failed to stop recorder:", e);
        }
      }
    };

    const handleEnded = () => {
      finish();
    };

    const handleTimeUpdate = () => {
      if (!isExportingRef.current) return;
      const curr = video.currentTime;
      const safeDur = duration > 0 ? duration : 1;
      const currentProgress = Math.min(99, Math.max(0, (curr / safeDur) * 100));
      setProgress(currentProgress);
      setRemainingSec(Math.max(0, Math.ceil(safeDur - curr)));

      if (curr >= duration - 0.05 || video.ended) {
        finish();
      }
    };

    video.addEventListener("ended", handleEnded);
    video.addEventListener("timeupdate", handleTimeUpdate);

    cleanupsRef.current = () => {
      video.removeEventListener("ended", handleEnded);
      video.removeEventListener("timeupdate", handleTimeUpdate);
    };

    activeIntervalRef.current = setInterval(() => {
      if (!isExportingRef.current || !video) {
        if (activeIntervalRef.current) {
          clearInterval(activeIntervalRef.current);
          activeIntervalRef.current = null;
        }
        return;
      }
      if (camVid && Math.abs(camVid.currentTime - video.currentTime) > 0.15) {
        camVid.currentTime = video.currentTime;
      }
      const curr = video.currentTime;
      const safeDur = duration > 0 ? duration : 1;
      const currentProgress = Math.min(99, Math.max(0, (curr / safeDur) * 100));
      setProgress(currentProgress);
      setRemainingSec(Math.max(0, Math.ceil(duration - curr)));

      if (curr >= duration - 0.05 || video.ended) {
        finish();
      }
    }, 80);

    const safetyMs = (duration + 3) * 1000;
    safetyTimerRef.current = setTimeout(() => {
      if (isExportingRef.current) {
        console.warn("Export safety fallback timer reached, finalizing export.");
        finish();
      }
    }, Math.max(4000, safetyMs));

    recorder.start(100);
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.error("Failed to play video for export:", err);
        finish();
      });
    }

    if (camVid) {
      camVid.currentTime = 0;
      camVid.play().catch(() => {});
    }
  };

  const handleChooseFolder = async () => {
    setIsSelectingFolder(true);
    try {
      const res = await desktopBridge.chooseExportFolder();
      if (!res.canceled && res.folderPath) {
        setExportFolder(res.folderPath);
      }
    } catch (err) {
      console.error("Failed to select export folder:", err);
    } finally {
      setIsSelectingFolder(false);
    }
  };

  const handleSaveVideo = async (forcePromptDialog = false) => {
    if (!exportedBlob && !exportedUrl) return;
    setIsSaving(true);
    try {
      let buffer: ArrayBuffer;
      if (exportedBlob) {
        buffer = await exportedBlob.arrayBuffer();
      } else {
        const resp = await fetch(exportedUrl!);
        buffer = await resp.arrayBuffer();
      }

      const defaultFileName = `${projectName.toLowerCase().replace(/\s+/g, "-")}-cinematic.webm`;
      const destination = forcePromptDialog ? undefined : (exportFolder || undefined);

      const result = await desktopBridge.saveExportedVideo(defaultFileName, buffer, destination);
      if (!result.canceled && result.filePath) {
        setSavedFilePath(result.filePath);
      }
    } catch (err) {
      console.error("Save video failed:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleShowInFolder = async () => {
    if (!savedFilePath) return;
    await desktopBridge.showInFolder(savedFilePath);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-2xl glass-panel-elevated p-6 sm:p-7 relative overflow-hidden space-y-4 border-white/[0.15] shadow-glass-lg">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-500/20 border border-rose-400/30 flex items-center justify-center text-rose-300">
              <Film className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-white">Export Cinematic Recording</h3>
              <p className="text-[11px] text-slate-400">Render directly on your local device</p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon-sm"
            onClick={isExporting ? cancelExport : onClose}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* State 1: Ready to Export */}
        {!isExporting && !exportedUrl && (
          <div className="space-y-4">
            <div className="space-y-2 glass-panel p-3.5 rounded-xl">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Resolution</span>
                <span className="text-white font-mono">1080p (60 FPS)</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Duration</span>
                <span className="text-white font-mono">{duration.toFixed(1)}s</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Codec</span>
                <span className="text-white font-mono">WebM (Hardware VP9)</span>
              </div>
            </div>

            {/* Frame Rate selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-medium text-slate-300">Frame Rate</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setExportFps(30)}
                  className={`p-2.5 rounded-xl border text-xs text-left transition-all duration-200 ${
                    exportFps === 30
                      ? "bg-rose-500/20 border-rose-400/30 text-white shadow-glass-sm"
                      : "bg-white/[0.03] border-white/[0.08] text-slate-400 hover:text-white"
                  }`}
                >
                  <div className="font-semibold text-white">30 FPS (Faster)</div>
                  <div className="text-[10px] text-slate-400">Light GPU rendering</div>
                </button>

                <button
                  type="button"
                  onClick={() => setExportFps(60)}
                  className={`p-2.5 rounded-xl border text-xs text-left transition-all duration-200 ${
                    exportFps === 60
                      ? "bg-rose-500/20 border-rose-400/30 text-white shadow-glass-sm"
                      : "bg-white/[0.03] border-white/[0.08] text-slate-400 hover:text-white"
                  }`}
                >
                  <div className="font-semibold text-white">60 FPS (Ultra Smooth)</div>
                  <div className="text-[10px] text-slate-400">High-fidelity motion</div>
                </button>
              </div>
            </div>

            {/* Quality selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-medium text-slate-300">Rendering Bitrate</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setBitrate(8000000)}
                  className={`p-2.5 rounded-xl border text-xs text-left transition-all duration-200 ${
                    bitrate === 8000000
                      ? "bg-rose-500/20 border-rose-400/30 text-white shadow-glass-sm"
                      : "bg-white/[0.03] border-white/[0.08] text-slate-400 hover:text-white"
                  }`}
                >
                  <div className="font-semibold text-white">HD (8 Mbps)</div>
                  <div className="text-[10px] text-slate-400">Fast & compact</div>
                </button>

                <button
                  type="button"
                  onClick={() => setBitrate(16000000)}
                  className={`p-2.5 rounded-xl border text-xs text-left transition-all duration-200 ${
                    bitrate === 16000000
                      ? "bg-rose-500/20 border-rose-400/30 text-white shadow-glass-sm"
                      : "bg-white/[0.03] border-white/[0.08] text-slate-400 hover:text-white"
                  }`}
                >
                  <div className="font-semibold text-white">Ultra (16 Mbps)</div>
                  <div className="text-[10px] text-slate-400">High bitrate 4K/60</div>
                </button>
              </div>
            </div>

            {/* Export Destination Folder selector */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono font-medium text-slate-300 flex items-center gap-1.5">
                  <Folder className="w-3.5 h-3.5 text-rose-400" />
                  <span>Export Destination Folder</span>
                </label>
                {exportFolder && (
                  <button
                    type="button"
                    onClick={() => setExportFolder(null)}
                    className="text-[10px] text-slate-400 hover:text-rose-300 transition-colors"
                  >
                    Reset
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08]">
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-white truncate font-mono">
                    {exportFolder ? exportFolder : "Prompt Folder on Save (Default)"}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate">
                    {exportFolder
                      ? "Exports will automatically save to this directory"
                      : "Choose a folder now or select upon rendering"}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={handleChooseFolder}
                  disabled={isSelectingFolder}
                  leftIcon={
                    isSelectingFolder ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <FolderOpen className="w-3.5 h-3.5 text-rose-400" />
                    )
                  }
                  className="text-xs shrink-0"
                >
                  {exportFolder ? "Change" : "Choose Folder"}
                </Button>
              </div>
            </div>

            {/* Why real-time explanation callout */}
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-slate-400 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-200 font-semibold text-[11px]">
                <Info className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                <span>Estimated Export Duration: ~{Math.ceil(duration)}s</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                Glideo simulates 3D camera dollies, motion blurs, cursor trails, and webcam bubbles in real time frame-by-frame. Export plays through the recording from 0s to {duration.toFixed(0)}s to render every effect.
              </p>
            </div>

            <Button
              variant="primary"
              size="lg"
              className="w-full font-bold shadow-md shadow-rose-600/30"
              onClick={startExport}
              leftIcon={<Download className="w-4 h-4" />}
            >
              Start Export ({exportFps} FPS)
            </Button>
          </div>
        )}

        {/* State 2: Export in Progress */}
        {isExporting && (
          <div className="py-6 text-center space-y-4">
            <Loader2 className="w-8 h-8 animate-spin text-rose-400 mx-auto" />
            <div className="space-y-0.5">
              <div className="text-white font-medium text-xs">Rendering 3D Frame by Frame...</div>
              <div className="text-[11px] text-slate-400">
                Compositing camera dolly transitions, reflections, and overlays
              </div>
            </div>

            {/* Progress bar */}
            <div className="space-y-2">
              <div className="w-full h-2.5 rounded-full bg-black/40 overflow-hidden border border-white/[0.08]">
                <div
                  className="h-full bg-gradient-to-r from-rose-500 to-rose-400 transition-all duration-100 shadow-[0_0_10px_rgba(251,113,133,0.5)]"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-[11px] font-mono">
                <span className="text-slate-400 font-medium">
                  {remainingSec > 0 ? `~${remainingSec}s remaining` : "Finalizing file..."}
                </span>
                <span className="text-rose-400 font-semibold">
                  {Math.round(progress)}% Complete
                </span>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={cancelExport}
              className="text-xs text-slate-400 hover:text-white border border-white/10 hover:border-white/20 mt-1"
            >
              Cancel Export
            </Button>
          </div>
        )}

        {/* State 3: Export Complete */}
        {exportedUrl && (
          <div className="space-y-3.5 animate-in fade-in zoom-in-95 duration-150">
            <div className="p-3 rounded-xl glass-panel border-rose-400/30 text-rose-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-rose-400" />
              <div className="flex-1 min-w-0">
                <div className="font-semibold">Video rendered successfully ({fileSize})</div>
                {savedFilePath && (
                  <div className="text-[10px] text-slate-300 truncate mt-0.5 font-mono">
                    Saved to: {savedFilePath}
                  </div>
                )}
              </div>
            </div>

            {/* Video Preview */}
            <div className="rounded-xl overflow-hidden border border-white/[0.12] aspect-video bg-black/60 shadow-glass-inner">
              <video src={exportedUrl} controls autoPlay loop className="w-full h-full object-contain" />
            </div>

            <div className="space-y-2 pt-1">
              <div className="grid grid-cols-2 gap-2.5">
                <Button
                  variant="primary"
                  onClick={() => handleSaveVideo(false)}
                  disabled={isSaving}
                  leftIcon={
                    isSaving ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Download className="w-3.5 h-3.5" />
                    )
                  }
                  className="font-semibold shadow-md shadow-rose-600/20"
                >
                  {savedFilePath ? "Save Copy..." : exportFolder ? "Save to Folder" : "Save Video..."}
                </Button>

                {savedFilePath ? (
                  <Button
                    variant="secondary"
                    onClick={handleShowInFolder}
                    leftIcon={<ExternalLink className="w-3.5 h-3.5 text-rose-400" />}
                  >
                    Open Folder
                  </Button>
                ) : (
                  <Button
                    variant="secondary"
                    onClick={() => handleSaveVideo(true)}
                    disabled={isSaving}
                    leftIcon={<FolderOpen className="w-3.5 h-3.5 text-rose-400" />}
                  >
                    Choose Folder...
                  </Button>
                )}
              </div>

              <div className="flex justify-between items-center px-1">
                <button
                  type="button"
                  onClick={() => {
                    setExportedUrl(null);
                    setExportedBlob(null);
                    setSavedFilePath(null);
                  }}
                  className="text-xs text-slate-400 hover:text-white transition-colors"
                >
                  Render Again
                </button>
                {exportFolder && (
                  <span className="text-[10px] text-slate-400 font-mono truncate max-w-[200px]" title={exportFolder}>
                    Folder: {exportFolder}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
