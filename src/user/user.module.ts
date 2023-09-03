import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { BcryptModule } from '@/bcrypt/bcrypt.module';

@Module({
  imports: [BcryptModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
