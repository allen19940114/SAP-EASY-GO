export interface LLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface LLMResponse {
  content: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export abstract class BaseLLMProvider {
  abstract chat(messages: LLMMessage[]): Promise<LLMResponse>;
  abstract stream(messages: LLMMessage[]): AsyncIterableIterator<string>;
}
