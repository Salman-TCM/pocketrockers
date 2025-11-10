'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  WifiHigh,
  WifiSlash,
  SpeakerHigh,
  SpeakerX,
  Clock,
  MusicNote,
  Shuffle,
  Repeat,
  HardDrive
} from '@phosphor-icons/react';
import { usePlaylistStore } from '@/store/playlist-store';
import { usePlayerStore } from '@/store/player-store';

export default function WinampStatusBar() {
  const { 
    playlist, 
    currentTrack, 
    volume, 
    isMuted, 
    isShuffled, 
    repeatMode 
  } = usePlaylistStore();
  
  const { isPlaying } = usePlayerStore();
  
  const [currentTime, setCurrentTime] = useState(new Date());
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected'>('connected');

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Simulate connection status
  useEffect(() => {
    const timer = setInterval(() => {
      setConnectionStatus(prev => 
        Math.random() > 0.95 ? (prev === 'connected' ? 'disconnected' : 'connected') : prev
      );
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const track = currentTrack();
  const totalDuration = playlist.reduce((acc, item) => acc + item.track.duration_seconds, 0);
  const totalTracks = playlist.length;

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="h-8 bg-gradient-to-r from-gray-800 via-gray-850 to-gray-800 border-t border-gray-700 flex items-center justify-between px-4 text-xs"
      style={{
        background: 'linear-gradient(90deg, #1f2129 0%, #252832 50%, #1f2129 100%)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)'
      }}
    >
      {/* Left Side - Connection & Audio Status */}
      <div className="flex items-center space-x-4">
        {/* Connection Status */}
        <motion.div 
          className="flex items-center space-x-1"
          animate={{ 
            color: connectionStatus === 'connected' ? '#10B981' : '#EF4444' 
          }}
        >
          {connectionStatus === 'connected' ? (
            <WifiHigh size={12} weight="fill" />
          ) : (
            <WifiSlash size={12} weight="fill" />
          )}
          <span className="font-medium">
            {connectionStatus === 'connected' ? 'Online' : 'Offline'}
          </span>
        </motion.div>

        {/* Separator */}
        <div className="w-px h-4 bg-gray-600" />

        {/* Audio Status */}
        <div className="flex items-center space-x-1 text-gray-400">
          {isMuted ? (
            <SpeakerX size={12} className="text-red-400" />
          ) : (
            <SpeakerHigh size={12} className="text-green-400" />
          )}
          <span>{isMuted ? 'Muted' : `${volume}%`}</span>
        </div>

        {/* Playback Mode Indicators */}
        <div className="flex items-center space-x-2">
          {isShuffled && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center space-x-1 text-green-400"
            >
              <Shuffle size={10} weight="fill" />
              <span>Shuffle</span>
            </motion.div>
          )}

          {repeatMode !== 'none' && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center space-x-1 text-blue-400"
            >
              <Repeat size={10} weight="fill" />
              <span>Repeat {repeatMode === 'one' ? 'One' : 'All'}</span>
            </motion.div>
          )}
        </div>
      </div>

      {/* Center - Current Track Info */}
      <div className="flex-1 flex justify-center">
        {track && isPlaying ? (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center space-x-2 text-gray-300 max-w-md"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <MusicNote size={12} weight="fill" className="text-green-400" />
            </motion.div>
            <span className="truncate">
              <span className="text-white font-medium">{track.track.title}</span>
              <span className="text-gray-400 ml-1">by {track.track.artist}</span>
            </span>
          </motion.div>
        ) : (
          <div className="flex items-center space-x-1 text-gray-500">
            <MusicNote size={12} />
            <span>No track playing</span>
          </div>
        )}
      </div>

      {/* Right Side - Library Stats & Time */}
      <div className="flex items-center space-x-4">
        {/* Library Stats */}
        <div className="flex items-center space-x-3 text-gray-400">
          <div className="flex items-center space-x-1">
            <HardDrive size={12} />
            <span>{totalTracks} tracks</span>
          </div>
          
          <div className="text-gray-500">
            {formatDuration(totalDuration)} total
          </div>
        </div>

        {/* Separator */}
        <div className="w-px h-4 bg-gray-600" />

        {/* System Clock */}
        <motion.div 
          className="flex items-center space-x-1 text-gray-300 font-mono"
          animate={{ opacity: [1, 0.7, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Clock size={12} />
          <span>{formatTime(currentTime)}</span>
        </motion.div>
      </div>
    </motion.div>
  );
}