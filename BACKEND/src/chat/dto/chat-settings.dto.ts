import { IsString, IsOptional, IsNumber, Min, Max, IsUUID } from 'class-validator';

export class CreateChatSettingsDto {
  @IsString()
  @IsOptional()
  model?: string;

  @IsString()
  @IsOptional()
  systemPrompt?: string;

  @IsNumber()
  @Min(0)
  @Max(2)
  @IsOptional()
  temperature?: number;

  @IsNumber()
  @Min(1)
  @Max(32768)
  @IsOptional()
  maxTokens?: number;

  @IsNumber()
  @Min(0)
  @Max(1)
  @IsOptional()
  topP?: number;

  @IsNumber()
  @Min(0)
  @Max(1)
  @IsOptional()
  topK?: number;

  @IsNumber()
  @Min(-2)
  @Max(2)
  @IsOptional()
  frequencyPenalty?: number;

  @IsNumber()
  @Min(-2)
  @Max(2)
  @IsOptional()
  presencePenalty?: number;

  @IsUUID()
  userId: string;
}

export class UpdateChatSettingsDto {
  @IsString()
  @IsOptional()
  model?: string;

  @IsString()
  @IsOptional()
  systemPrompt?: string;

  @IsNumber()
  @Min(0)
  @Max(2)
  @IsOptional()
  temperature?: number;

  @IsNumber()
  @Min(1)
  @Max(32768)
  @IsOptional()
  maxTokens?: number;

  @IsNumber()
  @Min(0)
  @Max(1)
  @IsOptional()
  topP?: number;

  @IsNumber()
  @Min(0)
  @Max(1)
  @IsOptional()
  topK?: number;

  @IsNumber()
  @Min(-2)
  @Max(2)
  @IsOptional()
  frequencyPenalty?: number;

  @IsNumber()
  @Min(-2)
  @Max(2)
  @IsOptional()
  presencePenalty?: number;
}