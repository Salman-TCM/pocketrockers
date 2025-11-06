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
  const bars = Array.from({ length: 40 }, (_, i) => i);
  
  return (
    <div className="flex items-center justify-center space-x-1 h-32 opacity-20">
      {bars.map((bar) => (
        <motion.div
          key={bar}
          className="bg-gradient-to-t from-cyan-400 to-purple-400 w-1 rounded-full"
          animate={{
            height: isPlaying 
              ? [20, 60, 30, 80, 45, 70, 25, 90, 35] 
              : [25, 25, 25, 25, 25, 25, 25, 25, 25],
            opacity: bar / 40 <= progress / 100 ? 0.8 : 0.3
          }}
          transition={{
            duration: 0.5 + (bar % 3) * 0.1,
            repeat: isPlaying ? Infinity : 0,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        />
      ))}
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
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#a855f7" />
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
        {/* Blurred Background */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900" />
          <div 
            className="absolute inset-0 opacity-20 blur-3xl"
            style={{
              backgroundImage: `url(${getTrackImage(currentTrack.track)})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
          <div className="absolute inset-0 bg-black/40" />
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
          {/* Album Art with Progress Ring */}
          <div className="relative">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative w-80 h-80 rounded-3xl overflow-hidden shadow-2xl"
            >
              <div className={cn("absolute inset-0 bg-gradient-to-br", generateGradient(currentTrack.track.id))} />
              <Image
                src={getTrackImage(currentTrack.track)}
                alt={currentTrack.track.title}
                fill
                className="object-cover mix-blend-overlay"
                unoptimized
              />
              
              {/* Pulse overlay when playing */}
              <AnimatePresence>
                {isPlaying && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 to-purple-400/20"
                  />
                )}
              </AnimatePresence>
            </motion.div>
            
            {/* Progress Ring */}
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
            <p className="text-2xl text-cyan-300 mb-1">
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
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full"
                style={{ width: `${progressPercentage}%` }}
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
              className={cn(
                "p-3 rounded-full transition-all duration-200",
                isShuffled 
                  ? "text-cyan-400 bg-cyan-400/20" 
                  : "text-gray-400 hover:text-white hover:bg-white/10"
              )}
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
              className="relative p-6 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full shadow-2xl hover:shadow-cyan-400/50 transition-all duration-300"
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
              className={cn(
                "p-3 rounded-full transition-all duration-200",
                repeatMode !== 'none'
                  ? "text-cyan-400 bg-cyan-400/20" 
                  : "text-gray-400 hover:text-white hover:bg-white/10"
              )}
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