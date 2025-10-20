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
    
    // Use the same protocol (http/https) as the current page
    // This ensures consistency and avoids mixed content warnings
    const apiUrl = `${protocol}//${hostname}:5001`;
    console.log('🔧 Auto-detected API URL:', apiUrl);
    console.log('   Current page:', `${protocol}//${hostname}:${window.location.port}`);
    return apiUrl;
  }
  
  // Default to HTTP localhost for local development
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
