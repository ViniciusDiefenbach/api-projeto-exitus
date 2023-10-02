import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindAllUserDto } from './dto/find-all-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { BcryptService } from '../bcrypt/bcrypt.service';
import { randomUUID } from 'crypto';
import { adptCreateMany } from '@/prisma/adpt-create-many';

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly bcryptService: BcryptService,
  ) { }

  async create({ password, guardeds, roles, ...data }: CreateUserDto) {
    return await this.prismaService.user.create({
      data: {
        id: randomUUID(),
        password: password
          ? await this.bcryptService.hash({ password })
          : randomUUID(),
        guardeds: adptCreateMany({ array: guardeds, key: 'guarded_id' }),
        roles: adptCreateMany({ array: roles, key: 'role_id' }),
        ...data,
        created_at: new Date(),
      },
    });
  }

  async findAll({ page, limit, active, shift, ...filter }: FindAllUserDto) {
    return this.prismaService.user.findMany({
      take: limit,
      skip: limit * page,
      where: {
        active,
        name: {
          contains: filter.name,
        },
        email: {
          contains: filter.email,
        },
        enrollment: {
          contains: filter.enrollment,
        },
        shift,
      },
    });
  }

  async findById(id: string) {
    return await this.prismaService.user.findUnique({ where: { id } });
  }

  findByEmail(email: string) {
    return this.prismaService.user.findUnique({ where: { email } });
  }

  async update(id: string, { password, ...data }: UpdateUserDto) {
    return await this.prismaService.user.update({
      where: { id },
      data: {
        password: password
          ? await this.bcryptService.hash({ password })
          : undefined,
        ...data,
      },
    });
  }

  async remove(id: string) {
    return await this.prismaService.user.delete({ where: { id } });
  }
}
