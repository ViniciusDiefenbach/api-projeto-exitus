import { Test, TestingModule } from '@nestjs/testing';
import { UserRoleRelationService } from './user-role-relation.service';

describe('UserRoleRelationService', () => {
  let service: UserRoleRelationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserRoleRelationService],
    }).compile();

    service = module.get<UserRoleRelationService>(UserRoleRelationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
