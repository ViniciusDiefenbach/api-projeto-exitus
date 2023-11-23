import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateRegisterDto } from './dto/create-register.dto';
import { UpdateRegisterDto } from './dto/update-register.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { randomUUID } from 'crypto';
import { FindAllRegisterDto } from './dto/find-all-register.dto';
import { RegisterType } from '@prisma/client';

@Injectable()
export class RegisterService {
  constructor(private readonly prismaService: PrismaService) {}

  async create({ time, register_type: r, user_id }: CreateRegisterDto) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: user_id,
      },
    });
    if (!user) {
      throw new InternalServerErrorException('Usuário não encontrado');
    }
    let register_type = r;
    if (!r) {
      const last_register = await this.prismaService.register.findFirst({
        take: 1,
        orderBy: {
          created_at: 'desc',
        },
        where: {
          user_id,
        },
      });
      if (!last_register) {
        register_type = 'IN';
      } else {
        const now = new Date().getTime();
        const last_register_time = last_register.created_at.getTime();
        const day_in_miliseconds = 1000 * 60 * 60 * 24;
        const time_diff_in_days =
          (now - last_register_time) / day_in_miliseconds;

        if (time_diff_in_days > 1) {
          register_type = 'IN';
          console.log('more than 1 day');
        } else {
          register_type = last_register.register_type === 'IN' ? 'OUT' : 'IN';
        }
      }
    }

    const new_register = await this.prismaService.register.create({
      data: {
        time: time,
        register_type,
        user_id,
      },
    });

    new_register.time = new_register.time;

    return new_register;
  }

  async findAll({
    limit,
    page,
    register_type,
    start_time,
    end_time,
    user_id,
  }: FindAllRegisterDto) {
    const registers = await this.prismaService.register.findMany({
      take: limit,
      skip: limit * page,
      where: {
        user_id,
        register_type: register_type as RegisterType,
        time: {
          gte: start_time,
          lte: end_time,
        },
      },
    });
    const count = await this.prismaService.register.count({
      where: {
        user_id,
        register_type: register_type as RegisterType,
        time: {
          gte: start_time,
          lte: end_time,
        },
      },
    });
    return {
      registers,
      count,
    };
  }

  async findOne(id: string) {
    return await this.prismaService.register.findUnique({
      where: {
        id,
      },
    });
  }

  async update(id: string, { user_id, ...data }: UpdateRegisterDto) {
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
