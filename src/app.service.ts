import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PrismaService } from './prisma/prisma.service';
import { RegisterType, RoleType, Shift } from '@prisma/client';
import schedule from '../config/schedule.json';

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
      select: {
        name: true,
        roles: {
          select: {
            role: {
              select: {
                role_type: true,
              },
            },
          },
        },
      },
      where: {
        fingerprint,
      },
    });
    if (!user) {
      throw new Error('User not found');
    }

    // Checking if the user is coming or leaving
    let register_type: RegisterType = RegisterType.IN;
    const now = new Date().getTime();
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
      const day_in_milliseconds = 1000 * 60 * 60 * 24;
      const time_diff_in_days =
        (now - last_register_time) / day_in_milliseconds;

      if (time_diff_in_days < 1) {
        register_type =
          last_register.register_type === RegisterType.IN
            ? RegisterType.OUT
            : RegisterType.IN;
      }
    }
    // Checking if the user is coming or leaving

    if (user.roles.length < 1) {
      throw new Error('User has no roles');
    }

    /*
      Checking if the user is a guarded (student)
        - If student, continues the algorithm (to check if the person can enter or exit)
        - If !student, just create a register with the register_type
    */
    if (!user.roles.find((obj) => obj.role.role_type === RoleType.GUARDED)) {
      return await this.prismaService.register.create({
        data: {
          id: randomUUID(),
          time: new Date(),
          register_type: register_type,
          created_at: new Date(),
          user: {
            connect: {
              fingerprint,
            },
          },
        },
      });
    }
    // Checking if the user is a guarded (student)

    // Getting the current shift
    let current_shift: Shift;
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
      current_shift = Shift.MORNING;
    } else if (now >= afternoon_start && now <= afternoon_end) {
      current_shift = Shift.AFTERNOON;
    } else if (now >= night_start && now <= night_end) {
      current_shift = Shift.NIGHT;
    }
    // Getting the current shift

    return await this.prismaService.register.create({
      data: {
        time: new Date(),
        register_type: register_type as RegisterType,
        user: {
          connect: {
            fingerprint,
          },
        },
      },
    });
  }
}
