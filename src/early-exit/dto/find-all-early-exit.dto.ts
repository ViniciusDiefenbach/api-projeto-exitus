import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDate, IsInt, IsOptional, IsUUID } from 'class-validator';
import { randomUUID } from 'crypto';

export class FindAllEarlyExitDto {
  @ApiProperty({
    example: 0,
    description: 'The page number to paginate the results',
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  page: number = 0;

  @ApiProperty({
    example: 8,
    description: 'The number of results to return',
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  limit: number = 8;

  @ApiProperty({
    example: randomUUID(),
    description: 'The id of a guarded (student) to help filter the results',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  guarded_id?: string;

  @ApiProperty({
    example: randomUUID(),
    description: 'The id of a guardian (parent) to help filter the results',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  guardian_id?: string;

  @ApiProperty({
    example: new Date(),
    description: 'The "early_exit" start date to filter the results',
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  start_at?: Date = new Date('1970-01-01T00:00:00.000Z');

  @ApiProperty({
    example: new Date(),
    description: 'The "early_exit" end date to filter the results',
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  end_at?: Date = new Date('9999-12-31T23:59:59.999Z');

  @ApiProperty({
    example: new Date(),
    description:
      'The "early_exit" start time (only the hours matter) to filter the results',
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  start_time?: Date = new Date('1970-01-01T00:00:00.000Z');

  @ApiProperty({
    example: new Date(),
    description:
      'The "early_exit" end time (only the hours matter) to filter the results',
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  end_time?: Date = new Date('1970-01-01T23:59:00.000Z');
}
