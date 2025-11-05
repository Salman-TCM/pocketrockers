'use client';

import { motion } from 'framer-motion';
import { Waveform, Users, WifiHigh, WifiX, CircleNotch } from '@phosphor-icons/react';
import { usePlaylistStore } from '@/store/playlist-store';
import KeyboardShortcuts from './KeyboardShortcuts';
import SettingsPanel from './SettingsPanel';
import UserPresence from './UserPresence';
import PlaylistHistory from './PlaylistHistory';

export default function Header() {
  const { connectionStatus, playlist } = usePlaylistStore();

  const statusConfig = {
    connected: {
      icon: WifiHigh,
      color: 'text-neon-teal',
      bg: 'bg-neon-teal/10',
      border: 'border-neon-teal/30',
      text: 'Connected'
    },
    connecting: {
      icon: CircleNotch,
      color: 'text-neon-lime',
      bg: 'bg-neon-lime/10',
      border: 'border-neon-lime/30',
      text: 'Connecting'
    },
    disconnected: {
      icon: WifiX,
      color: 'text-neon-pink',
      bg: 'bg-neon-pink/10',
      border: 'border-neon-pink/30',
      text: 'Disconnected'
    }
  };

  const config = statusConfig[connectionStatus];
  const StatusIcon = config.icon;

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="glass-panel mx-6 mt-6 p-6"
    >
      <div className="flex items-center justify-between">
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="flex items-center space-x-3"
        >
          <div className="relative">
            <Waveform 
              size={32} 
              className="text-neon-teal"
              weight="duotone"
            />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 border-2 border-neon-teal/20 rounded-full border-dashed"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold gradient-text">SyncPlay</h1>
            <p className="text-sm text-gray-400">Collaborative Playlist Manager</p>
          </div>
        </motion.div>

        {/* Stats & Controls */}
        <div className="hidden md:flex items-center space-x-4">
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="flex items-center space-x-2 px-4 py-2 glass-panel"
          >
            <Users size={20} className="text-neon-purple" weight="duotone" />
            <span className="text-sm">
              <span className="font-semibold text-neon-purple">{playlist.length}</span>
              <span className="text-gray-400 ml-1">tracks</span>
            </span>
          </motion.div>
          
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.4 }}
          >
            <UserPresence />
          </motion.div>
          
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="flex items-center space-x-2"
          >
            <PlaylistHistory />
            <KeyboardShortcuts />
            <SettingsPanel />
          </motion.div>
        </div>

        {/* Connection Status */}
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className={`flex items-center space-x-3 px-4 py-2 rounded-xl border ${config.bg} ${config.border}`}
        >
          <StatusIcon 
            size={18} 
            className={`${config.color} ${connectionStatus === 'connecting' ? 'animate-spin' : ''}`}
            weight="duotone"
          />
          <span className={`text-sm font-medium ${config.color}`}>
            {config.text}
          </span>
        </motion.div>
      </div>
    </motion.header>
  );
}