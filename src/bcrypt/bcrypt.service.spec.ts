import { Test, TestingModule } from '@nestjs/testing';
import { BcryptService } from './bcrypt.service';

describe('BcryptService', () => {
  let service: BcryptService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BcryptService],
    }).compile();

    service = module.get<BcryptService>(BcryptService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should generate and compare a hash', async () => {
    // Arrange
    const password = 'Olá mundo';

    // Act
    const hash = await service.hash({ password });

    // Assert
    expect(hash).toBeTruthy();
    expect(hash != password).toBeTruthy();
    expect(await service.compare({ password, hash })).toBeTruthy();
  });

  it("shouldn't compare a hash with a different password", async () => {
    // Arrange
    const password = 'Olá mundo';
    const password2 = 'Olá mundo 2';

    // Act
    const hash = await service.hash({ password });

    // Assert
    expect(hash).toBeTruthy();
    expect(hash != password).toBeTruthy();
    expect(await service.compare({ password: password2, hash })).toBeFalsy();
  });
});
