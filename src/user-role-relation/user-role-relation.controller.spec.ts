import { Test, TestingModule } from '@nestjs/testing';
import { UserRoleRelationController } from './user-role-relation.controller';
import { UserRoleRelationService } from './user-role-relation.service';

describe('UserRoleRelationController', () => {
  let controller: UserRoleRelationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserRoleRelationController],
      providers: [UserRoleRelationService],
    }).compile();

    controller = module.get<UserRoleRelationController>(
      UserRoleRelationController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
