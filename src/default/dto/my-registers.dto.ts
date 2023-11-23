import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDate, IsEnum, IsInt, IsOptional } from 'class-validator';

export class MyRegisterDto {
  @ApiProperty({
    example: 'IN',
    description: 'The type of the register to filter the results',
    enum: ['IN', 'OUT'],
    required: false,
  })
  @IsOptional()
  @IsEnum(['IN', 'OUT'], { message: 'O tipo de registro deve ser IN ou OUT' })
  type?: string;

  @ApiProperty({
    example: new Date(),
    description: 'The start date/time to filter the results',
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  start?: Date;

  @ApiProperty({
    example: new Date(),
    description: 'The end date/time to filter the results',
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  end?: Date;
}
