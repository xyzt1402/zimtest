interface HoverProgressRingProps {
    circumference: number;
    isVisible: boolean;
    radius: number;
    size: number;
    stroke: number;
    strokeDashoffset: number;
    transitionDuration?: string;
}

export function HoverProgressRing({
    circumference,
    isVisible,
    radius,
    size,
    stroke,
    strokeDashoffset,
    transitionDuration,
}: HoverProgressRingProps) {
    return (
        <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-15 flex items-center justify-center"
            style={{
                opacity: isVisible ? 1 : 0,
                transition: transitionDuration ?? 'opacity 0.15s ease',
            }}
        >
            <div className="relative" style={{ width: size, height: size }}>
                <svg
                    width={size}
                    height={size}
                    viewBox={`0 0 ${size} ${size}`}
                    className="absolute inset-0"
                    style={{ transform: 'rotate(-90deg)' }}
                >
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="none"
                        stroke="rgba(255,255,255,0.2)"
                        strokeWidth={stroke}
                    />
                </svg>
                <svg
                    width={size}
                    height={size}
                    viewBox={`0 0 ${size} ${size}`}
                    className="absolute inset-0"
                    style={{ transform: 'rotate(-90deg)' }}
                >
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="none"
                        stroke="rgba(255,255,255,0.95)"
                        strokeWidth={stroke}
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                    />
                </svg>
                <div
                    className="absolute inset-0 flex items-center justify-center"
                >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                        <path
                            d="M8 5.14v13.72a1 1 0 001.56.83l10-6.86a1 1 0 000-1.66l-10-6.86A1 1 0 008 5.14z"
                            fill="rgba(255,255,255,0.95)"
                        />
                    </svg>
                </div>
            </div>
        </div>
    );
}
