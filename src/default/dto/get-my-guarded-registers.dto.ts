import { IsString, IsUUID } from 'class-validator';
import { PaginationDto } from './pagination.dto';
import { ApiProperty } from '@nestjs/swagger';
import { randomUUID } from 'crypto';

export class GetMyGuardedRegistersDto extends PaginationDto {
  @ApiProperty({
    example: randomUUID(),
    description: 'Guarded id',
  })
  @IsString({ message: 'O id do guardado precisa ser uma palavra!' })
  @IsUUID(undefined, { message: 'Id do protegido inválido!' })
  guarded: string;
}
