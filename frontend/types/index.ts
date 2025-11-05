export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration_seconds: number;
  genre: string;
  cover_url?: string;
}

export interface PlaylistTrack {
  id: string;
  track_id: string;
  position: number;
  votes: number;
  added_by: string;
  added_at: string;
  is_playing: boolean;
  played_at?: string;
  track: Track;
}

export interface SocketEvent {
  type: 'track.added' | 'track.removed' | 'track.moved' | 'track.voted' | 'track.playing' | 'playlist.reordered' | 'ping';
  item?: any;
  id?: string;
  items?: any[];
  ts?: string;
}