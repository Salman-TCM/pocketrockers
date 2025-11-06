'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { usePlaylistStore } from '@/store/playlist-store';
import { useSocket } from '@/hooks/use-socket';
import { useTracks, usePlaylist, useUpdatePlaylistTrack } from '@/hooks/use-api';
import Header from '@/components/Header';
import TrackLibrary from '@/components/TrackLibrary';
import PlaylistPanel from '@/components/PlaylistPanel';
import NowPlayingBar from '@/components/NowPlayingBar';
import LoadingScreen from '@/components/LoadingScreen';
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts';

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

  const updateTrackMutation = useUpdatePlaylistTrack();

  const handlePlayPause = () => {
    const current = currentTrack();
    if (current) {
      updateTrackMutation.mutate({
        id: current.id,
        data: { is_playing: !current.is_playing }
      });
    }
  };

  // Initialize socket connection and keyboard shortcuts
  useSocket();
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
    }
  }, [playlistData, setPlaylist]);


  if (tracksLoading || playlistLoading) {
    return <LoadingScreen />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col h-screen bg-dark-400 overflow-hidden"
    >
      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden gap-6 p-6">
        {/* Track Library */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="w-2/5 min-w-[400px]"
        >
          <TrackLibrary />
        </motion.div>

        {/* Playlist */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex-1"
        >
          <PlaylistPanel />
        </motion.div>
      </div>

      {/* Now Playing Bar */}
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
  );
}