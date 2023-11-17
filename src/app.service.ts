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
        id: true,
        name: true,
        shift: true,
        birth: true,
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

    if (user.roles.length < 1) {
      throw new Error('User has no roles');
    }

    // Checking if the user is coming or leaving
    let register_type: RegisterType = RegisterType.IN;
    const now = new Date();
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
        (now.getTime() - last_register_time) / day_in_milliseconds;

      if (time_diff_in_days < 1) {
        register_type =
          last_register.register_type === RegisterType.IN
            ? RegisterType.OUT
            : RegisterType.IN;
      }
    }
    // Checking if the user is coming or leaving

    /*
      Checking if the user is not only a guarded (student)
        - If !student, just create a register with the register_type
        - If student, continues the algorithm (to check if the person can enter or exit)
    */
    if (
      !user.roles.find((obj) => obj.role.role_type === RoleType.GUARDED) ||
      user.roles.length > 1
    ) {
      return await this.prismaService.register.create({
        data: {
          register_type: register_type,
          user: {
            connect: {
              fingerprint,
            },
          },
        },
      });
    }
    // Checking if the user is not only a guarded (student)

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

    if (now.getTime() >= morning_start && now.getTime() <= morning_end) {
      current_shift = Shift.MORNING;
    } else if (
      now.getTime() >= afternoon_start &&
      now.getTime() <= afternoon_end
    ) {
      current_shift = Shift.AFTERNOON;
    } else if (now.getTime() >= night_start && now.getTime() <= night_end) {
      current_shift = Shift.NIGHT;
    }
    // Getting the current shift

    // Checking if the student can enter (configurable in schedule.json)
    if (
      !schedule.studentsCanEnterOutOfTheShift &&
      register_type === RegisterType.IN &&
      current_shift !== user.shift
    ) {
      throw new Error('Students can only enter in their shift');
    }
    // Checking if the student can enter (configurable in schedule.json)

    // Get the age of the student
    const birthDate = new Date(user.birth);
    let age = now.getFullYear() - birthDate.getFullYear();
    const month = now.getMonth() - birthDate.getMonth();
    if (month < 0 || (month === 0 && now.getDate() < birthDate.getDate())) {
      age--;
    }
    // Get the age of the student

    // Check if the student have a early exit
    const early_exits = await this.prismaService.earlyExit.findMany({
      where: {
        AND: [
          {
            start_at: {
              lte: new Date(),
            },
          },
          {
            end_at: {
              gte: new Date(),
            },
          },
          {
            guarded_id: user.id,
          },
        ],
      },
    });
    // Check if the student have a early exit

    // Checking if the student can exit (minimum age is configurable in schedule.json)
    if (register_type === RegisterType.OUT && age < schedule.minAgeToLeave) {
      if (early_exits.length > 0) {
        const validEarlyExit = early_exits.find((e_e) => {
          if (now.getHours() > e_e.time.getHours()) {
            return true;
          } else if (
            now.getHours() === e_e.time.getHours() &&
            now.getMinutes() >= e_e.time.getMinutes()
          ) {
            return true;
          } else {
            return false;
          }
        });

        if (validEarlyExit) {
          return await this.prismaService.register.create({
            data: {
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
      throw new Error(
        'Students can only exit, in class hours, with more than 18 years old',
      );
    }
    // Checking if the student can exit (minimum age is configurable in schedule.json)

    return await this.prismaService.register.create({
      data: {
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
