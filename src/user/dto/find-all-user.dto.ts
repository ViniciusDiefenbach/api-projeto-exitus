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
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  page: number = 0;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  limit: number = 8;

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

  @IsOptional()
  @IsString()
  @MinLength(5)
  name?: string;

  @IsOptional()
  @IsString()
  @MinLength(5)
  @MaxLength(256)
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  enrollment?: string;

  @IsOptional()
  @IsString()
  @IsEnum(['MORNING', 'AFTERNOON', 'NIGHT'])
  shift?: 'MORNING' | 'AFTERNOON' | 'NIGHT';
}
