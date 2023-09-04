import { UserDto } from './user.dto';

export type ObjUUID = {
  id: string;
};

export class CreateUserDto extends UserDto {
  guardeds?: Array<ObjUUID>;
  roles?: Array<ObjUUID>;
}
