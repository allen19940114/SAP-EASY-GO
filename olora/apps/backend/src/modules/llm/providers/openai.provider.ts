import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { BaseLLMProvider, LLMMessage, LLMResponse } from './base.provider';

@Injectable()
export class OpenAIProvider extends BaseLLMProvider {
  private client: OpenAI;

  constructor() {
    super();
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: process.env.OPENAI_BASE_URL,
    });
  }

  async chat(messages: LLMMessage[]): Promise<LLMResponse> {
    const response = await this.client.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4-turbo-preview',
      messages,
    });

    return {
      content: response.choices[0].message.content,
      usage: response.usage,
    };
  }

  async *stream(messages: LLMMessage[]) {
    const stream = await this.client.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4-turbo-preview',
      messages,
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) yield content;
    }
  }
}
