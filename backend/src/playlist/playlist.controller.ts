import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { PlaylistService } from './playlist.service';
import { CreatePlaylistTrackDto } from './dto/create-playlist-track.dto';
import { UpdatePlaylistTrackDto } from './dto/update-playlist-track.dto';
import { VoteTrackDto } from './dto/vote-track.dto';
import { EventsGateway } from '../events/events.gateway';

@ApiTags('playlist')
@Controller('api/playlist')
export class PlaylistController {
  constructor(
    private readonly playlistService: PlaylistService,
    private readonly eventsGateway: EventsGateway
  ) {}

  @Get()
  @ApiOperation({ 
    summary: 'Get all playlist tracks',
    description: 'Retrieve all tracks currently in the playlist with their metadata' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'List of playlist tracks returned successfully',
    schema: {
      example: [
        {
          id: "playlist_track_id",
          track_id: "cmhiqhm9k001bmzjex8nxcdq2",
          position: 0,
          votes: 5,
          is_playing: false,
          added_by: "John Doe",
          added_at: "2024-01-01T00:00:00.000Z",
          track: {
            id: "cmhiqhm9k001bmzjex8nxcdq2",
            title: "Bohemian Rhapsody",
            artist: "Queen",
            album: "A Night at the Opera",
            genre: "Rock",
            duration_seconds: 355
          }
        }
      ]
    }
  })
  findAll() {
    return this.playlistService.findAll();
  }

  @Post()
  @ApiOperation({ 
    summary: 'Add track to playlist',
    description: 'Add a new track to the playlist queue' 
  })
  @ApiBody({ type: CreatePlaylistTrackDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Track added to playlist successfully',
    schema: {
      example: {
        id: "new_playlist_track_id",
        track_id: "cmhiqhm9k001bmzjex8nxcdq2",
        position: 1,
        votes: 0,
        is_playing: false,
        added_by: "John Doe",
        added_at: "2024-01-01T00:00:00.000Z"
      }
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Invalid input or track already in playlist' 
  })
  async create(@Body() createPlaylistTrackDto: CreatePlaylistTrackDto) {
    const result = await this.playlistService.create(createPlaylistTrackDto);
    this.eventsGateway.sendTrackAdded(result);
    return result;
  }

  @Patch(':id')
  @ApiOperation({ 
    summary: 'Update playlist track',
    description: 'Update properties of a track in the playlist (position or playing status)' 
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the playlist track to update',
    example: 'playlist_track_id',
  })
  @ApiBody({ type: UpdatePlaylistTrackDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Track updated successfully' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Playlist track not found' 
  })
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
  @ApiOperation({ 
    summary: 'Vote on a playlist track',
    description: 'Submit an up or down vote for a track in the playlist' 
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the playlist track to vote on',
    example: 'playlist_track_id',
  })
  @ApiBody({ type: VoteTrackDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Vote recorded successfully',
    schema: {
      example: {
        id: "playlist_track_id",
        votes: 6
      }
    }
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Playlist track not found' 
  })
  async vote(@Param('id') id: string, @Body() voteTrackDto: VoteTrackDto) {
    const result = await this.playlistService.vote(id, voteTrackDto);
    this.eventsGateway.sendTrackVoted({ id: result.id, votes: result.votes });
    return result;
  }

  @Delete(':id')
  @ApiOperation({ 
    summary: 'Remove track from playlist',
    description: 'Remove a track from the playlist queue' 
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the playlist track to remove',
    example: 'playlist_track_id',
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Track removed from playlist successfully' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Playlist track not found' 
  })
  async remove(@Param('id') id: string) {
    const result = await this.playlistService.remove(id);
    this.eventsGateway.sendTrackRemoved(id);
    return result;
  }
}
