//
// Recipes API abstraction.
// Exposes listRecipes, getRecipeById, searchRecipes, toggleFavorite.
// Switches between mock data and real REST calls based on env.USE_MOCK.
// Simulates network latency in mock mode to exercise loading states.
//

import { USE_MOCK } from '../config/env';
import { requestJson } from './client';
import mockRecipes from '../data/mockRecipes';
import { getFavorites as lsGetFavorites, toggleFavorite as lsToggleFavorite } from '../utils/storage';

/**
 * Simulate latency in mock mode: 200-400ms
 * @returns {Promise<void>}
 */
function delay() {
  const ms = 200 + Math.floor(Math.random() * 200);
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * PUBLIC_INTERFACE
 * @typedef {import('../types/recipe').default & { id: string }} Recipe
 */

/**
 * PUBLIC_INTERFACE
 * listRecipes
 * Returns all recipes. In mock mode returns local data, otherwise calls GET /recipes.
 *
 * @returns {Promise<Recipe[]>}
 */
export async function listRecipes() {
  if (USE_MOCK) {
    await delay();
    return [...mockRecipes];
  }
  // Placeholder for future backend
  // Expected endpoint: GET /recipes
  return requestJson('/recipes');
}

/**
 * PUBLIC_INTERFACE
 * getRecipeById
 * Fetch a single recipe by id. In mock mode, finds locally.
 *
 * @param {string} id
 * @returns {Promise<Recipe|null>}
 */
export async function getRecipeById(id) {
  if (!id) return null;
  if (USE_MOCK) {
    await delay();
    const item = mockRecipes.find((r) => r.id === id);
    return item ? { ...item } : null;
  }
  // Placeholder for future backend
  // Expected endpoint: GET /recipes/:id
  return requestJson(`/recipes/${encodeURIComponent(id)}`);
}

/**
 * PUBLIC_INTERFACE
 * searchRecipes
 * Search by free-text query on title/description/ingredients.
 * In mock mode, performs client-side filtering; otherwise calls GET /recipes/search?q=
 *
 * @param {string} query
 * @returns {Promise<Recipe[]>}
 */
export async function searchRecipes(query) {
  const q = String(query || '').trim();
  if (USE_MOCK) {
    await delay();
    if (!q) return [...mockRecipes];
    const needle = q.toLowerCase();
    return mockRecipes.filter((r) => {
      const hayTitle = (r.title || '').toLowerCase();
      const hayDesc = (r.description || '').toLowerCase();
      const hayIngs = (r.ingredients || []).join(' ').toLowerCase();
      return hayTitle.includes(needle) || hayDesc.includes(needle) || hayIngs.includes(needle);
    });
  }
  // Placeholder for future backend
  // Expected endpoint: GET /recipes/search?q=<query>
  const params = new URLSearchParams();
  if (q) params.set('q', q);
  const qs = params.toString();
  const path = qs ? `/recipes/search?${qs}` : '/recipes/search';
  return requestJson(path);
}

/**
 * PUBLIC_INTERFACE
 * toggleFavorite
 * Adds or removes a recipe id from local favorites. In future, when a user system exists,
 * this can call a backend endpoint; for now it's always local storage.
 *
 * @param {string} id
 * @returns {Promise<string[]>} Updated favorites list (ids)
 */
export async function toggleFavorite(id) {
  // Even in non-mock mode, favor client-side persistence until backend exists.
  await delay();
  return lsToggleFavorite(String(id));
}

/**
 * PUBLIC_INTERFACE
 * getFavorites
 * Returns list of favorite recipe IDs from local storage.
 *
 * @returns {Promise<string[]>}
 */
export async function getFavorites() {
  await delay();
  return lsGetFavorites();
}

// Convenience flag for UI to know current mode
export const isMock = USE_MOCK;

export default {
  listRecipes,
  getRecipeById,
  searchRecipes,
  toggleFavorite,
  getFavorites,
  isMock,
};
