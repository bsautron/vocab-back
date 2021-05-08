import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { GraphQLModule } from '@nestjs/graphql';
import { WordModule } from './word/word.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    GraphQLModule.forRoot({
      autoSchemaFile: true,
      sortSchema: true,
    }),
    WordModule,

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
