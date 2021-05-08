import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tag } from './tag.entity';
import { Word } from './word.entity';
import { WordResolver } from './word.resolver';
import { WordService } from './word.service';
import { TagResolver } from './tag.resolver';
import { TagService } from './tag.service';


@Module({
  imports: [TypeOrmModule.forFeature([Tag, Word])],
  providers: [WordResolver, WordService, TagResolver, TagService]
})
export class WordModule { }
