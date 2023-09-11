import { Injectable } from '@nestjs/common';
import { CreateEarlyExitDto } from './dto/create-early-exit.dto';
import { UpdateEarlyExitDto } from './dto/update-early-exit.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { randomUUID } from 'crypto';
import { FindAllEarlyExitDto } from './dto/find-all-early-exit.dto';

@Injectable()
export class EarlyExitService {
  constructor (
    private readonly prismaService: PrismaService
  ) {}

  create(createEarlyExitDto: CreateEarlyExitDto) {
    return this.prismaService.earlyExit.create({
      data: {
        id: randomUUID(),
        ...createEarlyExitDto,
        created_at: new Date(),
      }
    })
  }

  findAll({ page, limit }: FindAllEarlyExitDto) {
    const skip = page * limit;
    return this.prismaService.earlyExit.findMany({
      take: limit,
      skip,
    })
  }

  findOne(id: string) {
    this.prismaService.earlyExit.findUniqueOrThrow({
      where: {
        id,
      }
    })
  }

  update(id: string, updateEarlyExitDto: UpdateEarlyExitDto) {
    return this.prismaService.earlyExit.update({
      data: updateEarlyExitDto,
      where: {
        id,
      },
    })
  }

  remove(id: string) {
    this.prismaService.earlyExit.delete({
      where: {
        id,
      }
    })
  }
}
