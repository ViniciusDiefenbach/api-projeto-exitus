import { Injectable } from '@nestjs/common';
import { CreateUserRoleRelationDto } from './dto/create-user-role-relation.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { FindAllUserRoleRelationDto } from './dto/find-all-user-role-relation.dto';
import { DeleteUserRoleRelationDto } from './dto/delete-user-role-relation.dto';

@Injectable()
export class UserRoleRelationService {
  constructor(private readonly prismService: PrismaService) { }

  async create({ role_id, user_id }: CreateUserRoleRelationDto) {
    return await this.prismService.userRoleRelation.create({
      data: {
        role_id,
        user_id,
        created_at: new Date(),
      },
    });
  }

  async findAll({
    page,
    limit,
    role: role_id,
    user: user_id,
  }: FindAllUserRoleRelationDto) {
    const take = limit ? +limit : 8;
    const skip = page ? take * +page : 0;
    return await this.prismService.userRoleRelation.findMany({
      take,
      skip,
      select: {
        role_id: false,
        user_id: false,
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        role: {
          select: {
            id: true,
            role_type: true,
          },
        },
      },
      where: {
        role_id,
        user_id,
      },
    });
  }

  async remove({ role: role_id, user: user_id }: DeleteUserRoleRelationDto) {
    return await this.prismService.userRoleRelation.delete({
      where: {
        user_id_role_id: {
          role_id,
          user_id,
        },
      },
    });
  }
}
