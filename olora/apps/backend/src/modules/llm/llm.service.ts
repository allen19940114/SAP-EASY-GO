import { Injectable } from '@nestjs/common';
import { OpenAIProvider } from './providers/openai.provider';
import { DeepSeekProvider } from './providers/deepseek.provider';
import { GeminiProvider } from './providers/gemini.provider';
import { BaseLLMProvider, LLMMessage } from './providers/base.provider';

@Injectable()
export class LLMService {
  private providers: Map<string, BaseLLMProvider>;

  constructor(
    private openai: OpenAIProvider,
    private deepseek: DeepSeekProvider,
    private gemini: GeminiProvider,
  ) {
    this.providers = new Map([
      ['openai', openai],
      ['deepseek', deepseek],
      ['gemini', gemini],
    ]);
  }

  getProvider(name?: string): BaseLLMProvider {
    const providerName = name || process.env.LLM_PROVIDER || 'openai';
    return this.providers.get(providerName);
  }

  async chat(messages: LLMMessage[], provider?: string) {
    return this.getProvider(provider).chat(messages);
  }

  stream(messages: LLMMessage[], provider?: string) {
    return this.getProvider(provider).stream(messages);
  }
}
