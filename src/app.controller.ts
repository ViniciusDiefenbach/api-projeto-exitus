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

@Roles(RoleType.ADMIN, RoleType.EMPLOYEE, RoleType.GUARDED, RoleType.GUARDIAN)
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('logs')
  getRegistersByUserId(@Request() req, @Query() query) {
    return this.appService.getRegistersByUserId({
      id: req.user.id,
      take: query.take,
      page: query.page,
    });
  }

  @Get('code')
  getFingerprintByUserId(@Request() req) {
    return this.appService.getFingerprintByUserId(req.user.sub);
  }

  @Patch('refresh-code')
  @Roles(RoleType.ADMIN)
  updateFingerprintByUserId(@Request() req) {
    return this.appService.updateFingerprintByUserId(req.user.sub);
  }

  @Post('make-a-register')
  createAnRegisterByFingerprint(@Body() body) {
    return this.appService.createAnRegisterByFingerprint(body.fingerprint);
  }
}
