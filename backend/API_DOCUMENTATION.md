# Music Playlist API Documentation

## Overview

The Music Playlist API provides endpoints for managing a collaborative music playlist system with advanced client-side playlist management. The API serves a Winamp-style interface that supports both server-side playlists and local custom playlists. Users can browse tracks, manage multiple playlists, vote on tracks, apply smart filters, and control playbook with full state synchronization.

## Base URL

- Development: `http://localhost:4000`
- API Documentation: `http://localhost:4000/api-docs`

## Authentication

Currently, the API does not require authentication. All endpoints are publicly accessible.

## Frontend Architecture

The application features a comprehensive client-side state management system that works alongside the API:

### Client-Side Playlist Management
- **Server Playlist**: Uses API endpoints for real-time collaborative features
- **Custom Playlists**: Managed locally with Zustand stores and localStorage persistence
- **Cross-Playlist Playback**: Seamless switching between server and custom playlists
- **Smart Filtering**: Advanced filtering without additional API calls

### State Management Stores
- `playlist-store`: Server playlist state and player controls
- `multi-playlist-store`: Custom playlist management with persistence
- `filter-store`: Smart filtering system (Most Played, Recently Added, etc.)
- `player-store`: Playback state and current track management

### UI Components
- **Winamp-Style Interface**: Three-panel layout (sidebar, main view, right panel)
- **Volume Control**: Integrated audio controls with visualizer
- **Modal Management**: Z-index managed overlays for playlist creation
- **Bulk Operations**: Multi-select functionality for track management

## WebSocket Events

The API uses Socket.IO for real-time updates. Connect to `ws://localhost:4000` to receive the following events:

### Events Emitted by Server

- `trackAdded` - When a new track is added to the server playlist
- `trackRemoved` - When a track is removed from the server playlist
- `trackMoved` - When a track's position changes in the server playlist
- `trackVoted` - When a track receives a vote
- `trackPlaying` - When a track starts/stops playing on the server playlist

**Note**: Custom playlists are managed entirely client-side and do not emit WebSocket events.

## API Endpoints

### Tracks

#### GET /api/tracks
Get all available tracks in the library.

**Response:**
```json
[
  {
    "id": "cmhiqhm9k001bmzjex8nxcdq2",
    "title": "Bohemian Rhapsody",
    "artist": "Queen",
    "album": "A Night at the Opera",
    "genre": "Rock",
    "duration_seconds": 355,
    "play_count": 0,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
]
```

#### GET /api/tracks/:id
Get a specific track by ID.

**Parameters:**
- `id` (string) - Track ID

**Response:**
```json
{
  "id": "cmhiqhm9k001bmzjex8nxcdq2",
  "title": "Bohemian Rhapsody",
  "artist": "Queen",
  "album": "A Night at the Opera",
  "genre": "Rock",
  "duration_seconds": 355,
  "play_count": 0,
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:00.000Z"
}
```

### Playlist

#### GET /api/playlist
Get all tracks in the current playlist.

**Response:**
```json
[
  {
    "id": "playlist_track_id",
    "track_id": "cmhiqhm9k001bmzjex8nxcdq2",
    "position": 0,
    "votes": 5,
    "is_playing": false,
    "added_by": "John Doe",
    "added_at": "2024-01-01T00:00:00.000Z",
    "track": {
      "id": "cmhiqhm9k001bmzjex8nxcdq2",
      "title": "Bohemian Rhapsody",
      "artist": "Queen",
      "album": "A Night at the Opera",
      "genre": "Rock",
      "duration_seconds": 355
    }
  }
]
```

#### POST /api/playlist
Add a track to the playlist.

**Request Body:**
```json
{
  "track_id": "cmhiqhm9k001bmzjex8nxcdq2",
  "added_by": "John Doe"  // Optional, defaults to "Anonymous"
}
```

**Response:**
```json
{
  "id": "new_playlist_track_id",
  "track_id": "cmhiqhm9k001bmzjex8nxcdq2",
  "position": 1,
  "votes": 0,
  "is_playing": false,
  "added_by": "John Doe",
  "added_at": "2024-01-01T00:00:00.000Z"
}
```

#### PATCH /api/playlist/:id
Update a playlist track's position or playing status.

**Parameters:**
- `id` (string) - Playlist track ID

**Request Body:**
```json
{
  "position": 2,        // Optional
  "is_playing": true    // Optional
}
```

**Response:**
```json
{
  "id": "playlist_track_id",
  "track_id": "cmhiqhm9k001bmzjex8nxcdq2",
  "position": 2,
  "is_playing": true,
  "votes": 5,
  "added_by": "John Doe",
  "added_at": "2024-01-01T00:00:00.000Z"
}
```

#### POST /api/playlist/:id/vote
Vote on a playlist track.

**Parameters:**
- `id` (string) - Playlist track ID

**Request Body:**
```json
{
  "direction": "up"  // "up" or "down"
}
```

**Response:**
```json
{
  "id": "playlist_track_id",
  "votes": 6
}
```

#### DELETE /api/playlist/:id
Remove a track from the playlist.

**Parameters:**
- `id` (string) - Playlist track ID

**Response:**
```json
{
  "id": "playlist_track_id",
  "track_id": "cmhiqhm9k001bmzjex8nxcdq2",
  "removed": true
}
```

## Error Responses

All endpoints follow a consistent error response format:

```json
{
  "statusCode": 400,
  "message": "Error message",
  "error": "Bad Request"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `404` - Not Found
- `500` - Internal Server Error

## Rate Limiting

Currently, there are no rate limits implemented. This may change in production.

## CORS

The API allows requests from:
- `http://localhost:3000`
- `http://localhost:3001`

## Testing the API

You can test the API using:

1. **Swagger UI**: Navigate to `http://localhost:4000/api-docs` for an interactive API explorer
2. **cURL**: Use the examples below
3. **Postman**: Import the endpoints listed above

### cURL Examples

```bash
# Get all tracks
curl http://localhost:4000/api/tracks

# Get a specific track
curl http://localhost:4000/api/tracks/cmhiqhm9k001bmzjex8nxcdq2

# Get playlist
curl http://localhost:4000/api/playlist

# Add track to playlist
curl -X POST http://localhost:4000/api/playlist \
  -H "Content-Type: application/json" \
  -d '{"track_id":"cmhiqhm9k001bmzjex8nxcdq2","added_by":"John"}'

# Vote on a track
curl -X POST http://localhost:4000/api/playlist/PLAYLIST_TRACK_ID/vote \
  -H "Content-Type: application/json" \
  -d '{"direction":"up"}'

# Update track position
curl -X PATCH http://localhost:4000/api/playlist/PLAYLIST_TRACK_ID \
  -H "Content-Type: application/json" \
  -d '{"position":3}'

# Remove track from playlist
curl -X DELETE http://localhost:4000/api/playlist/PLAYLIST_TRACK_ID
```

## WebSocket Connection Example

```javascript
const socket = io('http://localhost:4000');

socket.on('connect', () => {
  console.log('Connected to playlist server');
});

socket.on('trackAdded', (data) => {
  console.log('New track added:', data);
});

socket.on('trackRemoved', (trackId) => {
  console.log('Track removed:', trackId);
});

socket.on('trackVoted', (data) => {
  console.log('Track voted:', data);
});

socket.on('trackPlaying', (trackId) => {
  console.log('Now playing:', trackId);
});
```

## Frontend Features Integration

### Multi-Playlist System

The frontend implements a sophisticated playlist management system that works alongside the server playlist:

#### Custom Playlists
- **Local Storage**: Custom playlists persist in browser localStorage
- **Real-time Updates**: State changes update immediately without API calls
- **Cross-Playlist Sync**: Player state synchronizes between server and custom playlists

```javascript
// Example: Creating a custom playlist
const playlist = {
  id: 'playlist-1699123456789-abc123',
  name: 'My Rock Classics',
  description: 'Best rock tracks from the 70s',
  tracks: [
    {
      id: 'custom-track-1',
      track_id: 'cmhiqhm9k001bmzjex8nxcdq2',
      position: 1.0,
      is_playing: false,
      added_at: '2024-01-01T00:00:00.000Z',
      track: { /* track object */ }
    }
  ]
}
```

#### Smart Filtering

The client-side filtering system provides advanced track organization:

- **Most Played**: Sorted by vote count (highest first)
- **Recently Added**: Sorted by `added_at` timestamp (newest first)
- **Recently Played**: Tracks with `played_at` within last 7 days
- **Never Played**: Tracks without `played_at` and votes <= 0
- **Top Rated**: Tracks with votes > 0, sorted by votes

### Playback State Management

The frontend maintains sophisticated playback state that works with both playlist types:

```javascript
// Player state synchronization
{
  currentTrack: PlaylistTrack | null,
  isPlaying: boolean,
  currentTime: number,
  duration: number,
  volume: number,
  isMuted: boolean,
  isShuffled: boolean,
  repeatMode: 'none' | 'one' | 'all'
}
```

### API Usage Patterns

#### Hybrid Playlist Management

```javascript
// Playing from server playlist
fetch('/api/playlist/TRACK_ID', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ is_playing: true })
});

// Playing from custom playlist (local state only)
updateTrackInPlaylist(playlistId, trackId, {
  is_playing: true,
  played_at: new Date().toISOString()
});
```

#### Cross-Playlist Operations

When switching between playlists, the client automatically:
1. Stops any playing tracks from all playlists
2. Updates the appropriate store (server API or local state)
3. Synchronizes player state across components

#### Volume and Player Controls

```javascript
// Volume control (local state)
setVolume(75);
toggleMute();

// Player controls work with both playlist types
handlePlayPause(); // Automatically detects playlist type
handleNext();      // Navigates within current playlist context
handlePrevious();  // Works with both server and custom playlists
```

### Performance Optimizations

- **Optimistic Updates**: UI updates immediately before API confirmation
- **Local State Management**: Custom playlists avoid server round-trips
- **Selective Re-rendering**: Zustand stores minimize unnecessary re-renders
- **Persistent Storage**: localStorage preserves user playlists across sessions

### Error Handling

The frontend handles various scenarios gracefully:
- Network disconnections (WebSocket auto-reconnect)
- API failures (graceful fallback to cached state)
- Playlist conflicts (server state takes precedence)
- Cross-browser compatibility (localStorage fallbacks)

This architecture provides a seamless user experience that combines the collaborative features of server-side playlists with the flexibility and performance of client-side custom playlists.