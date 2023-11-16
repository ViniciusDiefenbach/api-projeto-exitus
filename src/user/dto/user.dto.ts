import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { randomUUID } from 'crypto';

export class UserDto {
  @IsOptional()
  @IsBoolean()
  active: boolean = true;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @MinLength(5)
  name: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @MaxLength(256)
  @MinLength(5)
  email: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  password?: string;

  @IsOptional()
  @IsString()
  fingerprint: string;

  @IsOptional()
  @IsString()
  enrollment?: string;

  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  birth?: Date;

  @IsOptional()
  @IsString()
  @IsEnum(['MORNING', 'AFTERNOON', 'NIGHT'])
  shift?: 'MORNING' | 'AFTERNOON' | 'NIGHT';
}
