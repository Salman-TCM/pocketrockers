import { ApiProperty } from '@nestjs/swagger';
import { TrackResponseDto } from '../../tracks/dto/track-response.dto';

export class PlaylistTrackResponseDto {
  @ApiProperty({
    description: 'Unique identifier of the playlist track entry',
    example: 'playlist_track_id_123',
  })
  id: string;

  @ApiProperty({
    description: 'ID of the referenced track',
    example: 'cmhiqhm9k001bmzjex8nxcdq2',
  })
  track_id: string;

  @ApiProperty({
    description: 'Position in the playlist (0-based)',
    example: 0,
    minimum: 0,
  })
  position: number;

  @ApiProperty({
    description: 'Current vote count (can be negative)',
    example: 5,
  })
  votes: number;

  @ApiProperty({
    description: 'Whether this track is currently playing',
    example: false,
  })
  is_playing: boolean;

  @ApiProperty({
    description: 'Name of the user who added this track',
    example: 'John Doe',
  })
  added_by: string;

  @ApiProperty({
    description: 'Timestamp when the track was added to playlist',
    example: '2024-01-01T00:00:00.000Z',
  })
  added_at: Date;

  @ApiProperty({
    description: 'Full track information',
    type: TrackResponseDto,
  })
  track: TrackResponseDto;
}