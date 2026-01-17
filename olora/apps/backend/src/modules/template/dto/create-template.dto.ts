import { IsString, IsArray, IsObject, IsOptional } from 'class-validator';

export interface TemplateField {
  name: string;
  type: 'string' | 'number' | 'date' | 'boolean';
  source: string; // SAP 数据源
  formula?: string; // 计算公式
  aggregation?: 'sum' | 'avg' | 'count' | 'max' | 'min';
}

export class CreateTemplateDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsArray()
  fields: TemplateField[];

  @IsObject()
  parameters: Record<string, any>;

  @IsOptional()
  @IsString()
  sapTable?: string;
}
