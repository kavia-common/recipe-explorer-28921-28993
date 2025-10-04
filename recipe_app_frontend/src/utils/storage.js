/**
 * Local storage utilities for persisting client-side state.
 * Keys:
 * - recipe:favorites: string[] of recipe IDs
 * - recipe:lastSearch: string for last search query
 *
 * Functions are defensive and no-op on server/non-browser environments.
 */

const FAVORITES_KEY = 'recipe:favorites';
const LAST_SEARCH_KEY = 'recipe:lastSearch';

function safeGetStorage() {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage;
    }
  } catch {
    // Ignore access errors (e.g., privacy mode)
  }
  return null;
}

// PUBLIC_INTERFACE
export function getFavorites() {
  /**
   * Returns an array of recipe IDs marked as favorites.
   */
  const ls = safeGetStorage();
  if (!ls) return [];
  try {
    const raw = ls.getItem(FAVORITES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// PUBLIC_INTERFACE
export function setFavorites(ids) {
  /**
   * Stores an array of recipe IDs as favorites.
   * @param {string[]} ids
   */
  const ls = safeGetStorage();
  if (!ls) return;
  try {
    ls.setItem(FAVORITES_KEY, JSON.stringify(Array.isArray(ids) ? ids : []));
  } catch {
    // ignore quota or serialization errors
  }
}

// PUBLIC_INTERFACE
export function toggleFavorite(id) {
  /**
   * Adds/removes a recipe ID from favorites and returns updated list.
   * @param {string} id
   * @returns {string[]} updated favorites
   */
  const current = new Set(getFavorites());
  if (current.has(id)) {
    current.delete(id);
  } else {
    current.add(id);
  }
  const updated = Array.from(current);
  setFavorites(updated);
  return updated;
}

// PUBLIC_INTERFACE
export function isFavorite(id) {
  /**
   * Checks if a recipe ID is in favorites.
   * @param {string} id
   * @returns {boolean}
   */
  return getFavorites().includes(id);
}

// PUBLIC_INTERFACE
export function getLastSearch() {
  /**
   * Retrieves the last search string from storage.
   * @returns {string}
   */
  const ls = safeGetStorage();
  if (!ls) return '';
  try {
    return ls.getItem(LAST_SEARCH_KEY) || '';
  } catch {
    return '';
  }
}

// PUBLIC_INTERFACE
export function setLastSearch(query) {
  /**
   * Persists the last search string.
   * @param {string} query
   */
  const ls = safeGetStorage();
  if (!ls) return;
  try {
    ls.setItem(LAST_SEARCH_KEY, String(query || ''));
  } catch {
    // ignore
  }
}

export const KEYS = {
  FAVORITES_KEY,
  LAST_SEARCH_KEY,
};

export default {
  getFavorites,
  setFavorites,
  toggleFavorite,
  isFavorite,
  getLastSearch,
  setLastSearch,
  KEYS,
};
