import { Injectable } from '@nestjs/common';
import { LLMService } from '../llm/llm.service';
import { IntentType, IntentResult, ExtractedParameter } from '../../shared/types/intent.types';

@Injectable()
export class IntentService {
  constructor(private llmService: LLMService) {}

  async detectIntent(userMessage: string): Promise<IntentResult> {
    const systemPrompt = `你是一个意图识别助手。分析用户消息，识别意图类型和参数。

可用意图类型:
- REPORT_TEMPLATE_RUN: 生成报表
- DATA_QUERY: 查询数据
- DATA_UPDATE: 更新数据
- PROJECT_CREATE: 创建项目
- WBS_CREATE: 创建WBS
- BUDGET_UPDATE: 更新预算
- GENERAL_CHAT: 一般对话

参数示例:
- company_code: 公司代码 (如 "1000")
- period: 期间 (如 "2024-01", "1月")
- profit_center: 利润中心
- project_name: 项目名称
- budget_amount: 预算金额

返回 JSON 格式:
{
  "intent": "REPORT_TEMPLATE_RUN",
  "confidence": 0.95,
  "parameters": [
    { "name": "period", "value": "2024-01", "confidence": 0.9, "required": true }
  ],
  "missingParameters": ["company_code"]
}`;

    const response = await this.llmService.chat([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage },
    ]);

    try {
      const result = JSON.parse(response.content);
      return {
        intent: result.intent as IntentType,
        confidence: result.confidence,
        parameters: result.parameters,
        missingParameters: result.missingParameters || [],
        needsConfirmation: result.missingParameters?.length > 0,
      };
    } catch (error) {
      console.error('Failed to parse intent result:', error);
      return {
        intent: IntentType.GENERAL_CHAT,
        confidence: 1.0,
        parameters: [],
        missingParameters: [],
        needsConfirmation: false,
      };
    }
  }

  async fillMissingParameters(
    intent: IntentResult,
    userResponse: string,
  ): Promise<IntentResult> {
    const systemPrompt = `从用户回复中提取缺失参数: ${intent.missingParameters.join(', ')}
返回 JSON 格式:
{
  "parameters": [
    { "name": "company_code", "value": "1000", "confidence": 0.9, "required": true }
  ],
  "stillMissing": []
}`;

    const response = await this.llmService.chat([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userResponse },
    ]);

    try {
      const result = JSON.parse(response.content);
      return {
        ...intent,
        parameters: [...intent.parameters, ...result.parameters],
        missingParameters: result.stillMissing || [],
        needsConfirmation: result.stillMissing?.length > 0,
      };
    } catch (error) {
      console.error('Failed to parse parameters:', error);
      return intent;
    }
  }
}
