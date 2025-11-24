import React, { useState, useEffect } from 'react';
import './QuickGeneration.css';
import { apiPost, testApiConnection } from '../utils/api';

const QuickGeneration: React.FC = () => {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showImage, setShowImage] = useState(false);
  const [apiStatus, setApiStatus] = useState<string>('Vérification de la connexion API...');

  // Test de connectivité au montage
  useEffect(() => {
    const checkApiConnection = async () => {
      const result = await testApiConnection();
      setApiStatus(result.message);
      if (!result.success) {
        setErrorMessage(`Problème de connexion API: ${result.message}`);
      }
    };
    
    checkApiConnection();
  }, []);

  // Exemples de prompts
  const promptExamples = [
    "Un chaton mignon jouant avec une pelote de laine",
    "Un paysage montagneux au coucher du soleil",
    "Une ville futuriste avec des buildings illuminés",
    "Un portrait de femme avec des fleurs dans les cheveux",
    "Un dragon majestueux volant dans le ciel",
    "Une forêt enchantée avec des lucioles",
    "Un robot amical dans un jardin",
    "Une plage tropicale avec des palmiers",
    "Un château médiéval sur une colline",
    "Un astronaute marchant sur la lune"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    setLoading(true);
    setImageUrl(null);
    setErrorMessage(null);

    try {
      const response = await apiPost('/flux/generate-and-save', {
        prompt: description,
        size: '1024x1024',
        n: 1,
      });

      if (response.ok) {
        const data = await response.json();
        setImageUrl(data.url);
        setShowImage(true);
      } else {
        const errorData = await response.json();
        setErrorMessage(`Erreur de génération: ${errorData.message || 'Erreur inconnue'}`);
      }
    } catch (error) {
      console.error('Erreur:', error);
      setErrorMessage('Erreur réseau lors de la génération de l\'image');
    } finally {
      setLoading(false);
    }
  };

  const selectPromptExample = (prompt: string) => {
    setDescription(prompt);
  };

  const handleBackToGeneration = () => {
    setShowImage(false);
    setImageUrl(null);
    setErrorMessage(null);
  };

  if (showImage && imageUrl) {
    return (
      <div className="quick-generation">
        <div className="image-display">
          <div className="image-container">
            <img
              src={imageUrl.startsWith('/uploads') ? `/api${imageUrl}` : imageUrl}
              alt="Image générée"
              className="generated-image-large"
            />
          </div>
          <div className="image-actions">
            <button 
              className="back-btn"
              onClick={handleBackToGeneration}
            >
              ← Retour à la génération
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="quick-generation">
      <div className="generation-header">
        <h2>Génération d'Images</h2>
        <p>Créez des images uniques avec l'IA. Utilisez des prompts détaillés pour de meilleurs résultats.</p>
      </div>
      
      {/* Section des exemples de prompts */}
      <div className="prompt-examples">
        <h3>Exemples de prompts</h3>
        <div className="examples-grid">
          {promptExamples.map((example, index) => (
            <button
              key={index}
              type="button"
              className="example-prompt"
              onClick={() => selectPromptExample(example)}
              title={`Cliquer pour utiliser ce prompt : ${example}`}
            >
              {example}
            </button>
          ))}
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="quick-form">
        <div className="input-container">
          <textarea
            placeholder="Décrivez l'image que vous voulez créer..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="quick-input"
            rows={4}
            required
          />
        </div>
        <button type="submit" className="quick-btn" disabled={loading}>
          {loading ? 'Génération...' : 'Générer'}
        </button>
      </form>
      
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      
      <div className="api-status">
        <small>🔗 {apiStatus}</small>
      </div>
    </div>
  );
};

export default QuickGeneration;