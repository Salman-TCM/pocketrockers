import { ApiProperty } from '@nestjs/swagger';

export class TrackResponseDto {
  @ApiProperty({
    description: 'Unique identifier of the track',
    example: 'cmhiqhm9k001bmzjex8nxcdq2',
  })
  id: string;

  @ApiProperty({
    description: 'Title of the track',
    example: 'Bohemian Rhapsody',
  })
  title: string;

  @ApiProperty({
    description: 'Artist name',
    example: 'Queen',
  })
  artist: string;

  @ApiProperty({
    description: 'Album name',
    example: 'A Night at the Opera',
  })
  album: string;

  @ApiProperty({
    description: 'Music genre',
    example: 'Rock',
  })
  genre: string;

  @ApiProperty({
    description: 'Track duration in seconds',
    example: 355,
    minimum: 0,
  })
  duration_seconds: number;

  @ApiProperty({
    description: 'Number of times this track has been played',
    example: 0,
    minimum: 0,
  })
  play_count: number;

  @ApiProperty({
    description: 'Track creation timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  created_at: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  updated_at: Date;
}