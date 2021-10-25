import { Module } from '@nestjs/common';
import { SentenceService } from './sentence.service';
import { LinkedSentencesResolver, SentenceResolver } from './sentence.resolver';
import { Sentence } from './sentence.entity';
import { UserModule } from '../user/user.module';
import { CategoryModule } from '../category/category.module';

@Module({
  imports: [
    CategoryModule,
    UserModule
  ],
  providers: [SentenceService, SentenceResolver, LinkedSentencesResolver]
})
export class SentenceModule { }
