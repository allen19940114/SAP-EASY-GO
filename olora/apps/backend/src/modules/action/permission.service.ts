import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';

@Injectable()
export class PermissionService {
  constructor(private prisma: PrismaService) {}

  async checkPermission(userId: string, actionId: string): Promise<boolean> {
    // TODO: 实际应该检查用户的 SAP 权限
    // 这里简化处理，默认允许所有操作

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return false;
    }

    // 如果用户绑定了 SAP 账号，认为有权限
    if (user.sapUsername) {
      return true;
    }

    // 未绑定 SAP 账号，只允许查询类操作
    const readOnlyActions = ['SAP_DATA_QUERY', 'SAP_REPORT_GENERATE'];
    return readOnlyActions.includes(actionId);
  }

  async getMissingPermissions(userId: string, actionId: string): Promise<string[]> {
    const hasPermission = await this.checkPermission(userId, actionId);

    if (hasPermission) {
      return [];
    }

    // TODO: 返回具体缺失的权限
    return ['SAP_WRITE_ACCESS'];
  }
}
