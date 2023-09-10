import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { UserRoleRelationModule } from './user-role-relation/user-role-relation.module';
import { GuardRelationModule } from './guard-relation/guard-relation.module';
import { RegisterModule } from './register/register.module';
import { EarlyExitModule } from './early-exit/early-exit.module';

@Module({
  imports: [
    PrismaModule,
    UserModule,
    RoleModule,
    UserRoleRelationModule,
    GuardRelationModule,
    RegisterModule,
    EarlyExitModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
