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
  ) {}

  async create({ password, guardeds, roles, ...data }: CreateUserDto) {
    const user = await this.prismaService.user.create({
      data: {
        password: password
          ? await this.bcryptService.hash({ password })
          : await this.bcryptService.hash({ password: randomUUID() }),
        guardeds: adptCreateMany({ array: guardeds, key: 'guarded_id' }),
        roles: adptCreateMany({ array: roles, key: 'role_id' }),
        ...data,
      },
    });
    const { password: _, ...result } = user;
    return result;
  }

  async findAll({ page, limit, active, shift, ...filter }: FindAllUserDto) {
    return this.prismaService.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        enrollment: true,
        active: true,
        shift: true,
        created_at: true,
        updated_at: true,
        birth: true,
        fingerprint: true,
      },
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
    return await this.prismaService.user.findUnique({
      select: {
        id: true,
        name: true,
        email: true,
        enrollment: true,
        active: true,
        shift: true,
        created_at: true,
        updated_at: true,
        birth: true,
        fingerprint: true,
      },
      where: { id },
    });
  }

  findByEmail(email: string) {
    return this.prismaService.user.findUnique({
      select: {
        id: true,
        name: true,
        email: true,
        enrollment: true,
        active: true,
        shift: true,
        created_at: true,
        updated_at: true,
        birth: true,
        fingerprint: true,
      },
      where: { email },
    });
  }

  async update(id: string, { password, ...data }: UpdateUserDto) {
    const user = await this.prismaService.user.update({
      where: { id },
      data: {
        password: password
          ? await this.bcryptService.hash({ password })
          : undefined,
        ...data,
      },
    });
    const { password: _, ...result } = user;
    return result;
  }

  async remove(id: string) {
    const user = await this.prismaService.user.delete({ where: { id } });
    const { password: _, ...result } = user;
    return result;
  }
}
