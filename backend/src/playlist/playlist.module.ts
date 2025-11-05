import { Module } from '@nestjs/common';
import { PlaylistController } from './playlist.controller';
import { PlaylistService } from './playlist.service';
import { PrismaService } from '../prisma.service';
import { EventsGateway } from '../events/events.gateway';

@Module({
  controllers: [PlaylistController],
  providers: [PlaylistService, PrismaService, EventsGateway],
  exports: [PlaylistService]
})
export class PlaylistModule {}
