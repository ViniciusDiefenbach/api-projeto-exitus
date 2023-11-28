import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindAllUserDto } from './dto/find-all-user.dto';
import { RoleType } from '@prisma/client';
import { Roles } from '@/auth/auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBearerAuth()
  @Roles(RoleType.ADMIN)
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }

  @ApiBearerAuth()
  @Roles(RoleType.ADMIN)
  @Get()
  async findAll(@Query() findAllUserDto: FindAllUserDto) {
    return await this.userService.findAll(findAllUserDto);
  }

  @ApiBearerAuth()
  @Roles(RoleType.ADMIN)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.userService.findById(id);
  }

  @ApiBearerAuth()
  @Roles(RoleType.ADMIN)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    try {
      return await this.userService.update(id, updateUserDto);
    } catch (error) {
      return error;
    }
  }

  @ApiBearerAuth()
  @Roles(RoleType.ADMIN)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.userService.remove(id);
  }
}
