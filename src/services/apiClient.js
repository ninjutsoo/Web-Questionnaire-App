// Shared API client configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:5001';

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
