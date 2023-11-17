import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { randomUUID } from 'crypto';

export class RefreshTokenDto {
  @ApiProperty({
    example: randomUUID(),
    description: 'The refresh token of the user',
  })
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  refresh_token: string;
}
