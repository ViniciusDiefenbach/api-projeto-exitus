import { IsInt, IsNumber, IsOptional, IsPositive } from "class-validator";

export class FindAllRegisterDto {
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
}
