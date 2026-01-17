import { IsString, IsArray, IsObject, IsOptional, IsBoolean } from 'class-validator';

export interface TemplateField {
  name: string;
  type: 'string' | 'number' | 'date' | 'boolean';
  source?: string;
  formula?: string;
  aggregation?: 'sum' | 'avg' | 'count' | 'max' | 'min';
}

export class CreateTemplateDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsObject()
  template?: Record<string, any>;

  @IsArray()
  fields: TemplateField[];

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;
}
