import { Test, TestingModule } from '@nestjs/testing';
import { GuardRelationController } from './guard-relation.controller';
import { GuardRelationService } from './guard-relation.service';

describe('GuardRelationController', () => {
  let controller: GuardRelationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GuardRelationController],
      providers: [GuardRelationService],
    }).compile();

    controller = module.get<GuardRelationController>(GuardRelationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
