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
import { Roles } from '../auth/auth.guard';
import { RoleType } from '@prisma/client';
import { FingerprintDto } from './dto/fingerprint.dto';
import { PaginationDto } from './dto/pagination.dto';
import { GetMyGuardedRegistersDto } from './dto/get-my-guarded-registers.dto';
import { createAnEarlyExitForMyGuardedDto } from './dto/create-an-early-exit-for-my-guarded.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Roles(RoleType.EMPLOYEE, RoleType.GUARDED, RoleType.GUARDIAN)
  @Get('my-registers')
  async getRegistersByUserId(
    @Request() req,
    @Query() { page, limit }: PaginationDto,
  ) {
    return this.appService.getRegistersByUserId({
      id: req.user.sub,
      take: limit,
      page: page,
    });
  }

  @Roles(RoleType.GUARDIAN)
  @Get('my-guardeds')
  getGuardedsByUserId(@Request() req) {
    return this.appService.getGuardedsByUserId(req.user.sub);
  }

  @Roles(RoleType.GUARDIAN)
  @Get('my-guarded-registers')
  getGuardedRegistersByUserId(
    @Request() req,
    @Query() { guarded, limit, page }: GetMyGuardedRegistersDto,
  ) {
    return this.appService.getGuardedRegistersByUserId({
      guardian: req.user.sub,
      guarded: guarded,
      take: limit,
      page: page,
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

  @Post('create-register')
  createAnRegisterByFingerprint(@Body() { fingerprint }: FingerprintDto) {
    return this.appService.createAnRegisterByFingerprint(fingerprint);
  }

  @Post('create-an-early-exit-for-my-guarded')
  createAnEarlyExitForMyGuarded(
    @Request() req,
    @Body() createAnEarlyExitForMyGuarded: createAnEarlyExitForMyGuardedDto,
  ) {
    const guardian_id = req.user.sub;
    return this.appService.createAnEarlyExitForMyGuarded({
      guardian_id,
      ...createAnEarlyExitForMyGuarded,
    });
  }
}
