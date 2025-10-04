import './App.css';
import './index.css';
import Header from './components/layout/Header';
import Container from './components/layout/Container';

/**
 * PUBLIC_INTERFACE
 * App
 * Minimal application shell using Ocean Professional theme.
 * Renders:
 * - Header with brand and placeholder search
 * - Main content area wrapped in Container
 */
function App() {
  return (
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
        </Container>
      </main>
    </div>
  );
}

export default App;
