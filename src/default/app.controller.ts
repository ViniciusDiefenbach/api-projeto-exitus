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
import { GetMyGuardedRegistersDto } from './dto/get-my-guarded-registers.dto';
import { CreateAnEarlyExitForMyGuardedDto } from './dto/create-an-early-exit-for-my-guarded.dto';
import { EarlyExitService } from '@/early-exit/early-exit.service';
import { FindAllEarlyExitDto } from '@/early-exit/dto/find-all-early-exit.dto';
import { RegisterService } from '@/register/register.service';
import { MyRegisterDto } from './dto/my-registers.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly earlyExitService: EarlyExitService,
    private readonly registerService: RegisterService,
  ) {}

  @ApiBearerAuth()
  @Roles(RoleType.ADMIN, RoleType.EMPLOYEE, RoleType.GUARDED, RoleType.GUARDIAN)
  @Get('my-profile')
  getProfile(@Request() req) {
    return this.appService.getProfile(req.user.sub);
  }

  @ApiBearerAuth()
  @Roles(RoleType.EMPLOYEE, RoleType.GUARDED, RoleType.GUARDIAN)
  @Get('my-registers')
  async getRegistersByUserId(
    @Request() req,
    @Query() myRegisterDto: MyRegisterDto,
  ) {
    const user_id = req.user.sub;
    const {
      type: register_type,
      start: start_time,
      end: end_time,
      ...result
    } = myRegisterDto;
    return await this.registerService.findAll({
      user_id,
      start_time,
      end_time,
      register_type,
      ...result,
    });
  }

  @ApiBearerAuth()
  @Roles(RoleType.GUARDIAN)
  @Get('my-guardeds')
  getGuardedsByUserId(@Request() req) {
    return this.appService.getGuardedsByUserId(req.user.sub);
  }

  @ApiBearerAuth()
  @Roles(RoleType.GUARDIAN)
  @Get('my-guarded-registers')
  getGuardedRegistersByUserId(
    @Request() req,
    @Query()
    getMyGuardedRegistersDto: GetMyGuardedRegistersDto,
  ) {
    const guardian = req.user.sub;
    return this.appService.getMyGuardedRegisters({
      guardian,
      ...getMyGuardedRegistersDto,
    });
  }

  @ApiBearerAuth()
  @Roles(RoleType.EMPLOYEE, RoleType.GUARDED, RoleType.GUARDIAN)
  @Get('my-code')
  getFingerprintByUserId(@Request() req) {
    return this.appService.getFingerprintByUserId(req.user.sub);
  }

  @ApiBearerAuth()
  @Roles(RoleType.EMPLOYEE, RoleType.GUARDED, RoleType.GUARDIAN)
  @Patch('refresh-my-code')
  updateFingerprintByUserId(@Request() req) {
    return this.appService.updateFingerprintByUserId(req.user.sub);
  }

  @ApiBearerAuth()
  @Post('create-register')
  createAnRegisterByFingerprint(@Body() { fingerprint }: FingerprintDto) {
    return this.appService.createAnRegisterByFingerprint(fingerprint);
  }

  @ApiBearerAuth()
  @Roles(RoleType.GUARDIAN)
  @Post('create-an-early-exit')
  createAnEarlyExitForMyGuarded(
    @Request() req,
    @Body()
    createAnEarlyExitForMyGuardedDto: CreateAnEarlyExitForMyGuardedDto,
  ) {
    const guardian_id = req.user.sub;

    return this.earlyExitService.create({
      guardian_id,
      ...createAnEarlyExitForMyGuardedDto,
    });
  }

  @ApiBearerAuth()
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

  @ApiBearerAuth()
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
