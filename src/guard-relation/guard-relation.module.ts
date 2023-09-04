import { Module } from '@nestjs/common';
import { GuardRelationService } from './guard-relation.service';
import { GuardRelationController } from './guard-relation.controller';

@Module({
  controllers: [GuardRelationController],
  providers: [GuardRelationService],
})
export class GuardRelationModule {}
