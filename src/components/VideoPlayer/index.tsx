import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from 'react';
import type { MouseEvent, PointerEvent } from 'react';
import { useVideoPlayer } from './useVideoPlayer';
import { CenterPlaybackButton } from './CenterPlaybackButton';
import { VideoControls } from './VideoControls';
import { useControllerVisibility } from './useControllerVisibility';

interface VideoPlayerProps {
    isActive: boolean;
    shouldAutoPlayOnEnable?: boolean;
    isControllerEnabled: boolean;
    transitionDuration?: string;
    videoUrl?: string;
    onPlaybackStateChange?: (isPlaying: boolean) => void;
}

export interface VideoPlayerHandle {
    togglePlayPause: () => void;
}

export const VideoPlayer = forwardRef<VideoPlayerHandle, VideoPlayerProps>(
    function VideoPlayer(
        {
            isActive,
            shouldAutoPlayOnEnable = false,
            isControllerEnabled,
            transitionDuration,
            videoUrl,
            onPlaybackStateChange,
        },
        ref
    ) {
        const {
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
        } = useVideoPlayer(videoUrl);

        const seekBarRef = useRef<HTMLDivElement>(null);
        const volumeBarRef = useRef<HTMLDivElement>(null);
        const isDragging = useRef(false);
        const isDraggingVol = useRef(false);
        const previousControllerEnabledRef = useRef(isControllerEnabled);
        const { showController, revealController, keepControllerVisible } = useControllerVisibility();

        useImperativeHandle(ref, () => ({ togglePlayPause }), [togglePlayPause]);

        useEffect(() => {
            if (!isActive) pauseVideo();
        }, [isActive, pauseVideo]);

        useEffect(() => {
            const justEnabled = !previousControllerEnabledRef.current && isControllerEnabled;
            previousControllerEnabledRef.current = isControllerEnabled;
            if (justEnabled && isActive && shouldAutoPlayOnEnable) playVideo();
        }, [isActive, isControllerEnabled, playVideo, shouldAutoPlayOnEnable]);

        useEffect(() => {
            onPlaybackStateChange?.(isPlaying);
        }, [isPlaying, onPlaybackStateChange]);

        const handleSeekDown = useCallback((e: PointerEvent<HTMLDivElement>) => {
            e.stopPropagation();
            isDragging.current = true;
            seekBarRef.current?.setPointerCapture(e.pointerId);
            const rect = e.currentTarget.getBoundingClientRect();
            seek(Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100)));
        }, [seek]);

        const handleSeekMove = useCallback((e: PointerEvent<HTMLDivElement>) => {
            if (!isDragging.current) return;
            const rect = e.currentTarget.getBoundingClientRect();
            seek(Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100)));
        }, [seek]);

        const handleSeekUp = useCallback(() => { isDragging.current = false; }, []);

        const handleVolumeDown = useCallback((e: PointerEvent<HTMLDivElement>) => {
            e.stopPropagation();
            isDraggingVol.current = true;
            volumeBarRef.current?.setPointerCapture(e.pointerId);
            const rect = e.currentTarget.getBoundingClientRect();
            setVolume(Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)));
        }, [setVolume]);

        const handleVolumeMove = useCallback((e: PointerEvent<HTMLDivElement>) => {
            if (!isDraggingVol.current) return;
            const rect = e.currentTarget.getBoundingClientRect();
            setVolume(Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)));
        }, [setVolume]);

        const handleVolumeUp = useCallback(() => { isDraggingVol.current = false; }, []);

        const handlePlaybackToggle = useCallback((e: MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();
            togglePlayPause();
            revealController();
        }, [revealController, togglePlayPause]);

        if (!videoUrl) return null;

        return (
            <>
                {/* Pointer-capture overlay for controller reveal */}
                <div
                    className="absolute inset-0 z-17"
                    onPointerEnter={isActive && isControllerEnabled ? revealController : undefined}
                    onPointerMove={isActive && isControllerEnabled ? revealController : undefined}
                />

                {/* Video element */}
                <video
                    ref={videoRef}
                    className="absolute inset-0 z-2 size-full object-cover"
                    playsInline
                    muted
                    loop
                    preload="metadata"
                    style={{
                        // opacity is composited — not reflow
                        opacity: isPlaying ? 1 : 0,
                        transition: transitionDuration ?? 'opacity 0.4s ease',
                    }}
                />

                {/* Centre play/pause button */}
                {isActive && isControllerEnabled && (!isPlaying || showController) && (
                    <CenterPlaybackButton isPlaying={isPlaying} onToggle={handlePlaybackToggle} />
                )}

                {/* Buffering spinner */}
                {isBuffering && isActive && (
                    <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40">
                        <div className="mc-spinner" />
                    </div>
                )}

                {/* Controls bar */}
                {isActive && isControllerEnabled && (
                    <VideoControls
                        currentTime={currentTime}
                        duration={duration}
                        isMuted={isMuted}
                        isPlaying={isPlaying}
                        seekBarRef={seekBarRef}
                        showController={showController}
                        transitionDuration={transitionDuration}
                        videoProgress={progress}
                        volume={volume}
                        volumeBarRef={volumeBarRef}
                        onControllerEnter={keepControllerVisible}
                        onControllerLeave={revealController}
                        onSeekDown={handleSeekDown}
                        onSeekMove={handleSeekMove}
                        onSeekUp={handleSeekUp}
                        onToggleMute={(e) => { e.stopPropagation(); toggleMute(); }}
                        onTogglePlayPause={(e) => { e.stopPropagation(); togglePlayPause(); }}
                        onVolumeDown={handleVolumeDown}
                        onVolumeMove={handleVolumeMove}
                        onVolumeUp={handleVolumeUp}
                    />
                )}
            </>
        );
    }
);