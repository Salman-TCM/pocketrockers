import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { TracksService } from './tracks.service';

@ApiTags('tracks')
@Controller('api/tracks')
export class TracksController {
  constructor(private readonly tracksService: TracksService) {}

  @Get()
  @ApiOperation({ 
    summary: 'Get all tracks',
    description: 'Retrieve a list of all available tracks in the library' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'List of tracks returned successfully',
    schema: {
      example: [
        {
          id: "cmhiqhm9k001bmzjex8nxcdq2",
          title: "Bohemian Rhapsody",
          artist: "Queen",
          album: "A Night at the Opera",
          genre: "Rock",
          duration_seconds: 355,
          play_count: 0,
          created_at: "2024-01-01T00:00:00.000Z",
          updated_at: "2024-01-01T00:00:00.000Z"
        }
      ]
    }
  })
  findAll() {
    return this.tracksService.findAll();
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Get a track by ID',
    description: 'Retrieve a single track by its unique identifier' 
  })
  @ApiParam({
    name: 'id',
    description: 'The unique identifier of the track',
    example: 'cmhiqhm9k001bmzjex8nxcdq2',
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Track found and returned successfully',
    schema: {
      example: {
        id: "cmhiqhm9k001bmzjex8nxcdq2",
        title: "Bohemian Rhapsody",
        artist: "Queen",
        album: "A Night at the Opera",
        genre: "Rock",
        duration_seconds: 355,
        play_count: 0,
        created_at: "2024-01-01T00:00:00.000Z",
        updated_at: "2024-01-01T00:00:00.000Z"
      }
    }
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Track not found' 
  })
  findOne(@Param('id') id: string) {
    return this.tracksService.findOne(id);
  }
}
