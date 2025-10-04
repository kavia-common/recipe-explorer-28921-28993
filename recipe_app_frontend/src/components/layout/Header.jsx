/* App Header with brand, placeholder search area, and actions */

import Button from '../common/Button';
import Icon from '../common/Icon';

// PUBLIC_INTERFACE
export default function Header() {
  /**
   * PUBLIC_INTERFACE
   * Header
   * Provides:
   * - Brand area (left)
   * - Search placeholder (center)
   * - Actions area (right)
   */
  return (
    <nav
      aria-label="Primary"
      role="navigation"
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 2fr 1fr',
        alignItems: 'center',
        gap: '1rem',
        paddingTop: '0.75rem',
        paddingBottom: '0.75rem',
      }}
    >
      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <div
          aria-hidden="true"
          style={{
            width: 32,
            height: 32,
            borderRadius: '8px',
            background: 'linear-gradient(135deg, rgba(37,99,235,0.9), rgba(37,99,235,0.6))',
            boxShadow: 'var(--shadow-sm)',
          }}
        />
        <div>
          <div style={{ fontWeight: 800, letterSpacing: '-0.02em' }}>Recipe Explorer</div>
          <div className="muted" style={{ fontSize: '0.75rem' }}>Discover, cook, enjoy</div>
        </div>
      </div>

      {/* Placeholder Search */}
      <div aria-label="Search" role="search">
        <div
          className="surface"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 0.75rem',
          }}
        >
          <Icon name="search" />
          <span className="muted" style={{ fontSize: '0.9rem' }}>
            Search recipes (coming soon)
          </span>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
        <Button variant="secondary" ariaLabel="View favorites">
          <Icon name="star" color="var(--color-secondary)" />
          Favorites
        </Button>
        <Button variant="primary" ariaLabel="Sign in">
          Sign In
        </Button>
      </div>

      {/* Responsive adjustments */}
      <style>{`
        @media (max-width: 900px) {
          nav[role="navigation"] {
            grid-template-columns: 1fr;
            row-gap: 0.75rem;
          }
          nav[role="navigation"] > div:nth-child(3) {
            justify-content: flex-start;
          }
        }
      `}</style>
    </nav>
  );
}
