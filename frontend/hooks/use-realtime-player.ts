import { useEffect, useRef } from 'react';
import { Socket } from 'socket.io-client';
import { usePlayerStore } from '@/store/player-store';
import { usePlaylistStore } from '@/store/playlist-store';

export const useRealtimePlayer = (socket: Socket | null) => {
  const prevStateRef = useRef<any>({});
  
  const {
    currentTrack,
    isPlaying,
    currentTime,
    isShuffled,
    repeatMode
  } = usePlayerStore();

  // Emit player state changes to other clients
  useEffect(() => {
    if (!socket || !currentTrack) return;

    const prevState = prevStateRef.current;
    
    // Track changed
    if (prevState.currentTrackId !== currentTrack.id) {
      socket.emit('track.changed', {
        type: 'track.changed',
        item: currentTrack,
        data: { is_playing: isPlaying }
      });
      prevState.currentTrackId = currentTrack.id;
    }
    
    // Play state changed
    if (prevState.isPlaying !== isPlaying) {
      if (isPlaying) {
        socket.emit('track.playing', {
          type: 'track.playing',
          id: currentTrack.id,
          data: { currentTime, timestamp: Date.now() }
        });
      } else {
        socket.emit('track.paused', {
          type: 'track.paused',
          id: currentTrack.id,
          data: { currentTime, timestamp: Date.now() }
        });
      }
      prevState.isPlaying = isPlaying;
    }
    
    prevStateRef.current = prevState;
  }, [socket, currentTrack, isPlaying, currentTime]);

  // Emit playlist changes when queue is modified
  const { playlist } = usePlaylistStore();
  
  useEffect(() => {
    if (!socket) return;
    
    const prevState = prevStateRef.current;
    const playlistIds = playlist.map(item => item.id).join(',');
    
    if (prevState.playlistIds !== playlistIds) {
      socket.emit('playlist.sync', {
        type: 'playlist.reordered',
        items: playlist
      });
      prevState.playlistIds = playlistIds;
    }
  }, [socket, playlist]);

  // Broadcast playback progress periodically
  useEffect(() => {
    if (!socket || !currentTrack || !isPlaying) return;

    const interval = setInterval(() => {
      socket.emit('playback.progress', {
        type: 'playback.progress',
        id: currentTrack.id,
        data: {
          currentTime,
          timestamp: Date.now(),
          isShuffled,
          repeatMode
        }
      });
    }, 5000); // Sync every 5 seconds

    return () => clearInterval(interval);
  }, [socket, currentTrack, isPlaying, currentTime, isShuffled, repeatMode]);
};