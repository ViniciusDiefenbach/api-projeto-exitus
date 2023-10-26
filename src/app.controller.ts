import { Body, Controller, Get, Patch, Post, Query, Request } from '@nestjs/common';
import { AppService } from './app.service';
import { Roles } from './auth/auth.guard';
import { RoleType } from '@prisma/client';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  @Roles(RoleType.ADMIN)
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('logs')
  @Roles(RoleType.ADMIN)
  getLogsByUserId(@Request() req, @Query() query) {
    return this.appService.getLogsByUserId({ "id": req.user.id, "take": query.take, "page": query.page });
  }

  @Get('code')
  @Roles(RoleType.ADMIN)
  getQRCodeByUserId(@Request() req) {
    return this.appService.getQRCodeByUserId(req.user.sub);
  }

  @Patch('refresh-code')
  @Roles(RoleType.ADMIN)
  updateQRCodeByUserId(@Request() req) {
    return this.appService.updateQRCodeByUserId(req.user.sub);
  }

  @Post('register')
  createAnRegisterByFingerprint(@Body() body) {
    return this.appService.createAnRegisterByFingerprint(body.fingerprint);
  }

}
