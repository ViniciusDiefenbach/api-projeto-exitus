import { Test, TestingModule } from '@nestjs/testing';
import { EarlyExitService } from './early-exit.service';

describe('EarlyExitService', () => {
  let service: EarlyExitService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EarlyExitService],
    }).compile();

    service = module.get<EarlyExitService>(EarlyExitService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
