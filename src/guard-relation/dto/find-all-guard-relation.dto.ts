import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';
import { randomUUID } from 'crypto';

export class FindAllGuardRelationDto {
  @ApiProperty({
    example: 1,
    description: 'The page number to return',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @IsInt()
  @IsPositive()
  page?: number;

  @ApiProperty({
    example: 10,
    description: 'The number of results to return',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @IsInt()
  @IsPositive()
  limit?: number;

  @ApiProperty({
    example: randomUUID(),
    description: 'The id of a guarded (student) to help filter the results',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsUUID()
  guarded?: string;

  @ApiProperty({
    example: randomUUID(),
    description: 'The id of a guardian (parent) to help filter the results',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsUUID()
  guardian?: string;
}
