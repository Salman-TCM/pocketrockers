import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Track, PlaylistTrack } from '@/types';

export interface PlayerState {
  // Current playback state
  currentTrack: PlaylistTrack | null;
  isPlaying: boolean;
  isPaused: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isShuffled: boolean;
  repeatMode: 'none' | 'one' | 'all';
  
  // UI State
  isExpanded: boolean; // For the new layout mode
  isLibraryCollapsed: boolean;
  
  // Queue management
  originalQueue: PlaylistTrack[];
  shuffledQueue: PlaylistTrack[];
  currentIndex: number;
  
  // Audio simulation
  playbackStartTime: number | null;
  isSimulating: boolean;
  
  // Actions
  setCurrentTrack: (track: PlaylistTrack | null) => void;
  play: () => void;
  pause: () => void;
  togglePlayPause: () => void;
  next: () => void;
  previous: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  toggleShuffle: () => void;
  setRepeatMode: (mode: 'none' | 'one' | 'all') => void;
  
  // Layout actions
  toggleLayout: () => void;
  toggleLibrary: () => void;
  expandPlayer: () => void;
  collapsePlayer: () => void;
  
  // Queue management
  setQueue: (tracks: PlaylistTrack[]) => void;
  shuffleQueue: () => void;
  restoreOriginalQueue: () => void;
  
  // Audio simulation
  startSimulation: () => void;
  stopSimulation: () => void;
  updateCurrentTime: (time: number) => void;
  
  // Computed getters
  progress: () => number;
  hasNext: () => boolean;
  hasPrevious: () => boolean;
  getCurrentQueue: () => PlaylistTrack[];
}

export const usePlayerStore = create<PlayerState>()(
  devtools(
    (set, get) => ({
      // Initial state
      currentTrack: null,
      isPlaying: false,
      isPaused: false,
      currentTime: 0,
      duration: 0,
      volume: 75,
      isMuted: false,
      isShuffled: false,
      repeatMode: 'none',
      
      // UI State
      isExpanded: false,
      isLibraryCollapsed: false,
      
      // Queue
      originalQueue: [],
      shuffledQueue: [],
      currentIndex: 0,
      
      // Audio simulation
      playbackStartTime: null,
      isSimulating: false,
      
      // Playback actions
      setCurrentTrack: (track) => {
        const state = get();
        set({ 
          currentTrack: track,
          duration: track?.track.duration_seconds || 0,
          currentTime: 0,
          playbackStartTime: null,
          isExpanded: track !== null // Auto-expand when track is set
        });
        
        // Update queue index
        if (track) {
          const queue = state.getCurrentQueue();
          const index = queue.findIndex(t => t.id === track.id);
          if (index !== -1) {
            set({ currentIndex: index });
          }
        }
      },
      
      play: () => {
        const state = get();
        set({ 
          isPlaying: true, 
          isPaused: false,
          playbackStartTime: Date.now() - (state.currentTime * 1000)
        });
        get().startSimulation();
      },
      
      pause: () => {
        set({ isPlaying: false, isPaused: true });
        get().stopSimulation();
      },
      
      togglePlayPause: () => {
        const { isPlaying } = get();
        if (isPlaying) {
          get().pause();
        } else {
          get().play();
        }
      },
      
      next: () => {
        const state = get();
        const queue = state.getCurrentQueue();
        let nextIndex = state.currentIndex + 1;
        
        // Handle repeat mode
        if (nextIndex >= queue.length) {
          if (state.repeatMode === 'all') {
            nextIndex = 0;
          } else {
            return; // End of queue
          }
        }
        
        const nextTrack = queue[nextIndex];
        if (nextTrack) {
          set({ currentIndex: nextIndex });
          get().setCurrentTrack(nextTrack);
          if (state.isPlaying) {
            get().play();
          }
        }
      },
      
      previous: () => {
        const state = get();
        const queue = state.getCurrentQueue();
        
        // If we're more than 3 seconds into the song, restart it
        if (state.currentTime > 3) {
          get().seek(0);
          return;
        }
        
        let prevIndex = state.currentIndex - 1;
        
        // Handle wrap around for repeat all
        if (prevIndex < 0) {
          if (state.repeatMode === 'all') {
            prevIndex = queue.length - 1;
          } else {
            return; // Beginning of queue
          }
        }
        
        const prevTrack = queue[prevIndex];
        if (prevTrack) {
          set({ currentIndex: prevIndex });
          get().setCurrentTrack(prevTrack);
          if (state.isPlaying) {
            get().play();
          }
        }
      },
      
      seek: (time) => {
        const state = get();
        set({ 
          currentTime: time,
          playbackStartTime: state.isPlaying ? Date.now() - (time * 1000) : null
        });
      },
      
      setVolume: (volume) => {
        set({ volume: Math.max(0, Math.min(100, volume)) });
      },
      
      toggleMute: () => {
        set((state) => ({ isMuted: !state.isMuted }));
      },
      
      toggleShuffle: () => {
        const state = get();
        if (state.isShuffled) {
          get().restoreOriginalQueue();
        } else {
          get().shuffleQueue();
        }
        set({ isShuffled: !state.isShuffled });
      },
      
      setRepeatMode: (mode) => {
        set({ repeatMode: mode });
      },
      
      // Layout actions
      toggleLayout: () => {
        set((state) => ({ isExpanded: !state.isExpanded }));
      },
      
      toggleLibrary: () => {
        set((state) => ({ 
          isLibraryCollapsed: !state.isLibraryCollapsed 
        }));
      },
      
      expandPlayer: () => {
        set({ isExpanded: true });
      },
      
      collapsePlayer: () => {
        set({ isExpanded: false });
      },
      
      // Queue management
      setQueue: (tracks) => {
        const state = get();
        set({ 
          originalQueue: tracks,
          shuffledQueue: tracks // Will be shuffled when shuffle is toggled
        });
      },
      
      shuffleQueue: () => {
        const state = get();
        const currentTrack = state.currentTrack;
        const remaining = state.originalQueue.filter(t => t.id !== currentTrack?.id);
        
        // Shuffle the remaining tracks
        const shuffled = [...remaining];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        
        // Keep current track at the beginning
        const newQueue = currentTrack ? [currentTrack, ...shuffled] : shuffled;
        set({ 
          shuffledQueue: newQueue,
          currentIndex: 0
        });
      },
      
      restoreOriginalQueue: () => {
        const state = get();
        if (state.currentTrack) {
          const index = state.originalQueue.findIndex(t => t.id === state.currentTrack!.id);
          set({ currentIndex: Math.max(0, index) });
        }
      },
      
      
      // Audio simulation
      startSimulation: () => {
        set({ isSimulating: true });
        
        const interval = setInterval(() => {
          const state = get();
          if (!state.isPlaying || !state.playbackStartTime) {
            clearInterval(interval);
            set({ isSimulating: false });
            return;
          }
          
          const elapsed = (Date.now() - state.playbackStartTime) / 1000;
          
          if (elapsed >= state.duration) {
            // Song finished
            clearInterval(interval);
            set({ 
              currentTime: state.duration,
              isSimulating: false 
            });
            
            // Auto-advance based on repeat mode
            if (state.repeatMode === 'one') {
              get().seek(0);
              get().play();
            } else {
              get().next();
            }
          } else {
            set({ currentTime: elapsed });
          }
        }, 100); // Update every 100ms for smooth progress
      },
      
      stopSimulation: () => {
        set({ isSimulating: false });
      },
      
      updateCurrentTime: (time) => {
        set({ currentTime: time });
      },
      
      // Computed getters
      progress: () => {
        const { currentTime, duration } = get();
        return duration > 0 ? (currentTime / duration) * 100 : 0;
      },
      
      hasNext: () => {
        const state = get();
        const queue = state.getCurrentQueue();
        return state.currentIndex < queue.length - 1 || state.repeatMode === 'all';
      },
      
      hasPrevious: () => {
        const state = get();
        const queue = state.getCurrentQueue();
        return state.currentIndex > 0 || state.repeatMode === 'all' || state.currentTime > 3;
      },
      
      getCurrentQueue: () => {
        const { isShuffled, originalQueue, shuffledQueue } = get();
        return isShuffled ? shuffledQueue : originalQueue;
      },
    }),
    { name: 'player-store' }
  )
);