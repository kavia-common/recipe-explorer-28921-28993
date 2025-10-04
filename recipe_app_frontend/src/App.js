import './App.css';
import './index.css';
import Header from './components/layout/Header';
import Container from './components/layout/Container';
import { RecipesProvider } from './state/RecipesContext.jsx';

/**
 * PUBLIC_INTERFACE
 * App
 * Minimal application shell using Ocean Professional theme.
 * Renders:
 * - Header with brand and search
 * - Recipe grid with loading/empty states
 * - RecipeDetailModal for viewing a selected recipe
 * - Wrapped in RecipesProvider for global state management
 */
function App() {
  // Import components inline to keep template simple (avoid dynamic imports)
  const RecipeGrid = require('./components/recipes/RecipeGrid.jsx').default;
  const RecipeDetailModal = require('./components/recipes/RecipeDetailModal.jsx').default;

  return (
    <RecipesProvider>
      <div className="app-root bg-ocean-gradient">
        <header className="app-header" role="banner">
          <Container>
            <Header />
          </Container>
        </header>

        <main className="app-main" role="main" aria-label="Main content">
          <Container>
            <section className="surface" style={{ padding: '1rem' }} aria-labelledby="welcome-title">
              <h1 id="welcome-title" className="section-title">Welcome to Recipe Explorer</h1>
              <p className="subtle">Start by searching for a recipe or browsing popular categories.</p>
            </section>

            <div className="mt-4">
              <section aria-labelledby="results-title">
                <h2 id="results-title" className="visually-hidden">Recipe results</h2>
                <RecipeGrid ariaLabel="Recipe results" />
              </section>
            </div>
          </Container>
        </main>

        {/* Modal portal within the app root (kept simple, no React portal to avoid extra complexity) */}
        <RecipeDetailModal />
      </div>
    </RecipesProvider>
  );
}

export default App;
