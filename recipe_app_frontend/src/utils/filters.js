/**
 * Pure filter helpers for recipe search.
 * - Text search: matches title, description, and ingredients
 * - Tag filter: matches selected tags and cuisines
 *
 * All functions are unit-friendly and side-effect free.
 */

/**
 * Normalize string for loose matching.
 */
function norm(str) {
  return String(str || '').toLowerCase().trim();
}

/**
 * Returns true if any ingredient contains the query.
 */
function ingredientsMatch(ingredients = [], q = '') {
  const query = norm(q);
  if (!query) return false;
  return ingredients.some((ing) => norm(ing).includes(query));
}

// PUBLIC_INTERFACE
export function searchMatch(recipe, query) {
  /**
   * Checks if the recipe matches the free-text search query.
   * Matches on title, description, and ingredients.
   *
   * @param {object} recipe
   * @param {string} query
   * @returns {boolean}
   */
  const q = norm(query);
  if (!q) return true;
  return (
    norm(recipe.title).includes(q) ||
    norm(recipe.description).includes(q) ||
    ingredientsMatch(recipe.ingredients, q)
  );
}

// PUBLIC_INTERFACE
export function tagsMatch(recipe, { tags = [], cuisines = [] } = {}) {
  /**
   * Checks if the recipe matches selected tags and cuisines.
   * Both tag and cuisine filters are ANDed together:
   * - If tags array has values, recipe must include ALL those tags.
   * - If cuisines array has values, recipe.cuisine must match ANY of them.
   *
   * @param {object} recipe
   * @param {{ tags?: string[], cuisines?: string[] }} filters
   * @returns {boolean}
   */
  const wantedTags = (tags || []).map(norm).filter(Boolean);
  const wantedCuisines = (cuisines || []).map(norm).filter(Boolean);

  const hasTags =
    wantedTags.length === 0 ||
    wantedTags.every((t) => (recipe.tags || []).map(norm).includes(t));
  const hasCuisine =
    wantedCuisines.length === 0 || wantedCuisines.includes(norm(recipe.cuisine));

  return hasTags && hasCuisine;
}

// PUBLIC_INTERFACE
export function filterRecipes(recipes, { query = '', tags = [], cuisines = [] } = {}) {
  /**
   * Filters recipes by text search and tag/cuisine selection.
   * Returns a new array; does not mutate inputs.
   *
   * @param {Array<object>} recipes
   * @param {{ query?: string, tags?: string[], cuisines?: string[] }} options
   * @returns {Array<object>}
   */
  const arr = Array.isArray(recipes) ? recipes : [];
  return arr.filter((r) => searchMatch(r, query) && tagsMatch(r, { tags, cuisines }));
}

export default {
  searchMatch,
  tagsMatch,
  filterRecipes,
};
