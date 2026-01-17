import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { LLMService } from '../llm/llm.service';
import { ChatService } from '../chat/chat.service';

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private llmService: LLMService,
    private chatService: ChatService,
  ) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('chat:message')
  async handleMessage(client: Socket, payload: { sessionId: string; content: string; provider?: string }) {
    // Save user message
    await this.chatService.sendMessage(payload.sessionId, 'user', payload.content);

    // Get chat history
    const messages = await this.chatService.getMessages(payload.sessionId);
    const llmMessages = messages.map((m) => ({ role: m.role as any, content: m.content }));

    // Stream LLM response
    let fullResponse = '';
    const stream = this.llmService.stream(llmMessages, payload.provider);

    for await (const chunk of stream) {
      fullResponse += chunk;
      client.emit('chat:stream', { chunk });
    }

    // Save assistant message
    await this.chatService.sendMessage(payload.sessionId, 'assistant', fullResponse);
    client.emit('chat:complete', { content: fullResponse });
  }
}
