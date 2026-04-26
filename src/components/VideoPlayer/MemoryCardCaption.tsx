import type { RefObject } from 'react';
import type { MemoryMoment } from '../../data/memoryMoments';

interface MemoryCardCaptionProps {
    captionLayerRef: RefObject<HTMLDivElement | null>;
    moment: Pick<MemoryMoment, 'location' | 'caption'>;
    transitionDuration?: string;
}

export function MemoryCardCaption({
    captionLayerRef,
    moment,
    transitionDuration,
}: MemoryCardCaptionProps) {
    return (
        <div
            ref={captionLayerRef}
            className="mc-caption absolute inset-x-0 bottom-0 z-15 px-4 pb-4.5 will-change-transform"
            style={{
                transition: transitionDuration ?? 'transform 0.12s ease-out',
            }}
        >
            {/* Location line */}
            <p
                className="mc-location mb-1 translate-y-2 truncate text-[13px] font-semibold
                           tracking-[0.01em] text-white opacity-0
                           [text-shadow:0_1px_4px_rgba(0,0,0,0.6)]"
                style={{
                    transition: transitionDuration
                        ?? 'opacity 0.3s ease 0.05s, transform 0.3s ease 0.05s',
                }}
            >
                {moment.location}
            </p>

            {/* Caption body */}
            <p
                className="mc-caption-text m-0 translate-y-2.5 text-[12px] leading-normal
                           text-white/85 opacity-0
                           [display:-webkit-box] [-webkit-line-clamp:3]
                           [-webkit-box-orient:vertical] whitespace-pre-line overflow-hidden
                           [text-shadow:0_1px_3px_rgba(0,0,0,0.5)]"
                style={{
                    transition: transitionDuration
                        ?? 'opacity 0.3s ease 0.12s, transform 0.3s ease 0.12s',
                }}
            >
                {moment.caption}
            </p>
        </div>
    );
}