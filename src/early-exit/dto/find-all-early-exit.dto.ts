import { IsInt, IsNumber, IsOptional, IsPositive } from "class-validator";

export class FindAllEarlyExitDto {
    @IsOptional()
    @IsNumber()
    @IsInt()
    @IsPositive()
    page: number = 0;
    
    @IsOptional()
    @IsNumber()
    @IsInt()
    @IsPositive()
    limit: number = 8;
}