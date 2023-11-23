import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';

export class PaginationDto {
  @ApiProperty({
    example: 0,
    description: 'The page number to paginate the results',
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  page: number = 0;

  @ApiProperty({
    example: 8,
    description: 'The number of results per page',
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  limit: number = 8;

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
