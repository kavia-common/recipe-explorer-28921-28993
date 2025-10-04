import { useEffect } from 'react';
import { useRecipes } from '../../state/useRecipes';
import RecipeCard from './RecipeCard';
import RecipeSkeleton from './RecipeSkeleton';
import EmptyState from './EmptyState';

/**
 * PUBLIC_INTERFACE
 * RecipeGrid
 * Displays a responsive grid of recipes, with loading skeletons and empty state.
 * Integrates with RecipesContext to load recipes and handle openRecipe and toggleFavorite.
 *
 * Props:
 * - ariaLabel: accessible label for the grid region
 */
export default function RecipeGrid({ ariaLabel = 'Recipe results' }) {
  const {
    filtered,
    loading,
    error,
    favorites,
    loadRecipes,
    openRecipe,
    toggleFavorite,
  } = useRecipes();

  // Load initial data once
  useEffect(() => {
    loadRecipes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Simple responsive grid style
  const gridStyle = {
    display: 'grid',
    gap: '1rem',
    gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
  };

  const gridStyleResponsive = `
    @media (min-width: 520px) {
      .recipe-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    }
    @media (min-width: 900px) {
      .recipe-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
    }
    @media (min-width: 1200px) {
      .recipe-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }
    }
  `;

  // Loading: show skeleton cards
  if (loading) {
    return (
      <section aria-label={ariaLabel} aria-busy="true" aria-live="polite">
        <div className="recipe-grid" style={gridStyle}>
          {Array.from({ length: 8 }).map((_, i) => (
            <RecipeSkeleton key={i} />
          ))}
        </div>
        <style>{gridStyleResponsive}</style>
      </section>
    );
  }

  // Error or empty: show friendly empty state (prefer error message if present)
  if (!loading && (error || !filtered || filtered.length === 0)) {
    return (
      <section aria-label={ariaLabel} aria-live="polite">
        <EmptyState
          title={error ? 'Something went wrong' : 'No recipes found'}
          message={
            error
              ? 'We were unable to load recipes. Please try again.'
              : 'Try adjusting your search or filters.'
          }
          actionLabel="Reload"
          onAction={loadRecipes}
        />
      </section>
    );
  }

  // Normal grid
  return (
    <section aria-label={ariaLabel}>
      <div className="recipe-grid" style={gridStyle}>
        {filtered.map((r) => (
          <RecipeCard
            key={r.id}
            recipe={r}
            isFavorite={favorites.includes(r.id)}
            onOpen={() => openRecipe(r.id)}
            onToggleFavorite={() => toggleFavorite(r.id)}
          />
        ))}
      </div>
      <style>{gridStyleResponsive}</style>
    </section>
  );
}
