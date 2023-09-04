import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { UserRoleRelationModule } from './user-role-relation/user-role-relation.module';

@Module({
  imports: [PrismaModule, UserModule, RoleModule, UserRoleRelationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
