import { useEffect, useMemo, useState } from 'react';
import Badge from '../common/Badge';
import { useRecipes } from '../../state/useRecipes';

/**
 * PUBLIC_INTERFACE
 * TagFilters
 * Renders a set of selectable, keyboard-focusable tag chips.
 * - Multi-select
 * - Calls RecipesContext.setTags(selectedTags)
 * - Provides aria-pressed semantics for toggle buttons
 */
export default function TagFilters({
  availableTags = ['Italian', 'Mexican', 'Vegan', 'Gluten-Free', 'Quick', 'Dessert'],
  ariaLabel = 'Filter by tags',
}) {
  const { tags, setTags } = useRecipes();
  const [selected, setSelected] = useState(new Set(tags || []));

  // Sync from context updates
  useEffect(() => {
    setSelected(new Set(tags || []));
  }, [tags]);

  const toggle = (tag) => {
    const next = new Set(selected);
    if (next.has(tag)) next.delete(tag);
    else next.add(tag);
    setSelected(next);
    setTags(Array.from(next));
  };

  const containerStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
  };

  const chipBaseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.375rem',
    padding: '0.35rem 0.6rem',
    borderRadius: '9999px',
    border: '1px solid var(--color-border)',
    background: 'var(--color-surface)',
    color: 'var(--color-text)',
    fontWeight: 600,
    fontSize: '0.8rem',
    boxShadow: 'var(--shadow-xs)',
    cursor: 'pointer',
    transition: 'background var(--transition-base), box-shadow var(--transition-base), transform var(--transition-base), border-color var(--transition-base)',
  };

  const selectedStyle = {
    background: 'rgba(37,99,235,0.08)',
    borderColor: 'rgba(37,99,235,0.2)',
    color: 'var(--color-primary)',
  };

  const chipStyle = (isActive) => ({
    ...chipBaseStyle,
    ...(isActive ? selectedStyle : {}),
  });

  const items = useMemo(() => availableTags.map((t) => String(t)), [availableTags]);

  return (
    <div aria-label={ariaLabel}>
      <div style={containerStyle}>
        {items.map((tag) => {
          const active = selected.has(tag);
          return (
            <button
              key={tag}
              type="button"
              role="button"
              aria-pressed={active}
              title={active ? `Remove ${tag} filter` : `Add ${tag} filter`}
              onClick={() => toggle(tag)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  toggle(tag);
                }
              }}
              style={chipStyle(active)}
            >
              <span>{tag}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
