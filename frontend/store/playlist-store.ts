import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import Fuse from 'fuse.js';
import { Track, PlaylistTrack } from '@/types';

interface PlaylistState {
  tracks: Track[];
  playlist: PlaylistTrack[];
  searchTerm: string;
  selectedGenre: string;
  connectionStatus: 'connecting' | 'connected' | 'disconnected';
  isLoading: boolean;
  autoSortByVotes: boolean;
  
  // Audio controls
  volume: number;
  isMuted: boolean;
  isPlaying: boolean;
  
  // UI state
  showShortcutsModal: boolean;
  selectedTrackIndex: number;
  
  // Actions
  setTracks: (tracks: Track[]) => void;
  setPlaylist: (playlist: PlaylistTrack[]) => void;
  addToPlaylist: (item: PlaylistTrack) => void;
  removeFromPlaylist: (id: string) => void;
  updatePlaylistItem: (id: string, updates: Partial<PlaylistTrack>) => void;
  setSearchTerm: (term: string) => void;
  setSelectedGenre: (genre: string) => void;
  setConnectionStatus: (status: 'connecting' | 'connected' | 'disconnected') => void;
  setIsLoading: (loading: boolean) => void;
  toggleAutoSort: () => void;
  
  // Audio control actions
  setVolume: (volume: number) => void;
  setIsMuted: (muted: boolean) => void;
  toggleMute: () => void;
  setIsPlaying: (playing: boolean) => void;
  togglePlayPause: () => void;
  volumeUp: () => void;
  volumeDown: () => void;
  
  // UI actions
  setShowShortcutsModal: (show: boolean) => void;
  toggleShortcutsModal: () => void;
  setSelectedTrackIndex: (index: number) => void;
  selectNextTrack: () => void;
  selectPreviousTrack: () => void;
  playSelectedTrack: () => void;
  
  // Computed
  filteredTracks: () => Track[];
  currentTrack: () => PlaylistTrack | undefined;
  genres: () => string[];
  totalDuration: () => number;
  playlistTrackIds: () => Set<string>;
  sortedPlaylist: () => PlaylistTrack[];
}

export const usePlaylistStore = create<PlaylistState>()(
  devtools(
    (set, get) => ({
      tracks: [],
      playlist: [],
      searchTerm: '',
      selectedGenre: 'All',
      connectionStatus: 'connecting',
      isLoading: false,
      autoSortByVotes: false,
      
      // Audio controls initial state
      volume: 75,
      isMuted: false,
      isPlaying: false,
      
      // UI state initial values
      showShortcutsModal: false,
      selectedTrackIndex: 0,
      
      setTracks: (tracks) => set({ tracks }),
      setPlaylist: (playlist) => set({ playlist: playlist.sort((a, b) => a.position - b.position) }),
      
      addToPlaylist: (item) => set((state) => ({
        playlist: [...state.playlist, item].sort((a, b) => a.position - b.position)
      })),
      
      removeFromPlaylist: (id) => set((state) => ({
        playlist: state.playlist.filter(item => item.id !== id)
      })),
      
      updatePlaylistItem: (id, updates) => set((state) => ({
        playlist: state.playlist.map(item => 
          item.id === id ? { ...item, ...updates } : item
        ).sort((a, b) => a.position - b.position)
      })),
      
      setSearchTerm: (searchTerm) => set({ searchTerm }),
      setSelectedGenre: (selectedGenre) => set({ selectedGenre }),
      setConnectionStatus: (connectionStatus) => set({ connectionStatus }),
      setIsLoading: (isLoading) => set({ isLoading }),
      toggleAutoSort: () => set((state) => ({ autoSortByVotes: !state.autoSortByVotes })),
      
      // Audio control actions
      setVolume: (volume) => set({ volume: Math.max(0, Math.min(100, volume)) }),
      setIsMuted: (isMuted) => set({ isMuted }),
      toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
      setIsPlaying: (isPlaying) => set({ isPlaying }),
      togglePlayPause: () => set((state) => ({ isPlaying: !state.isPlaying })),
      volumeUp: () => set((state) => ({ volume: Math.min(100, state.volume + 5) })),
      volumeDown: () => set((state) => ({ volume: Math.max(0, state.volume - 5) })),
      
      // UI actions
      setShowShortcutsModal: (showShortcutsModal) => set({ showShortcutsModal }),
      toggleShortcutsModal: () => set((state) => ({ showShortcutsModal: !state.showShortcutsModal })),
      setSelectedTrackIndex: (selectedTrackIndex) => set({ selectedTrackIndex }),
      selectNextTrack: () => set((state) => {
        const playlist = state.sortedPlaylist();
        const maxIndex = playlist.length - 1;
        return { selectedTrackIndex: Math.min(maxIndex, state.selectedTrackIndex + 1) };
      }),
      selectPreviousTrack: () => set((state) => ({
        selectedTrackIndex: Math.max(0, state.selectedTrackIndex - 1)
      })),
      playSelectedTrack: () => {
        const state = get();
        const playlist = state.sortedPlaylist();
        const selectedTrack = playlist[state.selectedTrackIndex];
        if (selectedTrack) {
          // This will need to be handled in the component that calls this
          console.log('🎵 Should play track:', selectedTrack.track.title);
        }
      },
      
      // Computed getters
      filteredTracks: () => {
        const { tracks, searchTerm, selectedGenre } = get();
        
        let filteredByGenre = tracks;
        if (selectedGenre !== 'All') {
          filteredByGenre = tracks.filter(track => track.genre === selectedGenre);
        }
        
        if (!searchTerm.trim()) {
          return filteredByGenre;
        }
        
        // Use fuzzy search for better matching
        const fuse = new Fuse(filteredByGenre, {
          keys: [
            { name: 'title', weight: 0.4 },
            { name: 'artist', weight: 0.3 },
            { name: 'album', weight: 0.2 },
            { name: 'genre', weight: 0.1 }
          ],
          threshold: 0.3, // Lower threshold = more strict matching
          includeScore: true,
          minMatchCharLength: 2
        });
        
        const results = fuse.search(searchTerm);
        return results.map(result => result.item);
      },
      
      currentTrack: () => {
        const { playlist } = get();
        return playlist.find(item => item.is_playing);
      },
      
      genres: () => {
        const { tracks } = get();
        return ['All', ...Array.from(new Set(tracks.map(track => track.genre)))];
      },
      
      totalDuration: () => {
        const { playlist } = get();
        return playlist.reduce((total, item) => total + item.track.duration_seconds, 0);
      },
      
      playlistTrackIds: () => {
        const { playlist } = get();
        return new Set(playlist.map(item => item.track_id));
      },
      
      sortedPlaylist: () => {
        const { playlist, autoSortByVotes } = get();
        const sorted = [...playlist];
        
        if (autoSortByVotes) {
          // Sort by votes (highest first), then by position for tie-breaking
          return sorted.sort((a, b) => {
            if (b.votes !== a.votes) {
              return b.votes - a.votes;
            }
            return a.position - b.position;
          });
        }
        
        // Default sort by position
        return sorted.sort((a, b) => a.position - b.position);
      }
    }),
    { name: 'playlist-store' }
  )
);