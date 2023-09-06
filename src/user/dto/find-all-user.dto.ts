import { Transform } from 'class-transformer';
import {
  IsBooleanString,
  IsEmail,
  IsEnum,
  IsInt,
  IsNumberString,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class FindAllUserDto {
  @IsOptional()
  @IsString()
  @IsNumberString()
  @IsInt()
  @IsPositive()
  page: number = 0;

  @IsOptional()
  @IsString()
  @IsNumberString()
  @IsInt()
  @IsPositive()
  @Min(5)
  limit?: number;

  @IsOptional()
  @IsBooleanString()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return undefined;
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
