import { Module } from '@nestjs/common';
import { SentenceService } from './sentence.service';
import { SentenceResolver } from './sentence.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sentence } from './sentence.entity';
import { UserModule } from '../user/user.module';
import { CategoryModule } from '../category/category.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Sentence]),
    CategoryModule,
    UserModule
  ],
  providers: [SentenceService, SentenceResolver]
})
export class SentenceModule { }
