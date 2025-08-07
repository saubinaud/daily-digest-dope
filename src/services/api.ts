
import { NewsDigest } from '@/types/news';

const API_BASE_URL = 'http://localhost:3001';

export const newsApi = {
  // Save today's digest
  saveDigest: async (digest: NewsDigest): Promise<{ status: string }> => {
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
  },

  // Get today's digest
  getTodayDigest: async (): Promise<NewsDigest> => {
    const response = await fetch(`${API_BASE_URL}/api/get-today`);
    
    if (response.status === 404) {
      throw new Error('No digest available for today');
    }
    
    if (!response.ok) {
      throw new Error(`Error fetching digest: ${response.statusText}`);
    }
    
    return response.json();
  },

  // Health check
  healthCheck: async (): Promise<{ status: string }> => {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.json();
  },
};
