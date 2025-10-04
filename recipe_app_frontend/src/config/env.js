//
// Environment configuration for the Recipe app.
// Uses Create React App style env variables (REACT_APP_*).
// Provides sensible defaults for local development.
//

// Read raw values from environment (CRA inlines these at build-time)
const RAW_USE_MOCK = process.env.REACT_APP_USE_MOCK;
const RAW_API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const RAW_TIMEOUT = process.env.REACT_APP_REQUEST_TIMEOUT_MS;

// Determine mock mode: default to true if not explicitly set to 'false'
export const USE_MOCK = String(RAW_USE_MOCK ?? 'true').toLowerCase() !== 'false';

// Base URL for backend API; only relevant when USE_MOCK === false
export const API_BASE_URL = RAW_API_BASE_URL || 'http://localhost:4000/api';

// Default request timeout in ms
export const REQUEST_TIMEOUT_MS = Number.isFinite(Number(RAW_TIMEOUT))
  ? Number(RAW_TIMEOUT)
  : 8000;

/**
 * PUBLIC_INTERFACE
 * getEnv
 * Return a snapshot of environment flags for diagnostics or conditional logic.
 */
export function getEnv() {
  return {
    USE_MOCK,
    API_BASE_URL,
    REQUEST_TIMEOUT_MS,
  };
}

export default {
  USE_MOCK,
  API_BASE_URL,
  REQUEST_TIMEOUT_MS,
  getEnv,
};
