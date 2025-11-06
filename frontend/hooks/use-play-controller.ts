import { useRef, useCallback } from 'react';
import { useUpdatePlaylistTrack } from './use-api';

// Global state to prevent multiple simultaneous play calls
let globalPlayLock = false;
let lastPlayCall: { trackId: string; timestamp: number } | null = null;

export const usePlayController = () => {
  const updateTrackMutation = useUpdatePlaylistTrack();
  const processingRef = useRef(false);

  const playTrack = useCallback(async (trackId: string, trackTitle?: string) => {
    // Prevent multiple simultaneous calls
    if (processingRef.current || globalPlayLock) {
      console.log('🚫 PLAY BLOCKED: Already processing a track change');
      return false;
    }

    // Prevent duplicate calls within 2 seconds
    const now = Date.now();
    if (lastPlayCall && 
        lastPlayCall.trackId === trackId && 
        now - lastPlayCall.timestamp < 2000) {
      console.log('🚫 PLAY BLOCKED: Duplicate call within 2 seconds for track:', trackTitle || trackId);
      return false;
    }

    console.log('🎵 PLAY CONTROLLER: Playing track:', trackTitle || trackId);
    
    // Set locks
    processingRef.current = true;
    globalPlayLock = true;
    lastPlayCall = { trackId, timestamp: now };

    try {
      await updateTrackMutation.mutateAsync({
        id: trackId,
        data: { is_playing: true }
      });
      console.log('✅ PLAY CONTROLLER: Successfully started track:', trackTitle || trackId);
      return true;
    } catch (error) {
      console.error('❌ PLAY CONTROLLER: Failed to play track:', error);
      return false;
    } finally {
      // Release locks after a delay
      setTimeout(() => {
        processingRef.current = false;
        globalPlayLock = false;
      }, 1000);
    }
  }, [updateTrackMutation]);

  const pauseTrack = useCallback(async (trackId: string, trackTitle?: string) => {
    if (processingRef.current || globalPlayLock) {
      console.log('🚫 PAUSE BLOCKED: Already processing a track change');
      return false;
    }

    console.log('⏸️ PLAY CONTROLLER: Pausing track:', trackTitle || trackId);
    
    processingRef.current = true;
    globalPlayLock = true;

    try {
      await updateTrackMutation.mutateAsync({
        id: trackId,
        data: { is_playing: false }
      });
      console.log('✅ PLAY CONTROLLER: Successfully paused track:', trackTitle || trackId);
      return true;
    } catch (error) {
      console.error('❌ PLAY CONTROLLER: Failed to pause track:', error);
      return false;
    } finally {
      setTimeout(() => {
        processingRef.current = false;
        globalPlayLock = false;
      }, 1000);
    }
  }, [updateTrackMutation]);

  const togglePlayPause = useCallback(async (trackId: string, isCurrentlyPlaying: boolean, trackTitle?: string) => {
    if (isCurrentlyPlaying) {
      return await pauseTrack(trackId, trackTitle);
    } else {
      return await playTrack(trackId, trackTitle);
    }
  }, [playTrack, pauseTrack]);

  return {
    playTrack,
    pauseTrack,
    togglePlayPause,
    isProcessing: processingRef.current || updateTrackMutation.isPending
  };
};