import { IsString, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VoteTrackDto {
  @ApiProperty({
    description: 'Vote direction for the track',
    enum: ['up', 'down'],
    example: 'up',
  })
  @IsString()
  @IsIn(['up', 'down'])
  direction: 'up' | 'down';
}