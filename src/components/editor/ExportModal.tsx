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
  Copy,
  Check,
  UploadCloud,
  AlertCircle,
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import { desktopBridge } from "@/lib/desktopBridge";
import {
  googleDriveService,
  GoogleDriveUploadResult,
} from "@/lib/googleDriveService";
import {
  GoogleDriveModal,
  GoogleDriveIcon,
} from "@/components/editor/GoogleDriveModal";

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
  const initialBitrate = canvasRef.current && canvasRef.current.width >= 3000 ? 32000000 : canvasRef.current && canvasRef.current.width >= 2000 ? 18000000 : 10000000;
  const [bitrate, setBitrate] = useState<number>(initialBitrate);
  const [exportFps, setExportFps] = useState<30 | 60>(60);
  const [remainingSec, setRemainingSec] = useState<number>(Math.ceil(duration));

  // Google Drive Cloud Save state
  const [isGDriveModalOpen, setIsGDriveModalOpen] = useState<boolean>(false);
  const [isUploadingGDrive, setIsUploadingGDrive] = useState<boolean>(false);
  const [gdriveUploadProgress, setGDriveUploadProgress] = useState<number>(0);
  const [gdriveResult, setGDriveResult] = useState<GoogleDriveUploadResult | null>(null);
  const [gdriveError, setGDriveError] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [isGDriveConnected, setIsGDriveConnected] = useState<boolean>(false);
  const [gdriveUserEmail, setGdriveUserEmail] = useState<string | null>(null);

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
    if (isOpen) {
      const gStatus = googleDriveService.getDriveStatus();
      setIsGDriveConnected(gStatus.isConnected);
      setGdriveUserEmail(gStatus.user?.email || null);
      setGDriveResult(null);
      setGDriveError(null);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isExporting) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isExporting, onClose]);

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
        borderColor: "#FF6B2C",
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
            exportCtx.strokeStyle = wConfig.borderColor || "#FF6B2C";
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
          colors: ["#FF6B2C", "#818cf8", "#c084fc"],
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

  const handleUploadToGoogleDrive = async () => {
    if (!exportedBlob && !exportedUrl) return;

    const gStatus = googleDriveService.getDriveStatus();
    if (!gStatus.isConnected) {
      setIsGDriveModalOpen(true);
      return;
    }

    setIsUploadingGDrive(true);
    setGDriveUploadProgress(0);
    setGDriveError(null);

    try {
      let blobToUpload = exportedBlob;
      if (!blobToUpload && exportedUrl) {
        const resp = await fetch(exportedUrl);
        blobToUpload = await resp.blob();
      }

      if (!blobToUpload) throw new Error("Video file data is not available.");

      const defaultFileName = `${projectName.toLowerCase().replace(/\s+/g, "-")}-cinematic.webm`;

      const res = await googleDriveService.uploadVideoToGoogleDrive({
        blob: blobToUpload,
        fileName: defaultFileName,
        onProgress: (p) => setGDriveUploadProgress(p),
      });

      setGDriveResult(res);
    } catch (err) {
      setGDriveError(err instanceof Error ? err.message : "Upload to Google Drive failed.");
    } finally {
      setIsUploadingGDrive(false);
    }
  };

  const handleCopyGDriveLink = () => {
    if (gdriveResult?.webViewLink && typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(gdriveResult.webViewLink);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg my-auto rounded-3xl bg-white dark:bg-[#090D18] border border-slate-200 dark:border-white/15 p-6 sm:p-7 relative overflow-hidden space-y-4 shadow-2xl text-slate-800 dark:text-slate-100 max-h-[calc(100vh-2rem)] overflow-y-auto select-none">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#FFF1E8] dark:bg-[#FF6B2C]/15 border border-[#FF6B2C]/30 flex items-center justify-center text-[#FF6B2C] shadow-xs">
              <Film className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Export &amp; Save Video</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Save to local device or your personal Google Drive</p>
            </div>
          </div>

          <button
            onClick={isExporting ? cancelExport : onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* State 1: Ready to Export */}
        {!isExporting && !exportedUrl && (
          <div className="space-y-4">
            <div className="space-y-2 p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Resolution</span>
                <span className="text-slate-900 dark:text-white font-mono font-bold">
                  {canvasRef.current
                    ? `${canvasRef.current.width}x${canvasRef.current.height} (${
                        canvasRef.current.width >= 3000
                          ? "4K UHD"
                          : canvasRef.current.width >= 2000
                          ? "2K QHD"
                          : "1080p FHD"
                      })`
                    : "4K UHD (3840x2160)"}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Duration</span>
                <span className="text-slate-900 dark:text-white font-mono font-bold">{duration.toFixed(1)}s</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Hardware Codec</span>
                <span className="text-slate-900 dark:text-white font-mono font-bold">WebM (VP9 / WebCodecs)</span>
              </div>
            </div>

            {/* Frame Rate selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200">Frame Rate</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setExportFps(30)}
                  className={`p-2.5 rounded-2xl border text-xs text-left transition-all cursor-pointer ${
                    exportFps === 30
                      ? "bg-[#FFF1E8] dark:bg-[#FF6B2C]/15 border-2 border-[#FF6B2C] text-slate-900 dark:text-white shadow-2xs"
                      : "bg-slate-50 dark:bg-white/[0.03] border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <div className="font-bold text-slate-900 dark:text-white">30 FPS (Faster)</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Light GPU rendering</div>
                </button>

                <button
                  type="button"
                  onClick={() => setExportFps(60)}
                  className={`p-2.5 rounded-2xl border text-xs text-left transition-all cursor-pointer ${
                    exportFps === 60
                      ? "bg-[#FFF1E8] dark:bg-[#FF6B2C]/15 border-2 border-[#FF6B2C] text-slate-900 dark:text-white shadow-2xs"
                      : "bg-slate-50 dark:bg-white/[0.03] border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <div className="font-bold text-[#FF6B2C]">60 FPS (Ultra Smooth)</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">High-fidelity motion</div>
                </button>
              </div>
            </div>

            {/* Quality selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200">Rendering Bitrate</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setBitrate(8000000)}
                  className={`p-2.5 rounded-2xl border text-xs text-left transition-all cursor-pointer ${
                    bitrate === 8000000
                      ? "bg-[#FFF1E8] dark:bg-[#FF6B2C]/15 border-2 border-[#FF6B2C] text-slate-900 dark:text-white shadow-2xs"
                      : "bg-slate-50 dark:bg-white/[0.03] border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <div className="font-bold text-slate-900 dark:text-white">HD (8 Mbps)</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Fast &amp; compact file</div>
                </button>

                <button
                  type="button"
                  onClick={() => setBitrate(16000000)}
                  className={`p-2.5 rounded-2xl border text-xs text-left transition-all cursor-pointer ${
                    bitrate === 16000000
                      ? "bg-[#FFF1E8] dark:bg-[#FF6B2C]/15 border-2 border-[#FF6B2C] text-slate-900 dark:text-white shadow-2xs"
                      : "bg-slate-50 dark:bg-white/[0.03] border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <div className="font-bold text-[#FF6B2C]">Ultra (16 Mbps)</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Crisp high-bitrate 4K</div>
                </button>
              </div>
            </div>

            {/* Local Export Destination Folder */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Folder className="w-3.5 h-3.5 text-[#FF6B2C]" />
                  <span>Local Save Folder</span>
                </label>
                {exportFolder && (
                  <button
                    type="button"
                    onClick={() => setExportFolder(null)}
                    className="text-[10px] text-[#FF6B2C] hover:underline cursor-pointer"
                  >
                    Reset
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10">
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-900 dark:text-white truncate font-mono font-medium">
                    {exportFolder ? exportFolder : "Prompt Folder on Save (Default)"}
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                    {exportFolder
                      ? "Video will save directly to this local path"
                      : "Pick a folder now or choose upon rendering"}
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
                      <FolderOpen className="w-3.5 h-3.5 text-[#FF6B2C]" />
                    )
                  }
                  className="text-xs shrink-0"
                >
                  {exportFolder ? "Change" : "Choose Folder"}
                </Button>
              </div>
            </div>

            {/* Google Drive Status Tip */}
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <GoogleDriveIcon className="w-4 h-4 shrink-0" />
                <div className="truncate">
                  <span className="font-bold text-slate-800 dark:text-slate-200">Google Drive: </span>
                  <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                    {isGDriveConnected ? (gdriveUserEmail || "Connected") : "Not connected"}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsGDriveModalOpen(true)}
                className="text-[11px] font-bold text-[#FF6B2C] hover:underline shrink-0 cursor-pointer"
              >
                {isGDriveConnected ? "Manage" : "Connect"}
              </button>
            </div>

            <Button
              variant="primary"
              size="lg"
              className="w-full font-bold shadow-xs cursor-pointer"
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
            <Loader2 className="w-8 h-8 animate-spin text-[#FF6B2C] mx-auto" />
            <div className="space-y-0.5">
              <div className="text-slate-900 dark:text-white font-bold text-sm">Rendering 3D Frame by Frame...</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                Compositing camera dolly transitions, motion blur, and overlays
              </div>
            </div>

            {/* Progress bar */}
            <div className="space-y-2">
              <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-black/40 overflow-hidden border border-slate-200 dark:border-white/10">
                <div
                  className="h-full bg-gradient-to-r from-[#FF7A3D] to-[#FF8A4C] transition-all duration-100 shadow-[0_0_10px_rgba(255,107,44,0.5)]"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-[11px] font-mono">
                <span className="text-slate-500 dark:text-slate-400 font-medium">
                  {remainingSec > 0 ? `~${remainingSec}s remaining` : "Finalizing file..."}
                </span>
                <span className="text-[#FF6B2C] font-bold">
                  {Math.round(progress)}% Complete
                </span>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={cancelExport}
              className="text-xs text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white border border-slate-200 dark:border-white/10 mt-1 cursor-pointer"
            >
              Cancel Export
            </Button>
          </div>
        )}

        {/* State 3: Export Complete */}
        {exportedUrl && (
          <div className="space-y-4 animate-in fade-in zoom-in-95 duration-150">
            {/* Status Feedback Banner */}
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600 dark:text-emerald-400" />
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs text-emerald-950 dark:text-emerald-200">
                  Video rendered successfully ({fileSize})
                </div>
                {savedFilePath && (
                  <div className="text-[11px] text-emerald-800 dark:text-emerald-400 truncate mt-0.5 font-mono">
                    Saved locally: {savedFilePath}
                  </div>
                )}
                {gdriveResult && (
                  <div className="text-[11px] text-emerald-800 dark:text-emerald-400 truncate mt-0.5 font-mono">
                    Uploaded to Google Drive: {gdriveResult.name}
                  </div>
                )}
              </div>
            </div>

            {/* Video Preview */}
            <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 aspect-video bg-black/90 shadow-inner">
              <video src={exportedUrl} controls autoPlay loop className="w-full h-full object-contain" />
            </div>

            {/* Save Destination Option 1: Local Computer */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Folder className="w-4 h-4 text-[#FF6B2C]" />
                  Save on Local Computer
                </span>
                {savedFilePath && (
                  <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                    <Check className="w-3 h-3" /> Saved Locally
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2">
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
                  className="w-full text-xs font-semibold shadow-xs cursor-pointer"
                >
                  {savedFilePath ? "Save Copy..." : exportFolder ? "Save to Folder" : "Save Video..."}
                </Button>

                {savedFilePath ? (
                  <Button
                    variant="secondary"
                    onClick={handleShowInFolder}
                    leftIcon={<ExternalLink className="w-3.5 h-3.5 text-[#FF6B2C]" />}
                    className="w-full text-xs font-semibold cursor-pointer"
                  >
                    Open Folder
                  </Button>
                ) : (
                  <Button
                    variant="secondary"
                    onClick={() => handleSaveVideo(true)}
                    disabled={isSaving}
                    leftIcon={<FolderOpen className="w-3.5 h-3.5 text-[#FF6B2C]" />}
                    className="w-full text-xs font-semibold cursor-pointer"
                  >
                    Choose Folder...
                  </Button>
                )}
              </div>
            </div>

            {/* Save Destination Option 2: Personal Google Drive */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <GoogleDriveIcon className="w-4 h-4" />
                  Save to Personal Google Drive
                </span>
                {isGDriveConnected && (
                  <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 truncate max-w-[150px]" title={gdriveUserEmail || ""}>
                    {gdriveUserEmail}
                  </span>
                )}
              </div>

              {gdriveError && (
                <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-300 text-[11px] flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  <span>{gdriveError}</span>
                </div>
              )}

              {/* Upload Progress Bar */}
              {isUploadingGDrive && (
                <div className="space-y-1.5 py-1">
                  <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-[#FF6B2C] transition-all duration-150"
                      style={{ width: `${gdriveUploadProgress}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <Loader2 className="w-3 h-3 animate-spin text-[#FF6B2C]" />
                      Uploading to Drive...
                    </span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{gdriveUploadProgress}%</span>
                  </div>
                </div>
              )}

              {/* Uploaded Result Actions */}
              {gdriveResult ? (
                <div className="space-y-2">
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-900 dark:text-emerald-300 text-[11px] flex items-center justify-between">
                    <span className="font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      Saved in &ldquo;FucuFlow Studio Videos&rdquo;
                    </span>
                    {gdriveResult.size && <span className="font-mono text-[10px] opacity-75">{gdriveResult.size}</span>}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {gdriveResult.webViewLink && (
                      <a
                        href={gdriveResult.webViewLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full"
                      >
                        <Button
                          variant="secondary"
                          size="sm"
                          leftIcon={<ExternalLink className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />}
                          className="w-full text-xs font-semibold"
                        >
                          Open in Drive
                        </Button>
                      </a>
                    )}

                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={handleCopyGDriveLink}
                      leftIcon={copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                      className="w-full text-xs font-semibold"
                    >
                      {copiedLink ? "Link Copied!" : "Copy Share Link"}
                    </Button>
                  </div>
                </div>
              ) : (
                /* Upload Button */
                <div>
                  <Button
                    variant="secondary"
                    onClick={handleUploadToGoogleDrive}
                    disabled={isUploadingGDrive}
                    leftIcon={
                      isUploadingGDrive ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <GoogleDriveIcon className="w-3.5 h-3.5" />
                      )
                    }
                    className="w-full text-xs font-bold bg-white dark:bg-white/[0.04] hover:bg-slate-50 dark:hover:bg-white/[0.08] border-slate-200 dark:border-white/10 shadow-2xs cursor-pointer"
                  >
                    {isUploadingGDrive
                      ? `Uploading (${gdriveUploadProgress}%)...`
                      : isGDriveConnected
                      ? "Upload Video to Google Drive"
                      : "Connect Google Drive & Save"}
                  </Button>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="flex justify-between items-center px-1 pt-1">
              <button
                type="button"
                onClick={() => {
                  setExportedUrl(null);
                  setExportedBlob(null);
                  setSavedFilePath(null);
                  setGDriveResult(null);
                  setGDriveError(null);
                }}
                className="text-xs text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer"
              >
                &larr; Render Again
              </button>
              {exportFolder && (
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono truncate max-w-[200px]" title={exportFolder}>
                  Folder: {exportFolder}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      <GoogleDriveModal
        isOpen={isGDriveModalOpen}
        onClose={() => setIsGDriveModalOpen(false)}
        onConnected={() => {
          setIsGDriveConnected(true);
          const currentStatus = googleDriveService.getDriveStatus();
          setGdriveUserEmail(currentStatus.user?.email || null);
          setIsGDriveModalOpen(false);
          handleUploadToGoogleDrive();
        }}
      />
    </div>
  );
}
