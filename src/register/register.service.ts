import { Injectable } from '@nestjs/common';
import { CreateRegisterDto } from './dto/create-register.dto';
import { UpdateRegisterDto } from './dto/update-register.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { randomUUID } from 'crypto';
import { FindAllRegisterDto } from './dto/find-all-register.dto';

@Injectable()
export class RegisterService {
  constructor(private readonly prismaService: PrismaService) {}

  async create({ time: t, regiter_type: r, user: user_id }: CreateRegisterDto) {
    const time = t ? new Date(t) : new Date();
    const last_register = await this.prismaService.register.findFirst({
      take: 1,
      orderBy: {
        time: 'desc',
      },
    });
    const time_diff_in_days =
      (new Date().getTime() - new Date(last_register.time).getTime()) *
      1000 *
      60 *
      60 *
      24;
    const register_type = r
      ? r
      : !last_register
      ? 'IN'
      : time_diff_in_days > 1
      ? 'IN'
      : 'OUT';
    return await this.prismaService.register.create({
      data: {
        id: randomUUID(),
        time,
        register_type,
        user_id,
      },
    });
  }

  async findAll({ limit, page }: FindAllRegisterDto) {
    const take = limit ? +limit : 8;
    const skip = page ? take * +page : 0;
    return await this.prismaService.register.findMany({
      take,
      skip,
    });
  }

  async findOne(id: string) {
    return await this.prismaService.register.findUnique({
      where: {
        id,
      },
    });
  }

  async update(id: string, { user: user_id, ...data }: UpdateRegisterDto) {
    return await this.prismaService.register.update({
      where: { id },
      data: {
        user_id,
        ...data,
      },
    });
  }

  async remove(id: string) {
    return await this.prismaService.register.delete({
      where: { id },
    });
  }
}
