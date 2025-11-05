import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class TracksService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.track.findMany({
      orderBy: { title: 'asc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.track.findUnique({
      where: { id },
    });
  }
}
