import { useEffect, useRef, useState } from 'react';

interface CarouselDotsProps {
    total: number;
    currentIndex: number;
    prefersReducedMotion: boolean;
    onNavigate: (index: number) => void;
}

const MAX_VISIBLE = 5;

/**
 * Paginator that shows at most 5 dots at a time.
 *
 * Window logic:
 *   - Keep the active dot as centred as possible within the 5-dot viewport.
 *   - Clamp the window start so it never goes below 0 or above (total - 5).
 *   - When the total is ≤ 5 every dot is always visible (no sliding needed).
 *
 * Transitions:
 *   - The strip slides horizontally via a CSS transform so all motion is
 *     GPU-composited and never triggers reflow.
 *   - The active dot expands its width; inactive dots shrink.
 *   - Dots that are about to leave the viewport fade out via opacity scaling.
 */
export function CarouselDots({
    total,
    currentIndex,
    prefersReducedMotion,
    onNavigate,
}: CarouselDotsProps) {
    // ── window start index ──────────────────────────────────────────────────
    const [windowStart, setWindowStart] = useState(() =>
        computeWindowStart(currentIndex, total)
    );

    // Delay window shift slightly so the active dot's expand animation plays
    // before the strip slides — feels more intentional.
    const shiftTimerRef = useRef<ReturnType<typeof setTimeout>>(null);

    useEffect(() => {
        const next = computeWindowStart(currentIndex, total);
        if (next === windowStart) return;

        if (shiftTimerRef.current) clearTimeout(shiftTimerRef.current);
        // Small delay so active-dot expansion renders before the strip moves.
        shiftTimerRef.current = setTimeout(
            () => setWindowStart(next),
            prefersReducedMotion ? 0 : 120
        );
        return () => {
            if (shiftTimerRef.current) clearTimeout(shiftTimerRef.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentIndex, total]);

    const visibleCount = Math.min(total, MAX_VISIBLE);
    const visibleIndices = Array.from({ length: visibleCount }, (_, i) => windowStart + i);

    const transition = prefersReducedMotion
        ? 'none'
        : 'transform 0.35s cubic-bezier(0.4,0,0.2,1)';

    return (
        <div
            role="tablist"
            aria-label="Carousel navigation"
            // Clip to exactly 5 dot slots so entering/leaving dots are hidden.
            className="relative flex items-center justify-center overflow-hidden"
            style={{
                // Each slot: 20px active width or 6px inactive + 5px gap on each side.
                // We fix the outer width to the 5-slot max so it never jumps.
                width: `${visibleCount * 6 + (visibleCount - 1) * 5 + (20 - 6)}px`,
                height: '20px',
            }}
        >
            {/* Sliding strip — translate to reveal the correct window */}
            <div
                className="flex items-center"
                style={{
                    gap: '5px',
                    transform: 'translateX(0)',   // strip always starts at 0; we move dots in/out
                    transition,
                    willChange: prefersReducedMotion ? 'auto' : 'transform',
                }}
            >
                {visibleIndices.map((dotIndex) => {
                    const isActive = dotIndex === currentIndex;
                    // Dots at the edges of the window get a subtle size reduction
                    // to hint that more content exists beyond.
                    const edgeFade =
                        total > MAX_VISIBLE &&
                        (dotIndex === windowStart || dotIndex === windowStart + visibleCount - 1);

                    return (
                        <button
                            key={dotIndex}
                            role="tab"
                            aria-selected={isActive}
                            aria-label={`Go to slide ${dotIndex + 1}`}
                            onClick={() => onNavigate(dotIndex)}
                            className="shrink-0 cursor-pointer border-none p-0 bg-white rounded-full focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
                            style={{
                                width: isActive ? '20px' : '6px',
                                height: '6px',
                                opacity: isActive ? 1 : edgeFade ? 0.25 : 0.4,
                                transition: prefersReducedMotion
                                    ? 'none'
                                    : 'width 0.3s cubic-bezier(0.4,0,0.2,1), opacity 0.3s ease',
                            }}
                        />
                    );
                })}
            </div>
        </div>
    );
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function computeWindowStart(activeIndex: number, total: number): number {
    if (total <= MAX_VISIBLE) return 0;
    const ideal = activeIndex - Math.floor(MAX_VISIBLE / 2);
    return Math.max(0, Math.min(ideal, total - MAX_VISIBLE));
}