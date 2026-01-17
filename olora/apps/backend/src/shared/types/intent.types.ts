export enum IntentType {
  REPORT_TEMPLATE_RUN = 'REPORT_TEMPLATE_RUN',
  DATA_QUERY = 'DATA_QUERY',
  DATA_UPDATE = 'DATA_UPDATE',
  PROJECT_CREATE = 'PROJECT_CREATE',
  WBS_CREATE = 'WBS_CREATE',
  BUDGET_UPDATE = 'BUDGET_UPDATE',
  GENERAL_CHAT = 'GENERAL_CHAT',
}

export interface ExtractedParameter {
  name: string;
  value: any;
  confidence: number;
  required: boolean;
}

export interface IntentResult {
  intent: IntentType;
  confidence: number;
  parameters: ExtractedParameter[];
  missingParameters: string[];
  needsConfirmation: boolean;
}
