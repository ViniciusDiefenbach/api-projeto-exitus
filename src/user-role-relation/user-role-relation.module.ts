import { Module } from '@nestjs/common';
import { UserRoleRelationService } from './user-role-relation.service';
import { UserRoleRelationController } from './user-role-relation.controller';

@Module({
  controllers: [UserRoleRelationController],
  providers: [UserRoleRelationService],
})
export class UserRoleRelationModule {}
