import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { PlaylistService } from './playlist.service';
import { CreatePlaylistTrackDto } from './dto/create-playlist-track.dto';
import { UpdatePlaylistTrackDto } from './dto/update-playlist-track.dto';
import { VoteTrackDto } from './dto/vote-track.dto';
import { EventsGateway } from '../events/events.gateway';

@Controller('api/playlist')
export class PlaylistController {
  constructor(
    private readonly playlistService: PlaylistService,
    private readonly eventsGateway: EventsGateway
  ) {}

  @Get()
  findAll() {
    return this.playlistService.findAll();
  }

  @Post()
  async create(@Body() createPlaylistTrackDto: CreatePlaylistTrackDto) {
    const result = await this.playlistService.create(createPlaylistTrackDto);
    this.eventsGateway.sendTrackAdded(result);
    return result;
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updatePlaylistTrackDto: UpdatePlaylistTrackDto) {
    const result = await this.playlistService.update(id, updatePlaylistTrackDto);
    
    if (updatePlaylistTrackDto.position !== undefined) {
      this.eventsGateway.sendTrackMoved({ id: result.id, position: result.position });
    }
    
    if (updatePlaylistTrackDto.is_playing === true) {
      this.eventsGateway.sendTrackPlaying(result.id);
    }
    
    return result;
  }

  @Post(':id/vote')
  async vote(@Param('id') id: string, @Body() voteTrackDto: VoteTrackDto) {
    const result = await this.playlistService.vote(id, voteTrackDto);
    this.eventsGateway.sendTrackVoted({ id: result.id, votes: result.votes });
    return result;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const result = await this.playlistService.remove(id);
    this.eventsGateway.sendTrackRemoved(id);
    return result;
  }
}
