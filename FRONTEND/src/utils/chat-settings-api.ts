import axios from 'axios';
import type { ChatSettings, UpdateChatSettingsRequest } from '../types/chat-settings.js';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const chatSettingsApi = {
  getSettings: async (): Promise<ChatSettings> => {
    const response = await axios.get(`${API_BASE_URL}/chat/settings`, {
      withCredentials: true, // ✅ Utilise les cookies pour l'authentification
    });
    return response.data;
  },

  updateSettings: async (settings: UpdateChatSettingsRequest): Promise<ChatSettings> => {
    const response = await axios.patch(`${API_BASE_URL}/chat/settings`, settings, {
      withCredentials: true, // ✅ Utilise les cookies pour l'authentification
    });
    return response.data;
  },
};