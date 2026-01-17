import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';

@Injectable()
export class PermissionService {
  constructor(private prisma: PrismaService) {}

  async checkPermission(userId: string, actionId: string): Promise<boolean> {
    // TODO: 实际应该检查用户的 SAP 权限
    // 实现方案:
    // 1. 查询 user_sap_bindings 表获取用户的SAP绑定信息
    // 2. 调用 SAP Authorization API 验证用户权限
    // 3. 查询 actions 表获取该操作需要的permissions列表
    // 4. 验证用户是否拥有所有必需的SAP权限对象
    // 5. 实现权限缓存以提高性能

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        sapBindings: {
          where: { isActive: true },
        },
      },
    });

    if (!user || !user.isActive) {
      return false;
    }

    // 检查用户是否绑定了 SAP 账号
    if (user.sapBindings && user.sapBindings.length > 0) {
      // TODO: 调用 SAP API 验证用户权限
      // 示例: sapClient.checkAuthorization(user.sapBindings[0].sapUsername, actionId)
      console.log(`[DEMO MODE] 权限检查通过 - 用户 ${userId} 有SAP绑定`);
      console.warn('⚠️ 当前简化处理，生产环境需调用真实SAP权限API');
      return true;
    }

    // 未绑定 SAP 账号，只允许只读操作
    const readOnlyActions = ['SAP_DATA_QUERY', 'SAP_REPORT_GENERATE'];
    return readOnlyActions.includes(actionId);
  }

  async getMissingPermissions(userId: string, actionId: string): Promise<string[]> {
    const hasPermission = await this.checkPermission(userId, actionId);

    if (hasPermission) {
      return [];
    }

    // TODO: 返回具体缺失的权限
    // 实现方案:
    // 1. 从 actions 表查询该操作需要的所有权限
    // 2. 从 SAP API 查询用户当前拥有的权限
    // 3. 计算差集，返回缺失的具体权限列表
    const action = await this.prisma.action.findUnique({
      where: { id: actionId },
      select: { permissions: true },
    });

    if (action && action.permissions && action.permissions.length > 0) {
      // 返回该操作需要的所有权限（演示模式）
      console.log(`[DEMO MODE] 缺失权限: ${action.permissions.join(', ')}`);
      console.warn('⚠️ 生产环境需要与SAP API交互获取用户实际权限');
      return action.permissions;
    }

    return ['SAP_WRITE_ACCESS']; // 默认返回写权限
  }
}
