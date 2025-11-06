#!/bin/bash

# Demo script to showcase the Enhanced Playlist Manager UI
echo "🎵 Enhanced Playlist Manager Demo"
echo "================================="

API_BASE="http://localhost:4000"

echo "ℹ️  Note: The app automatically loads demo songs when launched with Docker!"
echo "   Popular tracks like Bohemian Rhapsody, Billie Jean, and Hotel California"
echo "   are already included. This script adds an extra track for demonstration."
echo ""

echo "1. Adding a track to playlist..."
curl -s -X POST "$API_BASE/api/playlist" \
  -H "Content-Type: application/json" \
  -d '{
    "track_id": "cmhn67sb50000ofi4gzf7w2a3",
    "position": 1.0,
    "votes": 0,
    "added_by": "Demo User"
  }' | jq '.'

echo -e "\n2. Starting playback (this will trigger enhanced player mode)..."
sleep 2

# Get the first playlist item and start playing it
PLAYLIST_ITEM_ID=$(curl -s "$API_BASE/api/playlist" | jq -r '.[0].id')

curl -s -X PATCH "$API_BASE/api/playlist/$PLAYLIST_ITEM_ID" \
  -H "Content-Type: application/json" \
  -d '{"is_playing": true}' | jq '.'

echo -e "\n✨ Enhanced Player Demo Ready!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🌐 Frontend: http://192.168.100.45:3001"
echo "🎛️  Backend API: http://192.168.100.45:4000"
echo "📚 API Docs: http://192.168.100.45:4000/api-docs"
echo ""
echo "🎯 Features to test:"
echo "   • Click a track to enter Enhanced Player Mode"
echo "   • Use play/pause, next/previous controls"
echo "   • Try shuffle and repeat modes"  
echo "   • Vote on tracks in the horizontal playlist"
echo "   • Collapse/expand track library with pulsing icon"
echo "   • Drag tracks up to remove from playlist"
echo "   • Search and filter in the collapsible library"
echo ""
echo "⌨️  Keyboard Shortcuts:"
echo "   • SPACE: Play/Pause"
echo "   • ↑/↓: Volume Up/Down"
echo "   • M: Toggle Mute"
echo ""
echo "🚀 The enhanced player features:"
echo "   • Full-screen immersive player with album art"
echo "   • Animated waveform visualization"
echo "   • Progress ring around album cover"
echo "   • Glassmorphism effects and smooth animations"
echo "   • Real-time WebSocket synchronization"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"