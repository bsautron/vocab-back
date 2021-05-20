import { Module } from '@nestjs/common';
import { Word } from './word.entity';
import { WordResolver } from './word.resolver';
import { WordService } from './word.service';
import { ReversoApiModule } from '../reverso-api/reverso-api.module';
import { TagModule } from '../tag/tag.module';


@Module({
  imports: [
    ReversoApiModule,
    TagModule
  ],
  providers: [WordResolver, WordService]
})
export class WordModule { }
