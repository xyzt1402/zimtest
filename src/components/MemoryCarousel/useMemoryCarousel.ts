import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import type { MemoryMoment } from '../../data/memoryMoments';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface UseMemoryCarouselReturn {
    currentIndex: number;
    pendingAutoPlay: boolean;
    hoveredIndex: number | null;
    focusedIndex: number | null;
    currentMoment: MemoryMoment | null;
    totalMoments: number;
    initialIndex: number;
    prefersReducedMotion: boolean;
    navigateTo: (index: number, options?: { autoPlay?: boolean }) => void;
    setHoveredIndex: (index: number | null) => void;
    setFocusedIndex: (index: number | null) => void;
}

// ---------------------------------------------------------------------------
// Main carousel hook
// ---------------------------------------------------------------------------

export function useMemoryCarousel(moments: MemoryMoment[]): UseMemoryCarouselReturn {
    const initialIndex = useMemo(() => Math.floor(moments.length / 2), [moments.length]);

    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [pendingAutoPlay, setPendingAutoPlay] = useState(false);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

    // Detect prefers-reduced-motion
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
        if (typeof window === 'undefined') return false;
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    });

    useEffect(() => {
        const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
        const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
        mq.addEventListener('change', handler);
        return () => mq.removeEventListener('change', handler);
    }, []);

    /**
     * Single entry point for all navigation.
     * - Immediate: click card, click dot, keyboard arrows
     * - Deferred: hover ring completes → calls this too, just later
     *
     * autoPlay: true  → video starts as soon as the card becomes active
     * autoPlay: false → card shows static thumbnail, user must interact
     */
    const navigateTo = useCallback(
        (index: number, options?: { autoPlay?: boolean }) => {
            if (index < 0 || index >= moments.length) return;
            setCurrentIndex(index);
            setFocusedIndex(index);
            setPendingAutoPlay(options?.autoPlay ?? false);
        },
        [moments.length]
    );

    return {
        currentIndex,
        pendingAutoPlay,
        hoveredIndex,
        focusedIndex,
        currentMoment: moments[currentIndex] ?? null,
        totalMoments: moments.length,
        initialIndex,
        prefersReducedMotion,
        navigateTo,
        setHoveredIndex: useCallback((i) => setHoveredIndex(i), []),
        setFocusedIndex: useCallback((i) => setFocusedIndex(i), []),
    };
}

// ---------------------------------------------------------------------------
// useTilt — GPU-accelerated 3D card tilt via requestAnimationFrame
// ---------------------------------------------------------------------------

export function useTilt(maxDeg = 8, disabled = false) {
    const elRef = useRef<HTMLDivElement | null>(null);
    const current = useRef({ rx: 0, ry: 0 });
    const target = useRef({ rx: 0, ry: 0 });
    const rafId = useRef<number>(0);
    const hovered = useRef(false);

    useEffect(() => {
        const el = elRef.current;
        if (!el || disabled) return;

        const coarse = window.matchMedia('(pointer: coarse)').matches;
        const limit = coarse ? maxDeg / 2 : maxDeg;
        const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

        function animate() {
            const c = current.current;
            const t = target.current;
            c.rx = lerp(c.rx, t.rx, 0.1);
            c.ry = lerp(c.ry, t.ry, 0.1);
            el!.style.transform =
                `perspective(900px) rotateX(${c.rx}deg) rotateY(${c.ry}deg) translateZ(0)`;
            const moving = Math.abs(c.rx) > 0.01 || Math.abs(c.ry) > 0.01 || hovered.current;
            if (moving) {
                rafId.current = requestAnimationFrame(animate);
            } else {
                c.rx = 0; c.ry = 0;
                el!.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0)';
            }
        }

        let pendingRaf = false;
        function onMove(e: PointerEvent) {
            if (pendingRaf) return;
            pendingRaf = true;
            requestAnimationFrame(() => {
                pendingRaf = false;
                const rect = el!.getBoundingClientRect();
                const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
                const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
                target.current = { ry: nx * limit, rx: -ny * limit };
            });
        }

        function onEnter() {
            hovered.current = true;
            cancelAnimationFrame(rafId.current);
            rafId.current = requestAnimationFrame(animate);
        }

        function onLeave() {
            hovered.current = false;
            target.current = { rx: 0, ry: 0 };
        }

        el.style.willChange = 'transform';
        el.addEventListener('pointermove', onMove, { passive: true });
        el.addEventListener('pointerenter', onEnter);
        el.addEventListener('pointerleave', onLeave);

        return () => {
            el.removeEventListener('pointermove', onMove);
            el.removeEventListener('pointerenter', onEnter);
            el.removeEventListener('pointerleave', onLeave);
            cancelAnimationFrame(rafId.current);
            el.style.willChange = '';
            el.style.transform = '';
        };
    }, [disabled, maxDeg]);

    return elRef;
}

// ---------------------------------------------------------------------------
// Card layout constants
// ---------------------------------------------------------------------------

export const CARD_CONFIG = {
    CENTER_WIDTH: 420,
    CENTER_HEIGHT: 764,
    /** 10% smaller per step outward */
    SCALE_REDUCTION: 0.10,
    GAP: 24,
    MAX_VISIBLE: 3,
} as const;

// ---------------------------------------------------------------------------
// Layout helpers
// ---------------------------------------------------------------------------

export function getCardScale(index: number, currentIndex: number): number {
    return Math.max(0.4, 1 - Math.abs(index - currentIndex) * CARD_CONFIG.SCALE_REDUCTION);
}

export function getCardWidth(scale: number): number {
    return CARD_CONFIG.CENTER_WIDTH * scale;
}

export function getCardHeight(scale: number): number {
    return CARD_CONFIG.CENTER_HEIGHT * scale;
}

export function getCardOffset(index: number, currentIndex: number): number {
    const dist = index - currentIndex;
    if (dist === 0) return 0;

    const sign = dist > 0 ? 1 : -1;
    let offset = 0;

    for (let step = 1; step <= Math.abs(dist); step++) {
        const prevScale = Math.max(0.4, 1 - (step - 1) * CARD_CONFIG.SCALE_REDUCTION);
        const curScale = Math.max(0.4, 1 - step * CARD_CONFIG.SCALE_REDUCTION);
        offset +=
            (CARD_CONFIG.CENTER_WIDTH * prevScale) / 2 +
            CARD_CONFIG.GAP +
            (CARD_CONFIG.CENTER_WIDTH * curScale) / 2;
    }

    return sign * offset;
}