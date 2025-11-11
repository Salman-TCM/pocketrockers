import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { PlaylistTrack } from '@/types';

export interface CustomPlaylist {
  id: string;
  name: string;
  description?: string;
  tracks: PlaylistTrack[];
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

interface MultiPlaylistState {
  playlists: CustomPlaylist[];
  activePlaylistId: string | null;
  
  // Actions
  createPlaylist: (name: string, description?: string) => string;
  deletePlaylist: (id: string) => void;
  renamePlaylist: (id: string, name: string) => void;
  updatePlaylistDescription: (id: string, description: string) => void;
  setActivePlaylist: (id: string) => void;
  addTracksToPlaylist: (playlistId: string, tracks: PlaylistTrack[]) => void;
  updatePlaylistTracks: (playlistId: string, tracks: PlaylistTrack[]) => void;
  updateTrackInPlaylist: (playlistId: string, trackId: string, updates: Partial<PlaylistTrack>) => void;
  removeTrackFromPlaylist: (playlistId: string, trackId: string) => void;
  clearPlaylist: (id: string) => void;
  duplicatePlaylist: (id: string, newName: string) => string;
  
  // Computed
  getActivePlaylist: () => CustomPlaylist | null;
  getPlaylistById: (id: string) => CustomPlaylist | undefined;
  getAllPlaylists: () => CustomPlaylist[];
}

export const useMultiPlaylistStore = create<MultiPlaylistState>()(
  devtools(
    persist(
      (set, get) => ({
        playlists: [],
        activePlaylistId: null,
        
        createPlaylist: (name, description) => {
          const newPlaylist: CustomPlaylist = {
            id: `playlist-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            name,
            description,
            tracks: [],
            createdAt: new Date(),
            updatedAt: new Date(),
            isActive: false
          };
          
          set((state) => ({
            playlists: [...state.playlists, newPlaylist],
            activePlaylistId: newPlaylist.id
          }));
          
          return newPlaylist.id;
        },
        
        deletePlaylist: (id) => set((state) => {
          const newPlaylists = state.playlists.filter(p => p.id !== id);
          const newActiveId = state.activePlaylistId === id 
            ? (newPlaylists.length > 0 ? newPlaylists[0].id : null)
            : state.activePlaylistId;
          
          return {
            playlists: newPlaylists,
            activePlaylistId: newActiveId
          };
        }),
        
        renamePlaylist: (id, name) => set((state) => ({
          playlists: state.playlists.map(p => 
            p.id === id 
              ? { ...p, name, updatedAt: new Date() }
              : p
          )
        })),
        
        updatePlaylistDescription: (id, description) => set((state) => ({
          playlists: state.playlists.map(p => 
            p.id === id 
              ? { ...p, description, updatedAt: new Date() }
              : p
          )
        })),
        
        setActivePlaylist: (id) => set((state) => ({
          activePlaylistId: id,
          playlists: state.playlists.map(p => ({
            ...p,
            isActive: p.id === id
          }))
        })),
        
        addTracksToPlaylist: (playlistId, tracks) => set((state) => ({
          playlists: state.playlists.map(p => 
            p.id === playlistId 
              ? { 
                  ...p, 
                  tracks: [...p.tracks, ...tracks],
                  updatedAt: new Date()
                }
              : p
          )
        })),
        
        updatePlaylistTracks: (playlistId, tracks) => set((state) => ({
          playlists: state.playlists.map(p => 
            p.id === playlistId 
              ? { 
                  ...p, 
                  tracks: tracks,
                  updatedAt: new Date()
                }
              : p
          )
        })),
        
        updateTrackInPlaylist: (playlistId, trackId, updates) => set((state) => ({
          playlists: state.playlists.map(p => 
            p.id === playlistId 
              ? { 
                  ...p, 
                  tracks: p.tracks.map(t => 
                    t.id === trackId ? { ...t, ...updates } : t
                  ),
                  updatedAt: new Date()
                }
              : p
          )
        })),
        
        removeTrackFromPlaylist: (playlistId, trackId) => set((state) => ({
          playlists: state.playlists.map(p => 
            p.id === playlistId 
              ? { 
                  ...p, 
                  tracks: p.tracks.filter(t => t.id !== trackId),
                  updatedAt: new Date()
                }
              : p
          )
        })),
        
        clearPlaylist: (id) => set((state) => ({
          playlists: state.playlists.map(p => 
            p.id === id 
              ? { ...p, tracks: [], updatedAt: new Date() }
              : p
          )
        })),
        
        duplicatePlaylist: (id, newName) => {
          const original = get().playlists.find(p => p.id === id);
          if (!original) return '';
          
          const duplicatedPlaylist: CustomPlaylist = {
            ...original,
            id: `playlist-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            name: newName,
            createdAt: new Date(),
            updatedAt: new Date(),
            isActive: false
          };
          
          set((state) => ({
            playlists: [...state.playlists, duplicatedPlaylist]
          }));
          
          return duplicatedPlaylist.id;
        },
        
        // Computed
        getActivePlaylist: () => {
          const state = get();
          return state.playlists.find(p => p.id === state.activePlaylistId) || null;
        },
        
        getPlaylistById: (id) => {
          return get().playlists.find(p => p.id === id);
        },
        
        getAllPlaylists: () => {
          return get().playlists;
        }
      }),
      {
        name: 'multi-playlist-storage',
        partialize: (state) => ({
          playlists: state.playlists,
          activePlaylistId: state.activePlaylistId
        })
      }
    ),
    { name: 'multi-playlist-store' }
  )
);