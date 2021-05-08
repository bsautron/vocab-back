import { Test, TestingModule } from '@nestjs/testing';
import { WordResolver } from './word.resolver';

describe('WordResolver', () => {
  let resolver: WordResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WordResolver],
    }).compile();

    resolver = module.get<WordResolver>(WordResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
