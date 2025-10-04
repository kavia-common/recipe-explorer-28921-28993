import { render, screen, within } from '@testing-library/react';
import App from '../App';
import { RecipesProvider } from '../state/RecipesContext.jsx';

// Utility to render the app wrapped in provider to match runtime
function renderApp() {
  return render(
    <RecipesProvider>
      <div className="app-root">
        <header className="app-header">
          {/* App itself renders <Header /> internally */}
        </header>
        <App />
      </div>
    </RecipesProvider>
  );
}

test('renders Header brand, search input, and grid container; no CRA default text', async () => {
  renderApp();

  // Header brand area
  const header = screen.getByRole('banner');
  const brand = within(header).getByLabelText(/Recipe Explorer brand/i);
  expect(brand).toBeInTheDocument();
  expect(within(brand).getByText(/Recipe Explorer/i)).toBeInTheDocument();

  // SearchBar input
  const search = screen.getByRole('search', { name: /recipe search/i });
  const input = within(search).getByRole('searchbox', { name: /search recipes/i });
  expect(input).toBeInTheDocument();

  // Grid section region presence
  const gridRegion = await screen.findByRole('region', { name: /Recipe results/i });
  expect(gridRegion).toBeInTheDocument();

  // Ensure no CRA "learn react" remnants
  const learnReact = screen.queryByText(/learn react/i);
  expect(learnReact).not.toBeInTheDocument();
});
