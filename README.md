# Memory Moments Carousel

A modern, interactive memory carousel built with React, TypeScript, and Tailwind CSS. Display a collection of memory moments with thumbnail images and video playback capabilities.

## 🎯 Features

- **Interactive Carousel**: Navigate through memory moments with smooth animations
- **Video Playback**: HLS video streaming support with custom video player controls
- **Hover-to-Activate Gesture**: Elegant hover ring animation that unlocks video controls
- **Keyboard Navigation**: Use arrow keys to navigate and spacebar/Enter to play/pause
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Reduced Motion Support**: Respects user's motion preferences
- **Parallax Effects**: Tilt effect on cards for enhanced visual feedback
- **Accessibility**: Proper ARIA labels and keyboard focus management
- **Type-Safe**: Full TypeScript support with no implicit any

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## 📁 Project Structure

```
src/
├── components/
│   ├── MemoryCard/
│   │   ├── index.tsx                 # Main card component
│   │   └── useHoverProgress.ts       # Hook for hover animation
│   ├── MemoryCarousel/
│   │   ├── index.tsx                 # Carousel container
│   │   └── useMemoryCarousel.ts      # Carousel logic and tilt effect
│   └── VideoPlayer/
│       ├── index.tsx                 # Main video player component
│       ├── VideoControls.tsx         # Playback controls UI
│       ├── HoverProgressRing.tsx     # Animated progress ring
│       ├── MemoryCardCaption.tsx     # Caption overlay
│       ├── CenterPlaybackButton.tsx  # Play button overlay
│       ├── icons.tsx                 # SVG icon components
│       ├── useVideoPlayer.ts         # Video playback logic
│       └── useControllerVisibility.ts # Controller visibility state
├── data/
│   └── memoryMoments.ts              # Sample memory data
├── App.tsx                           # Root component
└── main.tsx                          # Entry point
```

## 🎨 Key Components

### MemoryCard
Displays a single memory moment with thumbnail and optional video. Features:
- Conditional video rendering
- Hover effects and animations
- Scale and shadow transitions
- Tilt perspective effect
- Caption overlay

**Props:**
```typescript
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
```

### MemoryCarousel
Container component managing carousel state and navigation. Features:
- Multi-card display with responsive sizing
- Keyboard navigation support
- Auto-play after hover-ring completion
- Maintains scroll position

### VideoPlayer
Custom video player with HLS streaming support. Features:
- HLS.js integration for stream playback
- Custom controls with progress bar
- Fullscreen expansion mode
- Play/pause with keyboard shortcuts
- Hover ring animation for locked state

## 🎯 User Interactions

### Navigation
- **Click a card** → Navigate to that memory
- **Arrow keys** → Move between memories
- **Hover on inactive card** → Animated ring unlocks auto-play
- **Spacebar/Enter** → Toggle play/pause on active card

### Video Playback
- **Hover on video** → Shows playback controls
- **Click play button** → Start/resume playback
- **Drag progress bar** → Seek through video
- **Click expand icon** → Fullscreen mode

## 🎨 Styling

This project uses **Tailwind CSS v4** with the Vite plugin for optimal performance. Recent refactoring converted all inline styles to Tailwind classes where possible, maintaining dynamic values only as inline styles.

### Key Tailwind Utilities Used:
- Gradients: `bg-gradient-to-b`, `from-*/via-*/to-*`
- Transforms: `scale-*`, `translate-*`, `perspective-*`
- Shadows: `shadow-*`, `shadow-[custom]` for inset shadows
- Transitions: `transition-*`, `duration-*`, `ease-*`
- Z-index: `z-10`, `z-30`, `z-40`, `z-50`

### Inline Styles (Preserved)
Only preserved when necessary:
- Dynamic `width` and `height` from props
- Conditional `transition` values based on `prefersReducedMotion`
- Custom `transformOrigin` values

## 📦 Dependencies

### Core
- **React 19**: UI framework
- **TypeScript 6**: Type safety
- **Vite 8**: Build tool with HMR

### Styling
- **Tailwind CSS 4**: Utility-first CSS framework
- **@tailwindcss/vite**: Vite integration

### Media
- **HLS.js**: HTTP Live Streaming support
- **HTML5 Video API**: Native video playback

### Development
- **ESLint**: Code linting
- **React Compiler**: Automatic component optimization
- **Babel**: Modern JavaScript

## 🔧 Configuration Files

- `tailwind.config.ts` - Tailwind CSS configuration
- `vite.config.ts` - Vite build configuration
- `tsconfig.json` - TypeScript compiler options
- `eslint.config.js` - ESLint rules
- `package.json` - Dependencies and scripts

## ♿ Accessibility Features

- Semantic HTML with proper ARIA attributes
- Keyboard navigation support
- Focus indicators for keyboard users
- Reduced motion preferences respected
- Descriptive aria-labels for screen readers
- Proper role and state attributes

## 🎬 Data Format

Memory moments follow this structure:

```typescript
interface MemoryMoment {
    id: number;
    thumbnail: string;           // Thumbnail image URL
    videoUrl?: string;           // Optional HLS video URL
    location: string;            // Memory location
    caption: string;             // Caption/description
}
```

## 🚀 Performance Optimizations

- **Code Splitting**: Components are modular and treeshakeable
- **React Compiler**: Automatic optimization of renders
- **Lazy Loading**: Images use `loading="lazy"`
- **Async Decoding**: Images use `decoding="async"`
- **CSS Containment**: `contain-[layout_style_paint]` for paint isolation
- **Transform Performance**: Uses `will-change` strategically
- **CSS Optimization**: Tailwind purges unused styles in production

## 🐛 Development Tips

### Hot Module Replacement
The dev server supports HMR. Save any file to see changes instantly without losing state.

### Type Checking
Run `npm run build` to perform full TypeScript type checking.

### Linting
Run `npm run lint` to check code style and potential issues.

### Browser DevTools
- Use React DevTools browser extension to inspect component tree
- Check Network tab for video streaming issues
- Monitor Performance tab for animation smoothness

## 📱 Browser Support

- Modern browsers with ES2020 support
- Video playback requires HTML5 Video API
- HLS streaming support (via HLS.js for older browsers)

## 🔄 Recent Updates

### Tailwind CSS Migration
- Converted inline styles to Tailwind utility classes
- Improved maintainability and consistency
- Reduced inline style complexity
- Maintained dynamic values where necessary
- Updated z-index utilities for proper layering

## 📝 License

This project is part of the ZIM Academy portfolio.

## 🤝 Contributing

When contributing:
1. Follow TypeScript strict mode
2. Use Tailwind CSS for styling
3. Maintain accessibility standards
4. Add ARIA labels for interactive elements
5. Test keyboard navigation
6. Verify motion-preference support

## 📞 Support

For issues or questions about the memory carousel implementation, please review the component documentation in their respective files.
