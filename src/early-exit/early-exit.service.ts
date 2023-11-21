import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateEarlyExitDto } from './dto/create-early-exit.dto';
import { UpdateEarlyExitDto } from './dto/update-early-exit.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { randomUUID } from 'crypto';
import { FindAllEarlyExitDto } from './dto/find-all-early-exit.dto';

@Injectable()
export class EarlyExitService {
  constructor(private readonly prismaService: PrismaService) {}

  async create({
    start_at,
    end_at,
    guarded_id,
    guardian_id,
    time,
  }: CreateEarlyExitDto) {
    const guarded = await this.prismaService.user.findUnique({
      where: {
        id: guarded_id,
      },
    });
    if (!guarded) {
      throw new InternalServerErrorException('Guarded not found');
    }
    const guardian = await this.prismaService.user.findUnique({
      where: {
        id: guardian_id,
      },
    });
    if (!guardian) {
      throw new InternalServerErrorException('Guardian not found');
    }
    const guard_relation = await this.prismaService.guardRelation.findUnique({
      where: {
        guarded_id_guardian_id: {
          guarded_id,
          guardian_id,
        },
      },
    });
    if (!guard_relation) {
      throw new InternalServerErrorException('Guardian not related to guarded');
    }
    if (end_at < new Date()) {
      throw new InternalServerErrorException('End date is in the past');
    }
    return this.prismaService.earlyExit.create({
      data: {
        time,
        start_at,
        end_at,
        guarded_id,
        guardian_id,
      },
    });
  }

  async findAll({
    page,
    limit,
    start_at,
    end_at,
    guarded_id,
    guardian_id,
    start_time,
    end_time,
  }: FindAllEarlyExitDto) {
    const result = await this.prismaService.earlyExit.findMany({
      take: limit,
      skip: limit * page,
      where: {
        AND: [
          {
            guarded_id,
          },
          {
            guardian_id,
          },
          {
            OR: [
              {
                start_at: {
                  gte: start_at,
                  lte: end_at,
                },
              },
              {
                start_at: {
                  lte: start_at,
                },
              },
            ],
          },
          {
            OR: [
              {
                end_at: {
                  gte: start_at,
                  lte: end_at,
                },
              },
              {
                end_at: {
                  gte: end_at,
                },
              },
            ],
          },
        ],
      },
    });

    return result.filter((saida) => {
      if (
        saida.time.getHours() > start_time.getHours() &&
        saida.time.getHours() < end_time.getHours()
      ) {
        return true;
      } else if (
        saida.time.getHours() === start_time.getHours() ||
        saida.time.getHours() === end_time.getHours()
      ) {
        if (
          saida.time.getMinutes() >= start_time.getMinutes() &&
          saida.time.getMinutes() <= end_time.getMinutes()
        ) {
          return true;
        }
      }
      return false;
    });
  }

  findOne(id: string) {
    this.prismaService.earlyExit.findUniqueOrThrow({
      where: {
        id,
      },
    });
  }

  update(id: string, updateEarlyExitDto: UpdateEarlyExitDto) {
    return this.prismaService.earlyExit.update({
      data: updateEarlyExitDto,
      where: {
        id,
      },
    });
  }

  remove(id: string) {
    return this.prismaService.earlyExit.delete({
      where: {
        id,
      },
    });
  }
}
