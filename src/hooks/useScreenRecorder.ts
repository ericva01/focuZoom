"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { ClickEvent, VideoMetadata } from "@/types/editor";

export interface ScreenRecorderResult {
  blobUrl: string;
  metadata: VideoMetadata;
  events: ClickEvent[];
}

export interface UseScreenRecorderOptions {
  onImportRecording: (result: ScreenRecorderResult) => void;
  defaultZoomScale?: number;
}

/**
 * Scales mouse click and movement coordinates (x, y) relative to the actual width
 * and height of the source video stream rather than raw window pixel size.
 */
function getStreamRelativeCoordinates(
  e: MouseEvent,
  streamSettings: MediaTrackSettings | null
): { x: number; y: number } {
  const streamW = streamSettings?.width || (typeof window !== "undefined" ? window.screen.width : 1920);
  const streamH = streamSettings?.height || (typeof window !== "undefined" ? window.screen.height : 1080);
  const streamAspect = streamW / streamH;
  const displaySurface = streamSettings?.displaySurface;

  const screenW = (typeof window !== "undefined" && window.screen.width) ? window.screen.width : streamW;
  const screenH = (typeof window !== "undefined" && window.screen.height) ? window.screen.height : streamH;
  const screenAspect = screenW / screenH;

  const winOuterW = (typeof window !== "undefined" && window.outerWidth) ? window.outerWidth : screenW;
  const winOuterH = (typeof window !== "undefined" && window.outerHeight) ? window.outerHeight : screenH;
  const winLeft = typeof window !== "undefined" ? (window.screenLeft ?? window.screenX ?? 0) : 0;
  const winTop = typeof window !== "undefined" ? (window.screenTop ?? window.screenY ?? 0) : 0;

  let relX: number;
  let relY: number;

  if (displaySurface === "monitor") {
    // Entire laptop / monitor screen captured
    // e.screenX, e.screenY give the position on the physical monitor display
    relX = e.screenX / screenW;
    relY = e.screenY / screenH;
  } else if (displaySurface === "window") {
    // Application window captured: offset by window screen location
    const wx = e.screenX - winLeft;
    const wy = e.screenY - winTop;
    relX = wx / winOuterW;
    relY = wy / winOuterH;
  } else if (displaySurface === "browser") {
    // Browser tab captured
    relX = e.clientX / window.innerWidth;
    relY = e.clientY / window.innerHeight;
  } else {
    // Fallback: check if the stream matches the laptop screen aspect ratio
    const isScreenLike =
      Math.abs(streamAspect - screenAspect) < 0.08 || streamW >= screenW;
    if (isScreenLike && typeof e.screenX === "number" && e.screenX > 0) {
      relX = e.screenX / screenW;
      relY = e.screenY / screenH;
    } else {
      relX = e.clientX / (typeof window !== "undefined" ? window.innerWidth : streamW);
      relY = e.clientY / (typeof window !== "undefined" ? window.innerHeight : streamH);
    }
  }

  return {
    x: Math.max(0.02, Math.min(0.98, Math.round(relX * 1000) / 1000)),
    y: Math.max(0.02, Math.min(0.98, Math.round(relY * 1000) / 1000)),
  };
}

export function useScreenRecorder({
  onImportRecording,
  defaultZoomScale = 2.2,
}: UseScreenRecorderOptions) {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingDuration, setRecordingDuration] = useState<number>(0);
  const [clickCount, setClickCount] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const startTimeRef = useRef<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const recordedClicksRef = useRef<ClickEvent[]>([]);
  const clickListenerRef = useRef<((e: MouseEvent) => void) | null>(null);
  const moveListenerRef = useRef<((e: MouseEvent) => void) | null>(null);
  const trackSettingsRef = useRef<MediaTrackSettings | null>(null);

  // Stop recording handler
  const stopRecording = useCallback(async () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Detach global click and movement listeners
    if (clickListenerRef.current) {
      window.removeEventListener("mousedown", clickListenerRef.current, true);
      clickListenerRef.current = null;
    }
    if (moveListenerRef.current) {
      window.removeEventListener("mousemove", moveListenerRef.current, true);
      moveListenerRef.current = null;
    }

    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== "inactive") {
      recorder.onstop = () => {
        const mimeType = recorder.mimeType || "video/webm";
        const blob = new Blob(chunksRef.current, { type: mimeType });
        const blobUrl = URL.createObjectURL(blob);

        // Stop all stream media tracks
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }

        // Measure true dimensions & duration via offscreen video
        const tempVideo = document.createElement("video");
        tempVideo.src = blobUrl;
        tempVideo.preload = "metadata";

        tempVideo.onloadedmetadata = () => {
          const elapsedSec = (performance.now() - startTimeRef.current) / 1000;
          const calculatedDuration =
            tempVideo.duration && isFinite(tempVideo.duration)
              ? tempVideo.duration
              : Math.max(1, elapsedSec);

          const dateStamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
          const metadata: VideoMetadata = {
            name: `screen-recording-${dateStamp}.webm`,
            duration: Math.round(calculatedDuration * 10) / 10,
            width: tempVideo.videoWidth || 1920,
            height: tempVideo.videoHeight || 1080,
            fileSize: `${(blob.size / (1024 * 1024)).toFixed(2)} MB`,
            url: blobUrl,
          };

          // Final sorted click events
          const sortedClicks = [...recordedClicksRef.current].sort(
            (a, b) => a.timestamp - b.timestamp
          );

          setIsRecording(false);
          setRecordingDuration(0);

          onImportRecording({
            blobUrl,
            metadata,
            events: sortedClicks,
          });
        };

        tempVideo.onerror = () => {
          // Fallback if metadata event is delayed
          const elapsedSec = (performance.now() - startTimeRef.current) / 1000;
          const metadata: VideoMetadata = {
            name: `screen-recording-${Date.now()}.webm`,
            duration: Math.max(1, Math.round(elapsedSec * 10) / 10),
            width: 1920,
            height: 1080,
            fileSize: `${(blob.size / (1024 * 1024)).toFixed(2)} MB`,
            url: blobUrl,
          };

          setIsRecording(false);
          setRecordingDuration(0);

          onImportRecording({
            blobUrl,
            metadata,
            events: [...recordedClicksRef.current],
          });
        };
      };

      recorder.stop();
    } else {
      setIsRecording(false);
      setRecordingDuration(0);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    }
  }, [onImportRecording]);

  // Start recording handler
  const startRecording = useCallback(async (): Promise<boolean> => {
    setError(null);
    recordedClicksRef.current = [];
    chunksRef.current = [];
    setClickCount(0);
    setRecordingDuration(0);

    try {
      let stream: MediaStream | null = null;

      // 1. Electron Native Desktop Stream Strategy (hardware-accelerated, zero-dialog)
      if (typeof window !== "undefined" && window.electronAPI?.getDesktopSources) {
        try {
          const sources = await window.electronAPI.getDesktopSources({ types: ["screen", "window"] });
          if (sources && sources.length > 0) {
            const primary = sources.find((s) => s.id.startsWith("screen")) || sources[0];
            const mediaDevicesAny = navigator.mediaDevices as unknown as {
              getUserMedia: (constraints: unknown) => Promise<MediaStream>;
            };
            stream = await mediaDevicesAny.getUserMedia({
              audio: false,
              video: {
                mandatory: {
                  chromeMediaSource: "desktop",
                  chromeMediaSourceId: primary.id,
                  minWidth: 1280,
                  maxWidth: 3840,
                  minHeight: 720,
                  maxHeight: 2160,
                  maxFrameRate: 60,
                },
              },
            });
          }
        } catch (electronErr) {
          console.warn("[FocuFlow] Native Electron desktop stream fallback to getDisplayMedia:", electronErr);
        }
      }

      // 2. Browser standard getDisplayMedia (also enabled in Electron via setDisplayMediaRequestHandler)
      if (!stream) {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
          setError("Screen recording API (getDisplayMedia) is not supported in this environment.");
          setTimeout(() => setError(null), 5000);
          return false;
        }

        try {
          stream = await navigator.mediaDevices.getDisplayMedia({
            video: {
              displaySurface: "browser",
              frameRate: { ideal: 60, max: 60 },
            },
            audio: true,
          });
        } catch {
          stream = await navigator.mediaDevices.getDisplayMedia({
            video: {
              frameRate: { ideal: 60, max: 60 },
            },
            audio: false,
          });
        }
      }

      streamRef.current = stream;

      // Select optimal WebM codec
      let mimeType = "video/webm;codecs=vp9";
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = "video/webm;codecs=vp8";
      }
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = "video/webm";
      }

      const recorder = new MediaRecorder(stream, {
        mimeType,
        videoBitsPerSecond: 10000000, // 10 Mbps for crisp 1080p
      });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      // Listen for user clicking native "Stop sharing" browser bar
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        trackSettingsRef.current = videoTrack.getSettings();
        videoTrack.onended = () => {
          stopRecording();
        };
      }

      // Record start timestamp
      const startTime = performance.now();
      startTimeRef.current = startTime;
      setIsRecording(true);

      // Start elapsed timer
      timerRef.current = setInterval(() => {
        const sec = (performance.now() - startTime) / 1000;
        setRecordingDuration(sec);
      }, 200);

      // Attach global mouse movement listener for continuous trajectory tracking
      let lastMoveMs = 0;
      const handleMouseMove = (e: MouseEvent) => {
        const now = performance.now();
        if (now - lastMoveMs < 60) return; // 16 FPS sample rate
        lastMoveMs = now;
        if (videoTrack) {
          trackSettingsRef.current = videoTrack.getSettings();
        }
        getStreamRelativeCoordinates(e, trackSettingsRef.current);
      };
      window.addEventListener("mousemove", handleMouseMove, { capture: true, passive: true });
      moveListenerRef.current = handleMouseMove;

      // Attach global click logging listener scaled to video stream
      const handleClick = (e: MouseEvent) => {
        const coords = getStreamRelativeCoordinates(e, trackSettingsRef.current);
        const relTime = Math.max(0.1, Math.round(((performance.now() - startTime) / 1000) * 10) / 10);

        const newClick: ClickEvent = {
          id: `rec-click-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          timestamp: relTime,
          x: coords.x,
          y: coords.y,
          zoom: defaultZoomScale,
          label: `Logged Click (${Math.round(coords.x * 100)}%, ${Math.round(coords.y * 100)}%)`,
          enabled: true,
        };

        recordedClicksRef.current.push(newClick);
        setClickCount(recordedClicksRef.current.length);
      };

      window.addEventListener("mousedown", handleClick, true);
      clickListenerRef.current = handleClick;

      // Begin recording in 500ms time slices
      recorder.start(500);
      return true;
    } catch (err: unknown) {
      if (err instanceof Error && err.name !== "NotAllowedError") {
        setError(err.message || "Failed to start screen recording.");
        setTimeout(() => setError(null), 5000);
      }
      return false;
    }
  }, [defaultZoomScale, stopRecording]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (clickListenerRef.current) {
        window.removeEventListener("mousedown", clickListenerRef.current, true);
      }
      if (moveListenerRef.current) {
        window.removeEventListener("mousemove", moveListenerRef.current, true);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  return {
    isRecording,
    recordingDuration,
    clickCount,
    error,
    clearError,
    startRecording,
    stopRecording,
  };
}
