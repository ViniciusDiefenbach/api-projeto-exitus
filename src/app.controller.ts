import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  Request,
} from '@nestjs/common';
import { AppService } from './app.service';
import { Roles } from './auth/auth.guard';
import { RoleType } from '@prisma/client';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Roles(RoleType.EMPLOYEE, RoleType.GUARDED, RoleType.GUARDIAN)
  @Get('my-registers')
  async getRegistersByUserId(@Request() req, @Query() query) {
    return this.appService.getRegistersByUserId({
      id: req.user.sub,
      take: query.take,
      page: query.page,
    });
  }

  @Roles(RoleType.GUARDIAN)
  @Get('my-guardeds')
  getGuardedsByUserId(@Request() req) {
    return this.appService.getGuardedsByUserId(req.user.sub);
  }

  @Roles(RoleType.GUARDIAN)
  @Get('my-guarded-registers')
  getGuardedRegistersByUserId(@Request() req, @Query() query) {
    return this.appService.getGuardedRegistersByUserId({
      guardian: req.user.sub,
      guarded: query.guarded,
      take: query.take,
      page: query.page,
    });
  }

  @Roles(RoleType.EMPLOYEE, RoleType.GUARDED, RoleType.GUARDIAN)
  @Get('my-code')
  getFingerprintByUserId(@Request() req) {
    return this.appService.getFingerprintByUserId(req.user.sub);
  }

  @Roles(RoleType.EMPLOYEE, RoleType.GUARDED, RoleType.GUARDIAN)
  @Patch('refresh-my-code')
  updateFingerprintByUserId(@Request() req) {
    return this.appService.updateFingerprintByUserId(req.user.sub);
  }

  @Post('gen-register')
  createAnRegisterByFingerprint(@Body() body) {
    return this.appService.createAnRegisterByFingerprint(body.fingerprint);
  }
}
