import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { BcryptModule } from '@/bcrypt/bcrypt.module';

@Module({
  imports: [
    BcryptModule,
    JwtModule.register({
      global: true,
      secret: "Teste123",
      signOptions: { expiresIn: '60s' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
