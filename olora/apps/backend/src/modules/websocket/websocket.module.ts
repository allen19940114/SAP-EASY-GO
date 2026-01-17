import { Module } from '@nestjs/common';
import { ChatGateway } from './websocket.gateway';
import { LLMModule } from '../llm/llm.module';
import { ChatModule } from '../chat/chat.module';

@Module({
  imports: [LLMModule, ChatModule],
  providers: [ChatGateway],
})
export class WebSocketModule {}
