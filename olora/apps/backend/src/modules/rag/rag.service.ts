import { Injectable } from '@nestjs/common';
import { DocumentService } from './document.service';
import { ParserService } from './parser.service';
import { EmbeddingService } from './embedding.service';
import { VectorStoreService } from './vectorstore.service';
import { PrismaService } from '../../shared/prisma/prisma.service';

@Injectable()
export class RAGService {
  constructor(
    private documentService: DocumentService,
    private parserService: ParserService,
    private embeddingService: EmbeddingService,
    private vectorStore: VectorStoreService,
    private prisma: PrismaService,
  ) {}

  async processDocument(documentId: string) {
    try {
      const doc = await this.prisma.knowledgeDocument.findUnique({
        where: { id: documentId },
      });

      if (!doc) {
        throw new Error('Document not found');
      }

      // 更新状态为处理中
      await this.documentService.updateDocumentStatus(documentId, 'processing');

      // 1. 解析文档
      let text: string;
      switch (doc.fileType) {
        case 'pdf':
          text = await this.parserService.parsePDF(doc.filePath);
          break;
        case 'md':
        case 'txt':
          text = await this.parserService.parseText(doc.filePath);
          break;
        default:
          throw new Error(`Unsupported file type: ${doc.fileType}`);
      }

      // 2. 切片
      const chunks = this.parserService.chunkText(text, 1024, 200);

      // 3. 生成向量
      const embeddings = await this.embeddingService.generateEmbeddings(chunks);

      // 4. 存储到 Qdrant
      await this.vectorStore.upsertVectors(documentId, chunks, embeddings);

      // 5. 更新状态为就绪
      await this.documentService.updateDocumentStatus(documentId, 'ready');

      console.log(`✅ Document ${documentId} processed successfully`);
    } catch (error) {
      console.error(`Failed to process document ${documentId}:`, error);
      await this.documentService.updateDocumentStatus(documentId, 'failed');
      throw error;
    }
  }

  async search(userId: string, query: string, limit = 5) {
    // 1. 生成查询向量
    const queryEmbedding = await this.embeddingService.generateEmbedding(query);

    // 2. 在 Qdrant 中搜索
    const results = await this.vectorStore.search(queryEmbedding, limit);

    // 3. 获取文档元数据
    const documentIds = [...new Set(results.map((r) => r.documentId))];
    const documents = await this.prisma.knowledgeDocument.findMany({
      where: {
        id: { in: documentIds },
        userId,
      },
      select: {
        id: true,
        filename: true,
        fileType: true,
      },
    });

    const docMap = new Map(documents.map((d) => [d.id, d]));

    // 4. 组合结果
    return results.map((r) => ({
      content: r.content,
      score: r.score,
      source: {
        documentId: r.documentId,
        filename: docMap.get(r.documentId)?.filename || 'Unknown',
        chunkIndex: r.chunkIndex,
      },
    }));
  }
}
