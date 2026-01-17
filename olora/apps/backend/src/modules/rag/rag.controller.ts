import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RAGService } from './rag.service';

@Controller('api/knowledge')
@UseGuards(JwtAuthGuard)
export class RAGController {
  constructor(private ragService: RAGService) {}

  @Post('search')
  async search(@Request() req, @Body() body: { query: string; limit?: number }) {
    return this.ragService.search(req.user.userId, body.query, body.limit || 5);
  }

  @Post('process/:id')
  async process(@Body() body: { documentId: string }) {
    return this.ragService.processDocument(body.documentId);
  }
}
