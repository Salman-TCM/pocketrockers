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
  const { 
    playlist, 
    currentTrack, 
    selectedTrackIndex,
    selectNextTrack,
    selectPreviousTrack,
    setSelectedTrackIndex 
  } = usePlaylistStore();
  const updateTrackMutation = useUpdatePlaylistTrack();

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      if (event.target instanceof HTMLInputElement || 
          event.target instanceof HTMLTextAreaElement ||
          event.target instanceof HTMLSelectElement) {
        return;
      }

      // List of keys we handle as shortcuts
      const ourKeys = ['Space', 'ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown', 'KeyN', 'KeyP', 'KeyM', 'KeyS', 'KeyR', 'KeyL', 'Enter'];
      const isOurKey = ourKeys.includes(event.code) || (event.code === 'Slash' && event.shiftKey);
      
      // Prevent default browser behavior for all our keyboard shortcuts
      if (isOurKey) {
        event.preventDefault();
        event.stopPropagation();
        console.log('🎹 Keyboard shortcut detected:', event.code, 
          event.shiftKey ? '(with Shift)' : '', 
          event.ctrlKey ? '(with Ctrl)' : '',
          'Target:', event.target?.constructor.name
        );
      }

      const sortedPlaylist = [...playlist].sort((a, b) => a.position - b.position);
      const currentIndex = sortedPlaylist.findIndex(item => item.is_playing);
      const current = currentTrack();

      switch (event.code) {
        case 'Space':
          // Toggle play/pause on current track
          if (current && onPlayPause) {
            onPlayPause();
          } else {
            console.log('Play/Pause toggled');
          }
          break;

        case 'ArrowRight':
        case 'KeyN':
          console.log('➡️ Next track triggered', { currentIndex, playlistLength: sortedPlaylist.length });
          // Next track
          if (currentIndex >= 0 && currentIndex < sortedPlaylist.length - 1) {
            const nextTrack = sortedPlaylist[currentIndex + 1];
            console.log('🎵 Playing next track:', nextTrack.track.title);
            // Stop current track first
            if (current) {
              updateTrackMutation.mutate({
                id: current.id,
                data: { is_playing: false }
              });
            }
            // Start next track
            updateTrackMutation.mutate({
              id: nextTrack.id,
              data: { is_playing: true }
            });
          } else if (currentIndex === -1 && sortedPlaylist.length > 0) {
            // No current track, play first track
            const firstTrack = sortedPlaylist[0];
            console.log('🎵 Playing first track:', firstTrack.track.title);
            updateTrackMutation.mutate({
              id: firstTrack.id,
              data: { is_playing: true }
            });
          } else {
            console.log('⚠️ No next track available');
          }
          break;

        case 'ArrowLeft':
        case 'KeyP':
          console.log('⬅️ Previous track triggered', { currentIndex, playlistLength: sortedPlaylist.length });
          // Previous track
          if (currentIndex > 0) {
            const prevTrack = sortedPlaylist[currentIndex - 1];
            console.log('🎵 Playing previous track:', prevTrack.track.title);
            // Stop current track first
            if (current) {
              updateTrackMutation.mutate({
                id: current.id,
                data: { is_playing: false }
              });
            }
            // Start previous track
            updateTrackMutation.mutate({
              id: prevTrack.id,
              data: { is_playing: true }
            });
          } else {
            console.log('⚠️ No previous track available');
          }
          break;

        case 'ArrowUp':
          if (event.shiftKey) {
            // Playlist navigation - select previous song
            console.log('🎵 Select previous song in playlist');
            selectPreviousTrack();
            console.log('✅ Previous song selected', { selectedIndex: selectedTrackIndex });
          } else {
            // Volume up
            console.log('🔊 Volume up triggered', { onVolumeUp: !!onVolumeUp });
            if (onVolumeUp) {
              onVolumeUp();
              console.log('✅ Volume up executed');
            } else {
              console.log('❌ No volume up callback provided');
            }
          }
          break;

        case 'ArrowDown':
          if (event.shiftKey) {
            // Playlist navigation - select next song
            console.log('🎵 Select next song in playlist');
            selectNextTrack();
            console.log('✅ Next song selected', { selectedIndex: selectedTrackIndex });
          } else {
            // Volume down
            console.log('🔉 Volume down triggered', { onVolumeDown: !!onVolumeDown });
            if (onVolumeDown) {
              onVolumeDown();
              console.log('✅ Volume down executed');
            } else {
              console.log('❌ No volume down callback provided');
            }
          }
          break;

        case 'KeyM':
          // Toggle mute
          console.log('🔇 Mute toggle triggered', { onToggleMute: !!onToggleMute });
          if (onToggleMute) {
            onToggleMute();
            console.log('✅ Mute toggle executed');
          } else {
            console.log('❌ No mute toggle callback provided');
          }
          break;

        case 'KeyS':
          // Shuffle playlist
          console.log('Shuffle playlist');
          break;

        case 'KeyR':
          // Repeat mode
          console.log('Toggle repeat');
          break;

        case 'KeyL':
          // Like/Unlike current track (vote up)
          if (current) {
            // This would integrate with the voting system
            console.log('Like current track');
          }
          break;

        case 'Enter':
          // Play selected track
          console.log('🎵 Play selected track triggered', { selectedIndex: selectedTrackIndex });
          if (sortedPlaylist.length > 0 && selectedTrackIndex >= 0 && selectedTrackIndex < sortedPlaylist.length) {
            const selectedTrack = sortedPlaylist[selectedTrackIndex];
            console.log('🎵 Playing selected track:', selectedTrack.track.title);
            
            // Stop current track
            if (current && current.id !== selectedTrack.id) {
              updateTrackMutation.mutate({
                id: current.id,
                data: { is_playing: false }
              });
            }
            
            // Start selected track
            updateTrackMutation.mutate({
              id: selectedTrack.id,
              data: { is_playing: true }
            });
          } else {
            console.log('⚠️ No valid track selected');
          }
          break;

        case 'Slash':
          if (event.shiftKey) { // This is the "?" key
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
  }, [playlist, updateTrackMutation, onPlayPause, onVolumeUp, onVolumeDown, onToggleMute, onShowShortcuts, selectedTrackIndex, selectNextTrack, selectPreviousTrack]);
};