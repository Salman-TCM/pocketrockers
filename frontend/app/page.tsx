'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlaylistStore } from '@/store/playlist-store';
import { usePlayerStore } from '@/store/player-store';
import { useSocket } from '@/hooks/use-socket';
import { useRealtimePlayer } from '@/hooks/use-realtime-player';
import { useTracks, usePlaylist, useUpdatePlaylistTrack } from '@/hooks/use-api';
import Header from '@/components/Header';
import TrackLibrary from '@/components/TrackLibrary';
import PlaylistPanel from '@/components/PlaylistPanel';
import NowPlayingBar from '@/components/NowPlayingBar';
import LoadingScreen from '@/components/LoadingScreen';
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts';
import { cn } from '@/lib/utils';

// Enhanced Components
import EnhancedNowPlaying from '@/components/EnhancedNowPlaying';
import CollapsibleTrackLibrary from '@/components/CollapsibleTrackLibrary';
import HorizontalPlaylist from '@/components/HorizontalPlaylist';

// Winamp Components
import WinampPlayer from '@/app/winamp-player';

export default function Home() {
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
    isLibraryCollapsed,
    setCurrentTrack,
    setQueue,
    togglePlayPause: playerTogglePlayPause,
    expandPlayer,
    toggleLibrary
  } = usePlayerStore();

  // Check if user wants Winamp mode (can be controlled via URL params or localStorage)
  const isWinampMode = typeof window !== 'undefined' && 
    (window.location.search.includes('winamp=true') || localStorage.getItem('winampMode') === 'true');

  const updateTrackMutation = useUpdatePlaylistTrack();
  
  // Initialize socket and realtime player sync
  const socket = useSocket();
  useRealtimePlayer(socket);

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

  // Keyboard shortcuts
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

  if (tracksLoading || playlistLoading) {
    return <LoadingScreen />;
  }

  // Return Winamp interface if in Winamp mode
  if (isWinampMode) {
    return <WinampPlayer />;
  }

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(120,219,226,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(168,85,247,0.1),transparent_50%)]" />
      </div>

      {/* Enhanced Now Playing (Full Screen When Expanded) */}
      <EnhancedNowPlaying />

      {/* Normal Layout (When Not Expanded) */}
      <AnimatePresence>
        {!isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col h-screen relative z-10"
          >
            {/* Header */}
            <Header />

            {/* Main Content - Responsive Grid Layout */}
            <motion.div 
              className="flex-1 overflow-hidden px-4 py-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className={cn(
                "h-full grid gap-2 transition-all duration-500 ease-out",
                "sm:gap-3 md:gap-4",
                isLibraryCollapsed 
                  ? "grid-cols-[80px_1fr]" 
                  : "grid-rows-[300px_1fr] md:grid-rows-none md:grid-cols-[40%_60%] lg:grid-cols-[35%_65%] xl:grid-cols-[35%_65%]"
              )}>
                {/* Track Library Panel - 35-40% width */}
                <motion.div
                  layout
                  className="h-full overflow-hidden"
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  <CollapsibleTrackLibrary />
                </motion.div>

                {/* Playlist Panel - 60-65% width */}
                <motion.div
                  layout
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="h-full overflow-hidden"
                >
                  <div className="h-full">
                    <PlaylistPanel />
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Traditional Now Playing Bar (When No Track Expanded) */}
            {currentTrack() && (
              <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <NowPlayingBar />
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Horizontal Playlist (Bottom When Expanded) */}
      <HorizontalPlaylist />

      {/* Global Keyboard Shortcuts Hint */}
      <AnimatePresence>
        {!isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-4 right-4 z-40"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2 text-xs text-gray-300 border border-white/10"
            >
              Press <kbd className="bg-white/20 px-1 rounded">Space</kbd> to play/pause
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}