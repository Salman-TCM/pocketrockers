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

  // Reset timer when track changes
  useEffect(() => {
    if (track) {
      setCurrentTime(0);
      setStartTime(Date.now());
    }
  }, [track?.id]);

  // Timer effect
  useEffect(() => {
    if (!track?.is_playing || isDraggingSeek) return;

    const startTimeRef = Date.now();
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTimeRef) / 1000);
      
      if (elapsed >= track.track.duration_seconds) {
        setCurrentTime(track.track.duration_seconds);
        clearInterval(interval);
        handleNextTrack();
      } else {
        setCurrentTime(elapsed);
      }
    }, 1000);

    return () => clearInterval(interval);
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
              {trackIsPlaying && (
                <div className="absolute inset-0 bg-neon-teal/20" />
              )}
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
                
                {/* Handle */}
                <div
                  style={{ left: `${progress}%` }}
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
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

      </motion.div>
    </AnimatePresence>
  );
}