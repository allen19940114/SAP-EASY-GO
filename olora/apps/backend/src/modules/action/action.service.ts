import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { ValidatorService } from './validator.service';
import { ExecutorService } from './executor.service';
import { PermissionService } from './permission.service';
import { ExecuteActionDto } from './dto/execute-action.dto';

@Injectable()
export class ActionService {
  constructor(
    private prisma: PrismaService,
    private validator: ValidatorService,
    private executor: ExecutorService,
    private permission: PermissionService,
  ) {}

  async executeAction(dto: ExecuteActionDto, userId: string) {
    // 1. 验证参数
    this.validator.validatePayload(dto.actionId, dto.payload);

    // 2. 检查权限
    const hasPermission = await this.permission.checkPermission(userId, dto.actionId);
    if (!hasPermission) {
      throw new Error('Permission denied');
    }

    // 3. 记录 Action 执行
    const execution = await this.prisma.actionExecution.create({
      data: {
        userId,
        sessionId: dto.sessionId,
        actionId: dto.actionId,
        parameters: dto.payload,
        status: 'running',
      },
    });

    // 4. 执行 Action
    const result = await this.executor.execute(dto.actionId, dto.payload, userId);

    // 5. 更新执行记录
    await this.prisma.actionExecution.update({
      where: { id: execution.id },
      data: {
        status: result.success ? 'completed' : 'failed',
        result: result.data,
        error: result.error,
        executedAt: new Date(),
      },
    });

    return {
      executionId: execution.id,
      ...result,
    };
  }

  async getActionHistory(userId: string, limit = 20) {
    return this.prisma.actionExecution.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }
}
