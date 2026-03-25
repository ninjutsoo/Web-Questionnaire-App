// Dynamic API base URL detection
const getApiBaseUrl = () => {
  // Check if explicitly set via environment variable
  if (import.meta.env.VITE_API_BASE_URL) {
    console.log('🔧 API URL from .env:', import.meta.env.VITE_API_BASE_URL);
    return import.meta.env.VITE_API_BASE_URL;
  }

  // Auto-detect based on current window location
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    const protocol = window.location.protocol;

    // Production: Firebase Hosting (same origin, no port). API is at /api/*
    const isProduction =
      hostname.endsWith('.web.app') ||
      hostname.endsWith('.firebaseapp.com') ||
      hostname === 'web-app-new-efb66.web.app';

    if (isProduction) {
      const apiUrl = `${protocol}//${hostname}`;
      console.log('🔧 Auto-detected API URL (production):', apiUrl);
      return apiUrl;
    }

    // Vite dev server: same-origin /api/* is proxied to hosted API (see vite.config.js).
    // Avoids ERR_CONNECTION_REFUSED when nothing runs on port 5001.
    if (import.meta.env.DEV) {
      console.log('🔧 API URL (dev): same origin + Vite /api proxy');
      return '';
    }

    // vite preview / odd hosts: optional local backend
    const apiUrl = `${protocol}//${hostname}:5001`;
    console.log('🔧 Auto-detected API URL (fallback :5001):', apiUrl);
    return apiUrl;
  }

  console.log('🔧 Using default API URL: http://localhost:5001');
  return 'http://localhost:5001';
};

// Shared API client configuration
export const API_BASE_URL = getApiBaseUrl();
console.log('✅ Final API_BASE_URL:', API_BASE_URL);

// Helper function to get API endpoint
export const getApiEndpoint = (path) => {
  return `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
};

// Default axios configuration
export const apiConfig = {
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
};
