'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import { 
  Play, 
  ThumbsUp, 
  ThumbsDown, 
  Trash, 
  Clock, 
  DotsSixVertical,
  Queue,
  User
} from '@phosphor-icons/react';
import { usePlaylistStore } from '@/store/playlist-store';
import { useVoteTrack, useRemoveFromPlaylist, useUpdatePlaylistTrack } from '@/hooks/use-api';
import { formatDuration, formatTotalDuration, getTrackImage, generateGradient, cn } from '@/lib/utils';
import Image from 'next/image';

export default function PlaylistPanel() {
  const { 
    totalDuration, 
    sortedPlaylist, 
    autoSortByVotes, 
    selectedTrackIndex,
    setSelectedTrackIndex 
  } = usePlaylistStore();
  
  const voteTrackMutation = useVoteTrack();
  const removeTrackMutation = useRemoveFromPlaylist();
  const updateTrackMutation = useUpdatePlaylistTrack();

  const playlistTracks = sortedPlaylist();
  const duration = totalDuration();

  const handleVote = (id: string, direction: 'up' | 'down') => {
    voteTrackMutation.mutate({ id, direction });
  };

  const handleRemove = (id: string) => {
    removeTrackMutation.mutate(id);
  };

  const handlePlay = (id: string, index?: number) => {
    if (index !== undefined) {
      setSelectedTrackIndex(index);
    }
    
    // Stop currently playing tracks
    const currentPlaying = playlistTracks.find(track => track.is_playing);
    if (currentPlaying) {
      updateTrackMutation.mutate({
        id: currentPlaying.id,
        data: { is_playing: false }
      });
    }
    
    // Start new track
    updateTrackMutation.mutate({
      id,
      data: { is_playing: true }
    });
  };

  const handleSongClick = (id: string, index: number, event: React.MouseEvent) => {
    // Don't trigger if clicking on buttons or interactive elements
    const target = event.target as HTMLElement;
    if (target.closest('button') || target.closest('[role="button"]')) {
      return;
    }
    
    handlePlay(id, index);
  };

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
          className="flex items-center justify-between"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-neon-purple/20 to-neon-pink/20 rounded-xl">
              <Queue size={24} className="text-neon-purple" weight="duotone" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Playlist</h2>
              <p className="text-sm text-gray-400">
                {playlistTracks.length} tracks • {formatTotalDuration(duration)}
                {autoSortByVotes && <span className="ml-2 text-neon-teal">• Auto-sorted by votes</span>}
              </p>
            </div>
          </div>
          
          {playlistTracks.length > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="px-4 py-2 bg-neon-teal/10 border border-neon-teal/30 rounded-xl"
            >
              <div className="flex items-center space-x-2">
                <Clock size={16} className="text-neon-teal" weight="duotone" />
                <span className="text-sm font-medium text-neon-teal">
                  {formatTotalDuration(duration)}
                </span>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>

      <Droppable droppableId="playlist">
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={cn(
              "flex-1 overflow-y-auto transition-all duration-200",
              snapshot.isDraggingOver && "bg-neon-teal/5"
            )}
          >
            <AnimatePresence mode="popLayout">
              {playlistTracks.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      onClick={(e) => handleSongClick(item.id, index, e)}
                      className={cn(
                        "group border-b border-white/5 transition-all duration-300 cursor-pointer",
                        snapshot.isDragging && "bg-dark-200/80 shadow-2xl scale-105 rotate-1 z-50",
                        !snapshot.isDragging && !item.is_playing && "hover:bg-dark-100/30",
                        item.is_playing && "bg-gradient-to-r from-neon-teal/10 to-transparent border-neon-teal/30",
                        selectedTrackIndex === index && !item.is_playing && "bg-gradient-to-r from-neon-blue/10 to-transparent border-neon-blue/30"
                      )}
                    >
                      <div className="p-4 flex items-center space-x-4">
                        {/* Drag Handle */}
                        <div
                          {...provided.dragHandleProps}
                          className="text-gray-500 hover:text-neon-teal cursor-grab active:cursor-grabbing transition-colors hover:scale-110 transform transition-transform"
                        >
                          <DotsSixVertical size={18} weight="bold" />
                        </div>

                        {/* Track Number / Playing Indicator */}
                        <div className="w-8 flex justify-center">
                          {item.is_playing ? (
                            <div className="flex items-center space-x-1">
                              <motion.div
                                className="w-1 h-3 bg-neon-teal rounded-full"
                                animate={{ height: [12, 4, 16, 8, 12] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                              />
                              <motion.div
                                className="w-1 h-3 bg-neon-teal rounded-full"
                                animate={{ height: [8, 16, 4, 12, 8] }}
                                transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                              />
                              <motion.div
                                className="w-1 h-3 bg-neon-teal rounded-full"
                                animate={{ height: [4, 12, 8, 16, 4] }}
                                transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                              />
                            </div>
                          ) : (
                            <span className="text-sm text-gray-500 font-medium">
                              {index + 1}
                            </span>
                          )}
                        </div>

                        {/* Album Art */}
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0"
                        >
                          <div className={cn("absolute inset-0 bg-gradient-to-br", generateGradient(item.track.id))} />
                          <Image
                            src={getTrackImage(item.track)}
                            alt={item.track.title}
                            fill
                            className="object-cover mix-blend-overlay"
                            unoptimized
                          />
                          {item.is_playing && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="absolute inset-0 bg-neon-teal/20 flex items-center justify-center"
                            >
                              <Play size={16} className="text-neon-teal" weight="fill" />
                            </motion.div>
                          )}
                        </motion.div>

                        {/* Track Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className={cn(
                            "font-semibold truncate transition-colors",
                            item.is_playing ? "text-neon-teal" : "text-white group-hover:text-neon-teal"
                          )}>
                            {item.track.title}
                          </h3>
                          <p className="text-sm text-gray-400 truncate">{item.track.artist}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-xs text-gray-500">{formatDuration(item.track.duration_seconds)}</span>
                            <span className="text-xs text-gray-500">•</span>
                            <div className="flex items-center space-x-1">
                              <User size={12} className="text-gray-500" />
                              <span className="text-xs text-gray-500">{item.added_by}</span>
                            </div>
                          </div>
                        </div>

                        {/* Voting */}
                        <div className="flex items-center space-x-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleVote(item.id, 'up');
                            }}
                            className="p-2 rounded-lg hover:bg-green-500/20 text-gray-400 hover:text-green-400 transition-all"
                            title="Upvote"
                          >
                            <ThumbsUp size={16} weight="duotone" />
                          </motion.button>
                          
                          <motion.span
                            key={item.votes}
                            initial={{ scale: 1.2 }}
                            animate={{ scale: 1 }}
                            className={cn(
                              "text-sm font-bold w-8 text-center transition-colors",
                              item.votes > 0 && "text-green-400",
                              item.votes < 0 && "text-red-400",
                              item.votes === 0 && "text-gray-400"
                            )}
                          >
                            {item.votes}
                          </motion.span>
                          
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleVote(item.id, 'down');
                            }}
                            className="p-2 rounded-lg hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-all"
                            title="Downvote"
                          >
                            <ThumbsDown size={16} weight="duotone" />
                          </motion.button>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-2">
                          <motion.button
                            whileHover={{ scale: item.is_playing ? 1 : 1.05 }}
                            whileTap={{ scale: item.is_playing ? 1 : 0.95 }}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              
                              if (!item.is_playing) {
                                handlePlay(item.id, index);
                              }
                            }}
                            disabled={item.is_playing}
                            className={cn(
                              "p-3 rounded-xl transition-all duration-200",
                              item.is_playing 
                                ? "bg-neon-teal/20 text-neon-teal border border-neon-teal/30 cursor-not-allowed"
                                : "btn-primary opacity-0 group-hover:opacity-100 cursor-pointer"
                            )}
                            title={item.is_playing ? "Currently playing" : "Play track"}
                          >
                            <Play size={16} weight={item.is_playing ? "fill" : "bold"} />
                          </motion.button>
                          
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemove(item.id);
                            }}
                            className="p-3 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30 transition-all duration-200 opacity-0 group-hover:opacity-100"
                            title="Remove from playlist"
                          >
                            <Trash size={16} weight="duotone" />
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
            </AnimatePresence>
            
            {provided.placeholder}
            
            {playlistTracks.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center h-64 text-center"
              >
                <motion.div
                  animate={{ 
                    y: [0, -10, 0],
                    rotate: [0, 5, -5, 0] 
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <Queue size={64} className="text-gray-600 mb-4" weight="duotone" />
                </motion.div>
                <h3 className="text-lg font-semibold text-gray-400 mb-2">Your playlist is empty</h3>
                <p className="text-sm text-gray-500">Add some tracks from the library to get the party started! 🎵</p>
              </motion.div>
            )}
          </div>
        )}
      </Droppable>
    </motion.div>
  );
}