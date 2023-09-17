import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CreateGuardRelationDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  guarded_id: string;
  
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  guardian_id: string;
}
