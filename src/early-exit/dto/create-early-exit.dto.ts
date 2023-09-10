import { Transform } from "class-transformer";
import { IsDate, IsDateString, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateEarlyExitDto {
    @IsOptional()
    @Transform(({ value }) => new Date(value))
    @IsDate()
    start_at: Date = new Date();

    @IsNotEmpty()
    @Transform(({ value }) => new Date(value))
    @IsDate()
    end_at: Date;

    @IsNotEmpty()
    @Transform(({ value }) => new Date(value))
    @IsDate()
    time: Date;

    @IsNotEmpty()
    @IsString()
    @IsUUID()
    guarded_id: string;

    @IsNotEmpty()
    @IsString()
    @IsUUID()
    guardian_id: string;
}
