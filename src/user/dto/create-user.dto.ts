import { IsArray, IsOptional } from 'class-validator';
import { UserDto } from './user.dto';

export type ObjUUID = {
  id: string;
};

export class CreateUserDto extends UserDto {
  @IsOptional()
  @IsArray()
  guardeds?: Array<ObjUUID>;

  @IsOptional()
  @IsArray()
  roles?: Array<ObjUUID>;
}
