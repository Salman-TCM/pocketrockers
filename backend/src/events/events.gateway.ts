import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  sendTrackAdded(item: any) {
    this.server.emit('track.added', { type: 'track.added', item });
  }

  sendTrackRemoved(id: string) {
    this.server.emit('track.removed', { type: 'track.removed', id });
  }

  sendTrackMoved(item: { id: string; position: number }) {
    this.server.emit('track.moved', { type: 'track.moved', item });
  }

  sendTrackVoted(item: { id: string; votes: number }) {
    this.server.emit('track.voted', { type: 'track.voted', item });
  }

  sendTrackPlaying(id: string) {
    this.server.emit('track.playing', { type: 'track.playing', id });
  }

  sendPlaylistReordered(items: any[]) {
    this.server.emit('playlist.reordered', { type: 'playlist.reordered', items });
  }

  sendPing() {
    this.server.emit('ping', { type: 'ping', ts: new Date().toISOString() });
  }
}
