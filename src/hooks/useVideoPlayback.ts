"use client";

import { useState, useEffect, useCallback } from "react";

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

  const seek = useCallback(
    (targetTime: number) => {
      const video = videoRef.current;
      if (video) {
        const maxTime = video.duration && !isNaN(video.duration) && video.duration > 0 ? video.duration : targetTime;
        const clamped = Math.max(0, Math.min(maxTime, targetTime));
        try {
          video.currentTime = clamped;
        } catch {
          // Ignore if video element cannot seek yet
        }
        setCurrentTime(clamped);
      } else {
        setCurrentTime(Math.max(0, targetTime));
      }
    },
    [videoRef]
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

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => {
      if (!isLooping) setIsPlaying(false);
    };

    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("timeupdate", handleTimeUpdate);
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
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("ended", handleEnded);
    };
  }, [videoRef, isLooping]);

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
