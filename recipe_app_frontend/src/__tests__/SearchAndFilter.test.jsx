import { render, screen, within, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

// Use modern fake timers to handle SearchBar debounce (300ms) and API mock delay (200-400ms)
jest.useFakeTimers();

function advanceAllTimers() {
  // Advance enough for both 300ms debounce and up to 400ms mock delay
  act(() => {
    jest.advanceTimersByTime(800);
  });
}

test('typing in SearchBar filters RecipeCard titles; clear restores list', async () => {
  const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

  render(<App />);

  // Wait for initial grid to load
  const region = await screen.findByRole('region', { name: /Recipe results/i });
  // Snapshot initial expected at least several recipes present
  // Find some known titles from mock data
  await screen.findByRole('heading', { name: /Spaghetti Bolognese/i });

  const search = screen.getByRole('search', { name: /Recipe search/i });
  const input = within(search).getByRole('searchbox', { name: /Search recipes/i });

  // Type 'ramen' and expect only "Simple Miso Ramen" to remain
  await user.clear(input);
  await user.type(input, 'ramen');

  advanceAllTimers();

  const ramenCard = await screen.findByRole('heading', { name: /Simple Miso Ramen/i });
  expect(ramenCard).toBeInTheDocument();

  // Check that another unrelated title is not present
  expect(screen.queryByRole('heading', { name: /Spaghetti Bolognese/i })).not.toBeInTheDocument();

  // Click clear button
  const clearBtn = within(search).getByRole('button', { name: /Clear search/i });
  await user.click(clearBtn);

  advanceAllTimers();

  // Original titles return
  expect(await screen.findByRole('heading', { name: /Spaghetti Bolognese/i })).toBeInTheDocument();
});
