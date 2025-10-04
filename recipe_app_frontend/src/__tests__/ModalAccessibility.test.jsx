import { render, screen, within, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

jest.useFakeTimers();

function advanceAll() {
  jest.advanceTimersByTime(800);
}

test('modal open sets focus to primary action, Esc and overlay close it, and focus returns to trigger', async () => {
  const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

  render(<App />);

  // Wait for a known card
  const openBtn = await screen.findByRole('button', { name: /Open recipe Spaghetti Bolognese/i });

  // Track focus returning to this opener
  openBtn.focus();
  expect(openBtn).toHaveFocus();

  // Open the detail modal
  await user.click(openBtn);
  advanceAll();

  // Modal should render with a dialog role and a "Close" primary action button
  const dialog = await screen.findByRole('dialog', { hidden: false });
  expect(dialog).toBeInTheDocument();

  // Primary action is the "Close" button in modal footer. It should be focused initially via initialFocusRef.
  // The Button component renders a native <button>, so role=button with name Close exists.
  const primaryClose = within(dialog).getByRole('button', { name: /^Close$/i });

  // Allow microtask flush for focus setTimeout(0)
  advanceAll();
  expect(primaryClose).toHaveFocus();

  // Press Escape to close
  await user.keyboard('{Escape}');
  advanceAll();

  // Dialog should be gone
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

  // Focus should return to the previously focused trigger (openBtn)
  expect(openBtn).toHaveFocus();

  // Re-open to test overlay click close and focus trap presence
  await user.click(openBtn);
  advanceAll();
  const dialog2 = await screen.findByRole('dialog', { hidden: false });
  const primaryClose2 = within(dialog2).getByRole('button', { name: /^Close$/i });

  // Tab to cycle inside focusables to assert trap (Tab past last goes to first)
  primaryClose2.focus();
  expect(primaryClose2).toHaveFocus();
  await user.tab(); // move to previous button in footer ("Unfavorite"/"Favorite") or first focusable
  // We can't guarantee exact order of focusables depending on favorite state, but focus remains inside dialog
  expect(dialog2).toContainElement(document.activeElement);

  // Click overlay to close.
  // The overlay is a presentation div wrapping the dialog. We can click on the parent of dialog.
  const overlay = dialog2.parentElement;
  // Simulate mouse down on overlay (Modal listens to onMouseDown)
  fireEvent.mouseDown(overlay, { target: overlay });
  advanceAll();

  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  expect(openBtn).toHaveFocus();
});
