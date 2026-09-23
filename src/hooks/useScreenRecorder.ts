"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { ClickEvent, CursorPoint, VideoMetadata } from "@/types/editor";
import { desktopBridge } from "@/lib/desktopBridge";
import { clusterNearbyClicks } from "@/utils/clickClusterer";

export interface ScreenRecorderResult {
  blobUrl: string;
  metadata: VideoMetadata;
  events: ClickEvent[];
  webcamBlobUrl?: string | null;
  videoBlob?: Blob | null;
  webcamBlob?: Blob | null;
}

export interface UseScreenRecorderOptions {
  onImportRecording: (result: ScreenRecorderResult) => void;
  defaultZoomScale?: number;
  enableWebcam?: boolean;
  webcamDeviceId?: string | null;
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
  const displaySurface = streamSettings?.displaySurface;

  let relX = 0.5;
  let relY = 0.5;

  if (displaySurface === "browser" || displaySurface === "window") {
    // Tab or window captured
    relX = e.clientX / (window.innerWidth || 1);
    relY = e.clientY / (window.innerHeight || 1);
  } else {
    // Entire monitor captured: normalize with respect to stream dimensions and handle multi-monitor coordinate offsets
    const sW = streamW > 0 ? streamW : (typeof window !== "undefined" ? window.screen.width : 1920);
    const sH = streamH > 0 ? streamH : (typeof window !== "undefined" ? window.screen.height : 1080);
    let sx = e.screenX;
    let sy = e.screenY;
    if (sx >= sW) sx = sx % sW;
    else if (sx < 0) sx = ((sx % sW) + sW) % sW;
    if (sy >= sH) sy = sy % sH;
    else if (sy < 0) sy = ((sy % sH) + sH) % sH;
    relX = sx / sW;
    relY = sy / sH;
  }

  return {
    x: Math.max(0.02, Math.min(0.98, Math.round(relX * 1000) / 1000)),
    y: Math.max(0.02, Math.min(0.98, Math.round(relY * 1000) / 1000)),
  };
}

export function useScreenRecorder({
  onImportRecording,
  defaultZoomScale = 2.2,
  enableWebcam = false,
  webcamDeviceId = null,
}: UseScreenRecorderOptions) {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingDuration, setRecordingDuration] = useState<number>(0);
  const [clickCount, setClickCount] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  // Live webcam stream state for live preview during recording
  const [liveWebcamStream, setLiveWebcamStream] = useState<MediaStream | null>(null);
  const [availableCameras, setAvailableCameras] = useState<{ deviceId: string; label: string }[]>([]);

  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  // Webcam separate recording refs
  const webcamStreamRef = useRef<MediaStream | null>(null);
  const webcamRecorderRef = useRef<MediaRecorder | null>(null);
  const webcamChunksRef = useRef<Blob[]>([]);
  const enableWebcamRef = useRef<boolean>(enableWebcam);
  const webcamDeviceIdRef = useRef<string | null | undefined>(webcamDeviceId);

  useEffect(() => {
    enableWebcamRef.current = enableWebcam;
  }, [enableWebcam]);

  useEffect(() => {
    webcamDeviceIdRef.current = webcamDeviceId;
  }, [webcamDeviceId]);

  const startTimeRef = useRef<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const recordedClicksRef = useRef<ClickEvent[]>([]);
  const recordedTrailRef = useRef<CursorPoint[]>([]);
  const clickListenerRef = useRef<((e: MouseEvent) => void) | null>(null);
  const moveListenerRef = useRef<((e: MouseEvent) => void) | null>(null);
  const trackSettingsRef = useRef<MediaTrackSettings | null>(null);

  // Enumerate videoinput camera devices
  const refreshCameras = useCallback(async (): Promise<{ deviceId: string; label: string }[]> => {
    if (typeof navigator !== "undefined" && navigator.mediaDevices?.enumerateDevices) {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const cams = devices
          .filter((d) => d.kind === "videoinput")
          .map((d, idx) => ({
            deviceId: d.deviceId,
            label: d.label || `Camera ${idx + 1}`,
          }));
        setAvailableCameras(cams);
        return cams;
      } catch {
        return [];
      }
    }
    return [];
  }, []);

  useEffect(() => {
    refreshCameras();
  }, [refreshCameras]);

  // Start webcam preview stream
  const startWebcamPreview = useCallback(
    async (preferredDeviceId?: string | null): Promise<MediaStream | null> => {
      if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
        setError("Camera access is not supported in this browser environment.");
        return null;
      }
      const devId = preferredDeviceId !== undefined ? preferredDeviceId : webcamDeviceId;
      try {
        // If an existing webcam stream is already active with the requested device, return it
        if (webcamStreamRef.current && webcamStreamRef.current.active) {
          const videoTrack = webcamStreamRef.current.getVideoTracks()[0];
          const currentDevId = videoTrack?.getSettings()?.deviceId;
          if (!devId || currentDevId === devId) {
            setLiveWebcamStream(webcamStreamRef.current);
            return webcamStreamRef.current;
          }
          // Device changed: stop old stream tracks
          webcamStreamRef.current.getTracks().forEach((t) => t.stop());
          webcamStreamRef.current = null;
        }

        const constraints: MediaStreamConstraints = {
          video: devId
            ? { deviceId: { exact: devId }, width: { ideal: 1920 }, height: { ideal: 1080 }, frameRate: { ideal: 30 } }
            : { width: { ideal: 1920 }, height: { ideal: 1080 }, frameRate: { ideal: 30 } },
          audio: false,
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        webcamStreamRef.current = stream;
        setLiveWebcamStream(stream);

        // Re-enumerate cameras now that permission has been granted so labels are populated
        await refreshCameras();
        return stream;
      } catch (err: unknown) {
        console.warn("[ScreenRecorder] Failed to start webcam preview:", err);
        const msg = err instanceof Error ? err.message : "Failed to access camera.";
        setError(msg);
        setTimeout(() => setError(null), 5000);
        return null;
      }
    },
    [webcamDeviceId, refreshCameras]
  );

  // Stop webcam preview stream
  const stopWebcamPreview = useCallback(() => {
    if (webcamStreamRef.current) {
      webcamStreamRef.current.getTracks().forEach((track) => track.stop());
      webcamStreamRef.current = null;
    }
    setLiveWebcamStream(null);
  }, []);

  // Automatically acquire or release live webcam stream when enableWebcam changes
  useEffect(() => {
    if (enableWebcam) {
      startWebcamPreview(webcamDeviceId);
    } else {
      if (!isRecording) {
        stopWebcamPreview();
      }
    }
  }, [enableWebcam, webcamDeviceId, isRecording, startWebcamPreview, stopWebcamPreview]);

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

    // Stop native global tracking across the entire OS (Tauri on Windows)
    try {
      const nativeResult = await desktopBridge.stopMouseTracking();
      if (nativeResult.clicks && nativeResult.clicks.length > 0) {
        // Authoritative OS-level clicks: use native clicks as the primary source
        recordedClicksRef.current = nativeResult.clicks.map((nc) => ({
          id: `rec-native-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          timestamp: nc.timestamp,
          x: nc.x,
          y: nc.y,
          zoom: defaultZoomScale,
          zoomInDuration: 0.4,
          holdDuration: 1.4,
          zoomOutDuration: 0.4,
          label: `Click (${Math.round(nc.x * 100)}%, ${Math.round(nc.y * 100)}%)`,
          enabled: true,
        }));
      }
      if (nativeResult.trail && nativeResult.trail.length > 0) {
        // Authoritative OS-level 50 FPS trajectory
        recordedTrailRef.current = nativeResult.trail;
      }
    } catch (err) {
      console.warn("[ScreenRecorder] Failed to get native mouse clicks/trail:", err);
    }

    // Process recorded webcam video if active
    let recordedWebcamBlobUrl: string | null = null;
    let recordedWebcamBlob: Blob | null = null;
    if (webcamRecorderRef.current) {
      const camRec = webcamRecorderRef.current;
      try {
        if (camRec.state !== "inactive") {
          await new Promise<void>((resolve) => {
            const timeoutId = setTimeout(() => resolve(), 2500);
            camRec.onstop = () => {
              clearTimeout(timeoutId);
              resolve();
            };
            if (camRec.state === "recording") {
              try {
                camRec.requestData();
              } catch {}
            }
            try {
              camRec.stop();
            } catch {
              resolve();
            }
          });
        }
      } catch (camErr) {
        console.warn("[ScreenRecorder] Error finalizing webcam recorder:", camErr);
      }
    }

    // Always assemble recorded webcam blob if chunks were captured
    if (webcamChunksRef.current && webcamChunksRef.current.length > 0) {
      try {
        const mimeType = webcamRecorderRef.current?.mimeType || "video/webm";
        const webcamBlob = new Blob(webcamChunksRef.current, { type: mimeType });
        if (webcamBlob.size > 0) {
          recordedWebcamBlob = webcamBlob;
          recordedWebcamBlobUrl = URL.createObjectURL(webcamBlob);
        }
      } catch (blobErr) {
        console.warn("[ScreenRecorder] Failed to create webcam blob URL:", blobErr);
      }
    }
    webcamRecorderRef.current = null;

    // Stop webcam stream tracks and clear live preview so it yields immediately to recorded playback
    if (webcamStreamRef.current) {
      webcamStreamRef.current.getTracks().forEach((track) => track.stop());
      webcamStreamRef.current = null;
    }
    setLiveWebcamStream(null);

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

          // Chromium WebM duration resolution: seeking to end resolves actual encoded media duration
          const resolveDurationAndImport = (actualDuration: number) => {
            const finalDuration = Math.max(0.5, actualDuration);
            const timeScale = elapsedSec > 0.5 ? finalDuration / elapsedSec : 1.0;

            // Align all recorded clicks and cursor points to the exact encoded video timeline
            const fullTrail = recordedTrailRef.current
              .map((p) => ({
                ...p,
                timestamp: Math.round(p.timestamp * timeScale * 100) / 100,
              }))
              .sort((a, b) => a.timestamp - b.timestamp);

            const sortedClicks = recordedClicksRef.current
              .map((c) => ({
                ...c,
                timestamp: Math.round(c.timestamp * timeScale * 100) / 100,
              }))
              .sort((a, b) => a.timestamp - b.timestamp);

            const clusteredClicks = clusterNearbyClicks(
              sortedClicks,
              0.8,
              defaultZoomScale,
              fullTrail
            );

            const dateStamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
            const metadata: VideoMetadata = {
              name: `screen-recording-${dateStamp}.webm`,
              duration: Math.round(finalDuration * 10) / 10,
              width: tempVideo.videoWidth || 1920,
              height: tempVideo.videoHeight || 1080,
              fileSize: `${(blob.size / (1024 * 1024)).toFixed(2)} MB`,
              url: blobUrl,
              webcamUrl: recordedWebcamBlobUrl || undefined,
              cursorTrail: fullTrail,
            };

            setIsRecording(false);
            setRecordingDuration(0);

            onImportRecording({
              blobUrl,
              metadata,
              events: clusteredClicks,
              webcamBlobUrl: recordedWebcamBlobUrl,
              videoBlob: blob,
              webcamBlob: recordedWebcamBlob,
            });
          };

          if (tempVideo.duration && isFinite(tempVideo.duration) && tempVideo.duration > 0) {
            resolveDurationAndImport(tempVideo.duration);
          } else {
            // Seek to 1e101 to force Chromium to parse final cluster and resolve finite duration
            tempVideo.currentTime = 1e101;
            tempVideo.onseeked = () => {
              tempVideo.onseeked = null;
              const resolved =
                isFinite(tempVideo.duration) && tempVideo.duration > 0
                  ? tempVideo.duration
                  : elapsedSec;
              resolveDurationAndImport(resolved);
            };
            // Fallback safety timeout if seeked event is delayed
            setTimeout(() => {
              if (tempVideo.onseeked) {
                tempVideo.onseeked = null;
                resolveDurationAndImport(elapsedSec);
              }
            }, 600);
          }
        };

        tempVideo.onerror = () => {
          // Fallback if metadata event is delayed
          const elapsedSec = (performance.now() - startTimeRef.current) / 1000;
          const fullTrail = [...recordedTrailRef.current].sort(
            (a, b) => a.timestamp - b.timestamp
          );
          const metadata: VideoMetadata = {
            name: `screen-recording-${Date.now()}.webm`,
            duration: Math.max(1, Math.round(elapsedSec * 10) / 10),
            width: 1920,
            height: 1080,
            fileSize: `${(blob.size / (1024 * 1024)).toFixed(2)} MB`,
            url: blobUrl,
            webcamUrl: recordedWebcamBlobUrl || undefined,
            cursorTrail: fullTrail,
          };

          setIsRecording(false);
          setRecordingDuration(0);

          const sortedClicks = [...recordedClicksRef.current].sort(
            (a, b) => a.timestamp - b.timestamp
          );
          const clusteredClicks = clusterNearbyClicks(
            sortedClicks,
            0.8,
            defaultZoomScale,
            fullTrail
          );

          onImportRecording({
            blobUrl,
            metadata,
            events: clusteredClicks,
            webcamBlobUrl: recordedWebcamBlobUrl,
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
  }, [onImportRecording, defaultZoomScale]);

  // Start recording handler
  const startRecording = useCallback(async (options?: { enableWebcam?: boolean }): Promise<boolean> => {
    setError(null);
    const shouldRecordWebcam =
      options?.enableWebcam !== undefined
        ? options.enableWebcam
        : (enableWebcamRef.current ?? enableWebcam);
    recordedClicksRef.current = [];
    recordedTrailRef.current = [];
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
          console.warn("[FucuFlow] Native Electron desktop stream fallback to getDisplayMedia:", electronErr);
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
              displaySurface: "monitor",
              width: { ideal: 3840, max: 3840 },
              height: { ideal: 2160, max: 2160 },
              frameRate: { ideal: 60, max: 60 },
            },
            audio: true,
          });
        } catch {
          stream = await navigator.mediaDevices.getDisplayMedia({
            video: {
              width: { ideal: 3840, max: 3840 },
              height: { ideal: 2160, max: 2160 },
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
        videoBitsPerSecond: 25000000, // 25 Mbps for ultra-crisp 4K/1080p text and UI detail
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
        // Enforce detail content hint so Chromium does not compress or blur sharp UI text
        if ("contentHint" in videoTrack) {
          (videoTrack as MediaStreamTrack & { contentHint?: string }).contentHint = "detail";
        }
        trackSettingsRef.current = videoTrack.getSettings();
        videoTrack.onended = () => {
          stopRecording();
        };
      }

      // Attach global mouse movement listener for continuous trajectory tracking
      let lastMoveMs = 0;
      const handleMouseMove = (e: MouseEvent) => {
        const now = performance.now();
        if (now - lastMoveMs < 25) return; // ~40 FPS sample rate
        lastMoveMs = now;
        if (videoTrack) {
          trackSettingsRef.current = videoTrack.getSettings();
        }
        const coords = getStreamRelativeCoordinates(e, trackSettingsRef.current);
        const baseStart = startTimeRef.current || now;
        const relTime = Math.max(0, Math.round(((now - baseStart) / 1000) * 100) / 100);
        recordedTrailRef.current.push({
          timestamp: relTime,
          x: coords.x,
          y: coords.y,
        });
      };
      window.addEventListener("mousemove", handleMouseMove, { capture: true, passive: true });
      moveListenerRef.current = handleMouseMove;

      // Attach global click logging listener scaled to video stream
      const handleClick = (e: MouseEvent) => {
        const coords = getStreamRelativeCoordinates(e, trackSettingsRef.current);
        const now = performance.now();
        const baseStart = startTimeRef.current || now;
        const relTime = Math.max(0.05, Math.round(((now - baseStart) / 1000) * 100) / 100);

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

      // Initialize secondary webcam recording if enabled BEFORE starting screen recorder
      if (shouldRecordWebcam) {
        try {
          const targetDevId = webcamDeviceIdRef.current !== undefined ? webcamDeviceIdRef.current : webcamDeviceId;
          let camStream = webcamStreamRef.current;
          if (
            !camStream ||
            !camStream.active ||
            camStream.getVideoTracks().length === 0 ||
            camStream.getVideoTracks()[0].readyState === "ended"
          ) {
            camStream = await startWebcamPreview(targetDevId);
          }

          if (camStream && camStream.active) {
            webcamStreamRef.current = camStream;
            setLiveWebcamStream(camStream);
            webcamChunksRef.current = [];

            let camMime = "video/webm;codecs=vp9";
            if (!MediaRecorder.isTypeSupported(camMime)) {
              camMime = "video/webm;codecs=vp8";
            }
            if (!MediaRecorder.isTypeSupported(camMime)) {
              camMime = "video/webm";
            }

            const camRecorder = new MediaRecorder(camStream, {
              mimeType: camMime,
              videoBitsPerSecond: 5000000,
            });
            webcamRecorderRef.current = camRecorder;
            camRecorder.ondataavailable = (ev) => {
              if (ev.data && ev.data.size > 0) {
                webcamChunksRef.current.push(ev.data);
              }
            };
            camRecorder.start(250);
          }
        } catch (camErr) {
          console.warn("[ScreenRecorder] Failed to initialize webcam recording:", camErr);
        }
      }

      // Synchronize recording start timestamp strictly with video frame 0
      const onRecordingStarted = () => {
        const startTime = performance.now();
        startTimeRef.current = startTime;
        setIsRecording(true);

        // Start native OS-level global mouse tracking in exact sync with video frame 0
        desktopBridge.startMouseTracking().catch((err) => {
          console.warn("[ScreenRecorder] Could not start native mouse tracker:", err);
        });

        // Start elapsed timer
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
          const sec = (performance.now() - startTime) / 1000;
          setRecordingDuration(sec);
        }, 200);
      };

      recorder.onstart = onRecordingStarted;

      // Begin recording in 500ms time slices
      recorder.start(500);
      if (!startTimeRef.current) {
        onRecordingStarted();
      }
      return true;
    } catch (err: unknown) {
      if (err instanceof Error && err.name !== "NotAllowedError") {
        setError(err.message || "Failed to start screen recording.");
        setTimeout(() => setError(null), 5000);
      }
      return false;
    }
  }, [defaultZoomScale, stopRecording, enableWebcam, webcamDeviceId, startWebcamPreview]);

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
      if (webcamStreamRef.current) {
        webcamStreamRef.current.getTracks().forEach((t) => t.stop());
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
    liveWebcamStream,
    availableCameras,
    startWebcamPreview,
    stopWebcamPreview,
    refreshCameras,
  };
}
