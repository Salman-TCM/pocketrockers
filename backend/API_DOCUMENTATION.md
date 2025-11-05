# Music Playlist API Documentation

## Overview

The Music Playlist API provides endpoints for managing a collaborative music playlist system. Users can browse tracks, add them to playlists, vote on tracks, and control playback.

## Base URL

- Development: `http://localhost:4000`
- API Documentation: `http://localhost:4000/api-docs`

## Authentication

Currently, the API does not require authentication. All endpoints are publicly accessible.

## WebSocket Events

The API uses Socket.IO for real-time updates. Connect to `ws://localhost:4000` to receive the following events:

### Events Emitted by Server

- `trackAdded` - When a new track is added to the playlist
- `trackRemoved` - When a track is removed from the playlist
- `trackMoved` - When a track's position changes in the playlist
- `trackVoted` - When a track receives a vote
- `trackPlaying` - When a track starts playing

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