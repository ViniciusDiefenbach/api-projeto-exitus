export class FindAllUserDto {
  page?: number;
  limit?: number;
  active?: string;
  name?: string;
  email?: string;
  enrollment?: string;
  shift?: 'MORNING' | 'AFTERNOON' | 'NIGHT';
}
