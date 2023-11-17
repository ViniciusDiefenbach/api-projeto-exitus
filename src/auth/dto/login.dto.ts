import { ApiProperty } from '@nestjs/swagger';
import { RoleType } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class LoginDto {
  @ApiProperty({
    enum: RoleType,
    example: 'ADMIN',
    description: 'The role of the user',
    required: false,
  })
  @IsString()
  @IsOptional()
  @IsEnum([
    RoleType.ADMIN,
    RoleType.EMPLOYEE,
    RoleType.GUARDED,
    RoleType.GUARDIAN,
  ])
  role?: string;

  @ApiProperty({
    example: 'admin@mail.com',
    description: 'The email of the user',
  })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '123456',
    description: 'The password of the user',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
