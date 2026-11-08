/**
 * API Service for communicating with FastAPI Backend (Render / Localhost).
 */

const getBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL.replace(/\/+$/, '');
  }
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    if (host === 'localhost' || host === '127.0.0.1') {
      return `http://${host}:8000`;
    }
    // For online tunnels or custom hostnames without VITE_API_URL, route through Vite proxy
    return '/api';
  }
  return 'http://127.0.0.1:8000';
};

const BASE_URL = getBaseUrl();
console.log(`[API Service] Configured backend URL: ${BASE_URL}`);

/**
 * Common fetch helper with error handling.
 */
async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMessage = data?.detail || data?.message || `HTTP ${response.status}: ${response.statusText}`;
      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error(
        `Backend server is waking up or temporarily unavailable. Please wait 10 seconds and retry.`
      );
    }
    throw error;
  }
}

export const api = {
  /**
   * Health check and database status
   */
  async checkHealth() {
    return request('/health');
  },

  /**
   * Run search simulation (Greedy Best-First or BFS)
   */
  async simulate(params) {
    return request('/simulate', {
      method: 'POST',
      body: JSON.stringify(params)
    });
  },

  /**
   * Search endpoint alias
   */
  async search(params) {
    return request('/search', {
      method: 'POST',
      body: JSON.stringify(params)
    });
  },

  /**
   * Compare GBFS vs BFS (Heuristic Misguidance Analysis)
   */
  async compare(params) {
    return request('/compare', {
      method: 'POST',
      body: JSON.stringify(params)
    });
  },

  /**
   * List simulation history
   */
  async getHistory() {
    return request('/history');
  },

  /**
   * Get single simulation with all steps
   */
  async getHistoryDetail(id) {
    return request(`/history/${id}`);
  },

  /**
   * Delete simulation record
   */
  async deleteHistory(id) {
    return request(`/history/${id}`, {
      method: 'DELETE'
    });
  }
};

