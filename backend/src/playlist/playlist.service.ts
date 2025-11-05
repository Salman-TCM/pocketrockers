import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreatePlaylistTrackDto } from './dto/create-playlist-track.dto';
import { UpdatePlaylistTrackDto } from './dto/update-playlist-track.dto';
import { VoteTrackDto } from './dto/vote-track.dto';
import { calculatePosition } from '../utils/position.util';

@Injectable()
export class PlaylistService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.playlistTrack.findMany({
      include: {
        track: true,
      },
      orderBy: { position: 'asc' },
    });
  }

  async create(createPlaylistTrackDto: CreatePlaylistTrackDto) {
    const existingTrack = await this.prisma.playlistTrack.findUnique({
      where: { track_id: createPlaylistTrackDto.track_id },
    });

    if (existingTrack) {
      throw new ConflictException('Track is already in the playlist');
    }

    const lastTrack = await this.prisma.playlistTrack.findFirst({
      orderBy: { position: 'desc' },
    });

    const position = calculatePosition(lastTrack?.position || null, null);

    return this.prisma.playlistTrack.create({
      data: {
        track_id: createPlaylistTrackDto.track_id,
        added_by: createPlaylistTrackDto.added_by || 'Anonymous',
        position,
      },
      include: {
        track: true,
      },
    });
  }

  async update(id: string, updatePlaylistTrackDto: UpdatePlaylistTrackDto) {
    const existingTrack = await this.prisma.playlistTrack.findUnique({
      where: { id },
    });

    if (!existingTrack) {
      throw new NotFoundException('Playlist track not found');
    }

    if (updatePlaylistTrackDto.is_playing === true) {
      await this.prisma.playlistTrack.updateMany({
        where: { is_playing: true },
        data: { is_playing: false, played_at: new Date() },
      });
    }

    return this.prisma.playlistTrack.update({
      where: { id },
      data: updatePlaylistTrackDto,
      include: {
        track: true,
      },
    });
  }

  async vote(id: string, voteTrackDto: VoteTrackDto) {
    const existingTrack = await this.prisma.playlistTrack.findUnique({
      where: { id },
    });

    if (!existingTrack) {
      throw new NotFoundException('Playlist track not found');
    }

    const voteChange = voteTrackDto.direction === 'up' ? 1 : -1;

    return this.prisma.playlistTrack.update({
      where: { id },
      data: {
        votes: existingTrack.votes + voteChange,
      },
      include: {
        track: true,
      },
    });
  }

  async remove(id: string) {
    const existingTrack = await this.prisma.playlistTrack.findUnique({
      where: { id },
    });

    if (!existingTrack) {
      throw new NotFoundException('Playlist track not found');
    }

    await this.prisma.playlistTrack.delete({
      where: { id },
    });

    return { message: 'Track removed from playlist' };
  }
}
