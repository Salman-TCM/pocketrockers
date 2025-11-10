'use client';

import { motion } from 'framer-motion';

interface WinampVisualizerProps {
  isPlaying: boolean;
  style: string;
  dominantColor: string;
}

// Get playing state from the current track
const getIsActuallyPlaying = (isPlaying: boolean) => {
  // For demo purposes, show animation if track is marked as playing
  return isPlaying;
};

export default function WinampVisualizer({ isPlaying, style, dominantColor }: WinampVisualizerProps) {
  const actuallyPlaying = getIsActuallyPlaying(isPlaying);
  const renderFrequencyBars = () => {
    const bars = Array.from({ length: 32 }, (_, i) => i);
    
    return (
      <div className="flex items-end justify-center space-x-0.5 h-full w-full">
        {bars.map((bar) => {
          const delay = bar * 0.02;
          const baseHeight = 2;
          const maxHeight = 28;
          const variation = Math.sin(bar * 0.3) * 8 + Math.cos(bar * 0.2) * 6;
          
          return (
            <motion.div
              key={bar}
              className="w-0.5 rounded-sm"
              style={{
                background: isPlaying 
                  ? '#00ff80'
                  : 'rgba(75, 85, 99, 0.3)'
              }}
              initial={{ height: baseHeight }}
              animate={{
                height: isPlaying 
                  ? [
                      baseHeight + variation,
                      maxHeight + Math.sin(bar * 0.5) * 4,
                      baseHeight + variation * 0.7,
                      maxHeight * 0.8 + Math.cos(bar * 0.4) * 3,
                      baseHeight + variation
                    ]
                  : baseHeight,
                opacity: isPlaying ? [0.7, 1, 0.8, 0.9, 0.7] : 0.4
              }}
              transition={{
                duration: 1.2 + Math.random() * 0.6,
                repeat: isPlaying ? Infinity : 0,
                ease: "easeInOut",
                delay: delay
              }}
            />
          );
        })}
      </div>
    );
  };

  const renderWaveform = () => {
    const points = Array.from({ length: 50 }, (_, i) => i);
    
    return (
      <div className="relative h-16 flex items-center justify-center">
        <svg width="100%" height="100%" viewBox="0 0 200 64" className="overflow-visible">
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={dominantColor} stopOpacity="0.3" />
              <stop offset="50%" stopColor="#00ff88" stopOpacity="0.8" />
              <stop offset="100%" stopColor={dominantColor} stopOpacity="0.3" />
            </linearGradient>
          </defs>
          
          <motion.path
            stroke="url(#waveGradient)"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{
              pathLength: isPlaying ? 1 : 0,
              d: isPlaying 
                ? [
                    "M0,32 Q50,16 100,32 Q150,48 200,32",
                    "M0,32 Q50,48 100,32 Q150,16 200,32",
                    "M0,32 Q50,20 100,32 Q150,44 200,32"
                  ]
                : "M0,32 L200,32"
            }}
            transition={{
              pathLength: { duration: 0.5 },
              d: {
                duration: 2,
                repeat: isPlaying ? Infinity : 0,
                ease: "easeInOut"
              }
            }}
          />
          
          {/* Animated dots along the wave */}
          {points.map((point, index) => (
            <motion.circle
              key={point}
              r="1.5"
              fill="#00ff88"
              initial={{ cy: 32, opacity: 0 }}
              animate={{
                cx: (point / points.length) * 200,
                cy: isPlaying 
                  ? [
                      32 + Math.sin(point * 0.2) * 8,
                      32 + Math.sin(point * 0.2 + Math.PI) * 8,
                      32 + Math.sin(point * 0.2) * 8
                    ]
                  : 32,
                opacity: isPlaying ? [0.3, 0.8, 0.5] : 0
              }}
              transition={{
                duration: 2,
                repeat: isPlaying ? Infinity : 0,
                ease: "easeInOut",
                delay: index * 0.05
              }}
            />
          ))}
        </svg>
      </div>
    );
  };

  const renderCircular = () => {
    const segments = Array.from({ length: 24 }, (_, i) => i);
    
    return (
      <div className="relative h-16 flex items-center justify-center">
        <div className="relative w-16 h-16">
          {segments.map((segment) => {
            const angle = (segment / segments.length) * 360;
            const delay = segment * 0.05;
            
            return (
              <motion.div
                key={segment}
                className="absolute w-1 h-4 rounded-full origin-bottom"
                style={{
                  left: '50%',
                  bottom: '50%',
                  transform: `translateX(-50%) rotate(${angle}deg)`,
                  transformOrigin: 'bottom',
                  background: isPlaying 
                    ? `linear-gradient(to top, ${dominantColor}, #00ff88)`
                    : 'rgba(75, 85, 99, 0.3)'
                }}
                initial={{ scaleY: 0.3 }}
                animate={{
                  scaleY: isPlaying 
                    ? [
                        0.3 + Math.sin(segment * 0.5) * 0.4,
                        1 + Math.sin(segment * 0.3) * 0.3,
                        0.4 + Math.sin(segment * 0.4) * 0.3,
                        0.8 + Math.cos(segment * 0.6) * 0.2
                      ]
                    : 0.3,
                  opacity: isPlaying ? [0.6, 1, 0.7, 0.9] : 0.3
                }}
                transition={{
                  duration: 1.5,
                  repeat: isPlaying ? Infinity : 0,
                  ease: "easeInOut",
                  delay: delay
                }}
              />
            );
          })}
          
          {/* Center pulse */}
          <motion.div
            className="absolute inset-4 rounded-full border-2"
            style={{ borderColor: dominantColor }}
            initial={{ scale: 0.8, opacity: 0.3 }}
            animate={{
              scale: isPlaying ? [0.8, 1.1, 0.9, 1.0] : 0.8,
              opacity: isPlaying ? [0.3, 0.7, 0.5, 0.6] : 0.3
            }}
            transition={{
              duration: 2,
              repeat: isPlaying ? Infinity : 0,
              ease: "easeInOut"
            }}
          />
        </div>
      </div>
    );
  };

  const renderSpectrum = () => {
    const bands = Array.from({ length: 16 }, (_, i) => i);
    
    return (
      <div className="h-16 flex items-center justify-center">
        <div className="grid grid-cols-8 gap-1 w-full max-w-xs">
          {bands.map((band) => {
            const delay = band * 0.1;
            const intensity = Math.sin(band * 0.4) * 0.5 + 0.5;
            
            return (
              <div key={band} className="flex flex-col space-y-1">
                <motion.div
                  className="h-3 rounded-sm"
                  style={{
                    background: isPlaying && intensity > 0.7
                      ? `linear-gradient(to top, #ff4444, #ff8888)`
                      : isPlaying && intensity > 0.4
                      ? `linear-gradient(to top, #ffaa00, #ffdd44)`
                      : isPlaying
                      ? `linear-gradient(to top, ${dominantColor}, #00ff88)`
                      : 'rgba(75, 85, 99, 0.3)'
                  }}
                  initial={{ opacity: 0.3, scaleY: 0.5 }}
                  animate={{
                    opacity: isPlaying ? intensity : 0.3,
                    scaleY: isPlaying ? [0.5, intensity + 0.3, 0.6, intensity] : 0.5
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: isPlaying ? Infinity : 0,
                    ease: "easeInOut",
                    delay: delay
                  }}
                />
                
                <motion.div
                  className="h-2 rounded-sm"
                  style={{
                    background: isPlaying && intensity > 0.5
                      ? `linear-gradient(to top, #ffaa00, #ffdd44)`
                      : isPlaying
                      ? `linear-gradient(to top, ${dominantColor}, #00ff88)`
                      : 'rgba(75, 85, 99, 0.2)'
                  }}
                  initial={{ opacity: 0.2, scaleY: 0.3 }}
                  animate={{
                    opacity: isPlaying ? intensity * 0.8 : 0.2,
                    scaleY: isPlaying ? [0.3, intensity * 0.7 + 0.2, 0.4, intensity * 0.8] : 0.3
                  }}
                  transition={{
                    duration: 1,
                    repeat: isPlaying ? Infinity : 0,
                    ease: "easeInOut",
                    delay: delay + 0.1
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderVisualizer = () => {
    switch (style) {
      case 'wave':
        return renderWaveform();
      case 'circular':
        return renderCircular();
      case 'spectrum':
        return renderSpectrum();
      default:
        return renderFrequencyBars();
    }
  };

  return (
    <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-gray-400">Audio Visualizer</span>
        <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-green-400 animate-pulse' : 'bg-gray-600'}`} />
      </div>
      {renderVisualizer()}
    </div>
  );
}