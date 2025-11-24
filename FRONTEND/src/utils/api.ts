/**
 * Utilitaire pour les requêtes API avec refresh automatique des tokens
 */

// En développement, utiliser le proxy Vite (/api)
// En production, utiliser l'URL complète du backend depuis les variables d'environnement
const API_BASE_URL = import.meta.env.PROD
  ? (import.meta.env.VITE_API_URL || 'https://votre-backend-url.onrender.com')
  : '/api';

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
        // Rediriger vers login si le refresh échoue
        window.location.href = '/login';
        throw new Error('Session expired');
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
