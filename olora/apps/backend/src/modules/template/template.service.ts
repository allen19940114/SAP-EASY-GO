import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { CreateTemplateDto } from './dto/create-template.dto';

@Injectable()
export class TemplateService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateTemplateDto) {
    return this.prisma.reportTemplate.create({
      data: {
        userId,
        name: dto.name,
        description: dto.description,
        fields: dto.fields,
        parameters: dto.parameters,
        sapTable: dto.sapTable,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.reportTemplate.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    return this.prisma.reportTemplate.findFirst({
      where: { id, userId },
    });
  }

  async update(id: string, userId: string, dto: Partial<CreateTemplateDto>) {
    return this.prisma.reportTemplate.update({
      where: { id },
      data: dto,
    });
  }

  async delete(id: string, userId: string) {
    return this.prisma.reportTemplate.delete({
      where: { id },
    });
  }

  async execute(id: string, userId: string, params: Record<string, any>) {
    const template = await this.findOne(id, userId);
    if (!template) {
      throw new Error('Template not found');
    }

    // TODO: 实际调用 SAP API 获取数据
    const mockData = this.generateMockData(template.fields as any[], params);

    return {
      templateId: id,
      templateName: template.name,
      executedAt: new Date(),
      parameters: params,
      data: mockData,
    };
  }

  private generateMockData(fields: any[], params: Record<string, any>): any[] {
    // 生成模拟数据
    return Array.from({ length: 10 }, (_, i) => {
      const row: any = {};
      fields.forEach((field) => {
        switch (field.type) {
          case 'string':
            row[field.name] = `Value ${i + 1}`;
            break;
          case 'number':
            row[field.name] = Math.floor(Math.random() * 1000000);
            break;
          case 'date':
            row[field.name] = new Date().toISOString();
            break;
          case 'boolean':
            row[field.name] = Math.random() > 0.5;
            break;
        }
      });
      return row;
    });
  }
}
