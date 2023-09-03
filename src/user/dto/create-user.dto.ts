import { UserDto } from './user.dto';

type Guardeds = {
  id: string;
};

export class CreateUserDto extends UserDto {
  guardeds?: Array<Guardeds>;
}
