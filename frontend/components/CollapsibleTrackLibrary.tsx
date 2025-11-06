'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MusicNote, 
  Waveform,
  MagnifyingGlass,
  Funnel,
  Plus
} from '@phosphor-icons/react';
import { usePlaylistStore } from '@/store/playlist-store';
import { usePlayerStore } from '@/store/player-store';
import { useAddToPlaylist } from '@/hooks/use-api';
import { formatDuration, getTrackImage, generateGradient, cn } from '@/lib/utils';
import { Track } from '@/types';
import Image from 'next/image';
import toast from 'react-hot-toast';

interface PulsingMusicIconProps {
  isPlaying: boolean;
  onClick: () => void;
}

const PulsingMusicIcon = ({ isPlaying, onClick }: PulsingMusicIconProps) => {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="relative p-4 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full shadow-2xl cursor-pointer group"
    >
      <motion.div
        animate={isPlaying ? {
          rotate: [0, 10, -10, 0],
          scale: [1, 1.05, 1]
        } : {}}
        transition={{
          duration: 1.5,
          repeat: isPlaying ? Infinity : 0,
          ease: "easeInOut"
        }}
      >
        <Waveform size={24} weight="bold" className="text-white" />
      </motion.div>
      
      {/* Pulsing ring */}
      <AnimatePresence>
        {isPlaying && (
          <motion.div
            initial={{ scale: 1, opacity: 0.8 }}
            animate={{ 
              scale: [1, 2, 2.5],
              opacity: [0.8, 0.3, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeOut"
            }}
            className="absolute inset-0 rounded-full border-2 border-cyan-400"
          />
        )}
      </AnimatePresence>
    </motion.button>
  );
};

interface TrackCardProps {
  track: Track;
  isInPlaylist: boolean;
  onAdd: (track: Track) => void;
}

const TrackCard = ({ track, isInPlaylist, onAdd }: TrackCardProps) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -2 }}
      className="group bg-white/5 backdrop-blur-sm rounded-xl p-4 hover:bg-white/10 transition-all duration-300 border border-white/10"
    >
      <div className="flex items-center space-x-4">
        {/* Album Art */}
        <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
          <div className={cn("absolute inset-0 bg-gradient-to-br", generateGradient(track.id))} />
          <Image
            src={getTrackImage(track)}
            alt={track.title}
            fill
            className="object-cover mix-blend-overlay"
            unoptimized
          />
        </div>

        {/* Track Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-white truncate group-hover:text-cyan-300 transition-colors">
            {track.title}
          </h3>
          <p className="text-sm text-gray-400 truncate">
            {track.artist}
          </p>
          <div className="flex items-center space-x-2 mt-1">
            <span className="text-xs text-gray-500">{track.genre}</span>
            <span className="text-xs text-gray-600">•</span>
            <span className="text-xs text-gray-500">{formatDuration(track.duration_seconds)}</span>
          </div>
        </div>

        {/* Add Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onAdd(track)}
          disabled={isInPlaylist}
          className={cn(
            "p-2 rounded-full transition-all duration-200",
            isInPlaylist 
              ? "bg-green-500/20 text-green-400 cursor-default"
              : "bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 opacity-0 group-hover:opacity-100"
          )}
        >
          <Plus size={16} weight={isInPlaylist ? "bold" : "regular"} />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default function CollapsibleTrackLibrary() {
  const {
    tracks,
    searchTerm,
    selectedGenre,
    filteredTracks,
    genres,
    playlistTrackIds,
    setSearchTerm,
    setSelectedGenre
  } = usePlaylistStore();
  
  const { isLibraryCollapsed, isPlaying, toggleLibrary } = usePlayerStore();
  const addToPlaylistMutation = useAddToPlaylist();
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const handleAddToPlaylist = async (track: Track) => {
    try {
      addToPlaylistMutation.mutate({
        track_id: track.id,
        added_by: 'User'
      });
      
      toast.success(`Added "${track.title}" to playlist`);
    } catch (error) {
      toast.error('Failed to add track to playlist');
    }
  };

  const displayedTracks = filteredTracks();
  const playlistIds = playlistTrackIds();

  return (
    <div className="h-full w-full flex flex-col">
      {/* Collapsed State - Centered Music Icon */}
      <AnimatePresence>
        {isLibraryCollapsed && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="h-full w-full flex items-center justify-center bg-black/20 backdrop-blur-xl border border-white/10 rounded-lg"
          >
            <PulsingMusicIcon isPlaying={isPlaying} onClick={toggleLibrary} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expanded State - Full Library */}
      <AnimatePresence>
        {!isLibraryCollapsed && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="h-full w-full bg-black/20 backdrop-blur-xl border border-white/10 rounded-lg flex flex-col"
          >
            {/* Header */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="p-6 border-b border-white/10"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">Track Library</h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleLibrary}
                  className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/10"
                >
                  <MusicNote size={20} />
                </motion.button>
              </div>

              {/* Search Bar */}
              <motion.div
                animate={isSearchFocused ? { scale: 1.02 } : { scale: 1 }}
                className="relative mb-4"
              >
                <MagnifyingGlass 
                  size={18} 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
                />
                <input
                  type="text"
                  placeholder="Search tracks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none transition-all duration-200"
                />
              </motion.div>

              {/* Genre Filter */}
              <div className="relative">
                <Funnel 
                  size={18} 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
                />
                <select
                  value={selectedGenre}
                  onChange={(e) => setSelectedGenre(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:border-cyan-400 focus:outline-none transition-all duration-200 appearance-none cursor-pointer"
                >
                  {genres().map((genre) => (
                    <option key={genre} value={genre} className="bg-gray-800">
                      {genre}
                    </option>
                  ))}
                </select>
              </div>
            </motion.div>

            {/* Track List */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="flex-1 overflow-y-auto p-6 space-y-3"
            >
              <AnimatePresence mode="popLayout">
                {displayedTracks.map((track, index) => (
                  <motion.div
                    key={track.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ 
                      opacity: 1, 
                      y: 0,
                      transition: { delay: index * 0.05 }
                    }}
                    exit={{ opacity: 0, y: -20 }}
                    layout
                  >
                    <TrackCard
                      track={track}
                      isInPlaylist={playlistIds.has(track.id)}
                      onAdd={handleAddToPlaylist}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>

              {displayedTracks.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12 text-gray-400"
                >
                  <MusicNote size={48} className="mx-auto mb-4 opacity-50" />
                  <p>No tracks found</p>
                  <p className="text-sm mt-2">Try adjusting your search or filter</p>
                </motion.div>
              )}
            </motion.div>

            {/* Stats Footer */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.4 }}
              className="p-4 border-t border-white/10 bg-white/5"
            >
              <div className="flex justify-between text-sm text-gray-400">
                <span>{displayedTracks.length} tracks</span>
                <span>{tracks.length} total</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}