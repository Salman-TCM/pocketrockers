'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { MagnifyingGlass, Plus, MusicNotes, Funnel, Clock } from '@phosphor-icons/react';
import { usePlaylistStore } from '@/store/playlist-store';
import { useAddToPlaylist } from '@/hooks/use-api';
import { formatDuration, getTrackImage, generateGradient, cn } from '@/lib/utils';
import Image from 'next/image';

export default function TrackLibrary() {
  const {
    searchTerm,
    setSearchTerm,
    selectedGenre,
    setSelectedGenre,
    filteredTracks,
    genres,
    playlistTrackIds,
  } = usePlaylistStore();

  const addToPlaylistMutation = useAddToPlaylist();

  const handleAddToPlaylist = (track: any) => {
    addToPlaylistMutation.mutate({
      track_id: track.id,
      added_by: 'Anonymous',
    });
  };

  const tracks = filteredTracks();
  const trackIds = playlistTrackIds();
  const allGenres = genres();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full flex flex-col glass-panel"
    >
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex items-center space-x-3 mb-6"
        >
          <div className="p-2 bg-gradient-to-r from-neon-teal/20 to-neon-blue/20 rounded-xl">
            <MusicNotes size={24} className="text-neon-teal" weight="duotone" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Track Library</h2>
            <p className="text-sm text-gray-400">{tracks.length} tracks available</p>
          </div>
        </motion.div>
        
        {/* Search */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="relative mb-4"
        >
          <MagnifyingGlass 
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" 
            size={18} 
            weight="duotone"
          />
          <input
            type="text"
            placeholder="Search by title, artist, or album..."
            className="input-field w-full pl-12"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </motion.div>

        {/* Genre Filter */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="relative"
        >
          <Funnel 
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" 
            size={18} 
            weight="duotone"
          />
          <select
            className="input-field w-full pl-12 cursor-pointer"
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
          >
            {allGenres.map(genre => (
              <option key={genre} value={genre} className="bg-dark-300">
                {genre}
              </option>
            ))}
          </select>
        </motion.div>
      </div>

      {/* Track List */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="popLayout">
          {tracks.map((track, index) => {
            const isInPlaylist = trackIds.has(track.id);
            const isLoading = addToPlaylistMutation.isPending;
            
            return (
              <motion.div
                key={track.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ 
                  duration: 0.3,
                  delay: Math.min(index * 0.05, 0.5)
                }}
                className={cn(
                  "group p-4 hover:bg-dark-100/30 transition-all duration-300 cursor-pointer border-b border-white/5",
                  "hover:shadow-[0_4px_20px_rgba(0,255,204,0.05)]"
                )}
              >
                <div className="flex items-center space-x-4">
                  {/* Album Art */}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0"
                  >
                    <div className={cn("absolute inset-0 bg-gradient-to-br", generateGradient(track.id))} />
                    <Image
                      src={getTrackImage(track)}
                      alt={track.title}
                      fill
                      className="object-cover mix-blend-overlay"
                      unoptimized
                    />
                  </motion.div>

                  {/* Track Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white truncate group-hover:text-neon-teal transition-colors">
                      {track.title}
                    </h3>
                    <p className="text-sm text-gray-400 truncate">{track.artist}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs text-gray-500">{track.album}</span>
                      <span className="text-xs text-gray-500">•</span>
                      <div className="flex items-center space-x-1">
                        <Clock size={12} className="text-gray-500" />
                        <span className="text-xs text-gray-500">{formatDuration(track.duration_seconds)}</span>
                      </div>
                    </div>
                    <span className="inline-block px-2 py-1 mt-2 text-xs bg-neon-purple/10 text-neon-purple rounded-full">
                      {track.genre}
                    </span>
                  </div>
                  
                  {/* Add Button */}
                  <motion.button
                    whileHover={{ scale: isInPlaylist ? 1 : 1.05 }}
                    whileTap={{ scale: isInPlaylist ? 1 : 0.95 }}
                    onClick={() => !isInPlaylist && !isLoading && handleAddToPlaylist(track)}
                    disabled={isInPlaylist || isLoading}
                    className={cn(
                      "p-3 rounded-xl transition-all duration-200 flex-shrink-0",
                      isInPlaylist 
                        ? "bg-dark-300 text-gray-500 cursor-not-allowed" 
                        : "btn-primary opacity-0 group-hover:opacity-100"
                    )}
                    title={isInPlaylist ? 'Already in playlist' : 'Add to playlist'}
                  >
                    <Plus size={18} weight={isInPlaylist ? "fill" : "bold"} />
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        
        {tracks.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center h-64 text-center"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <MusicNotes size={64} className="text-gray-600 mb-4" weight="duotone" />
            </motion.div>
            <h3 className="text-lg font-semibold text-gray-400 mb-2">No tracks found</h3>
            <p className="text-sm text-gray-500">Try adjusting your search or filter</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}