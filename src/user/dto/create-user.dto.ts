export class CreateUserDto {
  active?: boolean;
  name: string;
  email: string;
  password?: string;
  fingerprint?: string;
  enrollment?: string;
  birth?: string;
  shift?: 'MORNING' | 'AFTERNOON' | 'NIGHT';
}
