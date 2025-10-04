import Button from '../common/Button';
import Icon from '../common/Icon';

/**
 * PUBLIC_INTERFACE
 * EmptyState
 * Friendly placeholder for empty results or errors.
 *
 * Props:
 * - title: string
 * - message: string
 * - actionLabel?: string
 * - onAction?: () => void
 */
export default function EmptyState({ title = 'No results', message = 'Try changing your search or filters.', actionLabel, onAction }) {
  const wrap = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
  };

  const card = {
    width: '100%',
    maxWidth: 560,
    background: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow-sm)',
    padding: '1.25rem',
    textAlign: 'center',
  };

  const iconWrap = {
    width: 56,
    height: 56,
    borderRadius: '50%',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 0.75rem',
    background: 'rgba(37,99,235,0.08)',
    border: '1px solid rgba(37,99,235,0.18)',
  };

  const titleStyle = {
    fontWeight: 800,
    letterSpacing: '-0.02em',
    fontSize: '1.125rem',
    marginBottom: '0.375rem',
  };

  const msgStyle = {
    color: 'var(--color-text-muted)',
    marginBottom: '0.875rem',
  };

  return (
    <div style={wrap}>
      <div className="surface" style={card}>
        <div style={iconWrap} aria-hidden="true">
          <Icon name="search" size={24} color="var(--color-primary)" />
        </div>
        <div style={titleStyle}>{title}</div>
        <div style={msgStyle}>{message}</div>
        {actionLabel && onAction ? (
          <Button variant="secondary" onClick={onAction} ariaLabel={actionLabel}>
            {actionLabel}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
