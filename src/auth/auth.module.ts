import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import jwt from '../../config/jwt.json';

@Module({
  imports: [
    JwtModule.register({
      secret: jwt,
    }),
  ],
  providers: [AuthService],
})
export class AuthModule {}
