export interface ChatSettings {
  settingsId: string;
  model: string;
  systemPrompt: string | null;
  temperature: number;
  maxTokens: number;
  topP: number;
  topK: number;
  frequencyPenalty: number;
  presencePenalty: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateChatSettingsRequest {
  model?: string;
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  topK?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
}