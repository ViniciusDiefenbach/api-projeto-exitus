import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RoleService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll() {
    return await this.prismaService.role.findMany();
  }

  async findOne(id: string) {
    return await this.prismaService.role.findUnique({
      where: {
        id,
      },
    });
  }
}
