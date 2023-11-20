import { IsArray, IsOptional } from 'class-validator';
import { UserDto } from './user.dto';
import { ApiProperty } from '@nestjs/swagger';
import { randomUUID } from 'crypto';

export type ObjUUID = {
  id: string;
};

export class CreateUserDto extends UserDto {
  @ApiProperty({
    example: [{ id: randomUUID() }],
    description: 'The id of a guarded to create the user with',
    required: false,
  })
  @IsOptional()
  @IsArray()
  guardeds?: Array<ObjUUID>;

  @ApiProperty({
    example: [{ id: randomUUID() }],
    description: 'The id of a role to create the user with',
    required: false,
  })
  @IsOptional()
  @IsArray()
  roles?: Array<ObjUUID>;
}
