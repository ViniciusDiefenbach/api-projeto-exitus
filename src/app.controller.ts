import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard, Roles } from './auth/auth.guard';
import { RoleType } from '@prisma/client';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Roles(RoleType.ADMIN)
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('go/:id')
  go(@Param('id') id: string) {
    return id;
  }
}
