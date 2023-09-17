import { Injectable } from '@nestjs/common';
import { CreateGuardRelationDto } from './dto/create-guard-relation.dto';
import { FindAllGuardRelationDto } from './dto/find-all-guard-relation.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { DeleteGuardRelationDto } from './dto/delete-guard-relation.dto';

@Injectable()
export class GuardRelationService {
  constructor(private readonly prismaService: PrismaService) {}

  async create({
    guarded_id,
    guardian_id
  }: CreateGuardRelationDto) {
    return await this.prismaService.guardRelation.create({
      data: {
        guarded_id,
        guardian_id,
        created_at: new Date(),
      },
    });
  }

  async findAll({
    page,
    limit,
    guarded: guarded_id,
    guardian: guardian_id,
  }: FindAllGuardRelationDto) {
    const take = limit ? +limit : 8;
    const skip = page ? take * +page : 0;
    return await this.prismaService.guardRelation.findMany({
      skip,
      take,
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
