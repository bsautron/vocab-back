import { Test, TestingModule } from '@nestjs/testing';
import { SentenceResolver } from './sentence.resolver';

describe('SentenceResolver', () => {
  let resolver: SentenceResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SentenceResolver],
    }).compile();

    resolver = module.get<SentenceResolver>(SentenceResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
