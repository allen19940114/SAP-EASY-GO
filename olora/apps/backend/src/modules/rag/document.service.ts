import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { UploadDocumentDto } from './dto/upload-document.dto';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class DocumentService {
  constructor(private prisma: PrismaService) {}

  async uploadDocument(userId: string, file: Express.Multer.File, dto: UploadDocumentDto) {
    // 存储文件到本地
    const uploadDir = path.join(process.cwd(), 'uploads', 'documents');
    await fs.mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, `${Date.now()}-${file.originalname}`);
    await fs.writeFile(filePath, file.buffer);

    // 保存文档元数据到数据库
    const document = await this.prisma.knowledgeDocument.create({
      data: {
        userId,
        filename: dto.filename,
        filePath,
        fileType: dto.type,
        fileSize: file.size,
        description: dto.description || '',
        status: 'pending',
      },
    });

    return document;
  }

  async listDocuments(userId: string) {
    return this.prisma.knowledgeDocument.findMany({
      where: { userId },
      orderBy: { uploadedAt: 'desc' },
      select: {
        id: true,
        filename: true,
        fileType: true,
        fileSize: true,
        description: true,
        status: true,
        uploadedAt: true,
        processedAt: true,
      },
    });
  }

  async getDocument(id: string, userId: string) {
    return this.prisma.knowledgeDocument.findFirst({
      where: { id, userId },
    });
  }

  async deleteDocument(id: string, userId: string) {
    const doc = await this.getDocument(id, userId);
    if (!doc) {
      throw new Error('Document not found');
    }

    // 删除文件
    try {
      await fs.unlink(doc.filePath);
    } catch (err) {
      console.error('Failed to delete file:', err);
    }

    // 删除数据库记录
    await this.prisma.knowledgeDocument.delete({
      where: { id },
    });

    return { message: 'Document deleted successfully' };
  }

  async updateDocumentStatus(id: string, status: string) {
    return this.prisma.knowledgeDocument.update({
      where: { id },
      data: {
        status,
        processedAt: status === 'ready' ? new Date() : undefined,
      },
    });
  }
}
