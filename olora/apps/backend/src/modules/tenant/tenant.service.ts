import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';

export interface CreateTenantDto {
  name: string;
  code: string;
  tier: 'basic' | 'standard' | 'premium' | 'enterprise';
}

@Injectable()
export class TenantService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateTenantDto) {
    return this.prisma.tenant.create({
      data: {
        name: dto.name,
        code: dto.code,
        subscriptionTier: dto.tier,
      },
    });
  }

  async findAll() {
    return this.prisma.tenant.findMany({
      include: {
        subscriptions: true,
      },
    });
  }

  async subscribe(tenantId: string, actionId: string) {
    return this.prisma.interfaceSubscription.create({
      data: {
        tenantId,
        actionId,
      },
    });
  }

  async unsubscribe(tenantId: string, actionId: string) {
    const subscription = await this.prisma.interfaceSubscription.findFirst({
      where: { tenantId, actionId },
    });

    if (!subscription) {
      throw new Error('Subscription not found');
    }

    return this.prisma.interfaceSubscription.delete({
      where: { id: subscription.id },
    });
  }

  async hasAccess(tenantId: string, actionId: string): Promise<boolean> {
    const subscription = await this.prisma.interfaceSubscription.findFirst({
      where: {
        tenantId,
        actionId,
      },
    });

    return !!subscription;
  }
}
