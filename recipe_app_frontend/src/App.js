import './App.css';
import './index.css';
import Header from './components/layout/Header';
import Container from './components/layout/Container';
import { RecipesProvider } from './state/RecipesContext.jsx';

// PUBLIC_INTERFACE
export default function App() {
  /**
   * PUBLIC_INTERFACE
   * App
   * Application shell using the Ocean Professional theme.
   * Composition:
   * - Wraps entire app with RecipesProvider
   * - Sticky Header with SearchBar and TagFilters
   * - Home page content area rendering RecipeGrid based on context state
   * - RecipeDetailModal controlled by context/route
   * - Ocean gradient background and subtle accents
   */
  const Home = require('./pages/Home.jsx').default;
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
          <Home />
        </main>

        <RecipeDetailModal />
      </div>
    </RecipesProvider>
  );
}
