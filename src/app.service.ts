import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(private readonly prismaService: PrismaService) {}

  getHello(): string {
    return 'Hello World!';
  }

  async go({ fingerprint }) {
    const user = await this.prismaService.user.findUnique({
      select: {
        id: true,
      },
      where: {
        fingerprint,
      },
    });

    let register_type;
    const { id: user_id } = user;
    const last_register = await this.prismaService.register.findFirst({
      take: 1,
      orderBy: {
        time: 'desc',
      },
      where: {
        user_id,
      },
    });

    if (!last_register) {
      register_type = 'IN';
    } else {
      const time_diff_in_days =
        (new Date().getTime() - new Date(last_register.time).getTime()) /
        (1000 * 60 * 60 * 24);
      register_type = time_diff_in_days > 1 ? 'IN' : 'OUT';
    }
  }
}
