"use client";

import { useState, useEffect, useCallback, useRef } from "react";

export function useVideoPlayback(videoRef: React.RefObject<HTMLVideoElement>) {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isLooping, setIsLooping] = useState<boolean>(true);
  const [isReady, setIsReady] = useState<boolean>(false);

  // Sync playback speed
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed, videoRef]);

  // Sync looping
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.loop = isLooping;
    }
  }, [isLooping, videoRef]);

  const play = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.play().then(() => setIsPlaying(true)).catch((e) => {
        console.warn("Autoplay / play thwarted:", e);
      });
    }
  }, [videoRef]);

  const pause = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, [videoRef]);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  // Pending seek tracking for buttery 60fps real-time scrubbing without decoder stall
  const pendingSeekRef = useRef<number | null>(null);
  const rafSeekIdRef = useRef<number | null>(null);

  const applySeekToVideo = useCallback((video: HTMLVideoElement, targetTime: number) => {
    const fastSeekVideo = video as HTMLVideoElement & { fastSeek?: (time: number) => void };
    if (typeof fastSeekVideo.fastSeek === "function") {
      try {
        fastSeekVideo.fastSeek(targetTime);
        return;
      } catch {
        // Fallback to setting currentTime
      }
    }
    try {
      video.currentTime = targetTime;
    } catch {
      // Ignore if decoder is busy
    }
  }, []);

  const seek = useCallback(
    (targetTime: number) => {
      const video = videoRef.current;
      if (video) {
        const maxTime = video.duration && !isNaN(video.duration) && video.duration > 0 ? video.duration : targetTime;
        const clamped = Math.max(0, Math.min(maxTime, targetTime));

        // Immediately update React time state for zero-latency UI response
        setCurrentTime(clamped);

        // Throttle hardware video decoder calls to 60fps using requestAnimationFrame
        pendingSeekRef.current = clamped;
        if (rafSeekIdRef.current === null) {
          rafSeekIdRef.current = requestAnimationFrame(() => {
            rafSeekIdRef.current = null;
            if (videoRef.current && pendingSeekRef.current !== null) {
              const destTime = pendingSeekRef.current;
              if (!videoRef.current.seeking) {
                applySeekToVideo(videoRef.current, destTime);
                pendingSeekRef.current = null;
              }
            }
          });
        }
      } else {
        setCurrentTime(Math.max(0, targetTime));
      }
    },
    [videoRef, applySeekToVideo]
  );

  const stepFrames = useCallback(
    (secondsDelta: number) => {
      if (videoRef.current) {
        seek(videoRef.current.currentTime + secondsDelta);
      }
    },
    [videoRef, seek]
  );

  // Wire HTML5 video events
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setDuration(video.duration || 0);
      setIsReady(true);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    const handleSeeked = () => {
      // Pick up latest requested seek if user scrubbed rapidly while decoder was busy
      if (video && pendingSeekRef.current !== null) {
        const nextTime = pendingSeekRef.current;
        pendingSeekRef.current = null;
        applySeekToVideo(video, nextTime);
      }
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => {
      if (!isLooping) setIsPlaying(false);
    };

    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("seeked", handleSeeked);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("ended", handleEnded);

    if (video.readyState >= 1) {
      setDuration(video.duration);
      setIsReady(true);
    }

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("seeked", handleSeeked);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("ended", handleEnded);
      if (rafSeekIdRef.current !== null) {
        cancelAnimationFrame(rafSeekIdRef.current);
      }
    };
  }, [videoRef, isLooping, applySeekToVideo]);

  // 60 FPS continuous real-time playhead sync during playback
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isPlaying) return;

    let animId: number;
    const syncLoop = () => {
      if (video && !video.paused && !video.ended) {
        setCurrentTime(video.currentTime);
        animId = requestAnimationFrame(syncLoop);
      }
    };

    animId = requestAnimationFrame(syncLoop);
    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isPlaying, videoRef]);

  return {
    isPlaying,
    currentTime,
    duration,
    playbackSpeed,
    isLooping,
    isReady,
    play,
    pause,
    togglePlay,
    seek,
    stepFrames,
    setPlaybackSpeed,
    setIsLooping,
  };
}
