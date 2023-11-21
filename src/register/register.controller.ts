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
import { RegisterService } from './register.service';
import { CreateRegisterDto } from './dto/create-register.dto';
import { UpdateRegisterDto } from './dto/update-register.dto';
import { FindAllRegisterDto } from './dto/find-all-register.dto';
import { Roles } from '@/auth/auth.guard';
import { RoleType } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('register')
@Controller('register')
export class RegisterController {
  constructor(private readonly registerService: RegisterService) {}

  @Roles(RoleType.ADMIN)
  @Post()
  create(@Body() createRegisterDto: CreateRegisterDto) {
    console.log(createRegisterDto);
    return this.registerService.create(createRegisterDto);
  }

  @Roles(RoleType.ADMIN)
  @Get()
  findAll(@Query() findAllRegisterDto: FindAllRegisterDto) {
    return this.registerService.findAll(findAllRegisterDto);
  }

  @Roles(RoleType.ADMIN)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.registerService.findOne(id);
  }

  @Roles(RoleType.ADMIN)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRegisterDto: UpdateRegisterDto,
  ) {
    return this.registerService.update(id, updateRegisterDto);
  }

  @Roles(RoleType.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.registerService.remove(id);
  }
}
