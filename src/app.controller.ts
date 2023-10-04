import { Controller, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { Roles } from './auth/auth.guard';
import { RoleType } from '@prisma/client';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Roles(RoleType.ADMIN)
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('go/:fingerprint')
  go(@Param('fingerprint') fingerprint: string) {
    return this.appService.go({ fingerprint });
  }
}
