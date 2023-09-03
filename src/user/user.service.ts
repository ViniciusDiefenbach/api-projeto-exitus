import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindAllUserDto } from './dto/find-all-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { BcryptService } from '../bcrypt/bcrypt.service';
import { randomUUID } from 'crypto';

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly bcryptService: BcryptService,
  ) {}

  async create({
    active,
    password,
    fingerprint,
    birth,
    guardeds,
    ...data
  }: CreateUserDto) {
    const guardedsData = guardeds
      ? {
          createMany: {
            data: [
              ...guardeds?.map(({ id }) => ({
                guarded_id: id,
              })),
            ],
          },
        }
      : undefined;
    return await this.prismaService.user.create({
      data: {
        id: randomUUID(),
        active: active ?? true,
        password: password
          ? await this.bcryptService.hash({ password })
          : randomUUID(),
        fingerprint: fingerprint ?? randomUUID(),
        birth: birth ? new Date(birth) : undefined,
        guardeds: guardedsData,
        ...data,
      },
    });
  }

  async findAll({
    page,
    limit,
    active: aux,
    shift,
    ...filter
  }: FindAllUserDto) {
    const take = limit ? +limit : 8;
    const skip = page ? take * +page : 0;
    let active: boolean | undefined;
    switch (aux) {
      case 'true':
        active = true;
        break;
      case 'True':
        active = true;
        break;
      case 'false':
        active = false;
        break;
      case 'False':
        active = false;
        break;
      default:
        active = undefined;
        break;
    }
    return this.prismaService.user.findMany({
      take,
      skip,
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

  async update(id: string, { password, birth, ...data }: UpdateUserDto) {
    return await this.prismaService.user.update({
      where: { id },
      data: {
        password: password
          ? await this.bcryptService.hash({ password })
          : undefined,
        birth: birth ? new Date(birth) : undefined,
        ...data,
      },
    });
  }

  async remove(id: string) {
    return await this.prismaService.user.delete({ where: { id } });
  }
}
