import { Injectable } from '@nestjs/common';
import { PIIDetectorService, PIIMatch } from './pii-detector.service';
import { RedisService } from './redis.service';

export interface SanitizeResult {
  sanitizedText: string;
  mappingId: string;
}

@Injectable()
export class SanitizerService {
  constructor(
    private piiDetector: PIIDetectorService,
    private redis: RedisService,
  ) {}

  async sanitize(text: string, userId: string): Promise<SanitizeResult> {
    const piiMatches = this.piiDetector.detectPII(text);

    if (piiMatches.length === 0) {
      return { sanitizedText: text, mappingId: '' };
    }

    // 生成映射 ID
    const mappingId = `pii:${userId}:${Date.now()}`;

    // 替换文本
    let sanitizedText = text;
    const mapping: Record<string, string> = {};

    // 从后往前替换，避免索引偏移
    for (let i = piiMatches.length - 1; i >= 0; i--) {
      const match = piiMatches[i];
      sanitizedText =
        sanitizedText.slice(0, match.start) +
        match.placeholder +
        sanitizedText.slice(match.end);
      mapping[match.placeholder] = match.value;
    }

    // 存储映射到 Redis (TTL 1小时)
    await this.redis.set(mappingId, JSON.stringify(mapping), 3600);

    console.log(`🔒 Sanitized: ${piiMatches.length} PII items, mapping: ${mappingId}`);

    return { sanitizedText, mappingId };
  }
}
