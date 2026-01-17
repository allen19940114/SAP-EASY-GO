import { Injectable } from '@nestjs/common';
import { BaseLLMProvider, LLMMessage, LLMResponse } from './base.provider';

@Injectable()
export class GeminiProvider extends BaseLLMProvider {
  private apiKey: string;
  private baseURL: string;

  constructor() {
    super();
    this.apiKey = process.env.GEMINI_API_KEY;
    this.baseURL = process.env.GEMINI_BASE_URL || 'https://generativelanguage.googleapis.com/v1beta';
  }

  async chat(messages: LLMMessage[]): Promise<LLMResponse> {
    const model = process.env.GEMINI_MODEL || 'gemini-1.5-pro';
    const url = `${this.baseURL}/models/${model}:generateContent?key=${this.apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: messages.map(msg => ({ role: msg.role === 'assistant' ? 'model' : 'user', parts: [{ text: msg.content }] })),
      }),
    });

    const data = await response.json();
    return {
      content: data.candidates[0].content.parts[0].text,
      usage: data.usageMetadata,
    };
  }

  async *stream(messages: LLMMessage[]) {
    const model = process.env.GEMINI_MODEL || 'gemini-1.5-pro';
    const url = `${this.baseURL}/models/${model}:streamGenerateContent?key=${this.apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: messages.map(msg => ({ role: msg.role === 'assistant' ? 'model' : 'user', parts: [{ text: msg.content }] })),
      }),
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      yield decoder.decode(value);
    }
  }
}
