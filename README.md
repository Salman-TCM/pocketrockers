# SyncPlay - Realtime Collaborative Playlist Manager

A modern, real-time collaborative playlist application that allows multiple users to add, remove, reorder, and vote on songs in a shared playlist. Built with Next.js, NestJS, and WebSocket technology for seamless real-time synchronization.

## 🎵 Features

### Core Functionality
- **Real-time Collaboration**: All changes sync instantly across multiple browser windows
- **Enhanced Player Experience**: Full-screen immersive player with glassmorphism effects
- **Collapsible Track Library**: Smart interface that transforms into a pulsing music icon
- **Voting System**: Upvote and downvote tracks with real-time vote counting
- **Drag & Drop Reordering**: Smooth track reordering with optimistic updates
- **Now Playing Simulation**: Visual progress tracking with automatic track advancement
- **Search & Filter**: Find tracks quickly in the library
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

### Advanced UI Features
- **Glassmorphism Design**: Modern translucent interfaces with backdrop blur
- **Animated Waveform**: Visual feedback during playback simulation
- **Progress Ring**: Circular progress indicator around album artwork
- **Keyboard Shortcuts**: Space to play/pause, ESC to close enhanced player
- **Connection Status**: Real-time connection indicator
- **Smooth Animations**: Framer Motion powered transitions

## 📸 Screenshots

### Enhanced Full-Screen Player
![Enhanced Player](./screenshots/Screenshot%20from%202025-11-06%2015-52-31.png)

The enhanced player provides an immersive full-screen experience with:
- Large album artwork with progress ring
- Animated waveform visualization
- Complete playback controls (play, pause, next, previous, shuffle, repeat)
- Volume control and track information
- ESC key or close button to return to main view

### Main Interface with Track Library
![Main Interface](./screenshots/Screenshot%20from%202025-11-06%2015-52-00.png)

The main interface features:
- **Track Library** (left): Searchable collection with add-to-playlist buttons
- **Playlist Panel** (right): Current queue with voting, reordering, and play controls
- **Real-time Status**: Shows connected users and track count
- **Now Playing Bar** (bottom): Compact player with progress and controls

### Collapsed Library View
![Collapsed View](./screenshots/Screenshot%20from%202025-11-06%2015-52-12.png)

When the track library is collapsed:
- Pulsing music icon replaces the full library panel
- Playlist expands to use full available width
- Maintains all functionality in a cleaner layout

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ (if running without Docker)

### Using Docker (Recommended)
```bash
# Clone the repository
git clone <repository-url>
cd playlist-assignment

# Start the application
docker-compose up -d

# The application will be available at:
# Frontend: http://localhost:3001
# Backend API: http://localhost:4000
# API Documentation: http://localhost:4000/api-docs
```

### Manual Setup
```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Start backend
cd backend
npm install
npm run build
npm start

# Start frontend (in new terminal)
cd frontend
npm install
npm run build
npm start
```

## 🛠 Technical Architecture

### Frontend Stack
- **Next.js 16**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Framer Motion**: Smooth animations and transitions
- **Zustand**: Lightweight state management
- **TanStack Query**: Server state management
- **Socket.io Client**: Real-time communication
- **Phosphor Icons**: Modern icon library

### Backend Stack
- **NestJS**: Scalable Node.js framework
- **TypeScript**: End-to-end type safety
- **Prisma**: Type-safe database ORM
- **SQLite**: Embedded database
- **Socket.io**: WebSocket implementation
- **Swagger**: API documentation

### Key Features Implementation

#### Position Algorithm
Implements the required fractional positioning system for efficient reordering:

```typescript
function calculatePosition(prevPosition: number | null, nextPosition: number | null): number {
  if (!prevPosition && !nextPosition) return 1.0;
  if (!prevPosition) return nextPosition - 1;
  if (!nextPosition) return prevPosition + 1;
  return (prevPosition + nextPosition) / 2;
}
```

#### Real-time Synchronization
- WebSocket connection with automatic reconnection
- Optimistic updates for immediate UI feedback
- Event-driven architecture for all playlist changes
- Conflict resolution with server-authoritative state

#### Responsive Grid Layout
- CSS Grid system with responsive breakpoints
- 35%/65% width distribution on desktop
- 40%/60% on medium screens
- Stacked layout on mobile devices
- 8px gap between panels with consistent 16px padding

## 🗄 Database Schema

### Track (Library)
```sql
Track {
  id: String (Primary Key)
  title: String
  artist: String
  album: String
  duration_seconds: Int
  genre: String
  cover_url: String?
}
```

### PlaylistTrack
```sql
PlaylistTrack {
  id: String (Primary Key)
  track_id: String (Foreign Key)
  position: Float
  votes: Int
  added_by: String
  added_at: DateTime
  is_playing: Boolean
  played_at: DateTime?
  track: Track (Relation)
}
```

## 🔧 API Endpoints

### Tracks
- `GET /api/tracks` - Fetch available tracks library
- `GET /api/playlist` - Get current playlist ordered by position

### Playlist Management
- `POST /api/playlist` - Add track to playlist
- `PATCH /api/playlist/{id}` - Update position or playing status
- `DELETE /api/playlist/{id}` - Remove track from playlist

### Voting
- `POST /api/playlist/{id}/vote` - Vote on a track (up/down)

### Real-time Events
- WebSocket connection at the same port as API
- Events: `track.added`, `track.removed`, `track.moved`, `track.voted`, `track.playing`

## 🎮 Usage Guide

### Adding Tracks
1. Use the search bar to find tracks in the library
2. Click the "+" button next to any track to add it to the playlist
3. Tracks already in the playlist will show a checkmark instead

### Voting
- Click the thumbs up/down buttons next to each track
- Vote counts update in real-time across all connected users
- Tracks can have negative vote counts

### Reordering
- Drag tracks by the handle (⋮⋮) to reorder
- Changes sync immediately to other users
- Smooth animations show the new position

### Playback Control
- Click any track to start playing and enter enhanced player mode
- Use play/pause, next/previous controls
- Progress bar shows simulated playback progress
- Tracks auto-advance when they finish

### Enhanced Player
- Click any playing track to enter full-screen mode
- Use ESC key or close button (↓) to return to main view
- Full playback controls with shuffle and repeat modes
- Visual waveform and progress ring animations

## 🧪 Testing

### Running Tests
```bash
# Backend tests
cd backend
npm test

# Frontend tests  
cd frontend
npm test

# Run all tests
npm run test:all
```

### Test Coverage
- Position calculation algorithm
- Playlist CRUD operations
- Voting system
- Real-time event handling
- Component rendering and interactions

## 🏗 Development Decisions

### State Management
- **Zustand** for client-side player state (lightweight, TypeScript-first)
- **TanStack Query** for server state (caching, synchronization, optimistic updates)
- **WebSocket** events for real-time synchronization

### UI/UX Choices
- **Glassmorphism** design for modern, depth-rich interfaces
- **Grid Layout** instead of flexbox for predictable responsive behavior
- **Fractional positioning** to avoid expensive reindexing operations
- **Optimistic updates** for immediate user feedback

### Performance Optimizations
- Debounced drag operations to reduce server requests
- Efficient re-renders with proper React key usage
- Image optimization with Next.js built-in features
- Connection pooling and automatic reconnection

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

Mobile browsers supported with responsive design adaptations.

## 🔮 If I Had 2 More Days...

### Enhanced Features I'd Add
1. **Multiple Playlists**: Support for creating and managing multiple playlists
2. **User Authentication**: Proper user accounts with avatars and presence indicators  
3. **Track History**: Recently played tracks and listening statistics
4. **Spotify Integration**: Import tracks from Spotify playlists
5. **Collaborative Filters**: Save and share custom genre/mood filters
6. **Playlist Export**: Export to various formats (M3U, Spotify, etc.)
7. **Advanced Animations**: More sophisticated UI transitions and micro-interactions
8. **Mobile App**: React Native companion app
9. **Offline Mode**: Cache tracks and sync when reconnected
10. **Voice Commands**: "Add Bohemian Rhapsody" voice control

### Technical Improvements
1. **Redis Integration**: For better real-time performance at scale
2. **Database Optimization**: Proper indexing and query optimization
3. **Caching Strategy**: CDN and edge caching for static assets
4. **Performance Monitoring**: Real-time performance metrics and alerting
5. **End-to-End Testing**: Cypress tests for complete user journeys
6. **CI/CD Pipeline**: Automated testing and deployment
7. **Error Boundaries**: Better error handling and recovery
8. **Accessibility**: Full WCAG 2.1 compliance
9. **PWA Features**: Service workers and offline capability
10. **Load Testing**: Performance validation under high concurrent usage

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is part of a technical assessment and is intended for demonstration purposes.

---

Built with ❤️ for the Technometrics take-home assignment 

### Please Like, Comment and Share 
Md.Salman Hossain
