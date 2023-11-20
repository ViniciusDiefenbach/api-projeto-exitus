import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class FindAllUserDto {
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
    example: 'true',
    description: 'The status of the user to filter the results',
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => {
    switch (value) {
      case 'true':
        return true;
      case 'True':
        return true;
      case 'false':
        return false;
      case 'False':
        return false;
      default:
        return undefined;
    }
  })
  active?: boolean;

  @ApiProperty({
    example: 'John Doe',
    description: 'The name of the user to filter the results',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(5)
  name?: string;

  @ApiProperty({
    example: 'mail@mail.com',
    description: 'The email of the user to filter the results',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(5)
  @MaxLength(256)
  @IsEmail()
  email?: string;

  @ApiProperty({
    example: '123456789',
    description: 'The enrollment of the user to filter the results',
    required: false,
  })
  @IsOptional()
  @IsString()
  enrollment?: string;

  @ApiProperty({
    example: 'MORNING',
    description: 'The shift of the user to filter the results',
    enum: ['MORNING', 'AFTERNOON', 'NIGHT'],
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsEnum(['MORNING', 'AFTERNOON', 'NIGHT'])
  shift?: 'MORNING' | 'AFTERNOON' | 'NIGHT';
}
