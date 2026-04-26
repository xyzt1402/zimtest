import type { MouseEvent } from 'react';
import { PauseIcon, PlayIcon } from './icons';

interface CenterPlaybackButtonProps {
    isPlaying: boolean;
    onToggle: (e: MouseEvent<HTMLButtonElement>) => void;
}

export function CenterPlaybackButton({ isPlaying, onToggle }: CenterPlaybackButtonProps) {
    return (
        <div
            className="pointer-events-none absolute inset-0 z-18 flex items-center justify-center"
        >
            <button
                type="button"
                className="mc-center-play-btn"
                aria-label={isPlaying ? 'Pause video' : 'Play video'}
                style={{ pointerEvents: 'auto' }}
                onClick={onToggle}
            >
                {isPlaying ? <PauseIcon /> : <PlayIcon />}
            </button>
        </div>
    );
}
