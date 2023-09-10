import { IsInt, IsNumber, IsOptional, IsPositive, IsString, IsUUID } from "class-validator";

export class FindAllUserRoleRelationDto {
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
  user?: string;
  
  @IsOptional()
  @IsString()
  @IsUUID()
  role?: string;
}
