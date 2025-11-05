import { IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePlaylistTrackDto {
  @ApiProperty({
    description: 'The ID of the track to add to the playlist',
    example: 'cmhiqhm9k001bmzjex8nxcdq2',
  })
  @IsString()
  track_id: string;

  @ApiPropertyOptional({
    description: 'The name of the user adding the track',
    default: 'Anonymous',
    example: 'John Doe',
  })
  @IsString()
  @IsOptional()
  added_by?: string = 'Anonymous';
}