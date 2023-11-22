import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';
import { randomUUID } from 'crypto';

export class FingerprintDto {
  @ApiProperty({ example: randomUUID(), description: 'User fingerprint' })
  @IsString({ message: 'A fingerprint precisa ser uma palavra!' })
  @IsUUID(undefined, { message: 'Fingerprint inválida!' })
  fingerprint: string;
}
