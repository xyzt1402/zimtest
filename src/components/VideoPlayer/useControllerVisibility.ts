import { useCallback, useEffect, useRef, useState } from 'react';

const AUTO_HIDE_MS = 3000;

export function useControllerVisibility() {
    const [showController, setShowController] = useState(false);
    const controllerTimerRef = useRef<ReturnType<typeof setTimeout>>(null);

    const clearHideTimer = useCallback(() => {
        if (controllerTimerRef.current) {
            clearTimeout(controllerTimerRef.current);
            controllerTimerRef.current = null;
        }
    }, []);

    const revealController = useCallback(() => {
        setShowController(true);
        clearHideTimer();
        controllerTimerRef.current = setTimeout(() => setShowController(false), AUTO_HIDE_MS);
    }, [clearHideTimer]);

    const keepControllerVisible = useCallback(() => {
        setShowController(true);
        clearHideTimer();
    }, [clearHideTimer]);

    useEffect(() => clearHideTimer, [clearHideTimer]);

    return {
        showController,
        revealController,
        keepControllerVisible,
    };
}
