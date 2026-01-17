import { Injectable } from '@nestjs/common';
import { QdrantClient } from '@qdrant/js-client-rest';

@Injectable()
export class VectorStoreService {
  private client: QdrantClient;
  private collectionName = 'olora_knowledge';

  constructor() {
    this.client = new QdrantClient({
      url: process.env.QDRANT_URL || 'http://localhost:6333',
    });
    this.initializeCollection();
  }

  private async initializeCollection() {
    try {
      const collections = await this.client.getCollections();
      const exists = collections.collections.some(
        (c) => c.name === this.collectionName,
      );

      if (!exists) {
        await this.client.createCollection(this.collectionName, {
          vectors: {
            size: 1536, // OpenAI text-embedding-3-small 维度
            distance: 'Cosine',
          },
        });
        console.log(`✅ Qdrant collection "${this.collectionName}" created`);
      }
    } catch (error) {
      console.error('Failed to initialize Qdrant collection:', error);
    }
  }

  async upsertVectors(
    documentId: string,
    chunks: string[],
    embeddings: number[][],
  ) {
    const points = chunks.map((chunk, i) => ({
      id: `${documentId}-${i}`,
      vector: embeddings[i],
      payload: {
        documentId,
        chunkIndex: i,
        content: chunk,
      },
    }));

    await this.client.upsert(this.collectionName, {
      wait: true,
      points,
    });
  }

  async search(queryEmbedding: number[], limit = 5) {
    const result = await this.client.search(this.collectionName, {
      vector: queryEmbedding,
      limit,
      with_payload: true,
    });

    return result.map((hit) => ({
      documentId: hit.payload.documentId,
      chunkIndex: hit.payload.chunkIndex,
      content: hit.payload.content,
      score: hit.score,
    }));
  }

  async deleteDocument(documentId: string) {
    await this.client.delete(this.collectionName, {
      filter: {
        must: [
          {
            key: 'documentId',
            match: { value: documentId },
          },
        ],
      },
    });
  }
}
