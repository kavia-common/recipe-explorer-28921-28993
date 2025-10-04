//
// Lightweight fetch client wrapper with baseURL and timeout.
// No external dependencies.
//

import { API_BASE_URL, REQUEST_TIMEOUT_MS } from '../config/env';

/**
 * PUBLIC_INTERFACE
 * @typedef {Object} RequestOptions
 * @property {'GET'|'POST'|'PUT'|'PATCH'|'DELETE'} [method]
 * @property {Record<string,string>} [headers]
 * @property {any} [body] - If provided and not string/Blob/FormData, will be JSON.stringified and content-type set to application/json
 * @property {number} [timeoutMs] - Overrides default timeout
 */

/**
 * PUBLIC_INTERFACE
 * request
 * Thin wrapper around fetch with baseURL and timeout support.
 *
 * @param {string} path - Relative path (e.g., '/recipes')
 * @param {RequestOptions} [options]
 * @returns {Promise<Response>}
 */
export async function request(path, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options.timeoutMs ?? REQUEST_TIMEOUT_MS);

  const url = joinUrl(API_BASE_URL, path);

  const headers = { ...(options.headers || {}) };
  let body = options.body;

  // Auto JSON encode if body is a plain object
  const isPlainObject =
    body &&
    typeof body === 'object' &&
    !(body instanceof FormData) &&
    !(body instanceof Blob) &&
    !(body instanceof ArrayBuffer);

  if (isPlainObject) {
    headers['Content-Type'] = headers['Content-Type'] || 'application/json';
    body = JSON.stringify(body);
  }

  try {
    const res = await fetch(url, {
      method: options.method || 'GET',
      headers,
      body,
      signal: controller.signal,
    });
    return res;
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * PUBLIC_INTERFACE
 * requestJson
 * Calls request() and parses JSON, throwing on non-2xx responses with parsed error if available.
 *
 * @param {string} path
 * @param {RequestOptions} [options]
 * @returns {Promise<any>}
 */
export async function requestJson(path, options = {}) {
  const res = await request(path, options);
  const contentType = res.headers.get('content-type') || '';
  const hasJson = contentType.includes('application/json');
  if (!res.ok) {
    let errorPayload = null;
    try {
      errorPayload = hasJson ? await res.json() : await res.text();
    } catch {
      // ignore parse error
    }
    const err = new Error(`HTTP ${res.status}`);
    err.status = res.status;
    err.payload = errorPayload;
    throw err;
  }
  return hasJson ? res.json() : res.text();
}

/**
 * Join baseURL and path safely.
 */
function joinUrl(base, path) {
  const b = String(base || '').replace(/\/+$/, '');
  const p = String(path || '').replace(/^\/+/, '');
  return `${b}/${p}`;
}

export default {
  request,
  requestJson,
};
