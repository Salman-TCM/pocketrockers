'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlaylistStore } from '@/store/playlist-store';
import { usePlayerStore } from '@/store/player-store';
import { useSocket } from '@/hooks/use-socket';
import { useRealtimePlayer } from '@/hooks/use-realtime-player';
import { useTracks, usePlaylist, useUpdatePlaylistTrack } from '@/hooks/use-api';
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts';
import WinampLeftSidebar from '@/components/winamp/WinampLeftSidebar';
import WinampSongList from '@/components/winamp/WinampSongList';
import WinampRightPanel from '@/components/winamp/WinampRightPanel';
import WinampHeader from '@/components/winamp/WinampHeader';
import WinampStatusBar from '@/components/winamp/WinampStatusBar';
import LoadingScreen from '@/components/LoadingScreen';

export default function WinampPlayer() {
  const {
    setTracks,
    setPlaylist,
    playlist,
    currentTrack,
    volumeUp,
    volumeDown,
    toggleMute,
    toggleShortcutsModal,
  } = usePlaylistStore();

  const {
    isExpanded,
    setCurrentTrack,
    setQueue,
    togglePlayPause: playerTogglePlayPause,
    expandPlayer,
  } = usePlayerStore();

  const [dominantColor, setDominantColor] = useState('#1a1f2e');
  const [visualizerStyle, setVisualizerStyle] = useState('bars');
  const [showSettings, setShowSettings] = useState(false);
  
  const updateTrackMutation = useUpdatePlaylistTrack();

  const handlePlayPause = () => {
    const current = currentTrack();
    if (current) {
      updateTrackMutation.mutate({
        id: current.id,
        data: { is_playing: !current.is_playing }
      });
    }
    playerTogglePlayPause();
  };

  // Initialize socket connection and realtime player sync
  const socket = useSocket();
  useRealtimePlayer(socket);
  
  // Initialize keyboard shortcuts
  useKeyboardShortcuts(
    handlePlayPause,
    volumeUp,
    volumeDown,
    toggleMute,
    toggleShortcutsModal
  );

  // Fetch data with React Query
  const { data: tracks, isLoading: tracksLoading } = useTracks();
  const { data: playlistData, isLoading: playlistLoading } = usePlaylist();

  // Update store when data changes
  useEffect(() => {
    if (tracks) {
      setTracks(tracks);
    }
  }, [tracks, setTracks]);

  useEffect(() => {
    if (playlistData) {
      setPlaylist(playlistData);
      setQueue(playlistData);
      
      // Auto-set current track if one is playing
      const playingTrack = playlistData.find(item => item.is_playing);
      if (playingTrack && !usePlayerStore.getState().currentTrack) {
        setCurrentTrack(playingTrack);
        expandPlayer();
      }
    }
  }, [playlistData, setPlaylist, setQueue, setCurrentTrack, expandPlayer]);

  // Sync player with playlist store
  useEffect(() => {
    const current = currentTrack();
    const playerCurrent = usePlayerStore.getState().currentTrack;
    
    if (current && current.id !== playerCurrent?.id) {
      setCurrentTrack(current);
      if (current.is_playing) {
        expandPlayer();
      }
    }
  }, [currentTrack, setCurrentTrack, expandPlayer]);

  // Extract dominant color from album art
  useEffect(() => {
    const current = currentTrack();
    if (current && current.track.cover_url) {
      // This would normally use canvas API to extract color
      // For now, we'll use a gradient based on track ID
      const colors = ['#1a3a52', '#2d1b4e', '#1e4037', '#4a2c2a', '#2a3f5f'];
      const hash = current.track.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      setDominantColor(colors[hash % colors.length]);
    }
  }, [currentTrack]);

  if (tracksLoading || playlistLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="h-screen overflow-hidden bg-black">
      {/* Dynamic background based on dominant color */}
      <motion.div 
        className="absolute inset-0 opacity-20"
        animate={{
          background: `radial-gradient(circle at 50% 50%, ${dominantColor} 0%, transparent 70%)`
        }}
        transition={{ duration: 2, ease: "easeInOut" }}
      />
      
      {/* Animated gradient overlay */}
      <motion.div
        className="absolute inset-0 opacity-10"
        animate={{
          background: [
            'linear-gradient(45deg, transparent 0%, rgba(0,255,136,0.1) 100%)',
            'linear-gradient(225deg, transparent 0%, rgba(255,136,0,0.1) 100%)',
            'linear-gradient(45deg, transparent 0%, rgba(0,255,136,0.1) 100%)'
          ]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      />

      {/* Main Winamp Layout */}
      <div className="relative h-full flex overflow-hidden">
        {/* Left Sidebar */}
        <WinampLeftSidebar />

        {/* Central Song List */}
        <WinampSongList />

        {/* Right Panel */}
        <WinampRightPanel 
          visualizerStyle={visualizerStyle}
          onVisualizerStyleChange={setVisualizerStyle}
          dominantColor={dominantColor}
        />
      </div>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-16 right-4 z-50 bg-gray-900 rounded-lg border border-gray-700 p-6 min-w-[320px] shadow-2xl"
          >
            <h3 className="text-lg font-bold mb-4 text-green-400">Settings</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Visualizer Style</label>
                <select 
                  value={visualizerStyle}
                  onChange={(e) => setVisualizerStyle(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
                >
                  <option value="bars">Frequency Bars</option>
                  <option value="wave">Waveform</option>
                  <option value="circular">Circular</option>
                  <option value="spectrum">Spectrum</option>
                </select>
              </div>
              
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Theme</label>
                <select className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white">
                  <option>Classic Winamp</option>
                  <option>Modern Dark</option>
                  <option>Neon</option>
                </select>
              </div>
              
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Crossfade (seconds)</label>
                <input 
                  type="range" 
                  min="0" 
                  max="10" 
                  className="w-full"
                />
              </div>
            </div>
            
            <button
              onClick={() => setShowSettings(false)}
              className="mt-6 w-full py-2 bg-green-600 hover:bg-green-500 text-white rounded transition-colors"
            >
              Close
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}