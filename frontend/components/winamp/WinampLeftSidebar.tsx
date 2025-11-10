'use client';

import { useState, useEffect } from 'react';
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
  FolderOpen,
  X,
  Plus
} from '@phosphor-icons/react';
import { usePlaylistStore } from '@/store/playlist-store';
import { useMultiPlaylistStore } from '@/store/multi-playlist-store';
import { useFilterStore, FilterType } from '@/store/filter-store';
import { useTracks, useAddToPlaylist, useUpdatePlaylistTrack } from '@/hooks/use-api';
import { usePlayerStore } from '@/store/player-store';

interface SidebarSection {
  title: string;
  icon: React.ReactNode;
  items: string[];
  expanded: boolean;
}

export default function WinampLeftSidebar() {
  const { currentTrack } = usePlaylistStore();
  const { 
    playlists, 
    activePlaylistId,
    createPlaylist, 
    setActivePlaylist,
    addTracksToPlaylist,
    deletePlaylist,
    renamePlaylist
  } = useMultiPlaylistStore();
  const { activeFilter, setActiveFilter, clearFilter } = useFilterStore();
  const { data: tracks } = useTracks();
  const addToPlaylistMutation = useAddToPlaylist();
  const updateTrackMutation = useUpdatePlaylistTrack();
  const [showCreatePlaylist, setShowCreatePlaylist] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [playlistName, setPlaylistName] = useState('');
  const [playlistDescription, setPlaylistDescription] = useState('');
  const [selectedTracks, setSelectedTracks] = useState<Set<string>>(new Set());
  const [editingPlaylistId, setEditingPlaylistId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
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
      items: playlists.map(p => p.name),
      expanded: true
    },
    {
      title: 'Connectivity',
      icon: <WifiHigh size={12} />,
      items: ['Spotify', 'Deezer', 'Apple Music'],
      expanded: false
    }
  ]);

  // Update sections when playlists change
  useEffect(() => {
    setSections(prev => prev.map(section => 
      section.title === 'Playlists' 
        ? { ...section, items: playlists.map(p => p.name) }
        : section
    ));
  }, [playlists]);

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

  const handleTrackSelection = (trackId: string) => {
    const newSelection = new Set(selectedTracks);
    if (newSelection.has(trackId)) {
      newSelection.delete(trackId);
    } else {
      newSelection.add(trackId);
    }
    setSelectedTracks(newSelection);
  };

  const handleCreatePlaylist = () => {
    if (!playlistName.trim()) {
      alert('Please enter a playlist name');
      return;
    }

    const playlistId = createPlaylist(playlistName, playlistDescription);
    
    // Add selected tracks to the new playlist
    if (selectedTracks.size > 0) {
      const tracksToAdd = Array.from(selectedTracks).map((trackId, index) => {
        const track = tracks?.find(t => t.id === trackId);
        if (track) {
          return {
            id: `${playlistId}-${trackId}`,
            track_id: trackId,
            track: track,
            position: index + 1, // Sequential positions starting from 1
            added_by: 'User',
            added_at: new Date().toISOString(),
            is_playing: false,
            votes: 0
          };
        }
        return null;
      }).filter(Boolean) as any[];
      
      addTracksToPlaylist(playlistId, tracksToAdd);
    }

    // Reset modal state
    setShowCreatePlaylist(false);
    setPlaylistName('');
    setPlaylistDescription('');
    setSelectedTracks(new Set());
    setSearchQuery('');
  };

  // Map filter names to filter types
  const getFilterType = (itemName: string): FilterType => {
    switch (itemName) {
      case 'Most Played': return 'most_played';
      case 'Recently Added': return 'recently_added';
      case 'Recently Played': return 'recently_played';
      case 'Never Played': return 'never_played';
      case 'Top Rated': return 'top_rated';
      default: return null;
    }
  };

  const handleFilterClick = (itemName: string) => {
    const filterType = getFilterType(itemName);
    
    if (filterType) {
      // Clear any active playlist when using filters
      if (activePlaylistId) {
        setActivePlaylist(''); // Clear active playlist
      }
      
      // Toggle filter - if same filter is clicked, clear it
      if (activeFilter === filterType) {
        clearFilter();
      } else {
        setActiveFilter(filterType);
      }
    }
  };

  const filteredTracks = tracks?.filter(track => {
    const query = searchQuery.toLowerCase();
    return (
      track.title.toLowerCase().includes(query) ||
      track.artist.toLowerCase().includes(query) ||
      track.album.toLowerCase().includes(query)
    );
  });

  return (
    <motion.div
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-64 bg-gray-900 border-r border-green-500/30 h-full flex flex-col relative z-10"
      style={{
        background: 'linear-gradient(180deg, #1a1a1a 0%, #0f0f0f 100%)',
        boxShadow: 'inset -1px 0 0 rgba(0,255,128,0.2)'
      }}
    >

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto py-2">
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
                    {section.title === 'Playlists' ? (
                      <>
                        {playlists.map((playlist, itemIndex) => (
                          <motion.div
                            key={playlist.id}
                            initial={{ x: -10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: itemIndex * 0.05 }}
                            className="w-full text-left px-2 py-1 text-xs text-gray-400 hover:text-green-400 hover:bg-green-500/10 transition-all duration-200 flex items-center justify-between group"
                          >
                            {editingPlaylistId === playlist.id ? (
                              <input
                                type="text"
                                value={editingName}
                                onChange={(e) => setEditingName(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    renamePlaylist(playlist.id, editingName);
                                    setEditingPlaylistId(null);
                                  } else if (e.key === 'Escape') {
                                    setEditingPlaylistId(null);
                                  }
                                }}
                                onBlur={() => {
                                  renamePlaylist(playlist.id, editingName);
                                  setEditingPlaylistId(null);
                                }}
                                className="bg-gray-800 px-1 py-0.5 text-green-400 outline-none"
                                autoFocus
                              />
                            ) : (
                              <>
                                <button
                                  onClick={() => {
                                    // Stop any currently playing tracks when switching playlists
                                    const { playlists, updateTrackInPlaylist: updateTrack } = useMultiPlaylistStore.getState();
                                    playlists.forEach(p => {
                                      p.tracks.forEach(t => {
                                        if (t.is_playing) {
                                          updateTrack(p.id, t.id, { is_playing: false });
                                        }
                                      });
                                    });
                                    
                                    // Also stop server playlist tracks
                                    const serverPlaylist = usePlaylistStore.getState().playlist;
                                    serverPlaylist.forEach(serverTrack => {
                                      if (serverTrack.is_playing) {
                                        updateTrackMutation.mutate({
                                          id: serverTrack.id,
                                          data: { is_playing: false }
                                        });
                                      }
                                    });
                                    
                                    // Clear player state
                                    usePlayerStore.getState().setCurrentTrack(null);
                                    
                                    setActivePlaylist(playlist.id);
                                    if (activeFilter) {
                                      clearFilter(); // Clear any active filter when selecting a playlist
                                    }
                                  }}
                                  className={`flex items-center space-x-2 flex-1 ${
                                    activePlaylistId === playlist.id ? 'text-green-400 font-semibold' : ''
                                  }`}
                                >
                                  <span className="w-3 text-center">
                                    {activePlaylistId === playlist.id ? '▶' : '•'}
                                  </span>
                                  <span>{playlist.name}</span>
                                  <span className="text-gray-500">({playlist.tracks.length})</span>
                                </button>
                                <div className="opacity-0 group-hover:opacity-100 flex space-x-1">
                                  <button
                                    onClick={() => {
                                      setEditingPlaylistId(playlist.id);
                                      setEditingName(playlist.name);
                                    }}
                                    className="text-gray-500 hover:text-green-400 px-1"
                                  >
                                    ✏
                                  </button>
                                  <button
                                    onClick={() => {
                                      if (confirm(`Delete "${playlist.name}"?`)) {
                                        deletePlaylist(playlist.id);
                                      }
                                    }}
                                    className="text-gray-500 hover:text-red-400 px-1"
                                  >
                                    ✕
                                  </button>
                                </div>
                              </>
                            )}
                          </motion.div>
                        ))}
                        {playlists.length === 0 && (
                          <div className="px-2 py-1 text-xs text-gray-500 italic">
                            No playlists yet
                          </div>
                        )}
                      </>
                    ) : (
                      section.items.map((item, itemIndex) => {
                        const filterType = getFilterType(item);
                        const isActive = activeFilter === filterType;
                        
                        return (
                          <motion.button
                            key={item}
                            initial={{ x: -10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: itemIndex * 0.05 }}
                            onClick={() => section.title === 'Recent Items' ? handleFilterClick(item) : undefined}
                            className={`w-full text-left px-2 py-1 text-xs transition-all duration-200 flex items-center space-x-2 group ${
                              isActive 
                                ? 'bg-green-500/20 text-green-300 border-l-2 border-green-400' 
                                : 'text-gray-400 hover:text-green-400 hover:bg-green-500/10'
                            } ${
                              section.title === 'Recent Items' ? 'cursor-pointer' : ''
                            }`}
                          >
                            <span className="w-3 text-center">
                              {isActive ? '▶' : '•'}
                            </span>
                            <span>{item}</span>
                          </motion.button>
                        );
                      })
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* Create Playlist Button */}
      <div className="flex-shrink-0 p-2 border-t border-gray-700/50 bg-gray-900 relative z-20">
        <button
          onClick={() => setShowCreatePlaylist(true)}
          className="w-full px-2 py-2 bg-green-600 hover:bg-green-500 text-white text-xs font-medium transition-colors flex items-center justify-center space-x-1"
        >
          <Plus size={12} />
          <span>Create Playlist</span>
        </button>
      </div>

      {/* Create Playlist Modal */}
      <AnimatePresence>
        {showCreatePlaylist && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-[9999]"
            onClick={() => {
              setShowCreatePlaylist(false);
              setSearchQuery('');
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-gray-900 border border-green-500/30 rounded-lg p-6 w-[600px] max-h-[600px] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-green-500/20">
                <h3 className="text-lg font-bold text-green-400 flex items-center space-x-2">
                  <Star size={20} className="text-green-400" />
                  <span>Create New Playlist</span>
                </h3>
                <button
                  onClick={() => {
                    setShowCreatePlaylist(false);
                    setSearchQuery('');
                    setPlaylistName('');
                    setPlaylistDescription('');
                    setSelectedTracks(new Set());
                  }}
                  className="text-gray-400 hover:text-white p-1"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Playlist Details */}
              <div className="mb-4 space-y-3">
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Playlist Name *</label>
                  <input
                    type="text"
                    placeholder="Enter playlist name..."
                    value={playlistName}
                    onChange={(e) => setPlaylistName(e.target.value)}
                    className="w-full bg-gray-800 border border-green-500/30 rounded px-3 py-2 text-white placeholder-gray-400 text-sm focus:outline-none focus:border-green-400"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Description (optional)</label>
                  <textarea
                    placeholder="Add a description..."
                    value={playlistDescription}
                    onChange={(e) => setPlaylistDescription(e.target.value)}
                    className="w-full bg-gray-800 border border-green-500/30 rounded px-3 py-1 text-white placeholder-gray-400 text-sm focus:outline-none focus:border-green-400 h-12 resize-none"
                  />
                </div>
              </div>

              {/* Search and Filter */}
              <div className="mb-4">
                <div className="flex items-center space-x-2 mb-3">
                  <input
                    type="text"
                    placeholder="Search tracks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 bg-gray-800 border border-green-500/30 rounded px-3 py-2 text-white placeholder-gray-400 text-sm focus:outline-none focus:border-green-400"
                  />
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="px-3 py-2 bg-green-600 hover:bg-green-500 text-white rounded text-xs"
                  >
                    Clear
                  </button>
                </div>
                <p className="text-xs text-gray-400">Select tracks to add to your new playlist</p>
              </div>
              
              {/* Track List */}
              <div className="flex-1 overflow-y-auto space-y-1 mb-4 border border-green-500/20 rounded p-2 min-h-[200px] max-h-[300px]">
                {filteredTracks?.map((track, index) => (
                  <motion.div
                    key={track.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className={`flex items-center justify-between p-2 rounded transition-colors cursor-pointer ${
                      selectedTracks.has(track.id) 
                        ? 'bg-green-500/20 border border-green-500/30' 
                        : 'bg-gray-800/50 hover:bg-green-500/10'
                    }`}
                    onClick={() => handleTrackSelection(track.id)}
                  >
                    <div className="flex items-center space-x-2 flex-1 min-w-0">
                      <input
                        type="checkbox"
                        checked={selectedTracks.has(track.id)}
                        onChange={() => handleTrackSelection(track.id)}
                        onClick={(e) => e.stopPropagation()}
                        className="w-3 h-3 accent-green-500"
                      />
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium truncate transition-colors ${
                          selectedTracks.has(track.id) ? 'text-green-400' : 'text-white'
                        }`}>
                          {track.title}
                        </p>
                        <div className="flex items-center space-x-2 text-xs text-gray-400">
                          <span>{track.artist}</span>
                          <span>•</span>
                          <span>{track.album}</span>
                          <span>•</span>
                          <span>{Math.floor(track.duration_seconds / 60)}:{String(track.duration_seconds % 60).padStart(2, '0')}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {/* Action Buttons */}
              <div className="flex-shrink-0 border-t border-green-500/20 pt-4 mt-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-xs text-gray-400">
                    <div>{filteredTracks?.length || 0} tracks {searchQuery ? 'found' : 'available'}</div>
                    <div className="text-green-400">{selectedTracks.size} selected</div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        const allFilteredIds = new Set(filteredTracks?.map(t => t.id) || []);
                        setSelectedTracks(allFilteredIds);
                      }}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white text-xs rounded transition-colors"
                    >
                      Select All
                    </button>
                    <button
                      onClick={() => setSelectedTracks(new Set())}
                      className="px-3 py-1 bg-gray-600 hover:bg-gray-500 text-white text-xs rounded transition-colors"
                    >
                      Clear
                    </button>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setShowCreatePlaylist(false);
                      setSearchQuery('');
                      setPlaylistName('');
                      setPlaylistDescription('');
                      setSelectedTracks(new Set());
                    }}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm rounded transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreatePlaylist}
                    disabled={!playlistName.trim()}
                    className="px-6 py-2 bg-green-600 hover:bg-green-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white text-sm rounded transition-colors font-medium"
                  >
                    Create Playlist
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}