import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { randomUUID } from 'crypto';

export class UserDto {
  @ApiProperty({
    example: true,
    description:
      'The status of the user. True if active, false if inactive (optional - default: true)',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  active: boolean = true;

  @ApiProperty({
    example: 'John Doe',
    description: 'The name of the user',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @MinLength(5)
  name: string;

  @ApiProperty({
    example: 'mail@mail.com',
    description: 'The email of the user',
  })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @MaxLength(256)
  @MinLength(5)
  email: string;

  @ApiProperty({
    example: '123456',
    description: 'The password of the user (optional - default: random uuid)',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  password?: string;

  @ApiProperty({
    example: randomUUID(),
    description: 'The fingerprint (identifier) of the user',
  })
  @IsOptional()
  @IsString()
  fingerprint: string;

  @ApiProperty({
    example: '123456',
    description: 'The enrollment of the user (optional - default: random uuid)',
  })
  @IsOptional()
  @IsString()
  enrollment?: string;

  @ApiProperty({
    example: new Date(),
    description: 'The birth of the user',
  })
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  birth?: Date;

  @ApiProperty({
    example: 'MORNING',
    description:
      'The shift of the user (can be MORNING, AFTERNOON, NIGHT or null)',
    enum: ['MORNING', 'AFTERNOON', 'NIGHT'],
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsEnum(['MORNING', 'AFTERNOON', 'NIGHT'])
  shift?: 'MORNING' | 'AFTERNOON' | 'NIGHT';
}
