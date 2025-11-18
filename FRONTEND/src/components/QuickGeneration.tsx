import React, { useState } from 'react';
import './QuickGeneration.css';
import { apiPost } from '../utils/api';

const QuickGeneration: React.FC = () => {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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

  return (
    <div className="quick-generation">
      <h2>Générerations d'images</h2>
      <p>Faites votre prompt ! Ou utilisé les prompts par default. Vous pouvez aussi utiliser l'IA du chat pour contruire un prompt perfomant !</p>
      
      {/* Section des exemples de prompts */}
      <div className="prompt-examples">
        <h3>Exemples de prompts :</h3>
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
        <textarea
          placeholder="Décrivez l'image que vous voulez créer..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="quick-input"
          rows={6}
          required
        />
        <button type="submit" className="quick-btn" disabled={loading}>
          {loading ? 'Génération en cours...' : 'Générer'}
        </button>
      </form>
      {loading && <p>Génération de l'image en cours...</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {imageUrl && (
        <div className="generated-image">
          <h3>Votre image générée :</h3>
          <img src={imageUrl} alt="Image générée" style={{ maxWidth: '100%', height: 'auto' }} />
        </div>
      )}
    </div>
  );
};

export default QuickGeneration;