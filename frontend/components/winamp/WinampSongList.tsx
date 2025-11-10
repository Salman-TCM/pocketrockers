'use client';

import { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  CaretUp, 
  CaretDown,
  ThumbsUp,
  ThumbsDown,
  MusicNote,
  Clock,
  Calendar,
  User
} from '@phosphor-icons/react';
import { usePlaylistStore } from '@/store/playlist-store';
import { useMultiPlaylistStore } from '@/store/multi-playlist-store';
import { usePlayerStore } from '@/store/player-store';
import { useUpdatePlaylistTrack, useVoteTrack } from '@/hooks/use-api';
import { formatDuration } from '@/lib/utils';
import Image from 'next/image';

type SortField = 'date' | 'playCount' | 'title' | 'artist' | 'duration';
type SortOrder = 'asc' | 'desc';

export default function WinampSongList() {
  const { playlist, currentTrack } = usePlaylistStore();
  const { getActivePlaylist, activePlaylistId, updateTrackInPlaylist } = useMultiPlaylistStore();
  const { setCurrentTrack, togglePlayPause, isPlaying } = usePlayerStore();
  const updateTrackMutation = useUpdatePlaylistTrack();
  const voteTrackMutation = useVoteTrack();
  
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [hoveredTrack, setHoveredTrack] = useState<string | null>(null);
  const [draggedTrack, setDraggedTrack] = useState<string | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const dragRef = useRef<HTMLDivElement>(null);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Use active playlist if available, otherwise fall back to main playlist
  const activePlaylist = getActivePlaylist();
  const displayPlaylist = activePlaylist ? activePlaylist.tracks : playlist;

  const sortedPlaylist = useMemo(() => {
    const sorted = [...displayPlaylist];
    
    // For drag-and-drop functionality, we need to respect position ordering
    // Only apply custom sorting when explicitly requested
    if (sortField === 'date' && sortOrder === 'desc') {
      // Default view - sort by position for proper drag-and-drop
      return sorted.sort((a, b) => (a.position || 0) - (b.position || 0));
    }
    
    // Custom sorting
    sorted.sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case 'date':
          comparison = new Date(a.added_at).getTime() - new Date(b.added_at).getTime();
          break;
        case 'playCount':
          comparison = (a.votes || 0) - (b.votes || 0);
          break;
        case 'title':
          comparison = a.track.title.localeCompare(b.track.title);
          break;
        case 'artist':
          comparison = a.track.artist.localeCompare(b.track.artist);
          break;
        case 'duration':
          comparison = a.track.duration_seconds - b.track.duration_seconds;
          break;
        default:
          comparison = 0;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    return sorted;
  }, [displayPlaylist, sortField, sortOrder]);

  const handlePlayTrack = (trackId: string) => {
    const track = displayPlaylist.find(item => item.id === trackId);
    
    if (!track) {
      console.warn('Track not found:', trackId);
      return;
    }
    
    console.log('Playing track:', track.track.title, 'from', activePlaylist ? 'custom playlist' : 'server playlist');
    
    // Set the current track in the player store
    setCurrentTrack(track);
    
    if (activePlaylist) {
      // For custom playlists, handle playback locally
      console.log('Updating custom playlist tracks...');
      
      // First, stop any currently playing track in this playlist
      activePlaylist.tracks.forEach(t => {
        if (t.is_playing && t.id !== trackId) {
          console.log('Stopping track:', t.track.title);
          updateTrackInPlaylist(activePlaylist.id, t.id, { is_playing: false });
        }
      });
      
      // Then toggle the selected track
      const newPlayingState = !track.is_playing;
      console.log('Setting track playing state to:', newPlayingState);
      updateTrackInPlaylist(activePlaylist.id, trackId, { 
        is_playing: newPlayingState 
      });
      
      // Update player state if starting playback
      if (newPlayingState) {
        console.log('Starting playback in player store');
        togglePlayPause();
      }
    } else {
      // For server playlists, use the API
      console.log('Using server API for playback...');
      if (track.is_playing) {
        updateTrackMutation.mutate({
          id: trackId,
          data: { is_playing: false }
        });
      } else {
        // If starting a new track, stop any currently playing track first
        const currentlyPlaying = displayPlaylist.find(item => item.is_playing);
        if (currentlyPlaying && currentlyPlaying.id !== trackId) {
          updateTrackMutation.mutate({
            id: currentlyPlaying.id,
            data: { is_playing: false }
          });
        }
        // Then start the new track
        updateTrackMutation.mutate({
          id: trackId,
          data: { is_playing: true }
        });
      }
    }
  };

  const current = currentTrack();

  // Position calculation algorithm (from assignment requirements)
  const calculatePosition = (prevPosition?: number | null, nextPosition?: number | null): number => {
    if (!prevPosition && !nextPosition) return 1.0;
    if (!prevPosition) return nextPosition! - 1;
    if (!nextPosition) return prevPosition + 1;
    return (prevPosition + nextPosition) / 2;
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, trackId: string) => {
    setDraggedTrack(trackId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', trackId);
    
    // Add some visual feedback
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '0.5';
    }
  };

  const handleDragEnd = (e: React.DragEvent) => {
    setDraggedTrack(null);
    setDragOverIndex(null);
    
    // Restore opacity
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '1';
    }
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    
    const draggedId = e.dataTransfer.getData('text/plain');
    if (!draggedId || draggedId === sortedPlaylist[targetIndex]?.id) {
      setDraggedTrack(null);
      setDragOverIndex(null);
      return;
    }

    // Find the dragged track and calculate new position
    const draggedTrackIndex = sortedPlaylist.findIndex(t => t.id === draggedId);
    if (draggedTrackIndex === -1) return;

    const prevTrack = targetIndex > 0 ? sortedPlaylist[targetIndex - 1] : null;
    const nextTrack = sortedPlaylist[targetIndex];
    
    const newPosition = calculatePosition(
      prevTrack?.position || null,
      nextTrack?.position || null
    );

    console.log('Dropping track at index', targetIndex, 'with position', newPosition);

    // Update position based on playlist type
    if (activePlaylist) {
      // Custom playlist - update locally
      updateTrackInPlaylist(activePlaylist.id, draggedId, { position: newPosition });
    } else {
      // Server playlist - use API
      updateTrackMutation.mutate({
        id: draggedId,
        data: { position: newPosition }
      });
    }

    setDraggedTrack(null);
    setDragOverIndex(null);
  };

  const handleVote = (trackId: string, direction: 'up' | 'down', e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering play
    
    if (activePlaylist) {
      // Custom playlist - update locally
      const track = activePlaylist.tracks.find(t => t.id === trackId);
      if (track) {
        const currentVotes = track.votes || 0;
        const newVotes = direction === 'up' ? currentVotes + 1 : currentVotes - 1;
        updateTrackInPlaylist(activePlaylist.id, trackId, { votes: newVotes });
      }
    } else {
      // Server playlist - use API
      voteTrackMutation.mutate({ id: trackId, direction });
    }
  };

  const SortHeader = ({ field, children, icon }: { 
    field: SortField; 
    children: React.ReactNode; 
    icon: React.ReactNode;
  }) => {
    const isActive = sortField === field;
    
    return (
      <button
        onClick={() => handleSort(field)}
        className={`flex items-center space-x-2 px-4 py-3 text-left font-semibold transition-all duration-200 group w-full ${
          isActive ? 'text-green-400 bg-green-500/10' : 'text-gray-300 hover:text-green-400'
        }`}
      >
        <div className={isActive ? "text-green-400" : "text-gray-500"}>{icon}</div>
        <span className="flex-1">{children}</span>
        <div className="flex items-center space-x-1">
          {isActive && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-green-400"
            >
              {sortOrder === 'asc' ? <CaretUp size={14} weight="bold" /> : <CaretDown size={14} weight="bold" />}
            </motion.div>
          )}
        </div>
      </button>
    );
  };

  return (
    <div className="flex-1 bg-black border-r border-green-500/30 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="border-b border-green-500/30 bg-gray-900/50 px-4 py-2">
        <div className="flex items-center justify-between">
          <h1 className="text-sm text-gray-300">
            {activePlaylist ? activePlaylist.name : 'Library'}
            {activePlaylist && (
              <span className="text-xs text-gray-500 ml-2">
                ({activePlaylist.description || 'Custom Playlist'})
              </span>
            )}
          </h1>
          <div className="flex items-center space-x-4 text-xs text-gray-400">
            <button className="bg-green-600 hover:bg-green-500 px-3 py-1 text-white rounded">Play</button>
            <button className="bg-gray-700 hover:bg-gray-600 px-3 py-1 text-gray-300 rounded">Enqueue</button>
            <button className="bg-red-600 hover:bg-red-500 px-3 py-1 text-white rounded">Remove</button>
            <span>{displayPlaylist.length} items, {Math.round(displayPlaylist.reduce((acc, item) => acc + item.track.duration_seconds, 0) / 60)} estimated play time</span>
          </div>
        </div>
      </div>

      {/* Column Headers */}
      <div className="border-b border-green-500/20 bg-gray-800/50">
        <div className="grid grid-cols-12 gap-2 px-2 py-1 text-xs text-gray-300 font-medium">
          <div className="col-span-2">Added</div>
          <div className="col-span-1 text-center">Votes</div>
          <div className="col-span-4">Song Name</div>
          <div className="col-span-3">Artist</div>
          <div className="col-span-1 text-right">Duration</div>
          <div className="col-span-1 text-center">Actions</div>
        </div>
      </div>

      {/* Song List */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <AnimatePresence>
          {sortedPlaylist.map((item, index) => {
            const isPlaying = item.is_playing;
            const isCurrent = current?.id === item.id;
            
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.01 }}
                onMouseEnter={() => setHoveredTrack(item.id)}
                onMouseLeave={() => setHoveredTrack(null)}
                draggable={true}
                onDragStart={(e) => handleDragStart(e as unknown as React.DragEvent, item.id)}
                onDragEnd={(e) => handleDragEnd(e as unknown as React.DragEvent)}
                onDragOver={(e) => handleDragOver(e as unknown as React.DragEvent, index)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, index)}
                className={`group relative grid grid-cols-12 gap-2 px-2 py-1 text-xs border-b border-gray-800/30 hover:bg-green-500/10 transition-all duration-200 ${
                  draggedTrack === item.id ? 'opacity-50 scale-95' : 'cursor-pointer'
                } ${
                  dragOverIndex === index ? 'border-green-400 border-t-2' : ''
                } ${
                  isCurrent ? 'bg-green-500/20 text-green-300' : isPlaying ? 'bg-green-500/15 text-green-400' : 'text-gray-300'
                }`}
                onClick={() => !draggedTrack && handlePlayTrack(item.id)}
              >
                {/* Drag Handle */}
                <div className="absolute left-0 top-0 bottom-0 w-1 cursor-grab active:cursor-grabbing opacity-0 hover:opacity-100 bg-green-500/30 transition-opacity"></div>
                {/* Library/Date */}
                <div className="col-span-2 flex items-center">
                  {new Date(item.added_at).toLocaleDateString('en-US', { 
                    day: '2-digit',
                    month: '2-digit',
                    year: '2-digit'
                  })} {new Date(item.added_at).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>

                {/* Votes */}
                <div className="col-span-1 text-center flex items-center justify-center">
                  <span className={`font-medium ${
                    (item.votes || 0) > 0 ? 'text-green-400' : 
                    (item.votes || 0) < 0 ? 'text-red-400' : 
                    'text-gray-400'
                  }`}>
                    {item.votes || 0}
                  </span>
                </div>

                {/* Song Name */}
                <div className="col-span-4 flex items-center truncate">
                  <span className={`truncate ${isCurrent ? 'font-semibold' : ''}`}>
                    {item.track.title}
                  </span>
                </div>

                {/* Artist */}
                <div className="col-span-3 flex items-center truncate">
                  <span className="truncate">{item.track.artist}</span>
                </div>

                {/* Duration */}
                <div className="col-span-1 text-right flex items-center justify-end">
                  {formatDuration(item.track.duration_seconds)}
                </div>

                {/* Vote Actions */}
                <div className="col-span-1 flex items-center justify-center space-x-1">
                  <button
                    onClick={(e) => handleVote(item.id, 'up', e)}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-green-500/20 rounded transition-all"
                    title="Upvote"
                  >
                    <ThumbsUp size={12} className="text-green-400 hover:text-green-300" />
                  </button>
                  <button
                    onClick={(e) => handleVote(item.id, 'down', e)}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 rounded transition-all"
                    title="Downvote"
                  >
                    <ThumbsDown size={12} className="text-red-400 hover:text-red-300" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

    </div>
  );
}