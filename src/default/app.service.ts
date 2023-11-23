import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterType, RoleType, Shift } from '@prisma/client';
import schedule from '../../config/schedule.json';
import { RegisterService } from '@/register/register.service';
import { GetMyGuardedRegistersDto } from './dto/get-my-guarded-registers.dto';
import { GetMyGuardedRegistersMethodDto } from './dto/get-my-guarded-registers-method.dto';

@Injectable()
export class AppService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly registerService: RegisterService,
  ) {}

  async getProfile(id: string) {
    return await this.prismaService.user.findUnique({
      select: {
        id: true,
        name: true,
        email: true,
        shift: true,
        birth: true,
      },
      where: {
        id: id,
      },
    });
  }

  async deleteOneOfMyEarlyExits({ guardian_id, early_exit_id }) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: guardian_id,
      },
    });
    if (!user) {
      throw new InternalServerErrorException('Usuário não encontrado');
    }
    const early_exit = await this.prismaService.earlyExit.findUnique({
      where: {
        id: early_exit_id,
        guardian_id: guardian_id,
      },
    });
    if (!early_exit) {
      throw new InternalServerErrorException('Saída antecipada não encontrada');
    }
    await this.prismaService.earlyExit.delete({
      where: {
        id: early_exit_id,
      },
    });
    return {
      message: 'Saída antecipada deletada com sucesso',
    };
  }

  async getRegistersByUserId({
    id,
    take,
    page,
  }: {
    id: string;
    take: string;
    page: string;
  }) {
    const registers = await this.prismaService.register.findMany({
      where: {
        user_id: id,
      },
      take: take ? Number(take) : 10,
      skip: page ? Number(page) * (take ? Number(take) : 10) : 0,
      orderBy: {
        created_at: 'desc',
      },
    });
    if (registers.length < 1) {
      throw new InternalServerErrorException('Usuário não possui registros');
    }
    return registers;
  }

  async getFingerprintByUserId(id: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: id,
      },
    });
    return { fingerprint: user.fingerprint };
  }

  async updateFingerprintByUserId(userId: string) {
    const user = await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        fingerprint: randomUUID(),
      },
    });
    return {
      fingerprint: user.fingerprint,
    };
  }

  async getGuardedsByUserId(userId: string) {
    const guardeds = await this.prismaService.guardRelation.findMany({
      select: {
        guarded: {
          select: {
            id: true,
            name: true,
            shift: true,
            birth: true,
            fingerprint: true,
          },
        },
      },
      where: {
        guardian_id: userId,
      },
    });
    if (guardeds.length < 1) {
      throw new InternalServerErrorException('Usuário não possui protegidos');
    }
    return guardeds;
  }

  async getMyGuardedRegisters({
    guardian,
    guarded,
    limit,
    page,
    end,
    start,
    type,
    sort,
  }: GetMyGuardedRegistersMethodDto) {
    const guard_relation = await this.prismaService.guardRelation.findUnique({
      where: {
        guarded_id_guardian_id: {
          guarded_id: guarded,
          guardian_id: guardian,
        },
      },
    });
    if (!guard_relation) {
      throw new InternalServerErrorException(
        'Guardião não possui relação com o protegido',
      );
    }
    return await this.registerService.findAll({
      user_id: guarded,
      limit,
      page,
      end_time: end,
      start_time: start,
      register_type: type,
      sort,
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
      throw new InternalServerErrorException(
        'Usuário não encontrado (Possivelmente, erro no QR Code)',
      );
    }

    if (user.roles.length < 1) {
      throw new InternalServerErrorException('Usuário não possui permissão');
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
      throw new InternalServerErrorException(
        'Estudantes não podem entrar no colégio fora do horário',
      );
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
    if (
      register_type === RegisterType.OUT &&
      age < schedule.minAgeToLeave &&
      user.shift === current_shift
    ) {
      let validEarlyExit;

      if (early_exits.length > 0) {
        validEarlyExit = early_exits.find((e_e) => {
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
      }

      if (!validEarlyExit) {
        throw new InternalServerErrorException(
          'Estudantes com menos de 18 anos não podem sair do colégio fora do horário',
        );
      }
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
