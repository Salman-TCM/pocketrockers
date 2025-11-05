import { IsString, IsIn } from 'class-validator';

export class VoteTrackDto {
  @IsString()
  @IsIn(['up', 'down'])
  direction: 'up' | 'down';
}