import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';

export interface AuditLogEntry {
  userId: string;
  action: string;
  resource?: string;
  details?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async log(entry: AuditLogEntry) {
    return this.prisma.auditLog.create({
      data: {
        userId: entry.userId,
        action: entry.action,
        resource: entry.resource,
        details: entry.details || {},
        ipAddress: entry.ipAddress,
        userAgent: entry.userAgent,
      },
    });
  }

  async query(filters: {
    userId?: string;
    action?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
  }) {
    const where: any = {};

    if (filters.userId) {
      where.userId = filters.userId;
    }

    if (filters.action) {
      where.action = filters.action;
    }

    if (filters.startDate || filters.endDate) {
      where.createdAt = {};
      if (filters.startDate) {
        where.createdAt.gte = filters.startDate;
      }
      if (filters.endDate) {
        where.createdAt.lte = filters.endDate;
      }
    }

    return this.prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: filters.limit || 100,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });
  }
}
