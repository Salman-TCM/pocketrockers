import { IsString, IsOptional } from 'class-validator';

export class CreatePlaylistTrackDto {
  @IsString()
  track_id: string;

  @IsString()
  @IsOptional()
  added_by?: string = 'Anonymous';
}