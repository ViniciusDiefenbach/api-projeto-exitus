import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { randomUUID } from "crypto"
import { RegisterType } from '@prisma/client';

@Injectable()
export class AppService {
  constructor(
    private readonly prismaService: PrismaService,
  ) { }

  getHello(): string {
    return 'Hello World!';
  }

  async getLogsByUserId({ id, take, page }: { id: string, take: number, page: number }) {
    const logs = await this.prismaService.register.findMany({
      where: {
        user_id: id,
      },
      take: take ? Number(take) : 10,
      skip: page ? Number(page) * (take ? Number(take) : 10) : 0,
      orderBy: {
        created_at: 'desc',
      }
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
    return `https://chart.googleapis.com/chart?chs=150x150&cht=qr&chl=${user.fingerprint}`;
  }

  async updateQRCodeByUserId(userId: string): Promise<string> {
    await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        fingerprint: randomUUID(),
      },
    });
    return `QRCode from user ${userId} updated`;
  }

  async getGuardedsByUserId(userId: string) {
    return await this.prismaService.guardRelation.findMany({
      select: {
        guarded: true,
      },
      where: {
        guardian_id: userId,
      }
    })
  }

  async createAnRegisterByFingerprint(fingerprint) {
    let register_type = 'IN';
    const last_register = await this.prismaService.register.findFirst({
      take: 1,
      orderBy: {
        created_at: 'desc',
      },
      where: {
        user: {
          fingerprint,
        }
      }
    });
    if (last_register) {
      const now = new Date().getTime();
      const last_register_time = last_register.created_at.getTime();
      const day_in_miliseconds = 1000 *
        60 *
        60 *
        24;
      const time_diff_in_days = (now - last_register_time) / day_in_miliseconds;

      if (time_diff_in_days > 1) {
        register_type = 'IN';
        console.log('more than 1 day');
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
          }
        }
      }
    });
  }
}
