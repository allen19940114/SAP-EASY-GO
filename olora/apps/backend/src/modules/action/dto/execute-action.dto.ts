import { IsString, IsObject, IsOptional } from 'class-validator';

export class ExecuteActionDto {
  @IsString()
  actionId: string;

  @IsObject()
  payload: Record<string, any>;

  @IsOptional()
  @IsString()
  sessionId?: string;
}
