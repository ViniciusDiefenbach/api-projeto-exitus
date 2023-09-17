import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CreateUserRoleRelationDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  user_id: string;
  
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  role_id: string;
}
