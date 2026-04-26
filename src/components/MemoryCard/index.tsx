import { useCallback, useImperativeHandle, useRef, useState, forwardRef } from 'react';
import type { MemoryMoment } from '../../data/memoryMoments';
import { useHoverProgress } from './useHoverProgress';
import { useTilt } from '../MemoryCarousel/useMemoryCarousel';
import { HoverProgressRing } from '../VideoPlayer/HoverProgressRing';
import { MemoryCardCaption } from '../VideoPlayer/MemoryCardCaption';
import { VideoPlayer, type VideoPlayerHandle } from '../VideoPlayer';

interface MemoryCardProps {
    moment: MemoryMoment;
    isActive: boolean;
    shouldAutoPlay: boolean;
    onHover: (id: number | null) => void;
    onSelect: (options?: { autoPlay?: boolean }) => void;
    cardWidth: number;
    cardHeight: number;
    prefersReducedMotion: boolean;
    isKeyboardFocused?: boolean;
}

export interface MemoryCardHandle {
    togglePlayPause: () => void;
}

const RING = {
    SIZE: 72,
    RADIUS: 30,
    STROKE: 3,
    get CIRCUMFERENCE() {
        return 2 * Math.PI * this.RADIUS;
    },
} as const;

function ringOffset(pct: number) {
    return RING.CIRCUMFERENCE * (1 - pct / 100);
}

export const MemoryCard = forwardRef<MemoryCardHandle, MemoryCardProps>(function MemoryCard({
    moment,
    isActive,
    shouldAutoPlay,
    onHover,
    onSelect,
    cardWidth,
    cardHeight,
    prefersReducedMotion,
    isKeyboardFocused = false,
}, ref) {
    const { hoverProgress, isHovering, startHover, endHover } = useHoverProgress();

    const tiltRef = useTilt(7, prefersReducedMotion || isActive);
    const imgLayerRef = useRef<HTMLDivElement>(null);
    const captionLayerRef = useRef<HTMLDivElement>(null);
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);


    const [hoverUnlocked, setHoverUnlocked] = useState(false);
    const isControllerUnlocked = isActive && (shouldAutoPlay || hoverUnlocked);

    // Ref for the in-carousel VideoPlayer
    const videoPlayerRef = useRef<VideoPlayerHandle>(null);

    useImperativeHandle(ref, () => ({
        togglePlayPause: () => {

            videoPlayerRef.current?.togglePlayPause();

        },
    }), []);

    const resetParallax = useCallback(() => {
        if (imgLayerRef.current) {
            imgLayerRef.current.style.transform = 'scale(1.06) translate(0,0)';
        }
        if (captionLayerRef.current) {
            captionLayerRef.current.style.transform = 'translate(0,0)';
        }
    }, []);

    const handleClick = useCallback(() => {
        if (isActive) return;
        endHover();
        onSelect({ autoPlay: true });
    }, [isActive, endHover, onSelect]);

    const handlePointerEnter = useCallback(() => {
        onHover(moment.id);

        if (!moment.videoUrl) return;

        if (!isActive) {
            if (!prefersReducedMotion) {
                startHover(() => onSelect({ autoPlay: true }));
            }
            return;
        }

        if (!isVideoPlaying && !isControllerUnlocked) {
            if (prefersReducedMotion) {
                setHoverUnlocked(true);
            } else {
                startHover(() => {
                    setHoverUnlocked(true);
                    endHover();
                });
            }
        }
    }, [
        endHover,
        isActive,
        isControllerUnlocked,
        isVideoPlaying,
        moment.id,
        moment.videoUrl,
        onHover,
        onSelect,
        prefersReducedMotion,
        startHover,
    ]);

    const handlePointerLeave = useCallback(() => {
        onHover(null);
        resetParallax();
        if (!isActive || (!isVideoPlaying && !isControllerUnlocked)) {
            endHover();
        }
    }, [endHover, isActive, isControllerUnlocked, isVideoPlaying, onHover, resetParallax]);

    // ── Derived display flags ────────────────────────────────────────────────

    const dur = prefersReducedMotion ? '0ms' : undefined;
    const ringDash = ringOffset(hoverProgress);
    const showIdleHoverEffect = !isVideoPlaying;
    const showLoadingRing = !isActive || (!isVideoPlaying && !isControllerUnlocked);

    // Shared card content — rendered both in the carousel and in the fullscreen overlay.
    // `forFullscreen` switches the VideoPlayer ref and disables the tilt / hover effects.
    const cardContent = (forFullscreen: boolean) => (
        <>
            {/* ── Thumbnail image ── */}
            <div className="absolute inset-[-3%] z-1 overflow-hidden">
                <div
                    ref={forFullscreen ? undefined : imgLayerRef}
                    className="size-full will-change-transform"
                    style={{
                        transform: 'scale(1.06) translate(0,0)',
                        transition: dur ?? 'transform 0.15s ease-out',
                    }}
                >
                    <img
                        alt={moment.location}
                        src={moment.thumbnail}
                        loading="lazy"
                        decoding="async"
                        className="block size-full object-cover"
                        width={420}
                        height={764}
                    />
                </div>
            </div>

            {/* ── Video player ── */}
            <VideoPlayer
                ref={videoPlayerRef}
                isActive={isActive}
                shouldAutoPlayOnEnable={forFullscreen ? true : shouldAutoPlay}
                isControllerEnabled={forFullscreen ? true : isControllerUnlocked}
                transitionDuration={dur}
                videoUrl={moment.videoUrl}
                onPlaybackStateChange={forFullscreen ? undefined : setIsVideoPlaying}
            />

            {/* ── Persistent bottom-to-top gradient scrim ── */}
            <div
                className="pointer-events-none absolute inset-0 z-3"
                style={{
                    background: 'linear-gradient(180deg,rgba(0,0,0,0.1) 0%,rgba(0,0,0,0) 40%,rgba(0,0,0,0.55) 100%)',
                }}
            />

            {/* ── Darker hover scrim (idle state only, not shown in fullscreen) ── */}
            {!forFullscreen && showIdleHoverEffect && (
                <div
                    className="mc-reveal-overlay pointer-events-none absolute inset-0 z-4 opacity-0 transition-opacity duration-350 ease-in-out"
                    style={{
                        background: 'linear-gradient(180deg,rgba(0,0,0,0) 0%,rgba(0,0,0,0.25) 40%,rgba(0,0,0,0.8) 100%)',
                    }}
                />
            )}

            {/* ── Active-card inset border ring ── */}
            {isActive && !forFullscreen && (
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 z-5 rounded-2xl shadow-[inset_0_0_0_2px_rgba(255,255,255,0.3)]"
                />
            )}

            {/* ── Circular progress ring ── */}
            {!forFullscreen && showLoadingRing && (
                <HoverProgressRing
                    circumference={RING.CIRCUMFERENCE}
                    isVisible={isHovering}
                    radius={RING.RADIUS}
                    size={RING.SIZE}
                    stroke={RING.STROKE}
                    strokeDashoffset={ringDash}
                    transitionDuration={dur ?? 'opacity 0.15s ease'}
                />
            )}

            {/* ── Location + caption overlay ── */}
            {showIdleHoverEffect && (
                <MemoryCardCaption
                    captionLayerRef={captionLayerRef}
                    moment={moment}
                    transitionDuration={dur ?? 'transform 0.12s ease-out'}
                />
            )}
        </>
    );

    return (
        <>
            {/* ── In-carousel card ── */}
            <div
                ref={tiltRef}
                className="will-change-transform transform-3d"
                style={{
                    width: `${cardWidth}px`,
                    height: `${cardHeight}px`,
                    transform: 'perspective(900px) translateZ(0)',
                }}
                onPointerEnter={handlePointerEnter}
                onPointerLeave={handlePointerLeave}
                onClick={handleClick}
            >
                <div
                    className="mc-outer group/card relative size-full overflow-hidden rounded-2xl outline-none contain-[layout_style_paint]"
                    tabIndex={isActive ? -1 : 0}
                    role="button"
                    data-keyboard-focused={isKeyboardFocused ? 'true' : undefined}
                    aria-label={`Memory at ${moment.location}${moment.caption ? ': ' + moment.caption.slice(0, 60) : ''}`}
                    aria-pressed={isActive}
                    onFocus={() => onHover(moment.id)}
                    onBlur={() => onHover(null)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            endHover();
                            onSelect({ autoPlay: true });
                        }
                    }}
                    style={{
                        boxShadow: '0 16px 32px rgba(0,0,0,0.18)',
                    }}
                >
                    {cardContent(false)}
                </div>
            </div>
        </>
    );
});