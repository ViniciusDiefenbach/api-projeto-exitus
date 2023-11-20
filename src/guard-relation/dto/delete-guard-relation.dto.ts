import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { randomUUID } from 'crypto';

export class DeleteGuardRelationDto {
  @ApiProperty({
    example: randomUUID(),
    description: 'The id of a guarded (student)',
  })
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  guarded: string;

  @ApiProperty({
    example: randomUUID(),
    description: 'The id of a guardian (parent)',
  })
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  guardian: string;
}
