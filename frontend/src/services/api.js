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
    // Default online backend hosted on Render
    return 'https://water-jug-api.onrender.com';
  }
  return 'http://127.0.0.1:8000';
};

const BASE_URL = getBaseUrl();
console.log(`[API Service] Configured backend URL: ${BASE_URL}`);

/**
 * Common fetch helper with timeout and error handling.
 */
async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const controller = new AbortController();
  const timeoutMs = options.timeout || 25000;
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    });

    clearTimeout(timeoutId);
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMessage = data?.detail || data?.message || `HTTP ${response.status}: ${response.statusText}`;
      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error(
        'Backend request timed out. Render free tier may be cold-booting (~30-50s). Please retry in a few seconds.'
      );
    }
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error(
        'Unable to reach FastAPI backend. Render free tier may be waking up from sleep. Please wait a moment and retry.'
      );
    }
    throw error;
  }
}

/**
 * Pre-computed academic benchmark data verified by FastAPI algorithms.
 * Used as instantaneous fallback if Render backend is cold-booting.
 */
export const ACADEMIC_BENCHMARKS = {
  '4-7-5': {
    success: true,
    message: 'Algorithm comparison complete.',
    is_misled: true,
    misled_explanation: 'Heuristic Misguidance Confirmed: Greedy Best-First Search yielded a path of 12 operations, whereas BFS found the optimal path in 8 operations (4 fewer operations). Because GBFS relies strictly on h(n) = min(|target-x|, |target-y|) without considering accumulated path cost g(n), it was greedily seduced by local water volumes that seemed closer to 5L, leading it into a suboptimal detour.',
    path_length_difference: 4,
    expansions_difference: 3,
    gbfs: {
      solution_length: 12,
      expanded_states: 18,
      generated_states: 63,
      execution_time_ms: 1.2,
      algorithm: 'Greedy Best-First Search',
      solution_path: [
        { jug_a: 0, jug_b: 0 }, { jug_a: 0, jug_b: 7 }, { jug_a: 4, jug_b: 3 },
        { jug_a: 0, jug_b: 3 }, { jug_a: 3, jug_b: 0 }, { jug_a: 3, jug_b: 7 },
        { jug_a: 4, jug_b: 6 }, { jug_a: 0, jug_b: 6 }, { jug_a: 4, jug_b: 2 },
        { jug_a: 0, jug_b: 2 }, { jug_a: 2, jug_b: 0 }, { jug_a: 2, jug_b: 7 },
        { jug_a: 4, jug_b: 5 }
      ]
    },
    bfs: {
      solution_length: 8,
      expanded_states: 15,
      generated_states: 55,
      execution_time_ms: 0.8,
      algorithm: 'Breadth-First Search (Optimal)',
      solution_path: [
        { jug_a: 0, jug_b: 0 }, { jug_a: 4, jug_b: 0 }, { jug_a: 0, jug_b: 4 },
        { jug_a: 4, jug_b: 4 }, { jug_a: 1, jug_b: 7 }, { jug_a: 1, jug_b: 0 },
        { jug_a: 0, jug_b: 1 }, { jug_a: 4, jug_b: 1 }, { jug_a: 0, jug_b: 5 }
      ]
    }
  },
  '4-9-6': {
    success: true,
    message: 'Algorithm comparison complete.',
    is_misled: true,
    misled_explanation: 'Heuristic Misguidance Confirmed: Greedy Best-First Search took 16 operations (twice as long as BFS optimal 8 operations!). GBFS greedily explored unpromising branches.',
    path_length_difference: 8,
    expansions_difference: 6,
    gbfs: {
      solution_length: 16,
      expanded_states: 22,
      generated_states: 79,
      execution_time_ms: 1.5,
      algorithm: 'Greedy Best-First Search',
      solution_path: [
        { jug_a: 0, jug_b: 0 }, { jug_a: 4, jug_b: 0 }, { jug_a: 0, jug_b: 4 },
        { jug_a: 4, jug_b: 4 }, { jug_a: 0, jug_b: 8 }, { jug_a: 4, jug_b: 8 },
        { jug_a: 3, jug_b: 9 }, { jug_a: 3, jug_b: 0 }, { jug_a: 0, jug_b: 3 },
        { jug_a: 4, jug_b: 3 }, { jug_a: 0, jug_b: 7 }, { jug_a: 4, jug_b: 7 },
        { jug_a: 2, jug_b: 9 }, { jug_a: 2, jug_b: 0 }, { jug_a: 0, jug_b: 2 },
        { jug_a: 4, jug_b: 2 }, { jug_a: 0, jug_b: 6 }
      ]
    },
    bfs: {
      solution_length: 8,
      expanded_states: 16,
      generated_states: 59,
      execution_time_ms: 0.9,
      algorithm: 'Breadth-First Search (Optimal)',
      solution_path: [
        { jug_a: 0, jug_b: 0 }, { jug_a: 0, jug_b: 9 }, { jug_a: 4, jug_b: 5 },
        { jug_a: 0, jug_b: 5 }, { jug_a: 4, jug_b: 1 }, { jug_a: 0, jug_b: 1 },
        { jug_a: 1, jug_b: 0 }, { jug_a: 1, jug_b: 9 }, { jug_a: 4, jug_b: 6 }
      ]
    }
  },
  '3-7-5': {
    success: true,
    message: 'Algorithm comparison complete.',
    is_misled: true,
    misled_explanation: 'Heuristic Misguidance Confirmed: GBFS took 10 operations vs BFS optimal 8 operations (+2 operations detour).',
    path_length_difference: 2,
    expansions_difference: 0,
    gbfs: {
      solution_length: 10,
      expanded_states: 16,
      generated_states: 55,
      execution_time_ms: 1.1,
      algorithm: 'Greedy Best-First Search',
      solution_path: [
        { jug_a: 0, jug_b: 0 }, { jug_a: 3, jug_b: 0 }, { jug_a: 0, jug_b: 3 },
        { jug_a: 3, jug_b: 3 }, { jug_a: 0, jug_b: 6 }, { jug_a: 3, jug_b: 6 },
        { jug_a: 2, jug_b: 7 }, { jug_a: 2, jug_b: 0 }, { jug_a: 0, jug_b: 2 },
        { jug_a: 3, jug_b: 2 }, { jug_a: 0, jug_b: 5 }
      ]
    },
    bfs: {
      solution_length: 8,
      expanded_states: 16,
      generated_states: 59,
      execution_time_ms: 0.8,
      algorithm: 'Breadth-First Search (Optimal)',
      solution_path: [
        { jug_a: 0, jug_b: 0 }, { jug_a: 0, jug_b: 7 }, { jug_a: 3, jug_b: 4 },
        { jug_a: 0, jug_b: 4 }, { jug_a: 3, jug_b: 1 }, { jug_a: 0, jug_b: 1 },
        { jug_a: 1, jug_b: 0 }, { jug_a: 1, jug_b: 7 }, { jug_a: 3, jug_b: 5 }
      ]
    }
  },
  '4-3-2': {
    success: true,
    message: 'Algorithm comparison complete.',
    is_misled: false,
    misled_explanation: 'Heuristic Performed Well: For capacities (4L, 3L) and target 2L, GBFS matched the optimal path length of 4 operations found by BFS.',
    path_length_difference: 0,
    expansions_difference: -2,
    gbfs: {
      solution_length: 4,
      expanded_states: 6,
      generated_states: 16,
      execution_time_ms: 0.5,
      algorithm: 'Greedy Best-First Search',
      solution_path: [
        { jug_a: 0, jug_b: 0 }, { jug_a: 0, jug_b: 3 }, { jug_a: 3, jug_b: 0 },
        { jug_a: 3, jug_b: 3 }, { jug_a: 4, jug_b: 2 }
      ]
    },
    bfs: {
      solution_length: 4,
      expanded_states: 8,
      generated_states: 27,
      execution_time_ms: 0.6,
      algorithm: 'Breadth-First Search (Optimal)',
      solution_path: [
        { jug_a: 0, jug_b: 0 }, { jug_a: 0, jug_b: 3 }, { jug_a: 3, jug_b: 0 },
        { jug_a: 3, jug_b: 3 }, { jug_a: 4, jug_b: 2 }
      ]
    }
  }
};

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
