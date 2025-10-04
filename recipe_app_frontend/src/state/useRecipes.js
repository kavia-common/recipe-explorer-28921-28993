import { useContext } from 'react';
import { RecipesContext } from './RecipesContext.jsx';

/**
 * PUBLIC_INTERFACE
 * useRecipes
 * Hook to access the RecipesContext safely.
 * Provides:
 * - State: recipes, filtered, loading, error, query, tags, favorites, selectedRecipeId
 * - Actions: loadRecipes, setSearch, setTags, openRecipe, closeRecipe, toggleFavorite
 *
 * @returns {import('react').ContextType<typeof RecipesContext>}
 */
export function useRecipes() {
  const ctx = useContext(RecipesContext);
  if (!ctx) {
    throw new Error('useRecipes must be used within a RecipesProvider');
  }
  return ctx;
}

export default useRecipes;
