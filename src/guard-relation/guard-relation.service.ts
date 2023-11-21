import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateGuardRelationDto } from './dto/create-guard-relation.dto';
import { FindAllGuardRelationDto } from './dto/find-all-guard-relation.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { DeleteGuardRelationDto } from './dto/delete-guard-relation.dto';

@Injectable()
export class GuardRelationService {
  constructor(private readonly prismaService: PrismaService) {}

  async create({ guarded_id, guardian_id }: CreateGuardRelationDto) {
    const guarded = await this.prismaService.user.findUnique({
      where: {
        id: guarded_id,
      },
    });
    if (!guarded) {
      throw new InternalServerErrorException('Guarded não encontrado');
    }
    const guardian = await this.prismaService.user.findUnique({
      where: {
        id: guardian_id,
      },
    });
    if (!guardian) {
      throw new InternalServerErrorException('Guardian não encontrado');
    }
    return await this.prismaService.guardRelation.create({
      data: {
        guarded_id,
        guardian_id,
      },
    });
  }

  async findAll({
    page,
    limit,
    guarded: guarded_id,
    guardian: guardian_id,
  }: FindAllGuardRelationDto) {
    return await this.prismaService.guardRelation.findMany({
      take: limit,
      skip: limit * page,
      select: {
        guarded: {
          select: {
            id: true,
            name: true,
          },
        },
        guardian: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      where: {
        guarded_id,
        guardian_id,
      },
    });
  }

  async remove({
    guarded: guarded_id,
    guardian: guardian_id,
  }: DeleteGuardRelationDto) {
    const guarded = await this.prismaService.user.findUnique({
      where: {
        id: guarded_id,
      },
    });
    if (!guarded) {
      throw new InternalServerErrorException('Usuário não encontrado');
    }
    const guardian = await this.prismaService.user.findUnique({
      where: {
        id: guardian_id,
      },
    });
    if (!guardian) {
      throw new InternalServerErrorException('Usuário não encontrado');
    }
    return await this.prismaService.guardRelation.delete({
      where: {
        guarded_id_guardian_id: {
          guarded_id,
          guardian_id,
        },
      },
    });
  }
}
