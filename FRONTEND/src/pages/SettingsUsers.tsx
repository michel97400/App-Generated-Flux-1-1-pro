
import { useState, useEffect } from 'react';
import type { ChatSettings, UpdateChatSettingsRequest } from '../types/chat-settings.js';
import { chatSettingsApi } from '../utils/chat-settings-api.js';
import './SettingsUsers.css';

function Settings() {
  const [chatSettings, setChatSettings] = useState<ChatSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  // Available models for Groq
  const availableModels = [
    { value: 'openai/gpt-oss-20b', label: 'GPT OSS 20B (Recommandé)' },
  ];

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const settings = await chatSettingsApi.getSettings();
      setChatSettings(settings);
    } catch (error: any) {
      console.error('Erreur lors du chargement des paramètres:', error);
      let errorMessage = 'Erreur lors du chargement des paramètres';

      if (error.response) {
        // Erreur de réponse du serveur
        if (error.response.status === 401) {
          errorMessage = 'Session expirée. Veuillez vous reconnecter.';
          // Permettre l'utilisation du formulaire avec des valeurs par défaut
          setChatSettings({
            settingsId: 'default',
            model: 'openai/gpt-oss-20b',
            systemPrompt: null,
            temperature: 0.7,
            maxTokens: 4096,
            topP: 0.0,
            topK: 0.0,
            frequencyPenalty: 0.0,
            presencePenalty: 0.0,
            userId: 'default',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        } else if (error.response.status === 404) {
          errorMessage = 'Paramètres non trouvés. Utilisation des valeurs par défaut.';
          // Créer des paramètres par défaut pour permettre l'utilisation du formulaire
          setChatSettings({
            settingsId: 'default',
            model: 'openai/gpt-oss-20b',
            systemPrompt: null,
            temperature: 0.7,
            maxTokens: 4096,
            topP: 0.0,
            topK: 0.0,
            frequencyPenalty: 0.0,
            presencePenalty: 0.0,
            userId: 'default',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        } else {
          errorMessage = `Erreur serveur: ${error.response.status} - ${error.response.data?.message || 'Erreur inconnue'}`;
        }
      } else if (error.request) {
        // Erreur de réseau
        errorMessage = 'Erreur de connexion. Vérifiez votre connexion internet.';
      } else {
        // Autre erreur
        errorMessage = `Erreur: ${error.message || 'Erreur inconnue'}`;
      }

      setMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    if (!chatSettings) return;

    setSaving(true);
    setMessage('');

    try {
      const updateData: UpdateChatSettingsRequest = {
        model: chatSettings.model,
        systemPrompt: chatSettings.systemPrompt || undefined,
        temperature: chatSettings.temperature,
        maxTokens: chatSettings.maxTokens,
        topP: chatSettings.topP,
        topK: chatSettings.topK,
        frequencyPenalty: chatSettings.frequencyPenalty,
        presencePenalty: chatSettings.presencePenalty,
      };

      const updatedSettings = await chatSettingsApi.updateSettings(updateData);
      setChatSettings(updatedSettings);
      setMessage('Paramètres sauvegardés avec succès !');
    } catch (error: any) {
      console.error('Erreur lors de la sauvegarde:', error);
      let errorMessage = 'Erreur lors de la sauvegarde des paramètres';

      if (error.response) {
        if (error.response.status === 401) {
          errorMessage = 'Session expirée. Veuillez vous reconnecter.';
        } else {
          errorMessage = `Erreur serveur: ${error.response.status} - ${error.response.data?.message || 'Erreur inconnue'}`;
        }
      } else if (error.request) {
        errorMessage = 'Erreur de connexion. Vérifiez votre connexion internet.';
      } else {
        errorMessage = `Erreur: ${error.message || 'Erreur inconnue'}`;
      }

      setMessage(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof ChatSettings, value: string | number) => {
    if (!chatSettings) {
      // Si chatSettings n'existe pas, on l'initialise avec des valeurs par défaut
      const defaultSettings: ChatSettings = {
        settingsId: 'default',
        model: 'openai/gpt-oss-20b',
        systemPrompt: null,
        temperature: 0.7,
        maxTokens: 4096,
        topP: 0.0,
        topK: 0.0,
        frequencyPenalty: 0.0,
        presencePenalty: 0.0,
        userId: 'default',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setChatSettings({
        ...defaultSettings,
        [field]: value,
      });
      return;
    }

    setChatSettings({
      ...chatSettings,
      [field]: value,
    });
  };

  if (loading) {
    return (
      <div className="settings-container">
        <div className="loading">Chargement des paramètres...</div>
      </div>
    );
  }

  return (
    <div className="settings-container">
      <h1>Paramètres utilisateur</h1>

      {message && (
        <div className={`message ${message.includes('succès') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      <div className="settings-section">
        <h2>🤖 Paramètres Chat IA</h2>

        <div className="settings-group">
          <div className="setting-item">
            <label htmlFor="model">Modèle IA :</label>
            <select
              id="model"
              value={chatSettings?.model || 'openai/gpt-oss-20b'}
              onChange={(e) => handleInputChange('model', e.target.value)}
            >
              {availableModels.map((model) => (
                <option key={model.value} value={model.value}>
                  {model.label}
                </option>
              ))}
            </select>
          </div>

          <div className="setting-item">
            <label htmlFor="systemPrompt">Prompt système :</label>
            <textarea
              id="systemPrompt"
              value={chatSettings?.systemPrompt || ''}
              onChange={(e) => handleInputChange('systemPrompt', e.target.value)}
              placeholder="Instructions spéciales pour l'IA (optionnel)"
              rows={4}
            />
            <small>Définissez le comportement général de l'IA pour vos conversations</small>
          </div>

          <div className="setting-item">
            <label htmlFor="temperature">Température : {chatSettings?.temperature || 0.7}</label>
            <input
              type="range"
              id="temperature"
              min="0"
              max="2"
              step="0.1"
              value={chatSettings?.temperature || 0.7}
              onChange={(e) => handleInputChange('temperature', parseFloat(e.target.value))}
            />
            <small>0 = Déterministe, 2 = Très créatif</small>
          </div>

          <div className="setting-item">
            <label htmlFor="maxTokens">Tokens maximum :</label>
            <input
              type="number"
              id="maxTokens"
              min="1"
              max="32768"
              value={chatSettings?.maxTokens || 4096}
              onChange={(e) => handleInputChange('maxTokens', parseInt(e.target.value))}
            />
            <small>Longueur maximale des réponses (1-32768)</small>
          </div>

          <div className="setting-item">
            <label htmlFor="topP">Top P : {chatSettings?.topP || 0.0}</label>
            <input
              type="range"
              id="topP"
              min="0"
              max="1"
              step="0.01"
              value={chatSettings?.topP || 0.0}
              onChange={(e) => handleInputChange('topP', parseFloat(e.target.value))}
            />
            <small>Contrôle la diversité des réponses (0-1)</small>
          </div>

          <div className="setting-item">
            <label htmlFor="topK">Top K : {chatSettings?.topK || 0.0}</label>
            <input
              type="range"
              id="topK"
              min="0"
              max="1"
              step="0.01"
              value={chatSettings?.topK || 0.0}
              onChange={(e) => handleInputChange('topK', parseFloat(e.target.value))}
            />
            <small>Limite le nombre de tokens considérés (0-1)</small>
          </div>

          <div className="setting-item">
            <label htmlFor="frequencyPenalty">Pénalité fréquence : {chatSettings?.frequencyPenalty || 0.0}</label>
            <input
              type="range"
              id="frequencyPenalty"
              min="-2"
              max="2"
              step="0.1"
              value={chatSettings?.frequencyPenalty || 0.0}
              onChange={(e) => handleInputChange('frequencyPenalty', parseFloat(e.target.value))}
            />
            <small>Réduit la répétition de mots (-2 à 2)</small>
          </div>

          <div className="setting-item">
            <label htmlFor="presencePenalty">Pénalité présence : {chatSettings?.presencePenalty || 0.0}</label>
            <input
              type="range"
              id="presencePenalty"
              min="-2"
              max="2"
              step="0.1"
              value={chatSettings?.presencePenalty || 0.0}
              onChange={(e) => handleInputChange('presencePenalty', parseFloat(e.target.value))}
            />
            <small>Encourage l'utilisation de nouveaux topics (-2 à 2)</small>
          </div>
        </div>

        <div className="settings-actions">
          <button
            onClick={handleSaveSettings}
            disabled={saving}
            className="save-button"
          >
            {saving ? 'Sauvegarde...' : 'Sauvegarder les paramètres'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Settings;