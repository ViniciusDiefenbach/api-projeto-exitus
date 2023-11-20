import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { randomUUID } from 'crypto';

export class CreateGuardRelationDto {
  @ApiProperty({
    example: randomUUID(),
    description: 'The id of a guarded (student)',
  })
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  guarded_id: string;

  @ApiProperty({
    example: randomUUID(),
    description: 'The id of a guardian (parent)',
  })
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  guardian_id: string;
}
