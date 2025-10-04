import { render, screen, within, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import { KEYS } from '../utils/storage';

// Use real localStorage provided by jsdom; ensure clean slate between tests
beforeEach(() => {
  window.localStorage.clear();
});

afterEach(() => {
  cleanup();
});

jest.useFakeTimers();

function advanceAll() {
  // accommodate debounce and mock API delays
  jest.advanceTimersByTime(800);
}

test('favorite toggle persists and rehydrates from localStorage on remount', async () => {
  const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

  const { unmount } = render(<App />);

  // Wait for grid and a known card
  await screen.findByRole('heading', { name: /Spaghetti Bolognese/i });

  // Find the "Spaghetti Bolognese" card container by heading then its favorite button
  const cardButtonOpen = screen.getByRole('button', { name: /Open recipe Spaghetti Bolognese/i });
  const card = cardButtonOpen.closest('article');
  expect(card).toBeInTheDocument();

  // Favorite button inside image area uses aria-pressed and dynamic aria-label
  const favBtn = within(card).getByRole('button', { name: /Add .*Spaghetti Bolognese.* to favorites/i });
  await user.click(favBtn);
  advanceAll();

  // Button should now be pressed and label updated
  const favBtnAfter = within(card).getByRole('button', { name: /Remove .*Spaghetti Bolognese.* from favorites/i });
  expect(favBtnAfter).toHaveAttribute('aria-pressed', 'true');

  // Ensure persisted in localStorage
  const raw = window.localStorage.getItem(KEYS.FAVORITES_KEY);
  expect(raw).toBeTruthy();
  const ids = JSON.parse(raw);
  expect(Array.isArray(ids)).toBe(true);
  expect(ids).toContain('spaghetti-bolognese');

  // Unmount and remount app (simulate reload/provider rehydrate)
  unmount();

  const { rerender } = render(<App />);
  await screen.findByRole('heading', { name: /Spaghetti Bolognese/i });

  // Locate card again and verify favorite state restored
  const reopenedCardBtn = screen.getByRole('button', { name: /Open recipe Spaghetti Bolognese/i });
  const reopenedCard = reopenedCardBtn.closest('article');
  const favBtnRestored = within(reopenedCard).getByRole('button', { name: /Remove .*Spaghetti Bolognese.* from favorites/i });
  expect(favBtnRestored).toHaveAttribute('aria-pressed', 'true');
});
