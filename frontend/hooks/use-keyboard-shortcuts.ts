import { useEffect, useCallback } from 'react';
import { usePlaylistStore } from '@/store/playlist-store';
import { useUpdatePlaylistTrack } from './use-api';

export const useKeyboardShortcuts = (
  onPlayPause?: () => void,
  onVolumeUp?: () => void,
  onVolumeDown?: () => void,
  onToggleMute?: () => void,
  onShowShortcuts?: () => void
) => {
  const { playlist, currentTrack } = usePlaylistStore();
  const updateTrackMutation = useUpdatePlaylistTrack();

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      if (event.target instanceof HTMLInputElement || 
          event.target instanceof HTMLTextAreaElement ||
          event.target instanceof HTMLSelectElement) {
        return;
      }

      // Debug log to see if keyboard events are being captured
      console.log('Key pressed:', event.code, 'Target:', event.target);

      const sortedPlaylist = [...playlist].sort((a, b) => a.position - b.position);
      const currentIndex = sortedPlaylist.findIndex(item => item.is_playing);
      const current = currentTrack();

      switch (event.code) {
        case 'Space':
          event.preventDefault();
          // Toggle play/pause on current track
          if (current && onPlayPause) {
            onPlayPause();
          } else {
            console.log('Play/Pause toggled');
          }
          break;

        case 'ArrowRight':
        case 'KeyN':
          event.preventDefault();
          // Next track
          if (currentIndex < sortedPlaylist.length - 1) {
            const nextTrack = sortedPlaylist[currentIndex + 1];
            updateTrackMutation.mutate({
              id: nextTrack.id,
              data: { is_playing: true }
            });
          }
          break;

        case 'ArrowLeft':
        case 'KeyP':
          event.preventDefault();
          // Previous track
          if (currentIndex > 0) {
            const prevTrack = sortedPlaylist[currentIndex - 1];
            updateTrackMutation.mutate({
              id: prevTrack.id,
              data: { is_playing: true }
            });
          }
          break;

        case 'ArrowUp':
          event.preventDefault();
          // Volume up
          if (onVolumeUp) {
            onVolumeUp();
          } else {
            console.log('Volume up');
          }
          break;

        case 'ArrowDown':
          event.preventDefault();
          // Volume down
          if (onVolumeDown) {
            onVolumeDown();
          } else {
            console.log('Volume down');
          }
          break;

        case 'KeyM':
          event.preventDefault();
          // Toggle mute
          if (onToggleMute) {
            onToggleMute();
          } else {
            console.log('Toggle mute');
          }
          break;

        case 'KeyS':
          event.preventDefault();
          // Shuffle playlist
          console.log('Shuffle playlist');
          break;

        case 'KeyR':
          event.preventDefault();
          // Repeat mode
          console.log('Toggle repeat');
          break;

        case 'KeyL':
          event.preventDefault();
          // Like/Unlike current track (vote up)
          if (current) {
            // This would integrate with the voting system
            console.log('Like current track');
          }
          break;

        case 'Slash':
          if (event.shiftKey) { // This is the "?" key
            event.preventDefault();
            if (onShowShortcuts) {
              onShowShortcuts();
            } else {
              console.log('Show shortcuts');
            }
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [playlist, updateTrackMutation, onPlayPause, onVolumeUp, onVolumeDown, onToggleMute, onShowShortcuts]);
};