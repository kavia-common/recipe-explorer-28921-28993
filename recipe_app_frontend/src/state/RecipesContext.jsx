import React, { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  listRecipes,
  searchRecipes as apiSearchRecipes,
  toggleFavorite as apiToggleFavorite,
  getFavorites as apiGetFavorites,
} from '../api/recipesApi';
import {
  getLastSearch,
  setLastSearch,
} from '../utils/storage';
import { filterRecipes } from '../utils/filters';

/**
 * PUBLIC_INTERFACE
 * RecipesContext
 * React context carrying the global state for the Recipe app.
 * State includes:
 * - recipes: the raw list loaded from API/mock
 * - filtered: filtered list based on query and tags (derived)
 * - loading, error: async state flags
 * - query: current search text
 * - tags: array of selected tags
 * - favorites: array of recipe IDs marked as favorite
 * - selectedRecipeId: id of the currently opened recipe (for detail view)
 * Actions:
 * - loadRecipes(): fetches and initializes recipes and favorites
 * - setSearch(query): updates search query and persists last search (debounced persist)
 * - setTags(tags): updates selected tags array
 * - openRecipe(id): sets selectedRecipeId
 * - closeRecipe(): clears selectedRecipeId
 * - toggleFavorite(id): toggles favorite state and updates favorites array
 */
export const RecipesContext = createContext(null);

// PUBLIC_INTERFACE
export function RecipesProvider({ children }) {
  /**
   * PUBLIC_INTERFACE
   * RecipesProvider
   * Provides recipes state and actions to children.
   */
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [tags, setTags] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [selectedRecipeId, setSelectedRecipeId] = useState(null);

  // Hydrate initial last search from storage once
  useEffect(() => {
    const last = getLastSearch();
    if (last) setQuery(last);
  }, []);

  // On first mount: read selected id from URL (?id=...) and subscribe to popstate
  useEffect(() => {
    if (typeof window === 'undefined') return;
    // Initialize from URL
    try {
      const url = new URL(window.location.href);
      const initialId = url.searchParams.get('id');
      if (initialId) {
        setSelectedRecipeId(initialId);
      }
    } catch {
      // ignore
    }

    // Handle back/forward buttons
    function onPopState() {
      try {
        const url = new URL(window.location.href);
        const id = url.searchParams.get('id');
        setSelectedRecipeId(id || null);
      } catch {
        // ignore
      }
    }
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  // On first mount: read selected id from URL (?id=...) and subscribe to popstate
  useEffect(() => {
    if (typeof window === 'undefined') return;
    // Initialize from URL
    try {
      const url = new URL(window.location.href);
      const initialId = url.searchParams.get('id');
      if (initialId) {
        setSelectedRecipeId(initialId);
      }
    } catch {
      // ignore
    }

    // Handle back/forward buttons
    function onPopState() {
      try {
        const url = new URL(window.location.href);
        const id = url.searchParams.get('id');
        setSelectedRecipeId(id || null);
      } catch {
        // ignore
      }
    }
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  // Load recipes and favorites
  const loadRecipes = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [list, favs] = await Promise.all([listRecipes(), apiGetFavorites()]);
      setRecipes(Array.isArray(list) ? list : []);
      setFavorites(Array.isArray(favs) ? favs : []);
    } catch (err) {
      const msg = err?.message || 'Failed to load recipes';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounced persist of search query
  const debounceRef = useRef(null);
  const setSearch = useCallback((q) => {
    const val = String(q || '');
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setLastSearch(val);
    }, 250);
  }, []);

  // Tag selection setter (expects string[])
  const setTagsSafe = useCallback((arr) => {
    setTags(Array.isArray(arr) ? arr : []);
  }, []);

  // Open and close a recipe by id
  const openRecipe = useCallback((id) => {
    const rid = id || null;
    setSelectedRecipeId(rid);

    // Optional routing sync (no-react-router fallback)
    try {
      if (typeof window !== 'undefined' && window.history && window.location) {
        const url = new URL(window.location.href);
        // Prefer path-style /recipe/:id only if app is configured for that; fallback to ?id
        // Since we cannot assume react-router-dom is installed, we use query param.
        if (rid) {
          url.searchParams.set('id', String(rid));
        } else {
          url.searchParams.delete('id');
        }
        window.history.pushState({ rid }, '', url.toString());
      }
    } catch {
      // ignore history errors
    }
  }, []);
  const closeRecipe = useCallback(() => {
    setSelectedRecipeId(null);
    // Optional routing sync (no-react-router fallback)
    try {
      if (typeof window !== 'undefined' && window.history && window.location) {
        const url = new URL(window.location.href);
        url.searchParams.delete('id');
        window.history.pushState({ rid: null }, '', url.toString());
      }
    } catch {
      // ignore history errors
    }
  }, []);

  // Toggle favorite: updates local storage through api and updates state
  const toggleFavorite = useCallback(async (id) => {
    const rid = String(id || '');
    if (!rid) return;
    try {
      const updated = await apiToggleFavorite(rid);
      setFavorites(Array.isArray(updated) ? updated : []);
    } catch (err) {
      // Keep UX resilient: swallow error but set error message
      setError(err?.message || 'Failed to toggle favorite');
    }
  }, []);

  // Derived: filtered recipes using local filter util (works for both mock and real)
  const filtered = useMemo(() => {
    return filterRecipes(recipes, { query, tags });
  }, [recipes, query, tags]);

  // Optional: API-backed search when query changes (kept simple, still derive locally for tags)
  // This is a conservative approach: use server/client search for query, then apply tag filtering locally
  const lastSearchedQueryRef = useRef('');
  useEffect(() => {
    let ignore = false;

    async function runSearch() {
      const q = String(query || '').trim();
      // Only call API if query changed (avoid loops)
      if (q === lastSearchedQueryRef.current) return;
      lastSearchedQueryRef.current = q;
      try {
        // In mock mode this will filter locally inside api; otherwise it calls backend search endpoint.
        // We store the result as our recipes base list.
        const results = await apiSearchRecipes(q);
        if (!ignore) {
          // When searching, replace the list as base; local tag filter still applies via 'filtered'
          setRecipes(Array.isArray(results) ? results : []);
        }
      } catch (err) {
        if (!ignore) setError(err?.message || 'Search failed');
      }
    }

    // Fire search only when there's a query; for empty query, load all recipes again if none loaded
    if (query) {
      runSearch();
    } else if (recipes.length === 0 && !loading && !error) {
      // When query cleared and no recipes yet, ensure we load all
      loadRecipes();
    }

    return () => {
      ignore = true;
    };
  }, [query]); // eslint-disable-line react-hooks/exhaustive-deps

  const value = useMemo(
    () => ({
      // state
      recipes,
      filtered,
      loading,
      error,
      query,
      tags,
      favorites,
      selectedRecipeId,
      // actions
      loadRecipes,
      setSearch,
      setTags: setTagsSafe,
      openRecipe,
      closeRecipe,
      toggleFavorite,
    }),
    [
      recipes,
      filtered,
      loading,
      error,
      query,
      tags,
      favorites,
      selectedRecipeId,
      loadRecipes,
      setSearch,
      setTagsSafe,
      openRecipe,
      closeRecipe,
      toggleFavorite,
    ]
  );

  return <RecipesContext.Provider value={value}>{children}</RecipesContext.Provider>;
}

export default RecipesContext;
