import { Injectable, BadRequestException } from '@nestjs/common';

interface ActionSchema {
  actionId: string;
  requiredParams: string[];
  optionalParams?: string[];
  validators?: Record<string, (value: any) => boolean>;
}

@Injectable()
export class ValidatorService {
  private schemas: Map<string, ActionSchema> = new Map([
    [
      'SAP_REPORT_GENERATE',
      {
        actionId: 'SAP_REPORT_GENERATE',
        requiredParams: ['period', 'company_code'],
        optionalParams: ['profit_center', 'cost_center'],
      },
    ],
    [
      'SAP_PROJECT_CREATE',
      {
        actionId: 'SAP_PROJECT_CREATE',
        requiredParams: ['project_name', 'company_code'],
        optionalParams: ['start_date', 'end_date', 'budget'],
      },
    ],
    [
      'SAP_WBS_CREATE',
      {
        actionId: 'SAP_WBS_CREATE',
        requiredParams: ['project_id', 'wbs_name'],
        optionalParams: ['responsible_person'],
      },
    ],
    [
      'SAP_BUDGET_UPDATE',
      {
        actionId: 'SAP_BUDGET_UPDATE',
        requiredParams: ['project_id', 'amount'],
      },
    ],
  ]);

  validatePayload(actionId: string, payload: Record<string, any>): void {
    const schema = this.schemas.get(actionId);

    if (!schema) {
      throw new BadRequestException(`Unknown action: ${actionId}`);
    }

    // 检查必填参数
    const missing = schema.requiredParams.filter((param) => !payload[param]);
    if (missing.length > 0) {
      throw new BadRequestException(`Missing required parameters: ${missing.join(', ')}`);
    }

    // 自定义验证器
    if (schema.validators) {
      for (const [param, validator] of Object.entries(schema.validators)) {
        if (payload[param] && !validator(payload[param])) {
          throw new BadRequestException(`Invalid value for parameter: ${param}`);
        }
      }
    }
  }
}
