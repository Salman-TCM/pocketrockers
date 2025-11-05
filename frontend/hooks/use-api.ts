import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Track, PlaylistTrack } from '@/types';
import toast from 'react-hot-toast';

const API_BASE = 'http://localhost:4000/api';

// API functions
const api = {
  getTracks: async (): Promise<Track[]> => {
    const response = await fetch(`${API_BASE}/tracks`);
    if (!response.ok) throw new Error('Failed to fetch tracks');
    return response.json();
  },

  getPlaylist: async (): Promise<PlaylistTrack[]> => {
    const response = await fetch(`${API_BASE}/playlist`);
    if (!response.ok) throw new Error('Failed to fetch playlist');
    return response.json();
  },

  addToPlaylist: async (data: { track_id: string; added_by: string }): Promise<PlaylistTrack> => {
    const response = await fetch(`${API_BASE}/playlist`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to add track');
    }
    return response.json();
  },

  updatePlaylistTrack: async ({
    id,
    data,
  }: {
    id: string;
    data: { position?: number; is_playing?: boolean };
  }): Promise<PlaylistTrack> => {
    const response = await fetch(`${API_BASE}/playlist/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update track');
    return response.json();
  },

  voteTrack: async ({
    id,
    direction,
  }: {
    id: string;
    direction: 'up' | 'down';
  }): Promise<PlaylistTrack> => {
    const response = await fetch(`${API_BASE}/playlist/${id}/vote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ direction }),
    });
    if (!response.ok) throw new Error('Failed to vote');
    return response.json();
  },

  removeFromPlaylist: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE}/playlist/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to remove track');
  },
};

// Custom hooks
export const useTracks = () => {
  return useQuery({
    queryKey: ['tracks'],
    queryFn: api.getTracks,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const usePlaylist = () => {
  return useQuery({
    queryKey: ['playlist'],
    queryFn: api.getPlaylist,
    refetchInterval: 30000, // Refetch every 30 seconds as backup
  });
};

export const useAddToPlaylist = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: api.addToPlaylist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playlist'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to add track');
    },
  });
};

export const useUpdatePlaylistTrack = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: api.updatePlaylistTrack,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playlist'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update track');
    },
  });
};

export const useVoteTrack = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: api.voteTrack,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playlist'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to vote');
    },
  });
};

export const useRemoveFromPlaylist = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: api.removeFromPlaylist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playlist'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to remove track');
    },
  });
};