import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ChatService } from './chat.service';

@ApiTags('Chat')
@Controller('chat')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Post('sessions')
  createSession(@Request() req, @Body() body: { title?: string }) {
    return this.chatService.createSession(req.user.id, body.title);
  }

  @Get('sessions')
  getSessions(@Request() req) {
    return this.chatService.getSessions(req.user.id);
  }

  @Get('sessions/:id/messages')
  getMessages(@Param('id') id: string) {
    return this.chatService.getMessages(id);
  }

  @Post('sessions/:id/messages')
  sendMessage(@Param('id') id: string, @Body() body: { content: string }) {
    return this.chatService.sendMessage(id, 'user', body.content);
  }
}
