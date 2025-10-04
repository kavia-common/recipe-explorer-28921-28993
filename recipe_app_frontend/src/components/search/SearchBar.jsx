import { useEffect, useMemo, useRef, useState } from 'react';
import Icon from '../common/Icon';
import { useRecipes } from '../../state/useRecipes';

/**
 * PUBLIC_INTERFACE
 * SearchBar
 * Accessible search input with 300ms debounce and clear button.
 * - aria-label and associated label for screen readers
 * - Calls RecipesContext.setSearch with debounced input
 * - Displays current query from context and keeps local edit state
 */
export default function SearchBar({
  placeholder = 'Search recipes by name, ingredient...',
  ariaLabel = 'Search recipes',
}) {
  const { query, setSearch } = useRecipes();
  const [value, setValue] = useState(query || '');
  const debounceRef = useRef(null);
  const inputRef = useRef(null);

  // Keep local input state in sync if external query changes elsewhere
  useEffect(() => {
    setValue(query || '');
  }, [query]);

  // Debounced setter
  const debouncedSetSearch = useMemo(() => {
    return (text) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        setSearch(text);
      }, 300);
    };
  }, [setSearch]);

  function onChange(e) {
    const next = e.target.value;
    setValue(next);
    debouncedSetSearch(next);
  }

  function clear() {
    setValue('');
    // Immediate clear for UX responsiveness
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setSearch('');
    // Return focus to input for quick re-entry
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }

  const wrapperStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 0.75rem',
    background: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow-xs)',
  };

  const inputStyle = {
    flex: 1,
    border: 'none',
    outline: 'none',
    background: 'transparent',
    color: 'var(--color-text)',
    fontSize: '0.95rem',
  };

  const clearBtnStyle = {
    border: 'none',
    background: 'transparent',
    cursor: value ? 'pointer' : 'default',
    padding: '0.25rem',
    borderRadius: 'var(--radius-sm)',
    color: 'var(--color-text-muted)',
  };

  return (
    <div role="search" aria-label="Recipe search">
      <label htmlFor="recipe-search-input" className="visually-hidden">
        {ariaLabel}
      </label>
      <div className="surface" style={wrapperStyle}>
        <Icon name="search" ariaHidden title="Search" />
        <input
          id="recipe-search-input"
          ref={inputRef}
          type="search"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          aria-label={ariaLabel}
          style={inputStyle}
        />
        <button
          type="button"
          onClick={value ? clear : undefined}
          aria-label="Clear search"
          title="Clear"
          style={clearBtnStyle}
          disabled={!value}
        >
          <Icon name="close" ariaHidden />
        </button>
      </div>
    </div>
  );
}
