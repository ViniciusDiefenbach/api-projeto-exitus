import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class RefreshTokenDto {
    @IsString()
    @IsNotEmpty()
    @IsUUID()
    refresh_token: string;
}