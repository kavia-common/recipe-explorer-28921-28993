import Container from '../components/layout/Container';
import { useRecipes } from '../state/useRecipes';
import RecipeGrid from '../components/recipes/RecipeGrid';

/**
 * PUBLIC_INTERFACE
 * Home
 * Main page layout showing a welcome surface and the RecipeGrid.
 * Uses RecipesContext to reflect loading/error states implicitly via RecipeGrid.
 */
export default function Home() {
  const { loading, filtered, error } = useRecipes();

  const welcomeStyle = {
    padding: '1rem',
    position: 'relative',
    overflow: 'hidden',
    background:
      'linear-gradient(180deg, rgba(37,99,235,0.06), rgba(255,255,255,0.9))',
  };

  const accentGradient = {
    position: 'absolute',
    inset: 0,
    background:
      'radial-gradient(500px 250px at 10% -20%, rgba(37,99,235,0.12), transparent), radial-gradient(400px 220px at 110% 0%, rgba(245,158,11,0.10), transparent)',
    pointerEvents: 'none',
  };

  return (
    <Container>
      <section className="surface" style={welcomeStyle} aria-labelledby="welcome-title">
        <div style={accentGradient} aria-hidden="true" />
        <h1 id="welcome-title" className="section-title">Recipe Explorer</h1>
        <p className="subtle">
          {loading
            ? 'Loading recipes...'
            : error
            ? 'We encountered an issue loading recipes.'
            : filtered && filtered.length > 0
            ? 'Browse delicious ideas or refine your search.'
            : 'Try searching for pasta, vegan, dessert, and more.'}
        </p>
      </section>

      <div className="mt-4">
        <section aria-labelledby="results-title">
          <h2 id="results-title" className="visually-hidden">Recipe results</h2>
          <RecipeGrid ariaLabel="Recipe results" />
        </section>
      </div>
    </Container>
  );
}
