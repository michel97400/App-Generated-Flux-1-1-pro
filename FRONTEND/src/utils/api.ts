/**
 * Utilitaire pour les requêtes API avec refresh automatique des tokens
 */

// En développement, utiliser le proxy Vite (/api)
// En production, utiliser l'URL complète du backend depuis les variables d'environnement
const API_BASE_URL = import.meta.env.PROD
  ? (import.meta.env.VITE_API_URL || 'https://app-generated-flux-1-1-pro-backend.onrender.com')
  : '/api';

console.log('🔧 API_BASE_URL configuré:', API_BASE_URL);
console.log('🌍 Environnement:', import.meta.env.PROD ? 'PRODUCTION' : 'DEVELOPMENT');
console.log('📋 VITE_API_URL:', import.meta.env.VITE_API_URL);

interface FetchOptions extends RequestInit {
  skipRefresh?: boolean;
}

/**
 * Wrapper fetch avec gestion automatique du refresh token
 */
export async function apiFetch(endpoint: string, options: FetchOptions = {}) {
  const { skipRefresh, ...fetchOptions } = options;

  // Toujours inclure les credentials pour envoyer les cookies
  const config: RequestInit = {
    ...fetchOptions,
    credentials: 'include',
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    // Si 401 et pas déjà en train de refresh
    if (response.status === 401 && !skipRefresh) {
      // Tenter de rafraîchir le token
      const refreshed = await refreshToken();

      if (refreshed) {
        // Retry la requête originale
        return fetch(`${API_BASE_URL}${endpoint}`, config);
      } else {
        // Au lieu de rediriger automatiquement, laisser l'appelant gérer l'erreur
        console.warn('Session expirée - refresh token échoué');
        // Ne pas rediriger automatiquement pour éviter les problèmes de navigation
        // window.location.href = '/login';
        return response; // Retourner la réponse 401 originale
      }
    }

    return response;
  } catch (error) {
    console.error('API Fetch error:', error);
    throw error;
  }
}

/**
 * Rafraîchir le token automatiquement
 */
async function refreshToken(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    });

    if (response.ok) {
      const data = await response.json();
      // Mettre à jour l'utilisateur dans le localStorage
      localStorage.setItem('user', JSON.stringify(data.user));
      return true;
    }

    return false;
  } catch (error) {
    console.error('Token refresh failed:', error);
    return false;
  }
}

/**
 * Helper pour les requêtes GET
 */
export async function apiGet(endpoint: string) {
  return apiFetch(endpoint, { method: 'GET' });
}

/**
 * Helper pour les requêtes POST
 */
export async function apiPost(endpoint: string, data?: any) {
  return apiFetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: data ? JSON.stringify(data) : undefined,
  });
}

/**
 * Helper pour les requêtes PUT
 */
export async function apiPut(endpoint: string, data?: any) {
  return apiFetch(endpoint, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: data ? JSON.stringify(data) : undefined,
  });
}

/**
 * Helper pour les requêtes PATCH
 */
export async function apiPatch(endpoint: string, data?: any) {
  return apiFetch(endpoint, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: data ? JSON.stringify(data) : undefined,
  });
}

/**
 * Helper pour les requêtes DELETE
 */
export async function apiDelete(endpoint: string) {
  return apiFetch(endpoint, { method: 'DELETE' });
}

/**
 * Test de connectivité API
 */
export async function testApiConnection(): Promise<{ success: boolean; message: string }> {
  try {
    console.log('🧪 Test de connectivité API vers:', `${API_BASE_URL}/`);
    const response = await fetch(`${API_BASE_URL}/`, {
      method: 'GET',
      credentials: 'include',
    });
    
    console.log('📡 Réponse du test:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok
    });
    
    if (response.ok) {
      return { success: true, message: 'Connexion API réussie' };
    } else {
      return { success: false, message: `Erreur HTTP ${response.status}: ${response.statusText}` };
    }
  } catch (error) {
    console.error('❌ Erreur de connectivité API:', error);
    return { success: false, message: `Erreur réseau: ${error instanceof Error ? error.message : 'Inconnue'}` };
  }
}
