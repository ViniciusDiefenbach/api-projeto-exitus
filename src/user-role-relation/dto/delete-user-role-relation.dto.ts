import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { randomUUID } from 'crypto';

export class DeleteUserRoleRelationDto {
  @ApiProperty({
    example: randomUUID(),
    description: 'The id of a user',
  })
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  user: string;

  @ApiProperty({
    example: randomUUID(),
    description: 'The id of a role',
  })
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  role: string;
}
