import { RoleType } from "@prisma/client";
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class LoginDto {
    @IsString()
    @IsOptional()
    @IsEnum([RoleType.ADMIN, RoleType.EMPLOYEE, RoleType.GUARDED, RoleType.GUARDIAN])
    role?: string;

    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}