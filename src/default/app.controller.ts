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
import { EarlyExitService } from '@/early-exit/early-exit.service';
import { FindAllEarlyExitDto } from '@/early-exit/dto/find-all-early-exit.dto';
import { RegisterService } from '@/register/register.service';
import { MyRegisterDto } from './dto/my-registers.dto';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly earlyExitService: EarlyExitService,
    private readonly registerService: RegisterService,
  ) {}

  @Roles(RoleType.ADMIN, RoleType.EMPLOYEE, RoleType.GUARDED, RoleType.GUARDIAN)
  @Get('my-profile')
  getProfile(@Request() req) {
    return this.appService.getProfile(req.user.sub);
  }

  @Roles(RoleType.EMPLOYEE, RoleType.GUARDED, RoleType.GUARDIAN)
  @Get('my-registers')
  async getRegistersByUserId(
    @Request() req,
    @Query() { page, limit }: PaginationDto,
    @Query() { type, start, end }: MyRegisterDto,
  ) {
    const user_id = req.user.sub;
    const registers = await this.registerService.findAll({
      user_id,
      page: Number(page),
      limit: Number(limit),
      start_time: start,
      end_time: end,
      register_type: type,
    });
    return registers;
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

  @Roles(RoleType.GUARDIAN)
  @Post('create-an-early-exit')
  createAnEarlyExitForMyGuarded(
    @Request() req,
    @Body()
    { time, start_at, end_at, guarded_id }: createAnEarlyExitForMyGuardedDto,
  ) {
    const guardian_id = req.user.sub;

    return this.earlyExitService.create({
      guardian_id,
      guarded_id,
      time,
      start_at,
      end_at,
    });
  }

  @Roles(RoleType.GUARDIAN)
  @Get('my-early-exits')
  getMyEarlyExits(
    @Request() req,
    @Query()
    {
      limit,
      page,
      end_at,
      end_time,
      guarded_id,
      start_at,
      start_time,
    }: FindAllEarlyExitDto,
  ) {
    const guardian_id = req.user.sub;
    return this.earlyExitService.findAll({
      guardian_id,
      limit,
      page,
      end_at,
      end_time,
      guarded_id,
      start_at,
      start_time,
    });
  }

  @Roles(RoleType.GUARDIAN)
  @Get('delete-an-early-exit')
  deleteAnEarlyExits(
    @Request() req,
    @Query()
    { id }: { id: number },
  ) {
    const guardian_id = req.user.sub;
    return this.appService.deleteOneOfMyEarlyExits({
      guardian_id,
      early_exit_id: id,
    });
  }
}
