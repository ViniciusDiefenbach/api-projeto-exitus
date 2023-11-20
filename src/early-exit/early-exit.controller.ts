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
import { EarlyExitService } from './early-exit.service';
import { CreateEarlyExitDto } from './dto/create-early-exit.dto';
import { UpdateEarlyExitDto } from './dto/update-early-exit.dto';
import { FindAllEarlyExitDto } from './dto/find-all-early-exit.dto';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from '@/auth/auth.guard';
import { RoleType } from '@prisma/client';

@ApiTags('early-exit')
@Controller('early-exit')
@Roles(RoleType.ADMIN)
export class EarlyExitController {
  constructor(private readonly earlyExitService: EarlyExitService) {}

  @Post()
  create(@Body() createEarlyExitDto: CreateEarlyExitDto) {
    return this.earlyExitService.create(createEarlyExitDto);
  }

  @Get()
  findAll(@Query() findAllEarlyExitDto: FindAllEarlyExitDto) {
    return this.earlyExitService.findAll(findAllEarlyExitDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.earlyExitService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateEarlyExitDto: UpdateEarlyExitDto,
  ) {
    return this.earlyExitService.update(id, updateEarlyExitDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.earlyExitService.remove(id);
  }
}
