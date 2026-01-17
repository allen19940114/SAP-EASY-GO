import { Injectable } from '@nestjs/common';
import { RedisService } from './redis.service';

@Injectable()
export class RestorerService {
  constructor(private redis: RedisService) {}

  async restore(text: string, mappingId: string): Promise<string> {
    if (!mappingId) {
      return text;
    }

    const mappingStr = await this.redis.get(mappingId);
    if (!mappingStr) {
      console.warn(`⚠️  Mapping not found: ${mappingId}`);
      return text;
    }

    const mapping: Record<string, string> = JSON.parse(mappingStr);

    let restoredText = text;
    for (const [placeholder, value] of Object.entries(mapping)) {
      restoredText = restoredText.replaceAll(placeholder, value);
    }

    console.log(`🔓 Restored: ${Object.keys(mapping).length} PII items`);

    return restoredText;
  }
}
