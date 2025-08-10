
import { NewsDigest } from '@/types/news';

// Use environment variable if available, otherwise current domain
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || window.location.origin;

console.log('🌐 API Base URL:', API_BASE_URL);
console.log('🔧 Environment:', import.meta.env.VITE_API_BASE_URL ? 'Real API' : 'MSW/Local');

export const newsApi = {
  // Save today's digest
  saveDigest: async (digest: NewsDigest): Promise<{ status: string }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/news`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(digest),
      });
      
      if (!response.ok) {
        throw new Error(`Error saving digest: ${response.statusText}`);
      }
      
      return response.json();
    } catch (error) {
      console.error('❌ Error saving digest:', error);
      throw error;
    }
  },

  // Get today's digest
  getTodayDigest: async (): Promise<NewsDigest> => {
    try {
      console.log('🔍 Fetching digest from:', `${API_BASE_URL}/api/get-today`);
      
      const response = await fetch(`${API_BASE_URL}/api/get-today`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.status === 404) {
        throw new Error('No digest available or digest has expired (24h TTL)');
      }
      
      if (!response.ok) {
        throw new Error(`Error fetching digest: ${response.statusText} (${response.status})`);
      }
      
      const data = await response.json();
      console.log('✅ Digest fetched successfully');
      return data;
    } catch (error) {
      console.error('❌ Error fetching digest:', error);
      throw error;
    }
  },

  // Health check
  healthCheck: async (): Promise<{ status: string }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      return response.json();
    } catch (error) {
      console.error('❌ Health check failed:', error);
      throw error;
    }
  },

  // Test connection (for debugging)
  testConnection: async (): Promise<any> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/test-connection`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          test: 'connection from frontend',
          timestamp: new Date().toISOString(),
          environment: import.meta.env.VITE_API_BASE_URL ? 'real-api' : 'msw'
        }),
      });
      return response.json();
    } catch (error) {
      console.error('❌ Connection test failed:', error);
      throw error;
    }
  },

  // Get server status
  getStatus: async (): Promise<any> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/status`);
      return response.json();
    } catch (error) {
      console.error('❌ Status check failed:', error);
      throw error;
    }
  },
};
