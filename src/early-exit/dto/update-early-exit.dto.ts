import { PartialType } from '@nestjs/swagger';
import { CreateEarlyExitDto } from './create-early-exit.dto';

export class UpdateEarlyExitDto extends PartialType(CreateEarlyExitDto) {}
