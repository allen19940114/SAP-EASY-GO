import { Module } from '@nestjs/common';
import { DocumentService } from './document.service';
import { DocumentController } from './document.controller';
import { ParserService } from './parser.service';
import { EmbeddingService } from './embedding.service';
import { VectorStoreService } from './vectorstore.service';
import { RAGService } from './rag.service';
import { RAGController } from './rag.controller';
import { PrismaModule } from '../../shared/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [DocumentController, RAGController],
  providers: [
    DocumentService,
    ParserService,
    EmbeddingService,
    VectorStoreService,
    RAGService,
  ],
  exports: [RAGService, DocumentService],
})
export class RAGModule {}
