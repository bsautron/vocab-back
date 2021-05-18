import { Module } from '@nestjs/common';
import { ReversoApiService } from './reverso-api.service';

@Module({
  providers: [ReversoApiService],
  exports: [ReversoApiService]
})
export class ReversoApiModule { }
