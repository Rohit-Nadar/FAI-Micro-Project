/**
 * API Service for communicating with FastAPI Backend (Render / Localhost).
 */

const BASE_URL = import.meta.env.VITE_API_URL 
  ? import.meta.env.VITE_API_URL.replace(/\/+$/, '') 
  : 'http://127.0.0.1:8000';

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
        `Unable to connect to FastAPI backend at ${BASE_URL}. Please verify the server is running on port 8000 or check your network connection.`
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
