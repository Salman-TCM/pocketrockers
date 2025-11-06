'use client';

import { useRef } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { 
  Play,
  ArrowUp,
  ArrowDown,
  X,
  DotsThree,
  Users
} from '@phosphor-icons/react';
import { usePlaylistStore } from '@/store/playlist-store';
import { usePlayerStore } from '@/store/player-store';
import { useUpdatePlaylistTrack, useRemoveFromPlaylist } from '@/hooks/use-api';
import { formatDuration, getTrackImage, generateGradient, cn } from '@/lib/utils';
import { PlaylistTrack } from '@/types';
import Image from 'next/image';
import toast from 'react-hot-toast';

interface PlaylistCardProps {
  item: PlaylistTrack;
  index: number;
  isCurrentTrack: boolean;
  isPlaying: boolean;
  onPlay: () => void;
  onVote: (direction: 'up' | 'down') => void;
  onRemove: () => void;
}

const PlaylistCard = ({ 
  item, 
  index, 
  isCurrentTrack, 
  isPlaying,
  onPlay, 
  onVote, 
  onRemove 
}: PlaylistCardProps) => {
  const dragConstraints = useRef(null);

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    // If dragged up significantly, remove from playlist
    if (info.offset.y < -100) {
      onRemove();
    }
  };

  return (
    <motion.div
      ref={dragConstraints}
      drag="y"
      dragConstraints={{ top: -150, bottom: 0 }}
      dragElastic={0.2}
      onDragEnd={handleDragEnd}
      layout
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ 
        opacity: 1, 
        y: 0, 
        scale: 1,
        transition: { delay: index * 0.1 }
      }}
      exit={{ opacity: 0, y: 50, scale: 0.9 }}
      whileHover={{ scale: 1.05, y: -5 }}
      className={cn(
        "relative flex-shrink-0 w-64 h-80 rounded-2xl overflow-hidden cursor-pointer group",
        isCurrentTrack 
          ? "ring-2 ring-cyan-400 shadow-cyan-400/50" 
          : "shadow-lg hover:shadow-xl",
        "transition-all duration-300"
      )}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <div className={cn("absolute inset-0 bg-gradient-to-br", generateGradient(item.track.id))} />
        <Image
          src={getTrackImage(item.track)}
          alt={item.track.title}
          fill
          className="object-cover mix-blend-overlay opacity-80"
          unoptimized
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Current Track Indicator */}
      <AnimatePresence>
        {isCurrentTrack && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gradient-to-t from-cyan-500/20 to-purple-500/20"
          />
        )}
      </AnimatePresence>

      {/* Playing Animation */}
      <AnimatePresence>
        {isCurrentTrack && isPlaying && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.02, 1]
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 to-purple-400/20"
          />
        )}
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-between p-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <span className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium text-white">
              #{index + 1}
            </span>
            {isCurrentTrack && (
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="w-2 h-2 bg-cyan-400 rounded-full"
              />
            )}
          </div>

          {/* Quick Actions */}
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              className="p-1 bg-red-500/80 rounded-full backdrop-blur-sm"
            >
              <X size={12} className="text-white" />
            </motion.button>
          </div>
        </div>

        {/* Track Info */}
        <div className="space-y-2">
          <h3 className="font-bold text-white text-lg leading-tight line-clamp-2">
            {item.track.title}
          </h3>
          <p className="text-cyan-300 text-sm font-medium">
            {item.track.artist}
          </p>
          <p className="text-gray-300 text-xs">
            {item.track.album}
          </p>
          
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">
              {formatDuration(item.track.duration_seconds)}
            </span>
            <span className="text-xs text-gray-400">
              {item.track.genre}
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between">
          {/* Play Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              onPlay();
            }}
            className={cn(
              "p-2 rounded-full backdrop-blur-sm transition-all duration-200",
              isCurrentTrack 
                ? "bg-cyan-400/80 text-white" 
                : "bg-white/20 text-white hover:bg-white/30"
            )}
          >
            <Play size={16} weight="fill" />
          </motion.button>

          {/* Voting */}
          <div className="flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                onVote('up');
              }}
              className="p-1 bg-green-500/20 hover:bg-green-500/40 rounded-full backdrop-blur-sm transition-colors"
            >
              <ArrowUp size={12} className="text-green-400" />
            </motion.button>
            
            <span className={cn(
              "text-sm font-bold min-w-[20px] text-center",
              item.votes > 0 ? "text-green-400" :
              item.votes < 0 ? "text-red-400" : 
              "text-gray-300"
            )}>
              {item.votes > 0 ? `+${item.votes}` : item.votes}
            </span>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                onVote('down');
              }}
              className="p-1 bg-red-500/20 hover:bg-red-500/40 rounded-full backdrop-blur-sm transition-colors"
            >
              <ArrowDown size={12} className="text-red-400" />
            </motion.button>
          </div>

          {/* Added By */}
          <div className="flex items-center space-x-1">
            <Users size={12} className="text-gray-400" />
            <span className="text-xs text-gray-400">
              {item.added_by}
            </span>
          </div>
        </div>
      </div>

      {/* Drag Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        whileDrag={{ opacity: 1 }}
        className="absolute top-2 left-1/2 transform -translate-x-1/2 flex space-x-1"
      >
        <div className="w-8 h-1 bg-white/50 rounded-full" />
      </motion.div>
    </motion.div>
  );
};

export default function HorizontalPlaylist() {
  const { sortedPlaylist } = usePlaylistStore();
  const { currentTrack, isPlaying, setCurrentTrack, isExpanded } = usePlayerStore();
  const updateTrackMutation = useUpdatePlaylistTrack();
  const removeTrackMutation = useRemoveFromPlaylist();

  const playlist = sortedPlaylist();

  if (!isExpanded || playlist.length === 0) return null;

  const handlePlayTrack = (item: PlaylistTrack) => {
    setCurrentTrack(item);
    
    // Update backend
    updateTrackMutation.mutate({
      id: item.id,
      data: { is_playing: true }
    });
  };

  const handleVote = (item: PlaylistTrack, direction: 'up' | 'down') => {
    const newVotes = direction === 'up' ? item.votes + 1 : item.votes - 1;
    
    updateTrackMutation.mutate({
      id: item.id,
      data: { votes: newVotes }
    });

    toast.success(`${direction === 'up' ? 'Upvoted' : 'Downvoted'} "${item.track.title}"`);
  };

  const handleRemove = (item: PlaylistTrack) => {
    removeTrackMutation.mutate(item.id);
    toast.success(`Removed "${item.track.title}" from playlist`);
  };

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed bottom-0 left-0 right-0 z-30 bg-black/80 backdrop-blur-xl border-t border-white/10"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <div className="flex items-center space-x-3">
          <h3 className="text-lg font-bold text-white">Up Next</h3>
          <span className="px-2 py-1 bg-cyan-500/20 text-cyan-400 text-xs rounded-full">
            {playlist.length} tracks
          </span>
        </div>
        
        <div className="text-sm text-gray-400">
          Swipe up to remove • Click to play
        </div>
      </div>

      {/* Horizontal Scroll Container */}
      <div className="p-6">
        <motion.div 
          className="flex space-x-4 overflow-x-auto overflow-y-visible pb-4 scrollbar-hide"
          style={{ 
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          <AnimatePresence mode="popLayout">
            {playlist.map((item, index) => (
              <PlaylistCard
                key={item.id}
                item={item}
                index={index}
                isCurrentTrack={currentTrack?.id === item.id}
                isPlaying={isPlaying && currentTrack?.id === item.id}
                onPlay={() => handlePlayTrack(item)}
                onVote={(direction) => handleVote(item, direction)}
                onRemove={() => handleRemove(item)}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Hide scrollbar */}
      <style jsx global>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </motion.div>
  );
}