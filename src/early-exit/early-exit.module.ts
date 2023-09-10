import { Module } from '@nestjs/common';
import { EarlyExitService } from './early-exit.service';
import { EarlyExitController } from './early-exit.controller';

@Module({
  controllers: [EarlyExitController],
  providers: [EarlyExitService],
})
export class EarlyExitModule {}
