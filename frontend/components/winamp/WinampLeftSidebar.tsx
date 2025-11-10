'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MusicNote,
  Clock,
  HardDrive,
  Playlist,
  WifiHigh,
  CaretDown,
  CaretRight,
  House,
  Star,
  FolderOpen
} from '@phosphor-icons/react';
import { usePlaylistStore } from '@/store/playlist-store';
import { useTracks, useAddToPlaylist } from '@/hooks/use-api';

interface SidebarSection {
  title: string;
  icon: React.ReactNode;
  items: string[];
  expanded: boolean;
}

export default function WinampLeftSidebar() {
  const { currentTrack } = usePlaylistStore();
  const { data: tracks } = useTracks();
  const addToPlaylistMutation = useAddToPlaylist();
  const [showCreatePlaylist, setShowCreatePlaylist] = useState(false);
  const [sections, setSections] = useState<SidebarSection[]>([
    {
      title: 'Now Playing',
      icon: <MusicNote size={12} />,
      items: [],
      expanded: true
    },
    {
      title: 'Recent Items',
      icon: <Clock size={12} />,
      items: ['Most Played', 'Recently Added', 'Recently Played', 'Never Played', 'Top Rated'],
      expanded: true
    },
    {
      title: 'Local Media',
      icon: <HardDrive size={12} />,
      items: ['Audio', 'Video'],
      expanded: false
    },
    {
      title: 'Playlists',
      icon: <Playlist size={12} />,
      items: [],
      expanded: false
    },
    {
      title: 'Connectivity',
      icon: <WifiHigh size={12} />,
      items: ['Spotify', 'Deezer', 'Apple Music'],
      expanded: false
    }
  ]);

  const toggleSection = (index: number) => {
    setSections(prev => prev.map((section, i) => 
      i === index ? { ...section, expanded: !section.expanded } : section
    ));
  };

  const handleAddToPlaylist = (trackId: string) => {
    addToPlaylistMutation.mutate({
      track_id: trackId,
      added_by: 'User'
    });
  };

  return (
    <motion.div
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-64 bg-gray-900 border-r border-green-500/30 h-full overflow-y-auto scrollbar-hide"
      style={{
        background: 'linear-gradient(180deg, #1a1a1a 0%, #0f0f0f 100%)',
        boxShadow: 'inset -1px 0 0 rgba(0,255,128,0.2)'
      }}
    >

      {/* Navigation Sections */}
      <div className="py-2">
        {sections.map((section, index) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="mb-1"
          >
            {/* Section Header */}
            <button
              onClick={() => toggleSection(index)}
              className="w-full px-2 py-1 flex items-center text-xs hover:bg-green-500/10 transition-colors group"
            >
              <span className="w-3 text-center mr-1 text-gray-400">
                {section.expanded ? '▼' : '▶'}
              </span>
              <div className="mr-2 text-gray-400">{section.icon}</div>
              <span className="font-medium text-gray-300 group-hover:text-green-400 transition-colors">
                {section.title}
              </span>
            </button>

            {/* Section Items */}
            <AnimatePresence>
              {section.expanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="pl-4">
                    {section.items.map((item, itemIndex) => (
                      <motion.button
                        key={item}
                        initial={{ x: -10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: itemIndex * 0.05 }}
                        className="w-full text-left px-2 py-1 text-xs text-gray-400 hover:text-green-400 hover:bg-green-500/10 transition-all duration-200 flex items-center space-x-2 group"
                      >
                        <span className="w-3 text-center">•</span>
                        <span>{item}</span>
                      </motion.button>
                    ))}
                    
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* Bottom Actions */}
      <div className="absolute bottom-0 left-0 right-0 p-2 border-t border-gray-700/50 bg-black">
        <button
          onClick={() => setShowCreatePlaylist(true)}
          className="w-full px-2 py-2 bg-green-600 hover:bg-green-500 text-white text-xs font-medium transition-colors flex items-center justify-center space-x-1"
        >
          <Star size={10} />
          <span>Playlist</span>
        </button>
      </div>

      {/* Create Playlist Modal */}
      <AnimatePresence>
        {showCreatePlaylist && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setShowCreatePlaylist(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-gray-900 rounded-lg border border-gray-700 p-6 w-96 max-h-96 overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-bold text-white mb-4">Add Tracks to Playlist</h3>
              
              <div className="space-y-2 mb-4">
                {tracks?.slice(0, 10).map((track) => (
                  <motion.div
                    key={track.id}
                    className="flex items-center justify-between p-2 bg-gray-800 rounded hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white truncate">{track.title}</p>
                      <p className="text-xs text-gray-400 truncate">{track.artist}</p>
                    </div>
                    <motion.button
                      onClick={() => handleAddToPlaylist(track.id)}
                      className="px-3 py-1 bg-green-600 hover:bg-green-500 text-white text-xs rounded transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Add
                    </motion.button>
                  </motion.div>
                ))}
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowCreatePlaylist(false)}
                  className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}