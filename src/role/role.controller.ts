import { Controller, Get, Param } from '@nestjs/common';
import { RoleService } from './role.service';
import { Roles } from '@/auth/auth.guard';
import { RoleType } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('role')
@Controller('role')
@Roles(RoleType.ADMIN)
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  findAll() {
    return this.roleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roleService.findOne(id);
  }
}
