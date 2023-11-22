import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsNumberString, IsOptional, IsPositive } from 'class-validator';

export class PaginationDto {
  @ApiProperty({
    example: 0,
    description: 'The page number to paginate the results',
    required: false,
  })
  @IsOptional()
  @IsNumberString()
  page: string = '0';

  @ApiProperty({
    example: 8,
    description: 'The number of results per page',
    required: false,
  })
  @IsOptional()
  @IsNumberString()
  limit: string = '8';
}