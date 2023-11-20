import { Controller, Get, Post, Body, Delete, Query } from '@nestjs/common';
import { GuardRelationService } from './guard-relation.service';
import { CreateGuardRelationDto } from './dto/create-guard-relation.dto';
import { FindAllGuardRelationDto } from './dto/find-all-guard-relation.dto';
import { DeleteGuardRelationDto } from './dto/delete-guard-relation.dto';
import { Roles } from '@/auth/auth.guard';
import { RoleType } from '@prisma/client';

@Controller('guard-relation')
@Roles(RoleType.ADMIN)
export class GuardRelationController {
  constructor(private readonly guardRelationService: GuardRelationService) {}

  @Post()
  create(@Body() createGuardRelationDto: CreateGuardRelationDto) {
    return this.guardRelationService.create(createGuardRelationDto);
  }

  @Get()
  findAll(@Query() findAllGuardRelationDto: FindAllGuardRelationDto) {
    return this.guardRelationService.findAll(findAllGuardRelationDto);
  }

  @Delete()
  remove(@Query() deleteGuardRelationDto: DeleteGuardRelationDto) {
    return this.guardRelationService.remove(deleteGuardRelationDto);
  }
}
