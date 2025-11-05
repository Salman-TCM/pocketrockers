import { IsNumber, IsBoolean, IsOptional } from 'class-validator';

export class UpdatePlaylistTrackDto {
  @IsNumber()
  @IsOptional()
  position?: number;

  @IsBoolean()
  @IsOptional()
  is_playing?: boolean;
}