import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PrismaService } from './prisma/prisma.service';
import { RegisterType } from '@prisma/client';
import schedule from './config/schedule.json';

@Injectable()
export class AppService {
  constructor(private readonly prismaService: PrismaService) {}

  getHello(): string {
    return 'Hello World!';
  }

  async getLogsByUserId({
    id,
    take,
    page,
  }: {
    id: string;
    take: number;
    page: number;
  }) {
    const logs = await this.prismaService.register.findMany({
      where: {
        user_id: id,
      },
      take: take ? Number(take) : 10,
      skip: page ? Number(page) * (take ? Number(take) : 10) : 0,
      orderBy: {
        created_at: 'desc',
      },
    });
    return { logs, count: logs.length };
  }

  async getQRCodeByUserId(id: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: id,
      },
    });
    console.log(user);
    return { fingerprint: user.fingerprint };
  }

  async updateQRCodeByUserId(userId: string) {
    await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        fingerprint: randomUUID(),
      },
    });
    return true;
  }

  async getGuardedsByUserId(userId: string) {
    return await this.prismaService.guardRelation.findMany({
      select: {
        guarded: true,
      },
      where: {
        guardian_id: userId,
      },
    });
  }

  async createAnRegisterByFingerprint(fingerprint) {
    const user = await this.prismaService.user.findUnique({
      where: {
        fingerprint,
      },
    });
    if (!user) {
      throw new Error('User not found');
    }

    let shift_time: 'MORNING' | 'AFTERNOON' | 'NIGHT';
    const now = new Date().getTime();
    const morning_start = new Date().setHours(
      schedule.morning.begin.hour,
      schedule.morning.begin.minute,
    );
    const morning_end = new Date().setHours(
      schedule.morning.end.hour,
      schedule.morning.end.minute,
    );
    const afternoon_start = new Date().setHours(
      schedule.afternoon.begin.hour,
      schedule.afternoon.begin.minute,
    );
    const afternoon_end = new Date().setHours(
      schedule.afternoon.end.hour,
      schedule.afternoon.end.minute,
    );
    const night_start = new Date().setHours(
      schedule.night.begin.hour,
      schedule.night.begin.minute,
    );
    const night_end = new Date().setHours(
      schedule.night.end.hour,
      schedule.night.end.minute,
    );

    if (now >= morning_start && now <= morning_end) {
      shift_time = 'MORNING';
    } else if (now >= afternoon_start && now <= afternoon_end) {
      shift_time = 'AFTERNOON';
    } else if (now >= night_start && now <= night_end) {
      shift_time = 'NIGHT';
    } else {
      throw new Error('Out of schedule');
    }

    if (schedule.studentsCanComeAndGoOutsideClassHours) {
    }
    let register_type = 'IN';
    const last_register = await this.prismaService.register.findFirst({
      take: 1,
      orderBy: {
        created_at: 'desc',
      },
      where: {
        user: {
          fingerprint,
        },
      },
    });
    if (last_register) {
      const last_register_time = last_register.created_at.getTime();
      const day_in_miliseconds = 1000 * 60 * 60 * 24;
      const time_diff_in_days = (now - last_register_time) / day_in_miliseconds;

      if (time_diff_in_days > 1) {
        register_type = 'IN';
      } else {
        register_type = last_register.register_type === 'IN' ? 'OUT' : 'IN';
      }
    }
    return await this.prismaService.register.create({
      data: {
        id: randomUUID(),
        time: new Date(),
        register_type: register_type as RegisterType,
        created_at: new Date(),
        user: {
          connect: {
            fingerprint,
          },
        },
      },
    });
  }
}
