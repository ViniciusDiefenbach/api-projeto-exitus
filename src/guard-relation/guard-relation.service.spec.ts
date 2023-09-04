import { Test, TestingModule } from '@nestjs/testing';
import { GuardRelationService } from './guard-relation.service';

describe('GuardRelationService', () => {
  let service: GuardRelationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GuardRelationService],
    }).compile();

    service = module.get<GuardRelationService>(GuardRelationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
