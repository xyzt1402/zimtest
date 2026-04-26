import { useCallback, useEffect, useRef, useState } from 'react';

export interface UseVideoPlayerReturn {
    isReady: boolean;
    isPlaying: boolean;
    isBuffering: boolean;
    progress: number;
    duration: number;
    currentTime: number;
    isMuted: boolean;
    volume: number;
    playVideo: () => void;
    pauseVideo: () => void;
    togglePlayPause: () => void;
    seek: (pct: number) => void;
    setVolume: (v: number) => void;
    toggleMute: () => void;
    videoRef: React.RefObject<HTMLVideoElement | null>;
}

export function useVideoPlayer(videoUrl: string | undefined): UseVideoPlayerReturn {
    const [isReady, setIsReady] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isBuffering, setIsBuffering] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [isMuted, setIsMuted] = useState(true);
    const [volume, setVolumeState] = useState(1);

    const videoRef = useRef<HTMLVideoElement | null>(null);
    const hlsRef = useRef<InstanceType<typeof import('hls.js').default> | null>(null);

    useEffect(() => {
        if (!videoUrl) {
            return;
        }

        const video = videoRef.current;
        if (!video) {
            return;
        }

        setIsReady(false);
        let isCancelled = false;
        let cleanup = () => {};

        import('hls.js').then(({ default: Hls }) => {
            if (isCancelled) {
                return;
            }

            if (Hls.isSupported()) {
                const hls = new Hls({ debug: false, enableWorker: true, lowLatencyMode: true });
                hlsRef.current = hls;
                hls.loadSource(videoUrl);
                hls.attachMedia(video);
                hls.on(Hls.Events.MANIFEST_PARSED, () => {
                    if (!isCancelled) {
                        setIsReady(true);
                    }
                });
                hls.on(Hls.Events.ERROR, (_: unknown, details: { fatal: boolean }) => {
                    if (details.fatal && !isCancelled) {
                        setIsReady(true);
                    }
                });
                cleanup = () => {
                    hls.destroy();
                    hlsRef.current = null;
                };
                return;
            }

            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = videoUrl;
                if (!isCancelled) {
                    setIsReady(true);
                }
                cleanup = () => {
                    video.src = '';
                };
            }
        });

        return () => {
            isCancelled = true;
            cleanup();
        };
    }, [videoUrl]);

    const playVideo = useCallback(() => {
        const video = videoRef.current;
        if (!video || !isReady) {
            return;
        }
        video.play().catch(() => {});
    }, [isReady]);

    const pauseVideo = useCallback(() => {
        videoRef.current?.pause();
    }, []);

    const togglePlayPause = useCallback(() => {
        const video = videoRef.current;
        if (!video) {
            return;
        }

        if (video.paused) {
            video.play().catch(() => {});
            return;
        }

        video.pause();
    }, []);

    const seek = useCallback((pct: number) => {
        const video = videoRef.current;
        if (!video || !video.duration) {
            return;
        }
        video.currentTime = (pct / 100) * video.duration;
    }, []);

    const setVolume = useCallback((value: number) => {
        const video = videoRef.current;
        if (!video) {
            return;
        }

        const clamped = Math.max(0, Math.min(1, value));
        video.volume = clamped;
        video.muted = clamped === 0;
        setVolumeState(clamped);
        setIsMuted(clamped === 0);
    }, []);

    const toggleMute = useCallback(() => {
        const video = videoRef.current;
        if (!video) {
            return;
        }

        video.muted = !video.muted;
        setIsMuted(video.muted);
    }, []);

    const handleTimeUpdate = useCallback(() => {
        const video = videoRef.current;
        if (!video || !video.duration) {
            return;
        }

        setCurrentTime(video.currentTime);
        setProgress((video.currentTime / video.duration) * 100);
    }, []);

    const handleDurationChange = useCallback(() => {
        const video = videoRef.current;
        if (video) {
            setDuration(video.duration || 0);
        }
    }, []);

    const handlePlay = useCallback(() => setIsPlaying(true), []);
    const handlePause = useCallback(() => setIsPlaying(false), []);
    const handleWaiting = useCallback(() => setIsBuffering(true), []);
    const handleCanPlay = useCallback(() => setIsBuffering(false), []);
    const handleVolumeChange = useCallback(() => {
        const video = videoRef.current;
        if (!video) {
            return;
        }
        setIsMuted(video.muted);
        setVolumeState(video.muted ? 0 : video.volume);
    }, []);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) {
            return;
        }

        video.addEventListener('timeupdate', handleTimeUpdate);
        video.addEventListener('durationchange', handleDurationChange);
        video.addEventListener('play', handlePlay);
        video.addEventListener('pause', handlePause);
        video.addEventListener('waiting', handleWaiting);
        video.addEventListener('canplay', handleCanPlay);
        video.addEventListener('volumechange', handleVolumeChange);

        return () => {
            video.removeEventListener('timeupdate', handleTimeUpdate);
            video.removeEventListener('durationchange', handleDurationChange);
            video.removeEventListener('play', handlePlay);
            video.removeEventListener('pause', handlePause);
            video.removeEventListener('waiting', handleWaiting);
            video.removeEventListener('canplay', handleCanPlay);
            video.removeEventListener('volumechange', handleVolumeChange);
        };
    }, [
        handleCanPlay,
        handleDurationChange,
        handlePause,
        handlePlay,
        handleTimeUpdate,
        handleVolumeChange,
        handleWaiting,
    ]);

    return {
        isReady,
        isPlaying,
        isBuffering,
        progress,
        duration,
        currentTime,
        isMuted,
        volume,
        playVideo,
        pauseVideo,
        togglePlayPause,
        seek,
        setVolume,
        toggleMute,
        videoRef,
    };
}

export function formatTime(sec: number): string {
    if (!isFinite(sec) || sec < 0) {
        return '0:00';
    }
    const minutes = Math.floor(sec / 60);
    const seconds = Math.floor(sec % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}
