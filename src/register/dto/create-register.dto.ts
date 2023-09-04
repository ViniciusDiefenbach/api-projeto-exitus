export class CreateRegisterDto {
  user: string;
  regiter_type?: 'IN' | 'OUT';
  time?: string;
}
