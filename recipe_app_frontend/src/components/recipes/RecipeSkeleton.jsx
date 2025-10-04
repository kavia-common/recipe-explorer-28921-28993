 /**
  * PUBLIC_INTERFACE
  * RecipeSkeleton
  * Skeleton loading placeholder matching the RecipeCard layout.
  */
export default function RecipeSkeleton() {
  const card = {
    background: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow-sm)',
    overflow: 'hidden',
  };

  const shimmer = {
    background: 'linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 37%, #f3f4f6 63%)',
    backgroundSize: '400% 100%',
    animation: 'shimmer 1.4s ease infinite',
  };

  const img = {
    height: 0,
    paddingTop: '75%', // 4:3 aspect
    ...shimmer,
  };

  const body = {
    padding: '0.75rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  };

  const line = (w) => ({
    width: w,
    height: '12px',
    borderRadius: '8px',
    background: '#f3f4f6',
    ...shimmer,
  });

  return (
    <div style={card} aria-hidden="true">
      <div style={img} />
      <div style={body}>
        <div style={line('70%')} />
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <div style={line('30%')} />
          <div style={line('20%')} />
        </div>
        <div style={{ display: 'flex', gap: '0.35rem' }}>
          <div style={line('18%')} />
          <div style={line('14%')} />
          <div style={line('10%')} />
        </div>
      </div>
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );
}
