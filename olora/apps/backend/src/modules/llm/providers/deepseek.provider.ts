import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { BaseLLMProvider, LLMMessage, LLMResponse } from './base.provider';

@Injectable()
export class DeepSeekProvider extends BaseLLMProvider {
  private client: OpenAI;

  constructor() {
    super();
    this.client = new OpenAI({
      apiKey: process.env.DEEPSEEK_API_KEY,
      baseURL: process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com/v1',
    });
  }

  async chat(messages: LLMMessage[]): Promise<LLMResponse> {
    const response = await this.client.chat.completions.create({
      model: process.env.DEEPSEEK_MODEL || 'deepseek-chat',
      messages,
    });

    return {
      content: response.choices[0].message.content,
      usage: response.usage,
    };
  }

  async *stream(messages: LLMMessage[]) {
    const stream = await this.client.chat.completions.create({
      model: process.env.DEEPSEEK_MODEL || 'deepseek-chat',
      messages,
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) yield content;
    }
  }
}
