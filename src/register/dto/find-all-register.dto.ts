import { Transform } from 'class-transformer';
import {
  IsDate,
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsUUID,
} from 'class-validator';

export class FindAllRegisterDto {
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  page: number = 0;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  limit: number = 8;

  @IsOptional()
  @IsEnum(['IN', 'OUT'])
  register_type?: string;

  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  start_time?: Date;

  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  end_time?: Date;

  @IsOptional()
  @IsUUID()
  user_id?: string;
}
