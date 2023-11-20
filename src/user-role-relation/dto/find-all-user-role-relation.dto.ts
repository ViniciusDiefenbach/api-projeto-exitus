import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsString, IsUUID } from 'class-validator';
import { randomUUID } from 'crypto';

export class FindAllUserRoleRelationDto {
  @ApiProperty({
    example: 0,
    description: 'The page number to paginate the results',
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  page?: number = 0;

  @ApiProperty({
    example: 10,
    description: 'The number of results to return',
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  limit?: number = 8;

  @ApiProperty({
    example: randomUUID(),
    description: 'The id of a user to help filter the results',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsUUID()
  user?: string;

  @ApiProperty({
    example: randomUUID(),
    description: 'The id of a role to help filter the results',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsUUID()
  role?: string;
}
