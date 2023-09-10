import { Test, TestingModule } from '@nestjs/testing';
import { EarlyExitController } from './early-exit.controller';
import { EarlyExitService } from './early-exit.service';

describe('EarlyExitController', () => {
  let controller: EarlyExitController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EarlyExitController],
      providers: [EarlyExitService],
    }).compile();

    controller = module.get<EarlyExitController>(EarlyExitController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
