import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUserRoleRelationDto } from './dto/create-user-role-relation.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { FindAllUserRoleRelationDto } from './dto/find-all-user-role-relation.dto';
import { DeleteUserRoleRelationDto } from './dto/delete-user-role-relation.dto';

@Injectable()
export class UserRoleRelationService {
  constructor(private readonly prismService: PrismaService) {}

  async create({ role_id, user_id }: CreateUserRoleRelationDto) {
    const user = await this.prismService.user.findUnique({
      where: {
        id: user_id,
      },
    });
    if (!user) {
      throw new InternalServerErrorException('Usuário não encontrado');
    }
    const role = await this.prismService.role.findUnique({
      where: {
        id: role_id,
      },
    });
    if (!role) {
      throw new InternalServerErrorException('Função não encontrada');
    }
    return await this.prismService.userRoleRelation.create({
      data: {
        role_id,
        user_id,
      },
    });
  }

  async findAll({
    page,
    limit,
    role: role_id,
    user: user_id,
  }: FindAllUserRoleRelationDto) {
    return await this.prismService.userRoleRelation.findMany({
      take: limit,
      skip: limit * page,
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

  async findRolesByUserId(user_id: string) {
    return await this.prismService.userRoleRelation.findMany({
      select: {
        role: {
          select: {
            role_type: true,
          },
        },
      },
      where: {
        user_id,
      },
    });
  }

  async remove({ role: role_id, user: user_id }: DeleteUserRoleRelationDto) {
    const user = await this.prismService.user.findUnique({
      where: {
        id: user_id,
      },
    });
    if (!user) {
      throw new InternalServerErrorException('Usuário não encontrado');
    }
    const role = await this.prismService.role.findUnique({
      where: {
        id: role_id,
      },
    });
    if (!role) {
      throw new InternalServerErrorException('Função não encontrada');
    }
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
