'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack,
  Shuffle,
  Repeat,
  RepeatOnce,
  Heart,
  DotsThree,
  SpeakerHigh,
  SpeakerX,
  X,
  ArrowDown
} from '@phosphor-icons/react';
import { usePlayerStore } from '@/store/player-store';
import { useUpdatePlaylistTrack } from '@/hooks/use-api';
import { formatDuration, getTrackImage, generateGradient, cn } from '@/lib/utils';
import Image from 'next/image';

interface WaveformProps {
  isPlaying: boolean;
  progress: number;
}

const Waveform = ({ isPlaying, progress }: WaveformProps) => {
  const bars = Array.from({ length: 60 }, (_, i) => i);
  
  // Create more realistic waveform pattern
  const getBarHeight = (index: number, isPlaying: boolean) => {
    if (!isPlaying) return 8;
    
    // Create a more musical pattern
    const baseHeight = 15;
    const variation = Math.sin(index * 0.2) * 30 + Math.cos(index * 0.15) * 20;
    const randomness = Math.sin(index * 0.8 + Date.now() * 0.002) * 15;
    
    return Math.max(8, baseHeight + variation + randomness);
  };
  
  return (
    <div className="relative w-full max-w-2xl h-32 flex items-end justify-center space-x-1">
      {/* Neon background glow effect */}
      <div className="absolute inset-0 blur-xl rounded-full" style={{
        background: 'linear-gradient(90deg, transparent 0%, rgba(0, 255, 204, 0.12) 30%, rgba(120, 119, 198, 0.08) 70%, transparent 100%)'
      }} />
      
      {/* Waveform bars */}
      {bars.map((bar) => {
        const isActive = bar / bars.length <= progress / 100;
        const delay = bar * 0.02;
        
        return (
          <motion.div
            key={bar}
            className="relative w-1.5 rounded-full overflow-hidden"
            style={{
              background: isActive 
                ? 'linear-gradient(to top, #00FFCC 0%, #7877C6 50%, #5A6B7D 100%)'
                : 'rgba(107, 123, 140, 0.15)'
            }}
            initial={{ height: 8, scaleY: 0.8 }}
            animate={{
              height: isPlaying ? getBarHeight(bar, true) : 8,
              scaleY: isPlaying ? [0.8, 1.2, 0.9, 1.1, 0.85, 1.15, 0.95] : 0.8,
              opacity: isActive ? [0.7, 1, 0.8, 0.9, 0.85] : 0.3
            }}
            transition={{
              height: {
                duration: 0.3,
                ease: "easeOut"
              },
              scaleY: {
                duration: 0.6 + delay,
                repeat: isPlaying ? Infinity : 0,
                repeatType: "reverse",
                ease: "easeInOut",
                delay: delay
              },
              opacity: {
                duration: 0.4 + delay,
                repeat: isPlaying ? Infinity : 0,
                repeatType: "reverse",
                ease: "easeInOut",
                delay: delay * 0.5
              }
            }}
          >
            {/* Inner warm glow effect for active bars */}
            {isActive && isPlaying && (
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  background: 'linear-gradient(to top, rgba(0, 255, 204, 0.8) 0%, rgba(120, 119, 198, 0.6) 100%)'
                }}
                animate={{
                  opacity: [0.5, 1, 0.7, 0.9, 0.6],
                  scale: [1, 1.1, 0.95, 1.05, 0.98]
                }}
                transition={{
                  duration: 0.8 + delay,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut",
                  delay: delay * 0.3
                }}
              />
            )}
            
            {/* Reflection effect */}
            <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/30 to-transparent rounded-t-full" />
          </motion.div>
        );
      })}
      
      {/* Floating particles effect */}
      {isPlaying && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 8 }, (_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full"
              style={{
                background: 'linear-gradient(45deg, #00FFCC, #7877C6)'
              }}
              initial={{ 
                x: Math.random() * 400, 
                y: 60,
                opacity: 0 
              }}
              animate={{
                y: [60, 20, 60],
                x: [
                  Math.random() * 400,
                  Math.random() * 400 + 50,
                  Math.random() * 400
                ],
                opacity: [0, 0.8, 0],
                scale: [0.5, 1.2, 0.5]
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: i * 0.3,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface ProgressRingProps {
  progress: number;
  size: number;
  strokeWidth: number;
}

const ProgressRing = ({ progress, size, strokeWidth }: ProgressRingProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <svg width={size} height={size} className="absolute inset-0 -rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="rgba(255, 255, 255, 0.1)"
        strokeWidth={strokeWidth}
        fill="none"
      />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="url(#gradient)"
        strokeWidth={strokeWidth}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      />
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00FFCC" />
          <stop offset="50%" stopColor="#7877C6" />
          <stop offset="100%" stopColor="#5A6B7D" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default function EnhancedNowPlaying() {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isShuffled,
    repeatMode,
    isExpanded,
    play,
    pause,
    togglePlayPause,
    next,
    previous,
    seek,
    setVolume,
    toggleMute,
    toggleShuffle,
    setRepeatMode,
    progress,
    hasNext,
    hasPrevious,
    collapsePlayer
  } = usePlayerStore();

  const updateTrackMutation = useUpdatePlaylistTrack();
  const progressBarRef = useRef<HTMLDivElement>(null);

  // ESC key to close enhanced player
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        collapsePlayer();
      }
    };

    if (isExpanded) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isExpanded, collapsePlayer]);

  if (!currentTrack || !isExpanded) return null;

  const handleSeekClick = (e: React.MouseEvent) => {
    if (!progressBarRef.current) return;
    
    const rect = progressBarRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    const percentage = Math.max(0, Math.min(100, (x / width) * 100));
    const newTime = (percentage / 100) * duration;
    
    seek(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseInt(e.target.value));
  };

  const handleRepeatClick = () => {
    const modes: Array<'none' | 'one' | 'all'> = ['none', 'one', 'all'];
    const currentIndex = modes.indexOf(repeatMode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    setRepeatMode(nextMode);
  };

  const progressPercentage = progress();

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="fixed inset-0 z-50 flex items-center justify-center"
      >
        {/* Enhanced Moody Background */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0"
        >
          {/* Deep charcoal gradient background with shadows */}
          <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.5),0_0_50px_rgba(0,255,204,0.1)]" style={{
            background: 'linear-gradient(135deg, #2D2D34 0%, #3A3A42 50%, #2D2D34 100%)'
          }} />
          
          {/* Animated warm/cool layers */}
          <motion.div
            className="absolute inset-0 opacity-20"
            animate={{
              background: isPlaying 
                ? [
                    'radial-gradient(circle at 20% 80%, rgba(0, 255, 204, 0.2) 0%, transparent 60%)',
                    'radial-gradient(circle at 80% 20%, rgba(120, 119, 198, 0.15) 0%, transparent 60%)',
                    'radial-gradient(circle at 40% 40%, rgba(90, 107, 125, 0.1) 0%, transparent 60%)'
                  ]
                : 'radial-gradient(circle at 50% 50%, rgba(90, 107, 125, 0.08) 0%, transparent 50%)'
            }}
            transition={{
              duration: 6,
              repeat: isPlaying ? Infinity : 0,
              ease: "easeInOut"
            }}
          />
          
          {/* Album art background with moody blur */}
          <div 
            className="absolute inset-0 opacity-15 blur-3xl scale-110"
            style={{
              backgroundImage: `url(${getTrackImage(currentTrack.track)})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'sepia(0.3) saturate(0.8) brightness(0.7)'
            }}
          />
          
          {/* Subtle warm overlay with breathing effect */}
          <motion.div 
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(45deg, rgba(45, 45, 52, 0.7) 0%, rgba(58, 58, 66, 0.5) 100%)'
            }}
            animate={{
              opacity: isPlaying ? [0.8, 0.6, 0.8] : 0.8
            }}
            transition={{
              duration: 4,
              repeat: isPlaying ? Infinity : 0,
              ease: "easeInOut"
            }}
          />
          
          {/* Floating warm orbs */}
          {isPlaying && (
            <div className="absolute inset-0 overflow-hidden">
              {Array.from({ length: 4 }, (_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-24 h-24 rounded-full opacity-8"
                  style={{
                    background: `radial-gradient(circle, ${
                      ['rgba(0, 255, 204, 0.3)', 'rgba(120, 119, 198, 0.25)', 'rgba(90, 107, 125, 0.2)', 'rgba(107, 123, 140, 0.15)'][i]
                    } 0%, transparent 70%)`
                  }}
                  animate={{
                    x: [
                      Math.random() * 1200,
                      Math.random() * 1200,
                      Math.random() * 1200
                    ],
                    y: [
                      Math.random() * 800,
                      Math.random() * 800,
                      Math.random() * 800
                    ],
                    scale: [0.3, 1.2, 0.6, 1.0, 0.4]
                  }}
                  transition={{
                    duration: 25 + i * 8,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
              ))}
            </div>
          )}
        </motion.div>

        {/* Close/Minimize Button with Tooltip */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="absolute top-6 right-6 z-20 group"
        >
          <motion.button
            onClick={collapsePlayer}
            className="p-3 bg-white/10 backdrop-blur-sm rounded-full 
                       hover:bg-white/20 transition-all duration-200 border border-white/20"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Return to Playlist"
          >
            <ArrowDown 
              size={24} 
              className="text-white group-hover:text-cyan-300 transition-colors" 
            />
          </motion.button>
          <div className="absolute top-full mt-2 right-0 px-3 py-1 bg-black/80 backdrop-blur-sm rounded-lg text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            Return to Playlist (ESC)
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="relative z-10 flex flex-col items-center text-center space-y-8 max-w-2xl mx-auto px-8"
        >
          {/* Enhanced Album Art with Progress Ring */}
          <div className="relative group">
            {/* Outer warm glow ring */}
            <motion.div
              className="absolute -inset-4 rounded-full opacity-0 group-hover:opacity-100 blur-xl"
              style={{
                background: 'radial-gradient(circle, rgba(0, 255, 204, 0.4) 0%, rgba(120, 119, 198, 0.3) 50%, transparent 70%)'
              }}
              animate={{
                opacity: isPlaying ? [0.4, 0.7, 0.4] : 0,
                scale: isPlaying ? [1, 1.08, 1] : 1
              }}
              transition={{
                duration: 3,
                repeat: isPlaying ? Infinity : 0,
                ease: "easeInOut"
              }}
            />
            
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ 
                scale: 1, 
                rotate: 0,
                rotateY: isPlaying ? [0, 5, 0, -5, 0] : 0
              }}
              transition={{ 
                scale: { duration: 0.8, ease: "easeOut" },
                rotate: { duration: 0.8, ease: "easeOut" },
                rotateY: {
                  duration: 4,
                  repeat: isPlaying ? Infinity : 0,
                  ease: "easeInOut"
                }
              }}
              className="relative w-80 h-80 rounded-3xl overflow-hidden shadow-2xl transform-gpu"
              style={{ perspective: '1000px' }}
            >
              {/* Enhanced gradient background */}
              <div className={cn("absolute inset-0 bg-gradient-to-br", generateGradient(currentTrack.track.id))} />
              
              {/* Album image with improved blend */}
              <Image
                src={getTrackImage(currentTrack.track)}
                alt={currentTrack.track.title}
                fill
                className="object-cover mix-blend-multiply"
                unoptimized
              />
              
              {/* Multiple layered overlays for depth */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/10" />
              <div className="absolute inset-0" style={{
                background: 'radial-gradient(circle at center, transparent 40%, rgba(0,0,0,0.3) 100%)'
              }} />
              
              {/* Enhanced pulse overlay when playing */}
              <AnimatePresence>
                {isPlaying && (
                  <>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ 
                        opacity: [0.2, 0.4, 0.2],
                        scale: [1, 1.02, 1]
                      }}
                      exit={{ opacity: 0 }}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="absolute inset-0"
                      style={{
                        background: 'linear-gradient(135deg, rgba(0, 255, 204, 0.15) 0%, rgba(120, 119, 198, 0.12) 100%)'
                      }}
                    />
                    
                    {/* Warm ripple effect */}
                    <motion.div
                      className="absolute inset-0 border-2 rounded-3xl"
                      style={{
                        borderColor: 'rgba(0, 255, 204, 0.6)'
                      }}
                      animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.7, 0, 0.7]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeOut"
                      }}
                    />
                  </>
                )}
              </AnimatePresence>
              
              {/* Vinyl record spinning effect */}
              {isPlaying && (
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: 'conic-gradient(from 0deg, transparent 0deg, rgba(255,255,255,0.1) 180deg, transparent 360deg)'
                  }}
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
              )}
              
              {/* Glass reflection effect */}
              <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent rounded-t-3xl" />
            </motion.div>
            
            {/* Enhanced Progress Ring */}
            <ProgressRing progress={progressPercentage} size={320} strokeWidth={4} />
          </div>

          {/* Track Info */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="space-y-3"
          >
            <h1 className="text-5xl font-bold text-white mb-2">
              {currentTrack.track.title}
            </h1>
            <p className="text-2xl mb-1" style={{ color: '#7877C6' }}>
              {currentTrack.track.artist}
            </p>
            <p className="text-lg text-gray-400">
              {currentTrack.track.album}
            </p>
          </motion.div>

          {/* Waveform Visualization */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <Waveform isPlaying={isPlaying} progress={progressPercentage} />
          </motion.div>

          {/* Progress Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="w-full max-w-xl space-y-4"
          >
            <div className="flex justify-between text-sm text-gray-400">
              <span>{formatDuration(currentTime)}</span>
              <span>{formatDuration(duration)}</span>
            </div>
            
            <div
              ref={progressBarRef}
              onClick={handleSeekClick}
              className="relative w-full h-3 bg-white/10 rounded-full cursor-pointer group backdrop-blur-sm"
            >
              <motion.div
                className="absolute left-0 top-0 h-full rounded-full"
                style={{ 
                  width: `${progressPercentage}%`,
                  background: 'linear-gradient(90deg, #00FFCC 0%, #7877C6 100%)'
                }}
              />
              
              {/* Handle */}
              <motion.div
                className="absolute top-1/2 w-5 h-5 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity -translate-y-1/2"
                style={{ left: `calc(${progressPercentage}% - 10px)` }}
                whileHover={{ scale: 1.2 }}
              />
            </div>
          </motion.div>

          {/* Main Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.6 }}
            className="flex items-center space-x-8"
          >
            {/* Shuffle */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleShuffle}
              className="p-3 rounded-full transition-all duration-200"
              style={{
                color: isShuffled ? '#00FFCC' : '#6B7B8C',
                backgroundColor: isShuffled ? 'rgba(0, 255, 204, 0.15)' : 'transparent'
              }}
              onMouseEnter={(e) => {
                if (!isShuffled) {
                  e.currentTarget.style.color = '#FFFFFF';
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isShuffled) {
                  e.currentTarget.style.color = '#6B7B8C';
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <Shuffle size={24} weight={isShuffled ? "fill" : "regular"} />
            </motion.button>

            {/* Previous */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={previous}
              disabled={!hasPrevious()}
              className={cn(
                "p-4 rounded-full transition-all duration-200",
                hasPrevious() 
                  ? "text-white hover:bg-white/10" 
                  : "text-gray-600 cursor-not-allowed"
              )}
            >
              <SkipBack size={32} weight="fill" />
            </motion.button>

            {/* Play/Pause */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={togglePlayPause}
              className="relative p-6 rounded-full shadow-2xl transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, #00FFCC 0%, #7877C6 100%)',
                boxShadow: '0 20px 40px rgba(0, 255, 204, 0.3), 0 0 20px rgba(120, 119, 198, 0.2)'
              }}
            >
              <AnimatePresence mode="wait">
                {isPlaying ? (
                  <motion.div
                    key="pause"
                    initial={{ scale: 0, rotate: -90 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Pause size={40} weight="fill" className="text-gray-900" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="play"
                    initial={{ scale: 0, rotate: -90 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Play size={40} weight="fill" className="text-gray-900 ml-1" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Next */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={next}
              disabled={!hasNext()}
              className={cn(
                "p-4 rounded-full transition-all duration-200",
                hasNext() 
                  ? "text-white hover:bg-white/10" 
                  : "text-gray-600 cursor-not-allowed"
              )}
            >
              <SkipForward size={32} weight="fill" />
            </motion.button>

            {/* Repeat */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleRepeatClick}
              className="p-3 rounded-full transition-all duration-200"
              style={{
                color: repeatMode !== 'none' ? '#00FFCC' : '#6B7B8C',
                backgroundColor: repeatMode !== 'none' ? 'rgba(0, 255, 204, 0.15)' : 'transparent'
              }}
              onMouseEnter={(e) => {
                if (repeatMode === 'none') {
                  e.currentTarget.style.color = '#FFFFFF';
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (repeatMode === 'none') {
                  e.currentTarget.style.color = '#6B7B8C';
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              {repeatMode === 'one' ? (
                <RepeatOnce size={24} weight="fill" />
              ) : (
                <Repeat size={24} weight={repeatMode === 'all' ? "fill" : "regular"} />
              )}
            </motion.button>
          </motion.div>

          {/* Secondary Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="flex items-center space-x-6"
          >
            {/* Volume Control */}
            <div className="flex items-center space-x-3">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleMute}
                className="text-gray-400 hover:text-white transition-colors"
              >
                {isMuted || volume === 0 ? (
                  <SpeakerX size={20} />
                ) : (
                  <SpeakerHigh size={20} />
                )}
              </motion.button>
              
              <div className="w-24">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
            </div>

            {/* Favorite */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 text-gray-400 hover:text-red-400 transition-colors"
            >
              <Heart size={20} />
            </motion.button>

            {/* More Options */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <DotsThree size={20} weight="bold" />
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}