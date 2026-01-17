import { Module } from '@nestjs/common';
import { PIIDetectorService } from './pii-detector.service';
import { SanitizerService } from './sanitizer.service';
import { RestorerService } from './restorer.service';
import { RedisService } from './redis.service';

@Module({
  providers: [PIIDetectorService, SanitizerService, RestorerService, RedisService],
  exports: [SanitizerService, RestorerService],
})
export class SecurityModule {}
