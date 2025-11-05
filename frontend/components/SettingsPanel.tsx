'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Gear, 
  X, 
  SortDescending,
  Download,
  ArrowsCounterClockwise,
  Users,
  ClockCounterClockwise,
  Eye
} from '@phosphor-icons/react';
import { usePlaylistStore } from '@/store/playlist-store';
import Modal from './Modal';

export default function SettingsPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const { autoSortByVotes, toggleAutoSort, playlist } = usePlaylistStore();

  const exportPlaylist = () => {
    const playlistData = {
      name: 'SyncPlay Collaborative Playlist',
      tracks: playlist.map((item, index) => ({
        position: index + 1,
        title: item.track.title,
        artist: item.track.artist,
        album: item.track.album,
        duration: item.track.duration_seconds,
        votes: item.votes,
        added_by: item.added_by,
        added_at: item.added_at,
      })),
      total_tracks: playlist.length,
      total_duration: playlist.reduce((sum, item) => sum + item.track.duration_seconds, 0),
      exported_at: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(playlistData, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `syncplay-playlist-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      {/* Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="p-2 rounded-xl bg-dark-200/50 border border-white/10 hover:border-neon-purple/30 transition-all duration-200"
        title="Settings"
      >
        <Gear size={18} className="text-gray-400 hover:text-neon-purple transition-colors" weight="duotone" />
      </motion.button>

      {/* Modal */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} className="max-w-lg w-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-r from-neon-purple/20 to-neon-pink/20 rounded-xl">
                    <Gear size={24} className="text-neon-purple" weight="duotone" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Settings</h2>
                    <p className="text-sm text-gray-400">Customize your experience</p>
                  </div>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X size={20} className="text-gray-400" weight="bold" />
                </motion.button>
              </div>

              {/* Settings Content */}
              <div className="p-6 space-y-6">
                {/* Playlist Settings */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <SortDescending size={20} className="mr-2 text-neon-teal" weight="duotone" />
                    Playlist Settings
                  </h3>
                  
                  <div className="space-y-4">
                    {/* Auto Sort Toggle */}
                    <div className="flex items-center justify-between p-4 bg-dark-300/30 rounded-xl border border-white/5">
                      <div>
                        <h4 className="font-medium text-white">Auto-sort by Votes</h4>
                        <p className="text-sm text-gray-400">Automatically reorder tracks by vote count</p>
                      </div>
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={toggleAutoSort}
                        className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                          autoSortByVotes ? 'bg-neon-teal' : 'bg-gray-600'
                        }`}
                      >
                        <motion.div
                          animate={{ x: autoSortByVotes ? 24 : 0 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                          className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm"
                        />
                      </motion.button>
                    </div>
                  </div>
                </div>

                {/* Export & Backup */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <Download size={20} className="mr-2 text-neon-blue" weight="duotone" />
                    Export & Backup
                  </h3>
                  
                  <div className="space-y-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={exportPlaylist}
                      className="w-full p-4 bg-dark-300/30 hover:bg-dark-200/50 rounded-xl border border-white/5 hover:border-neon-blue/30 transition-all duration-200 text-left"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-white">Export Playlist</h4>
                          <p className="text-sm text-gray-400">Download as JSON file</p>
                        </div>
                        <Download size={18} className="text-neon-blue" weight="duotone" />
                      </div>
                    </motion.button>
                  </div>
                </div>

                {/* Advanced Features (Coming Soon) */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <Eye size={20} className="mr-2 text-neon-pink" weight="duotone" />
                    Advanced Features
                  </h3>
                  
                  <div className="space-y-3">
                    {[
                      { icon: ArrowsCounterClockwise, title: 'Undo/Redo', desc: 'Undo recent actions' },
                      { icon: Users, title: 'User Presence', desc: 'See who\'s online' },
                      { icon: ClockCounterClockwise, title: 'Play History', desc: 'Track listening history' },
                    ].map((feature, index) => (
                      <motion.div
                        key={feature.title}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 bg-dark-300/20 rounded-xl border border-white/5 opacity-60"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <feature.icon size={18} className="text-gray-500" weight="duotone" />
                            <div>
                              <h4 className="font-medium text-gray-400">{feature.title}</h4>
                              <p className="text-sm text-gray-500">{feature.desc}</p>
                            </div>
                          </div>
                          <span className="text-xs text-gray-500 bg-gray-700 px-2 py-1 rounded">Soon</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Playlist Stats</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gradient-to-br from-neon-teal/10 to-neon-blue/10 rounded-xl border border-neon-teal/20">
                      <div className="text-2xl font-bold text-neon-teal">{playlist.length}</div>
                      <div className="text-sm text-gray-400">Total Tracks</div>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-neon-purple/10 to-neon-pink/10 rounded-xl border border-neon-purple/20">
                      <div className="text-2xl font-bold text-neon-purple">
                        {Math.floor(playlist.reduce((sum, item) => sum + item.track.duration_seconds, 0) / 60)}m
                      </div>
                      <div className="text-sm text-gray-400">Total Duration</div>
                    </div>
                  </div>
                </div>
              </div>
      </Modal>
    </>
  );
}