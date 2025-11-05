'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { usePlaylistStore } from '@/store/playlist-store';
import { useSocket } from '@/hooks/use-socket';
import { useTracks, usePlaylist, useUpdatePlaylistTrack } from '@/hooks/use-api';
import Header from '@/components/Header';
import TrackLibrary from '@/components/TrackLibrary';
import PlaylistPanel from '@/components/PlaylistPanel';
import NowPlayingBar from '@/components/NowPlayingBar';
import LoadingScreen from '@/components/LoadingScreen';
import KeyboardShortcuts from '@/components/KeyboardShortcuts';
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

  // Create proper play/pause callback that uses track mutation
  const handlePlayPause = () => {
    const current = currentTrack();
    if (current) {
      console.log('🎵 Space bar play/pause for track:', current.track.title, 'current state:', current.is_playing);
      updateTrackMutation.mutate({
        id: current.id,
        data: { is_playing: !current.is_playing }
      });
    }
  };

  // Initialize socket connection and keyboard shortcuts
  useSocket();
  // TEMPORARILY DISABLED for debugging
  // useKeyboardShortcuts(
  //   handlePlayPause,
  //   volumeUp,
  //   volumeDown,
  //   toggleMute,
  //   toggleShortcutsModal
  // );

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

      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-neon-teal/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-purple/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-neon-blue/10 rounded-full blur-2xl" />
      </div>
    </motion.div>
  );
}