'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  SkipForward, 
  Heart,
  DotsThree 
} from '@phosphor-icons/react';
import { usePlaylistStore } from '@/store/playlist-store';
import { useUpdatePlaylistTrack } from '@/hooks/use-api';
import { formatDuration, getTrackImage, generateGradient, cn } from '@/lib/utils';
import Image from 'next/image';
import AdvancedVolumeControl from './AdvancedVolumeControl';

export default function NowPlayingBar() {
  const { 
    currentTrack, 
    playlist,
    volume,
    isMuted,
    isPlaying,
    setVolume,
    toggleMute,
    togglePlayPause
  } = usePlaylistStore();
  const updateTrackMutation = useUpdatePlaylistTrack();
  
  const [currentTime, setCurrentTime] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());
  const [isDraggingSeek, setIsDraggingSeek] = useState(false);
  const [seekTime, setSeekTime] = useState(0);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const track = currentTrack();
  if (!track) return null;

  // Simple timer logic - reset when track changes
  useEffect(() => {
    if (track) {
      console.log('🎵 Track changed to:', track.track.title, 'is_playing:', track.is_playing);
      setCurrentTime(0);
      setStartTime(Date.now());
    }
  }, [track?.id]);

  // Main timer effect - only runs when track is playing
  useEffect(() => {
    if (!track?.is_playing || isDraggingSeek) return;

    console.log('🎵 Starting timer for:', track.track.title);
    const startTimeRef = Date.now();
    
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTimeRef) / 1000);
      
      console.log(`⏱️ Timer - Elapsed: ${elapsed}s, Duration: ${track.track.duration_seconds}s, Track: ${track.track.title}`);
      
      if (elapsed >= track.track.duration_seconds) {
        console.log(`🏁 Track completed! ${track.track.title}`);
        setCurrentTime(track.track.duration_seconds);
        clearInterval(interval);
        handleNextTrack();
      } else {
        setCurrentTime(elapsed);
      }
    }, 1000);

    return () => {
      console.log('🛑 Clearing timer for:', track.track.title);
      clearInterval(interval);
    };
  }, [track?.is_playing, track?.id, isDraggingSeek]);

  // Use track's playing state for UI
  const trackIsPlaying = track?.is_playing || false;

  const handleNextTrack = () => {
    const sortedPlaylist = [...playlist].sort((a, b) => a.position - b.position);
    const currentIndex = sortedPlaylist.findIndex(item => item.is_playing);
    
    if (currentIndex < sortedPlaylist.length - 1) {
      const nextTrack = sortedPlaylist[currentIndex + 1];
      updateTrackMutation.mutate({
        id: nextTrack.id,
        data: { is_playing: true }
      });
    }
  };

  // Seek functionality
  const handleSeekMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDraggingSeek(true);
    updateSeekPosition(e);
  };

  const handleSeekMouseMove = (e: MouseEvent) => {
    if (isDraggingSeek) {
      updateSeekPosition(e);
    }
  };

  const handleSeekMouseUp = () => {
    if (isDraggingSeek) {
      setCurrentTime(seekTime);
      // Update start time to sync with the new position
      setStartTime(Date.now() - (seekTime * 1000));
      setIsDraggingSeek(false);
    }
  };

  const updateSeekPosition = (e: MouseEvent | React.MouseEvent) => {
    if (!progressBarRef.current) return;

    const rect = progressBarRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    const percentage = Math.max(0, Math.min(100, (x / width) * 100));
    const newTime = (percentage / 100) * track.track.duration_seconds;
    
    setSeekTime(Math.round(newTime));
  };

  // Add mouse event listeners for seeking
  useEffect(() => {
    if (isDraggingSeek) {
      document.addEventListener('mousemove', handleSeekMouseMove);
      document.addEventListener('mouseup', handleSeekMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleSeekMouseMove);
      document.removeEventListener('mouseup', handleSeekMouseUp);
    };
  }, [isDraggingSeek]);

  const displayTime = isDraggingSeek ? seekTime : currentTime;
  const progress = (displayTime / track.track.duration_seconds) * 100;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="glass-panel mx-6 mb-6 p-6"
      >
        <div className="flex items-center space-x-6">
          {/* Album Art & Track Info */}
          <div className="flex items-center space-x-4 flex-1 min-w-0">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0"
            >
              <div className={cn("absolute inset-0 bg-gradient-to-br", generateGradient(track.track.id))} />
              <Image
                src={getTrackImage(track.track)}
                alt={track.track.title}
                fill
                className="object-cover mix-blend-overlay"
                unoptimized
              />
              <motion.div
                animate={{ 
                  scale: trackIsPlaying ? [1, 1.1, 1] : 1,
                  opacity: trackIsPlaying ? [0.8, 1, 0.8] : 0.8
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-neon-teal/20"
              />
              
              {/* Vinyl spinning effect */}
              <motion.div
                animate={{ rotate: trackIsPlaying ? 360 : 0 }}
                transition={{ 
                  duration: 3, 
                  repeat: trackIsPlaying ? Infinity : 0, 
                  ease: "linear" 
                }}
                className="absolute inset-2 border border-neon-teal/30 rounded-full"
              />
            </motion.div>

            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="flex-1 min-w-0"
            >
              <h3 className="font-bold text-xl text-white truncate mb-1">
                {track.track.title}
              </h3>
              <p className="text-neon-teal text-lg truncate mb-2">
                {track.track.artist}
              </p>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-400">{track.track.album}</span>
                <span className="text-sm text-gray-500">•</span>
                <span className="text-sm text-gray-500">{track.track.genre}</span>
              </div>
            </motion.div>
          </div>

          {/* Controls */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="flex flex-col items-center space-y-4"
          >
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  console.log('🎵 Play/Pause button clicked, current state:', trackIsPlaying);
                  updateTrackMutation.mutate({
                    id: track.id,
                    data: { is_playing: !trackIsPlaying }
                  });
                }}
                className="p-4 bg-gradient-to-r from-neon-teal to-neon-blue rounded-full text-dark-400 shadow-lg hover:shadow-neon-teal/50 transition-all duration-200"
              >
                <AnimatePresence mode="wait">
                  {trackIsPlaying ? (
                    <motion.div
                      key="pause"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    >
                      <Pause size={24} weight="fill" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="play"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    >
                      <Play size={24} weight="fill" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleNextTrack}
                className="p-3 text-gray-400 hover:text-neon-teal transition-colors"
              >
                <SkipForward size={20} weight="duotone" />
              </motion.button>
            </div>

            {/* Clickable Progress Bar */}
            <div className="w-80">
              <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                <span>{formatDuration(displayTime)}</span>
                <span>{formatDuration(track.track.duration_seconds)}</span>
              </div>
              <div
                ref={progressBarRef}
                className="relative w-full h-2 bg-dark-300 rounded-full overflow-hidden cursor-pointer group"
                onMouseDown={handleSeekMouseDown}
              >
                {/* Track Background */}
                <div className="absolute inset-0 bg-dark-300 rounded-full" />
                
                {/* Progress Fill */}
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: isDraggingSeek ? 0 : 0.1 }}
                  className="h-full bg-gradient-to-r from-neon-teal to-neon-blue rounded-full relative"
                />
                
                {/* Draggable Handle */}
                <motion.div
                  animate={{ 
                    left: `${progress}%`,
                    scale: isDraggingSeek ? 1.3 : 1
                  }}
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity border-2 border-neon-teal"
                />
                
                {/* Pulsing Effect on Handle */}
                <motion.div
                  animate={{ 
                    left: `${progress}%`,
                    scale: isDraggingSeek ? [1, 1.2, 1] : [1, 1.2, 1],
                    opacity: isDraggingSeek ? [0.8, 1, 0.8] : [0.8, 1, 0.8]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 bg-neon-teal rounded-full opacity-60"
                />
                
                {/* Hover Effect */}
                <motion.div
                  animate={{ 
                    width: `${progress}%`,
                    opacity: isDraggingSeek ? 0.3 : 0
                  }}
                  className="absolute left-0 top-0 h-full bg-neon-teal/20 rounded-full transition-opacity group-hover:opacity-20"
                />
              </div>
            </div>
          </motion.div>

          {/* Right Side Actions */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="flex items-center space-x-4"
          >
            {/* Advanced Volume Control */}
            <AdvancedVolumeControl
              volume={volume}
              onVolumeChange={setVolume}
              isMuted={isMuted}
              onMuteToggle={toggleMute}
            />

            {/* Actions */}
            <div className="flex items-center space-x-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 text-gray-400 hover:text-neon-pink transition-colors"
              >
                <Heart size={18} weight="duotone" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <DotsThree size={18} weight="bold" />
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Waveform visualization */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: trackIsPlaying ? 0.3 : 0.1 }}
          className="flex items-end justify-center space-x-1 mt-4 h-8"
        >
          {Array.from({ length: 40 }).map((_, i) => (
            <motion.div
              key={i}
              className="bg-neon-teal rounded-full w-1"
              animate={{
                height: trackIsPlaying 
                  ? [Math.random() * 20 + 4, Math.random() * 30 + 8, Math.random() * 20 + 4]
                  : 4
              }}
              transition={{
                duration: 0.5 + Math.random() * 0.5,
                repeat: trackIsPlaying ? Infinity : 0,
                ease: "easeInOut",
                delay: i * 0.05
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}