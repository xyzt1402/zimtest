import { useCallback, useEffect, useRef, useState } from 'react';

const RING_FILL_MS = 1500;

const ONE_HUNDRED_PCT = 100;

export function useHoverProgress() {
    const [isHovering, setIsHovering] = useState(false);
    const [hoverProgress, setHoverProgress] = useState(0);

    const fillRafRef = useRef<number>(0);
    const fillStartRef = useRef<number>(0);
    const onCompleteRef = useRef<(() => void) | null>(null);

    useEffect(() => () => cancelAnimationFrame(fillRafRef.current), []);

    const startHover = useCallback((onComplete: () => void) => {
        setIsHovering(true);
        onCompleteRef.current = onComplete;
        setHoverProgress(0);
        fillStartRef.current = performance.now();

        cancelAnimationFrame(fillRafRef.current);

        function tick(now: number) {
            const pct = Math.min(((now - fillStartRef.current) / RING_FILL_MS) * ONE_HUNDRED_PCT, ONE_HUNDRED_PCT);
            setHoverProgress(pct);

            if (pct < ONE_HUNDRED_PCT) {
                fillRafRef.current = requestAnimationFrame(tick);
                return;
            }

            onCompleteRef.current?.();
            onCompleteRef.current = null;
        }

        fillRafRef.current = requestAnimationFrame(tick);
    }, []);

    const endHover = useCallback(() => {
        setIsHovering(false);
        cancelAnimationFrame(fillRafRef.current);
        setHoverProgress(0);
        onCompleteRef.current = null;
    }, []);

    return {
        hoverProgress,
        isHovering,
        startHover,
        endHover,
    };
}
