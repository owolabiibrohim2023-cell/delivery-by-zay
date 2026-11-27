// ============================================================
// DBZ centralized API configuration.
// Every backend request in the app goes through this module —
// never scatter fetch() calls inside page components.
//
// Set VITE_API_BASE_URL (e.g. https://d3z-api.onrender.com or leave empty
// to use the same origin + the Vite /api proxy) to connect the FastAPI
// backend. When it is not set the app runs in clearly-labelled mock mode.
// ============================================================

export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '')
  .trim()
  .replace(/\/+$/, '');

export const USE_MOCK = API_BASE_URL === '';

export const MOCK_MODE_NOTE =
  'Demonstration mode — data shown is sample content stored locally in your browser. Connect the FastAPI backend (VITE_API_BASE_URL) to enable live records.';

export class ApiError extends Error {
  constructor(message, status = 0, payload = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.payload = payload;
  }
}

/**
 * Central request helper.
 * @param {string} path  API path including the /api prefix, e.g. "/api/auth/login"
 * @param {{method?:string, body?:object, token?:string, headers?:object}} opts
 */
export async function apiRequest(path, { method = 'GET', body, token, headers } = {}) {
  if (USE_MOCK) {
    throw new ApiError(
      'Backend not connected. The frontend is running in demonstration mode.',
      0,
      { mock: true }
    );
  }

  let res;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: {
        Accept: 'application/json',
        ...(body ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (err) {
    throw new ApiError('Network error — could not reach the DBZ API.', 0, null);
  }

  let payload = null;
  const type = res.headers.get('content-type') || '';
  if (type.includes('application/json')) {
    try {
      payload = await res.json();
    } catch {
      payload = null;
    }
  }

  if (!res.ok) {
    const message =
      (payload && (payload.detail || payload.message)) ||
      `Request failed (${res.status})`;
    throw new ApiError(message, res.status, payload);
  }

  return payload;
}

/**
 * GET /api/health — expected backend response:
 *   {"status":"ok","service":"DBZ Logistics API"}
 */
export async function healthCheck() {
  if (USE_MOCK) {
    return { status: 'mock', service: 'DBZ Frontend — demonstration mode', connected: false };
  }
  try {
    const data = await apiRequest('/api/health');
    return { ...data, connected: true };
  } catch (err) {
    return { status: 'unreachable', service: API_BASE_URL, connected: false, error: err.message };
  }
}
