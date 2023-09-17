import { Transform } from "class-transformer";
import { IsDate, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateRegisterDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  user_id: string;

  @IsOptional()
  @IsString()
  @IsEnum(['IN', 'OUT'])
  regiter_type?: 'IN' | 'OUT';

  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  time?: Date = new Date();
}
