import { Controller, Get, Post, Body, Delete, Query } from '@nestjs/common';
import { UserRoleRelationService } from './user-role-relation.service';
import { CreateUserRoleRelationDto } from './dto/create-user-role-relation.dto';
import { FindAllUserRoleRelationDto } from './dto/find-all-user-role-relation.dto';
import { DeleteUserRoleRelationDto } from './dto/delete-user-role-relation.dto';

@Controller('user-role-relation')
export class UserRoleRelationController {
  constructor(
    private readonly userRoleRelationService: UserRoleRelationService,
  ) {}

  @Post()
  create(@Body() createUserRoleRelationDto: CreateUserRoleRelationDto) {
    return this.userRoleRelationService.create(createUserRoleRelationDto);
  }

  @Get()
  findAll(@Query() findAllUserRoleRelationDto: FindAllUserRoleRelationDto) {
    return this.userRoleRelationService.findAll(findAllUserRoleRelationDto);
  }

  @Delete()
  remove(@Query() deleteUserRoleRelationDto: DeleteUserRoleRelationDto) {
    return this.userRoleRelationService.remove(deleteUserRoleRelationDto);
  }
}
