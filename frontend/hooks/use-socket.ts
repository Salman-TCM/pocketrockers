import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { usePlaylistStore } from '@/store/playlist-store';
import { usePlayerStore } from '@/store/player-store';
import { SocketEvent } from '@/types';
import toast from 'react-hot-toast';

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);
  const {
    setConnectionStatus,
    addToPlaylist,
    removeFromPlaylist,
    updatePlaylistItem,
    setPlaylist
  } = usePlaylistStore();

  useEffect(() => {
    // Dynamically determine the WebSocket URL based on current host
    const getSocketUrl = () => {
      if (typeof window !== 'undefined') {
        const host = window.location.hostname;
        const port = 4000;
        return `http://${host}:${port}`;
      }
      return 'http://localhost:4000';
    };
    
    const socket = io(getSocketUrl(), {
      transports: ['websocket', 'polling'],
    });
    
    socketRef.current = socket;

    socket.on('connect', () => {
      setConnectionStatus('connected');
      toast.success('Connected to playlist!', {
        duration: 2000,
        position: 'bottom-right',
      });
    });

    socket.on('disconnect', () => {
      setConnectionStatus('disconnected');
      toast.error('Connection lost. Reconnecting...', {
        duration: 3000,
        position: 'bottom-right',
      });
    });

    socket.on('reconnect', () => {
      setConnectionStatus('connected');
      toast.success('Reconnected!', {
        duration: 2000,
        position: 'bottom-right',
      });
    });

    // Real-time events
    socket.on('track.added', (data: SocketEvent) => {
      if (data.item) {
        addToPlaylist(data.item);
        toast(`🎵 ${data.item.track.title} added by ${data.item.added_by}`, {
          duration: 3000,
          position: 'top-center',
        });
      }
    });

    socket.on('track.removed', (data: SocketEvent) => {
      if (data.id) {
        removeFromPlaylist(data.id);
        toast('Track removed from playlist', {
          duration: 2000,
          position: 'top-center',
        });
      }
    });

    socket.on('track.moved', (data: SocketEvent) => {
      if (data.item) {
        updatePlaylistItem(data.item.id, { position: data.item.position });
      }
    });

    socket.on('track.voted', (data: SocketEvent) => {
      if (data.item) {
        updatePlaylistItem(data.item.id, { votes: data.item.votes });
      }
    });

    socket.on('track.playing', (data: SocketEvent) => {
      if (data.id) {
        // Update all tracks to not playing, then set the current one
        const state = usePlaylistStore.getState();
        const updatedPlaylist = state.playlist.map(item => ({
          ...item,
          is_playing: item.id === data.id
        }));
        setPlaylist(updatedPlaylist);
        
        // Update player store
        const playingTrack = updatedPlaylist.find(item => item.is_playing);
        if (playingTrack) {
          const playerStore = usePlayerStore.getState();
          playerStore.setCurrentTrack(playingTrack);
          playerStore.play();
        }
      }
    });

    socket.on('track.paused', (data: SocketEvent) => {
      if (data.id) {
        const playerStore = usePlayerStore.getState();
        if (playerStore.currentTrack?.id === data.id) {
          playerStore.pause();
        }
      }
    });

    socket.on('track.changed', (data: SocketEvent) => {
      if (data.item) {
        const playerStore = usePlayerStore.getState();
        playerStore.setCurrentTrack(data.item);
        if (data.item.is_playing) {
          playerStore.play();
        }
      }
    });

    socket.on('playlist.reordered', (data: SocketEvent) => {
      if (data.items) {
        setPlaylist(data.items);
        // Update player queue
        const playerStore = usePlayerStore.getState();
        playerStore.setQueue(data.items);
      }
    });

    socket.on('ping', (data: SocketEvent) => {
      console.log('Ping received:', data.ts);
    });

    return () => {
      socket.disconnect();
    };
  }, [setConnectionStatus, addToPlaylist, removeFromPlaylist, updatePlaylistItem, setPlaylist]);

  return socketRef.current;
};