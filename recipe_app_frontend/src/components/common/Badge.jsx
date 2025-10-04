/* Badge component for categories/tags with color variants */

// PUBLIC_INTERFACE
export default function Badge({
  children,
  color = 'primary', // primary | secondary | success | error | neutral
  pill = true,
  title,
}) {
  /**
   * PUBLIC_INTERFACE
   * Badge
   * Props:
   * - color: variant key
   * - pill: rounded pill style
   * - title: title attribute for tooltip
   */
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.375rem',
    fontWeight: 600,
    fontSize: '0.75rem',
    padding: '0.25rem 0.5rem',
    borderRadius: pill ? '9999px' : '8px',
    border: '1px solid transparent',
    userSelect: 'none',
    lineHeight: 1.2,
  };

  const variants = {
    primary: {
      color: 'var(--color-primary)',
      background: 'rgba(37,99,235,0.08)',
      borderColor: 'rgba(37,99,235,0.15)',
    },
    secondary: {
      color: 'var(--color-secondary)',
      background: 'rgba(245,158,11,0.1)',
      borderColor: 'rgba(245,158,11,0.18)',
    },
    success: {
      color: 'var(--color-success)',
      background: 'rgba(16,185,129,0.08)',
      borderColor: 'rgba(16,185,129,0.18)',
    },
    error: {
      color: 'var(--color-error)',
      background: 'rgba(239,68,68,0.08)',
      borderColor: 'rgba(239,68,68,0.18)',
    },
    neutral: {
      color: 'var(--color-text)',
      background: '#f3f4f6',
      borderColor: 'var(--color-border)',
    },
  };

  const style = { ...base, ...variants[color] };

  return (
    <span style={style} title={title} aria-label={typeof children === 'string' ? children : undefined}>
      {children}
    </span>
  );
}
