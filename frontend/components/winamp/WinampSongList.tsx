'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  CaretUp, 
  CaretDown,
  MusicNote,
  Clock,
  Calendar,
  User
} from '@phosphor-icons/react';
import { usePlaylistStore } from '@/store/playlist-store';
import { useUpdatePlaylistTrack } from '@/hooks/use-api';
import { formatDuration } from '@/lib/utils';
import Image from 'next/image';

type SortField = 'date' | 'playCount' | 'title' | 'artist' | 'duration';
type SortOrder = 'asc' | 'desc';

export default function WinampSongList() {
  const { playlist, currentTrack } = usePlaylistStore();
  const updateTrackMutation = useUpdatePlaylistTrack();
  
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [hoveredTrack, setHoveredTrack] = useState<string | null>(null);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const sortedPlaylist = useMemo(() => {
    const sorted = [...playlist].sort((a, b) => {
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
  }, [playlist, sortField, sortOrder]);

  const handlePlayTrack = (trackId: string) => {
    const track = playlist.find(item => item.id === trackId);
    if (track) {
      // If the track is already playing, just pause it
      if (track.is_playing) {
        updateTrackMutation.mutate({
          id: trackId,
          data: { is_playing: false }
        });
      } else {
        // If starting a new track, stop any currently playing track first
        const currentlyPlaying = playlist.find(item => item.is_playing);
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
          <h1 className="text-sm text-gray-300">Library</h1>
          <div className="flex items-center space-x-4 text-xs text-gray-400">
            <button className="bg-green-600 hover:bg-green-500 px-3 py-1 text-white rounded">Play</button>
            <button className="bg-gray-700 hover:bg-gray-600 px-3 py-1 text-gray-300 rounded">Enqueue</button>
            <button className="bg-red-600 hover:bg-red-500 px-3 py-1 text-white rounded">Remove</button>
            <span>{playlist.length} items, {Math.round(playlist.reduce((acc, item) => acc + item.track.duration_seconds, 0) / 60)} estimated play time</span>
          </div>
        </div>
      </div>

      {/* Column Headers */}
      <div className="border-b border-green-500/20 bg-gray-800/50">
        <div className="grid grid-cols-12 gap-2 px-2 py-1 text-xs text-gray-300 font-medium">
          <div className="col-span-2">Library</div>
          <div className="col-span-1 text-center">Play Count</div>
          <div className="col-span-5">Song Name</div>
          <div className="col-span-2">Artist</div>
          <div className="col-span-2 text-right">Duration</div>
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
                className={`grid grid-cols-12 gap-2 px-2 py-1 text-xs border-b border-gray-800/30 hover:bg-green-500/10 cursor-pointer ${
                  isCurrent ? 'bg-green-500/20 text-green-300' : isPlaying ? 'bg-green-500/15 text-green-400' : 'text-gray-300'
                }`}
                onClick={() => handlePlayTrack(item.id)}
              >
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

                {/* Play Count */}
                <div className="col-span-1 text-center flex items-center justify-center">
                  {item.votes || 1}
                </div>

                {/* Song Name */}
                <div className="col-span-5 flex items-center truncate">
                  <span className={`truncate ${isCurrent ? 'font-semibold' : ''}`}>
                    {item.track.title}
                  </span>
                </div>

                {/* Artist */}
                <div className="col-span-2 flex items-center truncate">
                  <span className="truncate">{item.track.artist}</span>
                </div>

                {/* Duration */}
                <div className="col-span-2 text-right flex items-center justify-end">
                  {formatDuration(item.track.duration_seconds)}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

    </div>
  );
}