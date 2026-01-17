import { Injectable } from '@nestjs/common';
import { IntentResult, IntentType } from '../../shared/types/intent.types';

export interface ActionPlan {
  actionId: string;
  actionName: string;
  payload: Record<string, any>;
  description: string;
}

@Injectable()
export class PlannerService {
  generateActionPlan(intent: IntentResult): ActionPlan | null {
    if (intent.intent === IntentType.GENERAL_CHAT) {
      return null;
    }

    const payload: Record<string, any> = {};
    intent.parameters.forEach((param) => {
      payload[param.name] = param.value;
    });

    const actionMap: Record<IntentType, { id: string; name: string }> = {
      [IntentType.REPORT_TEMPLATE_RUN]: {
        id: 'SAP_REPORT_GENERATE',
        name: '生成 SAP 报表',
      },
      [IntentType.DATA_QUERY]: {
        id: 'SAP_DATA_QUERY',
        name: '查询 SAP 数据',
      },
      [IntentType.DATA_UPDATE]: {
        id: 'SAP_DATA_UPDATE',
        name: '更新 SAP 数据',
      },
      [IntentType.PROJECT_CREATE]: {
        id: 'SAP_PROJECT_CREATE',
        name: '创建 SAP 项目',
      },
      [IntentType.WBS_CREATE]: {
        id: 'SAP_WBS_CREATE',
        name: '创建 WBS 元素',
      },
      [IntentType.BUDGET_UPDATE]: {
        id: 'SAP_BUDGET_UPDATE',
        name: '更新项目预算',
      },
      [IntentType.GENERAL_CHAT]: {
        id: '',
        name: '',
      },
    };

    const action = actionMap[intent.intent];

    return {
      actionId: action.id,
      actionName: action.name,
      payload,
      description: `执行 ${action.name}，参数: ${JSON.stringify(payload, null, 2)}`,
    };
  }

  formatConfirmationMessage(intent: IntentResult, plan: ActionPlan): string {
    if (intent.missingParameters.length > 0) {
      return `为了完成操作，还需要以下信息:\n${intent.missingParameters.map((p) => `- ${p}`).join('\n')}\n\n请提供缺失的参数。`;
    }

    return `确认执行以下操作:\n\n**操作名称**: ${plan.actionName}\n**参数**:\n${Object.entries(plan.payload)
      .map(([key, value]) => `- ${key}: ${value}`)
      .join('\n')}\n\n请确认是否执行 (回复"确认"或"取消")`;
  }
}
