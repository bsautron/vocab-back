import { Test, TestingModule } from '@nestjs/testing';
import { ReversoApiService } from './reverso-api.service';

describe('ReversoApiService', () => {
  let service: ReversoApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReversoApiService],
    }).compile();

    service = module.get<ReversoApiService>(ReversoApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
