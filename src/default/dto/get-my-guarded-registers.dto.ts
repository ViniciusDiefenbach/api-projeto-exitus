import { IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { randomUUID } from 'crypto';
import { MyRegisterDto } from './my-registers.dto';

export class GetMyGuardedRegistersDto extends MyRegisterDto {
  @ApiProperty({
    example: randomUUID(),
    description: 'Guarded id',
  })
  @IsString({ message: 'O id do guardado precisa ser uma palavra!' })
  @IsUUID(undefined, { message: 'Id do protegido inválido!' })
  guarded: string;
}
