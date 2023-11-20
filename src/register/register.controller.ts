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

@Controller('register')
export class RegisterController {
  constructor(private readonly registerService: RegisterService) {}

  @Post()
  @Roles(RoleType.ADMIN)
  create(@Body() createRegisterDto: CreateRegisterDto) {
    console.log(createRegisterDto);
    return this.registerService.create(createRegisterDto);
  }

  @Get()
  findAll(@Query() findAllRegisterDto: FindAllRegisterDto) {
    return this.registerService.findAll(findAllRegisterDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.registerService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRegisterDto: UpdateRegisterDto,
  ) {
    return this.registerService.update(id, updateRegisterDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.registerService.remove(id);
  }
}
