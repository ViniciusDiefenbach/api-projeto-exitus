import { Controller, Get, Post, Body, Delete, Query } from '@nestjs/common';
import { UserRoleRelationService } from './user-role-relation.service';
import { CreateUserRoleRelationDto } from './dto/create-user-role-relation.dto';
import { FindAllUserRoleRelationDto } from './dto/find-all-user-role-relation.dto';
import { DeleteUserRoleRelationDto } from './dto/delete-user-role-relation.dto';
import { Roles } from '@/auth/auth.guard';
import { RoleType } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('user-role-relation')
@Controller('user-role-relation')
export class UserRoleRelationController {
  constructor(
    private readonly userRoleRelationService: UserRoleRelationService,
  ) {}

  @Roles(RoleType.ADMIN)
  @Post()
  create(@Body() createUserRoleRelationDto: CreateUserRoleRelationDto) {
    return this.userRoleRelationService.create(createUserRoleRelationDto);
  }

  @Roles(RoleType.ADMIN)
  @Get()
  findAll(@Query() findAllUserRoleRelationDto: FindAllUserRoleRelationDto) {
    return this.userRoleRelationService.findAll(findAllUserRoleRelationDto);
  }

  @Roles(RoleType.ADMIN)
  @Delete()
  remove(@Query() deleteUserRoleRelationDto: DeleteUserRoleRelationDto) {
    return this.userRoleRelationService.remove(deleteUserRoleRelationDto);
  }
}
