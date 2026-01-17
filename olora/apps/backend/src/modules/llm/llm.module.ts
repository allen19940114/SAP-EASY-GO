import { Module } from '@nestjs/common';
import { LLMService } from './llm.service';
import { OpenAIProvider } from './providers/openai.provider';
import { DeepSeekProvider } from './providers/deepseek.provider';
import { GeminiProvider } from './providers/gemini.provider';

@Module({
  providers: [LLMService, OpenAIProvider, DeepSeekProvider, GeminiProvider],
  exports: [LLMService],
})
export class LLMModule {}
