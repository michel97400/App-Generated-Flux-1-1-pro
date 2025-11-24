// Composant enfant pour gérer l'affichage sécurisé d'une image
import React from 'react';

interface GalleryImageProps {
  image: ImageData;
  onDownload: (imageId: string, filename: string) => void;
  onDelete: (imageId: string) => void;
}

const GalleryImage: React.FC<GalleryImageProps> = ({ image, onDownload, onDelete }) => {
  const [imgSrc, setImgSrc] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchImage = async () => {
      if (image.imageUrl.startsWith('/uploads')) {
        const token = localStorage.getItem('token');
        try {
          // Correction : utilise le préfixe /api pour passer par le proxy Vite
          const response = await fetch(`/api/images/${image.imageId}/download`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          if (response.ok) {
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            if (isMounted) setImgSrc(url);
          } else {
            if (isMounted) setImgSrc(null);
          }
        } catch {
          if (isMounted) setImgSrc(null);
        }
      } else {
        setImgSrc(image.imageUrl);
      }
    };
    fetchImage();
    return () => { isMounted = false; };
  }, [image.imageId, image.imageUrl]);

  return (
    <div className="gallery-item">
      {imgSrc && (
        <img src={imgSrc} alt={image.imagePrompt} className="gallery-image" />
      )}
      <div className="gallery-info">
        <p><strong>Prompt:</strong> {image.imagePrompt}</p>
        {image.imageTheme && <p><strong>Thème:</strong> {image.imageTheme}</p>}
        {image.imageSize && <p><strong>Taille:</strong> {image.imageSize}</p>}
        <p><strong>Créée le:</strong> {new Date(image.imageCreatedAt).toLocaleDateString()}</p>
        <div className="gallery-actions">
          <button
            className="download-btn"
            onClick={() => onDownload(image.imageId, `image-${image.imageId}.png`)}
          >
            <Download size={16} /> Télécharger
          </button>
          <button
            className="delete-btn"
            onClick={() => onDelete(image.imageId)}
          >
            <Trash2 size={16} /> Supprimer
          </button>
        </div>
      </div>
    </div>
  );
};


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
        console.log('🔍 Tentative de récupération des images...');
        const response = await apiGet('/images/my-images');
        console.log('📡 Réponse reçue:', {
          status: response.status,
          statusText: response.statusText,
          ok: response.ok
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log('✅ Images récupérées:', data);
          setImages(data);
        } else {
          const errorText = await response.text();
          console.error('❌ Erreur API:', errorText);
          setError(`Erreur lors du chargement des images: ${response.status} ${response.statusText}`);
        }
      } catch (err) {
        console.error('❌ Erreur réseau:', err);
        setError('Erreur réseau lors du chargement des images');
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  const downloadImage = async (imageId: string, filename: string) => {
    console.log('🖥️ Frontend: Tentative de téléchargement', { imageId, filename });
    try {
      // Utiliser l'API backend pour télécharger l'image avec authentification
      const token = localStorage.getItem('token');
      console.log('🖥️ Frontend: Token présent:', !!token);

      // Toujours préfixer par /api pour garantir le passage par le proxy
      const downloadUrlApi = `/api/images/${imageId}/download`;
      const response = await fetch(downloadUrlApi, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('🖥️ Frontend: Réponse reçue:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('🖥️ Frontend: Erreur réponse:', errorText);
        throw new Error(`Erreur HTTP ${response.status}: ${errorText}`);
      }

      const blob = await response.blob();
      console.log('🖥️ Frontend: Blob reçu, taille:', blob.size, 'bytes');

      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

      console.log('🖥️ Frontend: Téléchargement terminé avec succès');
    } catch (err) {
      console.error('🖥️ Frontend: Erreur lors du téléchargement:', err);
      alert('Erreur lors du téléchargement de l\'image');
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
            <GalleryImage
              key={image.imageId}
              image={image}
              onDownload={downloadImage}
              onDelete={deleteImage}
            />
          ))}
        </div>
      )}
    </>
  );
}

export default PicsGalery;