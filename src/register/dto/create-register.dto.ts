import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { randomUUID } from 'crypto';

export class CreateRegisterDto {
  @ApiProperty({
    example: randomUUID(),
    description: 'The id of a user',
  })
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  user_id: string;

  @ApiProperty({
    example: 'IN',
    description:
      'The type of the register (Optional - Default: aplly logic to define)',
    required: false,
    enum: ['IN', 'OUT'],
  })
  @IsOptional()
  @IsString()
  @IsEnum(['IN', 'OUT'])
  register_type?: 'IN' | 'OUT';

  @ApiProperty({
    example: new Date(),
    description: 'The time of the register (Optional - Default: now)',
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  time?: Date = new Date();
}
