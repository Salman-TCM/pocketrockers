
# SyncPlay - Winamp-Style Collaborative Playlist Manager

A modern, real-time collaborative playlist application with a nostalgic Winamp-inspired interface. Features multiple custom playlists, advanced filtering, and immersive playback controls. Built with Next.js, NestJS, and WebSocket technology for seamless real-time synchronization.


## 🎵 Features

### Core Functionality
- **Real-time Collaboration**: All changes sync instantly across multiple browser windows
- **Multi-Playlist Management**: Create, rename, and delete custom named playlists
- **Smart Filtering System**: Filter tracks by Most Played, Recently Added, Recently Played, Never Played, and Top Rated
- **Winamp-Style Interface**: Classic three-panel layout with left sidebar, main view, and right panel
- **Advanced Playback Controls**: Play, pause, stop, previous, next with proper state management
- **Voting System**: Upvote and downvote tracks with real-time vote counting
- **Drag & Drop Reordering**: Smooth track reordering with fractional positioning algorithm
- **Volume Control**: Integrated volume slider with mute functionality in audio visualizer
- **Bulk Operations**: Select multiple tracks and perform bulk remove operations
- **Cross-Playlist Playback**: Seamless switching between server playlist and custom playlists

### Advanced UI Features
- **Winamp-Inspired Design**: Classic green and dark theme with retro aesthetic
- **Audio Visualizer**: Real-time visual feedback during playback with multiple styles
- **Interactive Progress Bars**: Click-to-seek functionality for track navigation
- **Modal Overlays**: Z-index managed modals for playlist creation and management
- **Dynamic State Indicators**: Visual feedback for playing, paused, and stopped states
- **Responsive Sidebar**: Collapsible left panel with smart playlist navigation
- **Real-time Updates**: Live state synchronization across all interface components
- **Smooth Animations**: Framer Motion powered transitions with optimized performance

## 📸 Screenshots

### Winamp-Style Interface
![Winamp Interface](./screenshots/Screenshot%20from%202025-11-11%2012-06-06.png)

The new Winamp-inspired interface features:
- **Left Sidebar**: Playlist management with filtering options (Most Played, Recently Added, etc.)
- **Center Panel**: Main track list with voting, drag-and-drop, and playback controls  
- **Right Panel**: Audio visualizer, player controls, and volume management
- **Green Theme**: Authentic Winamp color scheme with neon green accents
- **Real-time Equalizer**: Visual frequency display with adjustable settings

### Playlist Creation Modal
![Create Playlist Modal](./screenshots/Screenshot%20from%202025-11-11%2012-05-52.png)

Enhanced playlist creation features:
- **Search Integration**: Real-time track search with instant results
- **Bulk Selection**: Select multiple tracks at once with checkboxes
- **Track Preview**: View artist, album, and duration before adding
- **Glassmorphism Design**: Modern modal with backdrop blur effects

### Multi-Playlist Management
![Playlist Management](./screenshots/playlist-management.png)

Advanced playlist features include:
- **Custom Playlists**: Create named playlists with descriptions
- **Playlist Switching**: Easy navigation between server and custom playlists
- **Track Management**: Add, remove, and reorder tracks across different playlists
- **State Persistence**: Playlists saved locally with full state management

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

### URL Parameters

#### Winamp Mode
Enable the classic Winamp-style interface by adding the `winamp` parameter:
```
http://localhost:3001?winamp=true
```

This activates:
- **Classic Three-Panel Layout**: Left sidebar, center main view, right audio panel
- **Retro Green Theme**: Authentic Winamp color scheme and styling
- **Audio Visualizer**: Real-time visual feedback with multiple visualization styles
- **Enhanced Player Controls**: Complete playback management in the right panel
- **Nostalgic UI Elements**: Classic buttons, borders, and Winamp-inspired design

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
- **Next.js 16**: React framework with App Router and Turbopack
- **TypeScript**: End-to-end type safety with strict mode
- **Tailwind CSS**: Utility-first styling with custom Winamp theme
- **Framer Motion**: Smooth animations and transitions
- **Zustand**: Multi-store state management architecture
  - `playlist-store`: Server playlist and player controls
  - `multi-playlist-store`: Custom playlist management with persistence
  - `filter-store`: Smart filtering system
  - `player-store`: Playback state and current track management
- **TanStack Query**: Server state management with optimistic updates
- **Socket.io Client**: Real-time WebSocket communication
- **Phosphor Icons**: Comprehensive icon library for UI elements

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

### Creating Custom Playlists
1. Click the **"Create Playlist"** button at the bottom of the left sidebar
2. Enter a playlist name and optional description
3. Search and select tracks from the library
4. Click **"Create Playlist"** to save

### Managing Playlists
- **Switch Playlists**: Click on any playlist name in the sidebar
- **Rename Playlist**: Double-click on playlist name or use the edit button
- **Delete Playlist**: Use the "✕" button next to the playlist name
- **View Track Count**: Each playlist shows the number of tracks in parentheses

### Smart Filtering
Access advanced filters from the **"Recent Items"** section:
- **Most Played**: Tracks sorted by highest vote count
- **Recently Added**: Most recently added tracks first
- **Recently Played**: Tracks played within the last week
- **Never Played**: Tracks that haven't been played yet
- **Top Rated**: Tracks with positive vote counts only

### Playback Control
- **Play/Pause**: Click any track to start playing (click again to pause)
- **Next/Previous**: Use controls in the right panel or keyboard shortcuts
- **Stop**: Use the stop button to completely stop playback
- **Volume**: Adjust volume using the slider in the Audio Visualizer section
- **Seek**: Click on progress bars to jump to specific positions

### Track Management
- **Add Tracks**: Use the "+" button next to tracks in search results
- **Remove Tracks**: Use individual "✕" buttons or select multiple and use bulk remove
- **Voting**: Use thumbs up/down buttons (updates in real-time)
- **Reordering**: Drag tracks to reorder within playlists
- **Bulk Selection**: Use checkboxes to select multiple tracks for batch operations

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

### Mobile & Responsive Design
The application is fully responsive and optimized for all device sizes:
- **Mobile First**: Touch-friendly interface with larger tap targets
- **Tablet Optimized**: Adapted layouts for medium screens (768px+)
- **Desktop Enhanced**: Full feature set on large screens (1024px+)
- **Ultra-wide Support**: Optimized layouts for 1920px+ displays
- **Safe Area Support**: Handles device notches and rounded corners
- **Orientation Aware**: Adapts to both portrait and landscape modes

## ✅ Recently Implemented Features

### Major Enhancements Added
1. **✅ Multiple Playlists**: Full support for creating, managing, and switching between custom playlists
2. **✅ Smart Filtering System**: Advanced filtering by play history, ratings, and date criteria
3. **✅ Winamp-Style Interface**: Complete UI overhaul with classic three-panel layout
4. **✅ Enhanced Player Controls**: Comprehensive playback management with volume control
5. **✅ Cross-Playlist Playback**: Seamless switching between server and custom playlists
6. **✅ Bulk Operations**: Multi-select functionality for batch track management
7. **✅ State Persistence**: Local storage for playlists with automatic sync
8. **✅ Advanced UI Components**: Modal management, responsive design, and improved UX

## 🔮 If I Had 2 More Days...

### Additional Features I'd Add
1. **User Authentication**: Proper user accounts with avatars and presence indicators  
2. **Track History**: Detailed listening statistics and analytics dashboard
3. **Spotify Integration**: Import tracks and playlists from Spotify API
4. **Collaborative Filters**: Save and share custom genre/mood filters across users
5. **Playlist Export**: Export to various formats (M3U, JSON, Spotify, etc.)
6. **Advanced Animations**: More sophisticated UI transitions and micro-interactions
7. **Mobile App**: React Native companion app with offline sync
8. **Real Audio Playback**: Integrate with Web Audio API for actual music streaming
9. **Voice Commands**: "Add Bohemian Rhapsody" voice control integration
10. **Playlist Sharing**: Share playlists via URLs or QR codes

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
