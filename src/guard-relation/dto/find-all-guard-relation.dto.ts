import { IsInt, IsNumber, IsOptional, IsPositive, IsString, IsUUID } from "class-validator";

export class FindAllGuardRelationDto {
  @IsOptional()
  @IsNumber()
  @IsInt()
  @IsPositive()
  page?: number;

  @IsOptional()
  @IsNumber()
  @IsInt()
  @IsPositive()
  limit?: number;

  @IsOptional()
  @IsString()
  @IsUUID()
  guarded?: string;

  @IsOptional()
  @IsString()
  @IsUUID()
  guardian?: string;
}
