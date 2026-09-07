"use client";

import { useState, useRef } from "react";
import confetti from "canvas-confetti";
import {
  X,
  Download,
  CheckCircle2,
  Loader2,
  Film,
} from "lucide-react";

import { Button } from "@/components/ui/Button";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  videoRef: React.RefObject<HTMLVideoElement>;
  duration: number;
  projectName: string;
}

export function ExportModal({
  isOpen,
  onClose,
  canvasRef,
  videoRef,
  duration,
  projectName,
}: ExportModalProps) {
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [exportedUrl, setExportedUrl] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<string | null>(null);
  const [bitrate, setBitrate] = useState<number>(8000000); // 8 Mbps

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  if (!isOpen) return null;

  const startExport = async () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    setIsExporting(true);
    setProgress(0);
    setExportedUrl(null);

    // Pause current playback and seek to start
    video.pause();
    video.currentTime = 0;

    await new Promise((r) => setTimeout(r, 200));

    // Capture 60 FPS stream from canvas
    const stream = canvas.captureStream(60);

    let mimeType = "video/webm;codecs=vp9";
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      mimeType = "video/webm;codecs=vp8";
    }
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      mimeType = "video/webm";
    }

    const recorder = new MediaRecorder(stream, {
      mimeType,
      videoBitsPerSecond: bitrate,
    });
    mediaRecorderRef.current = recorder;

    const chunks: Blob[] = [];
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      setExportedUrl(url);

      const sizeMb = (blob.size / (1024 * 1024)).toFixed(2);
      setFileSize(`${sizeMb} MB`);

      setIsExporting(false);
      setProgress(100);

      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.5 },
          colors: ["#38bdf8", "#818cf8", "#c084fc"],
        });
      } catch {
        // ignore
      }
    };

    recorder.start();
    video.play();

    const interval = setInterval(() => {
      if (!video || !isExporting) {
        clearInterval(interval);
        return;
      }
      const safeDur = duration > 0 ? duration : 1;
      const currentProgress = Math.min(99, (video.currentTime / safeDur) * 100);
      setProgress(currentProgress);

      if (video.currentTime >= duration || video.ended) {
        clearInterval(interval);
        video.pause();
        recorder.stop();
      }
    }, 100);
  };

  const handleDownload = () => {
    if (!exportedUrl) return;
    const a = document.createElement("a");
    a.href = exportedUrl;
    a.download = `${projectName.toLowerCase().replace(/\s+/g, "-")}-cinematic.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-2xl glass-panel-elevated p-6 sm:p-7 relative overflow-hidden space-y-4 border-white/[0.15] shadow-glass-lg">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-300">
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
            onClick={onClose}
            disabled={isExporting}
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

            {/* Quality selector */}
            <div className="space-y-2">
              <label className="text-xs font-mono font-medium text-slate-300">Rendering Bitrate</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setBitrate(8000000)}
                  className={`p-2.5 rounded-xl border text-xs text-left transition-all duration-200 ${
                    bitrate === 8000000
                      ? "bg-sky-500/20 border-sky-400/30 text-white shadow-glass-sm"
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
                      ? "bg-sky-500/20 border-sky-400/30 text-white shadow-glass-sm"
                      : "bg-white/[0.03] border-white/[0.08] text-slate-400 hover:text-white"
                  }`}
                >
                  <div className="font-semibold text-white">Ultra (16 Mbps)</div>
                  <div className="text-[10px] text-slate-400">High bitrate 4K/60</div>
                </button>
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={startExport}
              leftIcon={<Download className="w-4 h-4" />}
            >
              Start 60 FPS Export
            </Button>
          </div>
        )}

        {/* State 2: Export in Progress */}
        {isExporting && (
          <div className="py-6 text-center space-y-4">
            <Loader2 className="w-8 h-8 animate-spin text-sky-400 mx-auto" />
            <div className="space-y-0.5">
              <div className="text-white font-medium text-xs">Rendering Frame by Frame...</div>
              <div className="text-[11px] text-slate-400">
                Synchronizing auto-zoom easing and cursor motion
              </div>
            </div>

            {/* Progress bar */}
            <div className="space-y-1.5">
              <div className="w-full h-2.5 rounded-full bg-black/40 overflow-hidden border border-white/[0.08]">
                <div
                  className="h-full bg-gradient-to-r from-sky-500 to-sky-400 transition-all duration-100 shadow-[0_0_10px_rgba(56,189,248,0.5)]"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="text-right text-[11px] font-mono text-sky-400 font-medium">
                {Math.round(progress)}% Complete
              </div>
            </div>
          </div>
        )}

        {/* State 3: Export Complete */}
        {exportedUrl && (
          <div className="space-y-3.5 animate-in fade-in zoom-in-95 duration-150">
            <div className="p-3 rounded-xl glass-panel border-sky-400/30 text-sky-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-sky-400" />
              <span>Video rendered successfully ({fileSize})</span>
            </div>

            {/* Video Preview */}
            <div className="rounded-xl overflow-hidden border border-white/[0.12] aspect-video bg-black/60 shadow-glass-inner">
              <video src={exportedUrl} controls autoPlay loop className="w-full h-full object-contain" />
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <Button
                variant="primary"
                onClick={handleDownload}
                leftIcon={<Download className="w-3.5 h-3.5" />}
              >
                Download .webm
              </Button>

              <Button
                variant="secondary"
                onClick={() => setExportedUrl(null)}
              >
                Export Again
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
