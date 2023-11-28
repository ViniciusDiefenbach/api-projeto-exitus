import { Controller, Get, Post, Body, Delete, Query } from '@nestjs/common';
import { GuardRelationService } from './guard-relation.service';
import { CreateGuardRelationDto } from './dto/create-guard-relation.dto';
import { FindAllGuardRelationDto } from './dto/find-all-guard-relation.dto';
import { DeleteGuardRelationDto } from './dto/delete-guard-relation.dto';
import { Roles } from '@/auth/auth.guard';
import { RoleType } from '@prisma/client';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('guard-relation')
@Controller('guard-relation')
export class GuardRelationController {
  constructor(private readonly guardRelationService: GuardRelationService) {}

  @ApiBearerAuth()
  @Roles(RoleType.ADMIN)
  @Post()
  create(@Body() createGuardRelationDto: CreateGuardRelationDto) {
    return this.guardRelationService.create(createGuardRelationDto);
  }

  @ApiBearerAuth()
  @Roles(RoleType.ADMIN)
  @Get()
  findAll(@Query() findAllGuardRelationDto: FindAllGuardRelationDto) {
    return this.guardRelationService.findAll(findAllGuardRelationDto);
  }

  @ApiBearerAuth()
  @Roles(RoleType.ADMIN)
  @Delete()
  remove(@Query() deleteGuardRelationDto: DeleteGuardRelationDto) {
    return this.guardRelationService.remove(deleteGuardRelationDto);
  }
}
