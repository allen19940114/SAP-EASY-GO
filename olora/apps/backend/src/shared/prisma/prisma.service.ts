import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      log: ['error', 'warn'],
      errorFormat: 'pretty',
    });
  }

  async onModuleInit() {
    await this.$connect();
    console.log('✅ Database connected successfully');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    console.log('🔌 Database disconnected');
  }

  async cleanDatabase() {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Cannot clean database in production');
    }

    // Delete all data in reverse order of dependencies
    const models = [
      'auditLog',
      'sensitiveDataMapping',
      'reportExecution',
      'reportTemplate',
      'extensionField',
      'interfaceFieldRule',
      'interfaceSubscription',
      'tenant',
      'actionTemplate',
      'actionExecution',
      'action',
      'knowledgeChunk',
      'knowledgeDocument',
      'message',
      'chatSession',
      'userSapBinding',
      'user',
    ];

    for (const model of models) {
      await this[model].deleteMany();
    }

    console.log('🧹 Database cleaned');
  }
}
