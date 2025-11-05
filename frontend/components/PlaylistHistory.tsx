'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ClockCounterClockwise,
  X,
  Play,
  Clock,
  User
} from '@phosphor-icons/react';
import { formatDuration } from '@/lib/utils';
import Modal from './Modal';

interface HistoryTrack {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration_seconds: number;
  played_at: Date;
  played_by: string;
}

export default function PlaylistHistory() {
  const [isOpen, setIsOpen] = useState(false);
  
  // Mock history data (in a real app, this would come from the store/API)
  const [history] = useState<HistoryTrack[]>([
    {
      id: '1',
      title: 'Bohemian Rhapsody',
      artist: 'Queen',
      album: 'A Night at the Opera',
      duration_seconds: 355,
      played_at: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
      played_by: 'Alex'
    },
    {
      id: '2', 
      title: 'Hotel California',
      artist: 'Eagles',
      album: 'Hotel California',
      duration_seconds: 391,
      played_at: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
      played_by: 'You'
    },
    {
      id: '3',
      title: 'Stairway to Heaven',
      artist: 'Led Zeppelin',
      album: 'Led Zeppelin IV',
      duration_seconds: 482,
      played_at: new Date(Date.now() - 25 * 60 * 1000), // 25 minutes ago
      played_by: 'Sarah'
    },
    {
      id: '4',
      title: 'Sweet Child O\' Mine',
      artist: 'Guns N\' Roses',
      album: 'Appetite for Destruction',
      duration_seconds: 356,
      played_at: new Date(Date.now() - 35 * 60 * 1000), // 35 minutes ago
      played_by: 'Mike'
    }
  ]);

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return 'Just now';
    if (diffMins === 1) return '1 minute ago';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours === 1) return '1 hour ago';
    if (diffHours < 24) return `${diffHours} hours ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return '1 day ago';
    return `${diffDays} days ago`;
  };

  return (
    <>
      {/* Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="p-2 rounded-xl bg-dark-200/50 border border-white/10 hover:border-neon-lime/30 transition-all duration-200"
        title="Recently Played"
      >
        <ClockCounterClockwise size={18} className="text-gray-400 hover:text-neon-lime transition-colors" weight="duotone" />
      </motion.button>

      {/* Modal */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} className="max-w-2xl w-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-r from-neon-lime/20 to-neon-teal/20 rounded-xl">
                    <ClockCounterClockwise size={24} className="text-neon-lime" weight="duotone" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Recently Played</h2>
                    <p className="text-sm text-gray-400">Your listening history</p>
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

              {/* History List */}
              <div className="overflow-y-auto" style={{ maxHeight: 'calc(70vh - 200px)' }}>
                {history.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-12 text-center">
                    <ClockCounterClockwise size={64} className="text-gray-600 mb-4" weight="duotone" />
                    <h3 className="text-lg font-semibold text-gray-400 mb-2">No tracks played yet</h3>
                    <p className="text-sm text-gray-500">Start playing some music to build your history!</p>
                  </div>
                ) : (
                  <div className="p-4 space-y-2">
                    {history.map((track, index) => (
                      <motion.div
                        key={track.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="p-4 rounded-xl bg-dark-300/30 hover:bg-dark-200/50 transition-all duration-200 border border-white/5 hover:border-neon-lime/20"
                      >
                        <div className="flex items-center space-x-4">
                          {/* Play Button */}
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 rounded-lg bg-neon-lime/20 hover:bg-neon-lime/30 text-neon-lime transition-colors"
                            title="Play again"
                          >
                            <Play size={16} weight="fill" />
                          </motion.button>

                          {/* Track Info */}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-white truncate">{track.title}</h3>
                            <p className="text-sm text-gray-400 truncate">{track.artist}</p>
                            <p className="text-xs text-gray-500 truncate">{track.album}</p>
                          </div>

                          {/* Duration */}
                          <div className="flex items-center space-x-2 text-xs text-gray-400">
                            <Clock size={12} />
                            <span>{formatDuration(track.duration_seconds)}</span>
                          </div>

                          {/* Played Info */}
                          <div className="text-right">
                            <div className="flex items-center space-x-1 text-xs text-gray-400 mb-1">
                              <User size={12} />
                              <span>{track.played_by}</span>
                            </div>
                            <div className="text-xs text-gray-500">
                              {formatTimeAgo(track.played_at)}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {history.length > 0 && (
                <div className="p-4 border-t border-white/10">
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <span>{history.length} tracks in history</span>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
                    >
                      Clear History
                    </motion.button>
                  </div>
                </div>
              )}
      </Modal>
    </>
  );
}