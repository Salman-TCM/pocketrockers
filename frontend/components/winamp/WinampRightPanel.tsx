'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack,
  Shuffle,
  Repeat,
  RepeatOnce,
  SpeakerHigh,
  SpeakerX,
  Equalizer,
  ListBullets,
  Heart,
  DotsThree
} from '@phosphor-icons/react';
import { usePlaylistStore } from '@/store/playlist-store';
import { usePlayerStore } from '@/store/player-store';
import { useUpdatePlaylistTrack } from '@/hooks/use-api';
import { formatDuration, getTrackImage } from '@/lib/utils';
import Image from 'next/image';
import WinampEqualizer from './WinampEqualizer';
import WinampVisualizer from './WinampVisualizer';

interface WinampRightPanelProps {
  visualizerStyle: string;
  onVisualizerStyleChange: (style: string) => void;
  dominantColor: string;
}

export default function WinampRightPanel({ 
  visualizerStyle, 
  onVisualizerStyleChange,
  dominantColor
}: WinampRightPanelProps) {
  const { 
    currentTrack, 
    playlist,
    volume,
    isMuted,
    isShuffled,
    repeatMode,
    setVolume,
    toggleMute,
    toggleShuffle,
    setRepeatMode
  } = usePlaylistStore();
  
  const {
    isPlaying,
    currentTime,
    duration,
    togglePlayPause,
    next,
    previous,
    hasNext,
    hasPrevious,
    seek
  } = usePlayerStore();

  const updateTrackMutation = useUpdatePlaylistTrack();
  const [activeTab, setActiveTab] = useState<'nowplaying' | 'equalizer' | 'playlist'>('nowplaying');
  const [showEqualizer, setShowEqualizer] = useState(false);

  const track = currentTrack();
  const trackDuration = track?.track.duration_seconds || 0;
  const progress = trackDuration > 0 ? (currentTime / trackDuration) * 100 : 0;

  const handlePlayPause = () => {
    if (track) {
      updateTrackMutation.mutate({
        id: track.id,
        data: { is_playing: !track.is_playing }
      });
    }
    togglePlayPause();
  };

  const handleRepeatClick = () => {
    const modes: Array<'none' | 'one' | 'all'> = ['none', 'one', 'all'];
    const currentIndex = modes.indexOf(repeatMode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    setRepeatMode(nextMode);
  };

  const upcomingTracks = playlist
    .filter(item => !item.is_playing)
    .slice(0, 5);

  return (
    <div className="w-96 bg-black border-l border-green-500/30 flex flex-col h-full">
      {/* Track Info Header */}
      <div className="border-b border-green-500/30 bg-gray-900/30 px-3 py-2">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-green-400 text-sm font-mono">
            {track ? formatDuration(currentTime) : '01:20'}
          </span>
          <span className="text-white text-sm">
            {track ? `${track.track.title} - ${track.track.artist}` : 'Sale True - Tristlal'}
          </span>
        </div>
        <div className="mt-1 flex items-center space-x-3 text-xs text-gray-400">
          <span>Size</span>
          <span>Mbps</span>
          <span>kz</span>
        </div>
      </div>

      {/* Audio Visualizer */}
      <div className="bg-black p-3 border-b border-green-500/20">
        <div className="text-xs text-green-400 mb-2 flex items-center justify-between">
          <span>Audio Visualizer</span>
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        </div>
        <div className="h-16 bg-gray-900/30 border border-green-500/30 rounded p-1">
          <div className="w-full h-full flex items-end justify-center">
            <WinampVisualizer 
              isPlaying={track?.is_playing || false}
              style={visualizerStyle}
              dominantColor="#00ff80"
            />
          </div>
        </div>
      </div>

      {/* Player Controls */}
      <div className="bg-black px-3 py-2 border-b border-green-500/20">
        <div className="flex items-center justify-center space-x-2 mb-3">
          <button
            onClick={previous}
            disabled={!hasPrevious()}
            className="p-2 bg-gray-800/50 border border-green-500/30 rounded text-green-400 hover:bg-gray-700 disabled:opacity-50"
          >
            <SkipBack size={14} />
          </button>
          
          <button
            onClick={handlePlayPause}
            className="p-2 bg-green-500 hover:bg-green-400 rounded-full text-black"
          >
            {track?.is_playing ? <Pause size={16} weight="fill" /> : <Play size={16} weight="fill" className="ml-0.5" />}
          </button>
          
          <button
            onClick={next}
            disabled={!hasNext()}
            className="p-2 bg-gray-800/50 border border-green-500/30 rounded text-green-400 hover:bg-gray-700 disabled:opacity-50"
          >
            <SkipForward size={14} />
          </button>
          
          <button 
            onClick={toggleShuffle}
            className={`p-2 bg-gray-800/50 border border-green-500/30 rounded hover:bg-gray-700 ${
              isShuffled ? 'text-green-400' : 'text-gray-400'
            }`}
          >
            <Shuffle size={14} />
          </button>
          
          <button 
            onClick={handleRepeatClick}
            className={`p-2 bg-gray-800/50 border border-green-500/30 rounded hover:bg-gray-700 ${
              repeatMode !== 'none' ? 'text-green-400' : 'text-gray-400'
            }`}
          >
            <Repeat size={14} />
          </button>
        </div>
        
        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="h-1 bg-gray-800 rounded-full cursor-pointer"
               onClick={(e) => {
                 const rect = e.currentTarget.getBoundingClientRect();
                 const x = e.clientX - rect.left;
                 const percentage = (x / rect.width) * 100;
                 const newTime = (percentage / 100) * trackDuration;
                 seek(newTime);
               }}>
            <div
              className="h-full bg-green-500 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-400">
            <span>{formatDuration(currentTime)}</span>
            <span>{formatDuration(trackDuration)}</span>
          </div>
        </div>
      </div>

      {/* EQ Section */}
      <div className="bg-black px-3 py-2 border-t border-green-500/20">
        <div className="text-xs text-green-400 mb-2">EQ</div>
        <div className="text-xs text-gray-400 mb-2">
          <span className="text-green-400">Equalizer</span>
          <span className="ml-2 bg-gray-700 px-2 py-1 rounded text-gray-300">OFF</span>
        </div>
        
        {/* Frequency bands */}
        <div className="flex items-end justify-between space-x-1 mb-2">
          <div className="text-xs text-gray-500 flex space-x-1">
            {['60', '170', '310', '600', '1K', '3K', '6K', '12K', '14K', '16K'].map((freq, i) => (
              <div key={freq} className="flex flex-col items-center">
                <div className="w-4 h-16 bg-gray-800 rounded-full relative border border-green-500/30">
                  <div className="w-3 h-3 bg-green-500 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                </div>
                <span className="text-xs text-gray-500 mt-1">{freq}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Queue List */}
      <div className="flex-1 bg-black overflow-y-auto border-t border-green-500/20">
        <div className="p-3">
          <div className="space-y-1">
            {upcomingTracks.length > 0 ? upcomingTracks.map((item, index) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-2 hover:bg-green-500/10 transition-colors cursor-pointer text-xs"
                onClick={() => updateTrackMutation.mutate({
                  id: item.id,
                  data: { is_playing: true }
                })}
              >
                <div className="flex-1 min-w-0">
                  <div className="text-green-400 font-medium">
                    {index + 2}. {item.track.title}
                  </div>
                  <div className="text-gray-400 text-xs">{item.track.artist}</div>
                </div>
                <span className="text-white ml-2">{formatDuration(item.track.duration_seconds)}</span>
              </div>
            )) : (
              <div className="text-center py-4 text-gray-500 text-xs">
                No upcoming tracks
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}