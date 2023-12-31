import { Controller, Get, Param } from '@nestjs/common';
import { RoleService } from './role.service';
import { Roles } from '@/auth/auth.guard';
import { RoleType } from '@prisma/client';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('role')
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @ApiBearerAuth()
  @Roles(RoleType.ADMIN)
  @Get()
  findAll() {
    return this.roleService.findAll();
  }

  @ApiBearerAuth()
  @Roles(RoleType.ADMIN)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roleService.findOne(id);
  }
}
