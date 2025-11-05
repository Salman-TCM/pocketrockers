import { IsNumber, IsBoolean, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdatePlaylistTrackDto {
  @ApiPropertyOptional({
    description: 'The new position of the track in the playlist',
    example: 2,
    minimum: 0,
  })
  @IsNumber()
  @IsOptional()
  position?: number;

  @ApiPropertyOptional({
    description: 'Whether the track is currently playing',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  is_playing?: boolean;
}