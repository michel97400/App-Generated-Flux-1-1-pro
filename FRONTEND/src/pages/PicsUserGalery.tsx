

import { useState, useEffect } from 'react';
import { apiGet, apiDelete } from '../utils/api';
import { Download, Trash2 } from 'lucide-react';

interface ImageData {
  imageId: string;
  imageUrl: string;
  imagePrompt: string;
  imageTheme?: string;
  imageSize?: string;
  imageCreatedAt: string;
}

function PicsGalery() {
  const [images, setImages] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await apiGet('/images/my-images');
        if (response.ok) {
          const data = await response.json();
          setImages(data);
        } else {
          setError('Erreur lors du chargement des images');
        }
      } catch (err) {
        setError('Erreur réseau');
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  const downloadImage = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.error('Erreur lors du téléchargement:', err);
    }
  };

  const deleteImage = async (imageId: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette image ?')) {
      return;
    }

    try {
      const response = await apiDelete(`/images/${imageId}`);
      if (response.ok) {
        setImages(images.filter(img => img.imageId !== imageId));
      } else {
        setError('Erreur lors de la suppression de l\'image');
      }
    } catch (err) {
      setError('Erreur réseau lors de la suppression');
    }
  };

  if (loading) {
    return <p>Chargement des images...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  return (
    <>
      <h1>Mes Images Générées</h1>
      {images.length === 0 ? (
        <p>Vous n'avez pas encore généré d'images.</p>
      ) : (
        <div className="gallery-grid">
          {images.map((image) => (
            <div key={image.imageId} className="gallery-item">
              <img src={image.imageUrl} alt={image.imagePrompt} className="gallery-image" />
              <div className="gallery-info">
                <p><strong>Prompt:</strong> {image.imagePrompt}</p>
                {image.imageTheme && <p><strong>Thème:</strong> {image.imageTheme}</p>}
                {image.imageSize && <p><strong>Taille:</strong> {image.imageSize}</p>}
                <p><strong>Créée le:</strong> {new Date(image.imageCreatedAt).toLocaleDateString()}</p>
                <div className="gallery-actions">
                  <button
                    className="download-btn"
                    onClick={() => downloadImage(image.imageUrl, `image-${image.imageId}.png`)}
                  >
                    <Download size={16} /> Télécharger
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => deleteImage(image.imageId)}
                  >
                    <Trash2 size={16} /> Supprimer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default PicsGalery;