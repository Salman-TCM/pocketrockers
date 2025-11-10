import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { PlaylistTrack } from '@/types';

export type FilterType = 'most_played' | 'recently_added' | 'recently_played' | 'never_played' | 'top_rated' | null;

interface FilterState {
  activeFilter: FilterType;
  filteredTracks: PlaylistTrack[];
  
  // Actions
  setActiveFilter: (filter: FilterType) => void;
  clearFilter: () => void;
  
  // Filter functions
  applyFilter: (tracks: PlaylistTrack[], filter: FilterType) => PlaylistTrack[];
}

export const useFilterStore = create<FilterState>()(
  devtools(
    (set, get) => ({
      activeFilter: null,
      filteredTracks: [],
      
      setActiveFilter: (filter) => set({ activeFilter: filter }),
      
      clearFilter: () => set({ activeFilter: null, filteredTracks: [] }),
      
      applyFilter: (tracks, filter) => {
        if (!filter) return tracks;
        
        const now = new Date();
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        
        switch (filter) {
          case 'most_played':
            // Sort by votes/play count (highest first)
            return [...tracks].sort((a, b) => (b.votes || 0) - (a.votes || 0));
            
          case 'recently_added':
            // Sort by added_at (most recent first)
            return [...tracks].sort((a, b) => 
              new Date(b.added_at).getTime() - new Date(a.added_at).getTime()
            );
            
          case 'recently_played':
            // Filter tracks that have been played recently (have played_at within last week)
            return tracks.filter(track => {
              if (!track.played_at) return false;
              return new Date(track.played_at) > oneWeekAgo;
            }).sort((a, b) => 
              new Date(b.played_at || 0).getTime() - new Date(a.played_at || 0).getTime()
            );
            
          case 'never_played':
            // Filter tracks that have never been played (no played_at or votes <= 0)
            return tracks.filter(track => 
              !track.played_at && (track.votes || 0) <= 0
            ).sort((a, b) => 
              new Date(b.added_at).getTime() - new Date(a.added_at).getTime()
            );
            
          case 'top_rated':
            // Filter tracks with positive votes and sort by highest votes
            return tracks.filter(track => (track.votes || 0) > 0)
              .sort((a, b) => (b.votes || 0) - (a.votes || 0));
            
          default:
            return tracks;
        }
      }
    }),
    { name: 'filter-store' }
  )
);