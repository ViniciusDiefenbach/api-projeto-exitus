import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from '../prisma/prisma.module';
import { UserModule } from '../user/user.module';
import { RoleModule } from '../role/role.module';
import { UserRoleRelationModule } from '../user-role-relation/user-role-relation.module';
import { GuardRelationModule } from '../guard-relation/guard-relation.module';
import { RegisterModule } from '../register/register.module';
import { EarlyExitModule } from '../early-exit/early-exit.module';
import { AuthModule } from '../auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '../auth/auth.guard';
import { EarlyExitService } from '@/early-exit/early-exit.service';
import { RegisterService } from '@/register/register.service';

@Module({
  imports: [
    PrismaModule,
    UserModule,
    RoleModule,
    UserRoleRelationModule,
    GuardRelationModule,
    RegisterModule,
    EarlyExitModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    EarlyExitService,
    RegisterService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
