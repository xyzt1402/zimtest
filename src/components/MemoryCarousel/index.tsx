import {
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';
import {
    type MemoryMoment,
    memoryMomentsData,
    sectionConfig,
} from '../../data/memoryMoments';
import {
    useMemoryCarousel,
    getCardScale,
    CARD_CONFIG,
} from './useMemoryCarousel';
import { MemoryCard, type MemoryCardHandle } from '../MemoryCard';
import { CarouselDots } from '../CarouselDot';

interface MemoryCarouselProps {
    moments?: MemoryMoment[];
    title?: string;
    description?: string;
}

const RENDER_DISTANCE = CARD_CONFIG.MAX_VISIBLE + 1;
const CARD_RATIO = 764 / 420;

const DESKTOP_GAP = 48;
const TABLET_GAP = 32;
const MOBILE_OVERLAP = 0.65;

export function MemoryCarousel({
    moments = memoryMomentsData,
    title = sectionConfig.title,
    description = sectionConfig.description,
}: MemoryCarouselProps) {
    const {
        currentIndex,
        pendingAutoPlay,
        focusedIndex,
        setHoveredIndex,
        navigateTo,
        prefersReducedMotion,
    } = useMemoryCarousel(moments);

    const activeCardRef = useRef<MemoryCardHandle | null>(null);

    // ================================
    // Responsive
    // ================================
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [containerWidth, setContainerWidth] = useState(320);

    useEffect(() => {
        if (!containerRef.current) return;

        const observer = new ResizeObserver(([entry]) => {
            setContainerWidth(entry.contentRect.width);
        });

        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    const isMobile = containerWidth <= 480;
    const isTablet = containerWidth <= 1024;

    const getCardSize = () => {
        if (isMobile) {
            const width = containerWidth * 0.68;
            return { width, height: width * CARD_RATIO };
        }

        const width = Math.min(420, containerWidth * 0.8);
        return { width, height: width * CARD_RATIO };
    };

    const { width: cardWidth, height: cardHeight } = getCardSize();

    const getOffset = (distance: number) => {
        if (isMobile) return distance * cardWidth * MOBILE_OVERLAP;
        if (isTablet) return distance * (cardWidth + TABLET_GAP);
        return distance * (cardWidth + DESKTOP_GAP);
    };

    // ================================
    // Drag (state-based)
    // ================================
    const [drag, setDrag] = useState({
        isDragging: false,
        startX: 0,
        delta: 0,
    });

    const rafRef = useRef<number | null>(null);

    const onPointerDown = (e: React.PointerEvent) => {
        setDrag({
            isDragging: true,
            startX: e.clientX,
            delta: 0,
        });
    };

    const onPointerMove = (e: React.PointerEvent) => {
        if (!drag.isDragging) return;

        if (rafRef.current) cancelAnimationFrame(rafRef.current);

        rafRef.current = requestAnimationFrame(() => {
            setDrag((prev) => ({
                ...prev,
                delta: e.clientX - prev.startX,
            }));
        });
    };

    const onPointerUp = () => {
        if (!drag.isDragging) return;

        const threshold = cardWidth * 0.2;

        if (drag.delta > threshold) {
            navigateTo((currentIndex - 1 + moments.length) % moments.length, { autoPlay: true });
        } else if (drag.delta < -threshold) {
            navigateTo((currentIndex + 1) % moments.length, { autoPlay: true });
        }

        setDrag({
            isDragging: false,
            startX: 0,
            delta: 0,
        });
    };

    // ================================
    // Keyboard
    // ================================
    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            switch (e.key) {
                case 'ArrowRight':
                case 'ArrowDown':
                    navigateTo((currentIndex + 1) % moments.length, { autoPlay: true });
                    break;
                case 'ArrowLeft':
                case 'ArrowUp':
                    navigateTo((currentIndex - 1 + moments.length) % moments.length, { autoPlay: true });
                    break;
                case 'Enter':
                case ' ':
                    activeCardRef.current?.togglePlayPause();
                    break;
            }
        },
        [currentIndex, moments.length, navigateTo]
    );

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    const TRANSITION = prefersReducedMotion
        ? 'none'
        : 'transform 0.48s cubic-bezier(0.4,0,0.2,1), opacity 0.48s';

    return (
        <section className="mc-section">
            <div className="mc-header">
                <h2>{title}</h2>
                <p>{description}</p>
            </div>

            <div
                ref={containerRef}
                className="mc-track-wrapper"
                style={{ height: `${cardHeight}px`, touchAction: 'pan-y' }}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerLeave={onPointerUp}
            >
                <div className="mc-track" style={{ height: `${cardHeight}px` }}>
                    {moments.map((moment, index) => {
                        const distance = index - currentIndex;
                        const absDistance = Math.abs(distance);

                        if (absDistance > RENDER_DISTANCE) return null;

                        // ✅ derive direction instead of previousIndex
                        const direction = Math.sign(currentIndex - index);

                        const isEntering =
                            absDistance <= CARD_CONFIG.MAX_VISIBLE &&
                            Math.abs(distance - direction) > CARD_CONFIG.MAX_VISIBLE;

                        const baseOffset = getOffset(distance);
                        const dragOffset = drag.isDragging ? drag.delta * 0.6 : 0;
                        const targetOffset = baseOffset + dragOffset;

                        const fromOffset = isEntering
                            ? getOffset(distance + direction)
                            : targetOffset;

                        const isActive = index === currentIndex;
                        const isFocused = focusedIndex === index;
                        const isOffscreen = absDistance > CARD_CONFIG.MAX_VISIBLE;

                        const opacity = isOffscreen
                            ? 0
                            : isMobile
                                ? Math.max(0.6, 1 - absDistance * 0.25)
                                : Math.max(0.35, 1 - absDistance * 0.18);

                        const scale = isMobile
                            ? 1 - absDistance * 0.08
                            : getCardScale(index, currentIndex);

                        const zIndex = isMobile
                            ? (isActive ? 10 : 10 - absDistance)
                            : moments.length - absDistance;

                        return (
                            <div
                                key={moment.id}
                                style={{
                                    position: 'absolute',
                                    left: '50%',
                                    top: '50%',
                                    width: `${cardWidth}px`,
                                    height: `${cardHeight}px`,
                                    transform: `translateX(calc(-50% + ${isEntering ? fromOffset : targetOffset}px)) translateY(-50%) scale(${scale})`,
                                    opacity: isEntering ? 0 : opacity,
                                    zIndex,
                                    transition: isEntering ? 'none' : TRANSITION,
                                    pointerEvents: isOffscreen ? 'none' : 'auto',
                                }}
                                ref={isEntering ? (el) => {
                                    if (!el) return;
                                    requestAnimationFrame(() => {
                                        el.style.transition = TRANSITION;
                                        el.style.transform = `translateX(calc(-50% + ${targetOffset}px)) translateY(-50%) scale(${scale})`;
                                        el.style.opacity = String(opacity);
                                    });
                                } : undefined}
                            >
                                <MemoryCard
                                    ref={isActive ? activeCardRef : null}
                                    moment={moment}
                                    isActive={isActive}
                                    shouldAutoPlay={isActive && pendingAutoPlay}
                                    onHover={setHoveredIndex}
                                    onSelect={() => navigateTo(index, { autoPlay: true })}
                                    cardWidth={cardWidth}
                                    cardHeight={cardHeight}
                                    prefersReducedMotion={prefersReducedMotion}
                                    isKeyboardFocused={isFocused}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="mt-4 flex justify-center">
                <CarouselDots
                    total={moments.length}
                    currentIndex={currentIndex}
                    prefersReducedMotion={prefersReducedMotion}
                    onNavigate={(i) => navigateTo(i, { autoPlay: true })}
                />
            </div>
        </section>
    );
}