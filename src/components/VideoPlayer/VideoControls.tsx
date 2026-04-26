import type { MouseEvent, PointerEvent, RefObject } from 'react';
import { formatTime } from './useVideoPlayer';
import { MutedIcon, PauseIcon, PlayIcon, SpeakerIcon } from './icons';

interface VideoControlsProps {
    currentTime: number;
    duration: number;
    isMuted: boolean;
    isPlaying: boolean;
    seekBarRef: RefObject<HTMLDivElement | null>;
    showController: boolean;
    transitionDuration?: string;
    videoProgress: number;
    volume: number;
    volumeBarRef: RefObject<HTMLDivElement | null>;
    onControllerEnter: () => void;
    onControllerLeave: () => void;
    onSeekDown: (e: PointerEvent<HTMLDivElement>) => void;
    onSeekMove: (e: PointerEvent<HTMLDivElement>) => void;
    onSeekUp: () => void;
    onToggleMute: (e: MouseEvent<HTMLButtonElement>) => void;
    onTogglePlayPause: (e: MouseEvent<HTMLButtonElement>) => void;
    onVolumeDown: (e: PointerEvent<HTMLDivElement>) => void;
    onVolumeMove: (e: PointerEvent<HTMLDivElement>) => void;
    onVolumeUp: () => void;
}

export function VideoControls({
    currentTime,
    duration,
    isMuted,
    isPlaying,
    seekBarRef,
    showController,
    transitionDuration,
    videoProgress,
    volume,
    volumeBarRef,
    onControllerEnter,
    onControllerLeave,
    onSeekDown,
    onSeekMove,
    onSeekUp,
    onToggleMute,
    onTogglePlayPause,
    onVolumeDown,
    onVolumeMove,
    onVolumeUp,
}: VideoControlsProps) {
    const clampedVideoProgress = Math.max(0, Math.min(100, videoProgress));
    const seekScale = clampedVideoProgress / 100;
    const clampedVolumeProgress = Math.max(0, Math.min(1, isMuted ? 0 : volume));

    return (
        <div
            className="mc-controller absolute inset-x-0 bottom-0 z-20 will-change-transform px-3.5 pb-3.5 pt-10"
            style={{
                // gradient background can't be expressed without arbitrary Tailwind
                background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 70%, transparent 100%)',
                // transform drives show/hide — kept as style since it's dynamic
                transform: showController ? 'translateY(0)' : 'translateY(100%)',
                transition: transitionDuration ?? 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
            }}
            onPointerEnter={onControllerEnter}
            onPointerLeave={onControllerLeave}
        >
            {/* ── Seek bar ── */}
            <div
                ref={seekBarRef}
                onPointerDown={onSeekDown}
                onPointerMove={onSeekMove}
                onPointerUp={onSeekUp}
                className="mb-2 flex h-4 cursor-pointer items-center touch-none"
                role="slider"
                aria-label="Seek"
                aria-valuenow={Math.round(videoProgress)}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuetext={`${formatTime(currentTime)} of ${formatTime(duration)}`}
            >
                <div className="relative h-0.75 w-full rounded-xs bg-white/25">
                    {/* Filled track */}
                    <div
                        className="absolute inset-0 rounded-xs bg-white will-change-transform origin-left"
                        style={{
                            transform: `scaleX(${seekScale})`,
                            transition: 'transform 0.25s linear',
                        }}
                    />
                    {/* Thumb */}
                    <div
                        className="absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_4px_rgba(0,0,0,0.4)] will-change-transform"
                        style={{
                            left: `${clampedVideoProgress}%`,
                            transition: 'left 0.25s linear',
                        }}
                    />
                </div>
            </div>

            {/* ── Controls row ── */}
            <div className="flex items-center gap-2">
                <button
                    onClick={onTogglePlayPause}
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                    className="mc-ctrl-btn"
                >
                    {isPlaying ? <PauseIcon /> : <PlayIcon />}
                </button>

                <span className="shrink-0 whitespace-nowrap text-[11px] text-white/80 [font-variant-numeric:tabular-nums]">
                    {formatTime(currentTime)} / {formatTime(duration)}
                </span>

                <div className="flex-1" />

                <button
                    onClick={onToggleMute}
                    aria-label={isMuted ? 'Unmute' : 'Mute'}
                    className="mc-ctrl-btn"
                >
                    {isMuted || volume === 0 ? <MutedIcon /> : <SpeakerIcon />}
                </button>

                {/* Volume bar */}
                <div
                    ref={volumeBarRef}
                    onPointerDown={onVolumeDown}
                    onPointerMove={onVolumeMove}
                    onPointerUp={onVolumeUp}
                    className="flex h-4 w-14 shrink-0 cursor-pointer items-center touch-none"
                    role="slider"
                    aria-label="Volume"
                    aria-valuenow={Math.round((isMuted ? 0 : volume) * 100)}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuetext={`${Math.round((isMuted ? 0 : volume) * 100)} percent`}
                >
                    <div className="relative h-0.75 w-full rounded-xs bg-white/25">
                        <div
                            className="absolute inset-0 rounded-xs bg-white will-change-transform origin-left"
                            style={{ transform: `scaleX(${clampedVolumeProgress})` }}
                        />
                    </div>
                </div>

            </div>
        </div>
    );
}