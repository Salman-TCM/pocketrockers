import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TracksModule } from './tracks/tracks.module';
import { PlaylistModule } from './playlist/playlist.module';
import { EventsGateway } from './events/events.gateway';

@Module({
  imports: [TracksModule, PlaylistModule],
  controllers: [AppController],
  providers: [AppService, EventsGateway],
})
export class AppModule {}
