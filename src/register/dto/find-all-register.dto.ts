import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsDate,
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { randomUUID } from 'crypto';

export class FindAllRegisterDto {
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
    example: 'IN',
    description: 'The type of the register to filter the results',
    enum: ['IN', 'OUT'],
    required: false,
  })
  @IsOptional()
  @IsEnum(['IN', 'OUT'])
  register_type?: string;

  @ApiProperty({
    example: new Date(),
    description: 'The start date/time to filter the results',
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  start_time?: Date;

  @ApiProperty({
    example: new Date(),
    description: 'The end date/time to filter the results',
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  end_time?: Date;

  @ApiProperty({
    example: randomUUID(),
    description: 'The id of a user to help filter the results',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  user_id?: string;

  @ApiProperty({
    example: 'asc',
    description: 'The order to sort the results',
    enum: ['asc', 'desc'],
    required: false,
  })
  @IsOptional()
  @IsEnum(['asc', 'desc'])
  sort?: 'asc' | 'desc' = 'asc';
}
