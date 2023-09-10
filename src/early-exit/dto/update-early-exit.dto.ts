import { PartialType } from '@nestjs/mapped-types';
import { CreateEarlyExitDto } from './create-early-exit.dto';

export class UpdateEarlyExitDto extends PartialType(CreateEarlyExitDto) {}
