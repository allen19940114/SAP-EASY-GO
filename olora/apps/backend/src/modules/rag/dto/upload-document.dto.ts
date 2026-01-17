import { IsString, IsOptional, IsEnum } from 'class-validator';

export enum DocumentType {
  PDF = 'pdf',
  WORD = 'docx',
  EXCEL = 'xlsx',
  MARKDOWN = 'md',
  TEXT = 'txt',
}

export class UploadDocumentDto {
  @IsString()
  filename: string;

  @IsEnum(DocumentType)
  type: DocumentType;

  @IsOptional()
  @IsString()
  description?: string;
}
