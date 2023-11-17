import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { randomUUID } from 'crypto';

export class CreateEarlyExitDto {
  @ApiProperty({
    example: '2021-09-01T00:00:00.000Z',
    description: 'The start date of the early exit',
  })
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  start_at: Date = new Date();

  @ApiProperty({
    example: '2022-09-01T00:00:00.000Z',
    description: 'The end date of the early exit',
  })
  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  end_at: Date;

  @ApiProperty({
    example: new Date().toISOString(),
    description:
      'The time of the early exit. In this property, the important is the time (hh:mm:ss), the rest will be ignored',
  })
  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  time: Date;

  @ApiProperty({
    example: randomUUID(),
    description: 'The id of the guarded (student)',
  })
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  guarded_id: string;

  @ApiProperty({
    example: randomUUID(),
    description: 'The id of the guardian (parent)',
  })
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  guardian_id: string;
}
