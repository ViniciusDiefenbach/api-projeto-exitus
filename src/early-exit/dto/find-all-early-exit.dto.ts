import { Transform } from 'class-transformer';
import {
  IsDate,
  IsDateString,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsUUID,
} from 'class-validator';

export class FindAllEarlyExitDto {
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  page: number = 0;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  limit: number = 8;

  @IsOptional()
  @IsUUID()
  guarded_id?: string;

  @IsOptional()
  @IsUUID()
  guardian_id?: string;

  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  start_at?: Date;

  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  end_at?: Date;

  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  start_time?: Date = new Date('1970-01-01T00:00:00.000');

  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  end_time?: Date = new Date('1970-01-01T23:59:59.999');
}
