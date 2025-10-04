import { useMemo, useRef } from 'react';
import Modal from '../common/Modal';
import Badge from '../common/Badge';
import Button from '../common/Button';
import Icon from '../common/Icon';
import { useRecipes } from '../../state/useRecipes';

/**
 * PUBLIC_INTERFACE
 * RecipeDetailModal
 * Modal that shows details for the currently selected recipe.
 * - Pulls selectedRecipeId, filtered list, favorites, and actions from context
 * - Renders image, title, tags, meta (time, servings), ingredients and steps
 * - Provides close button (Esc and overlay also work)
 * - Toggle favorite button with aria-pressed
 */
export default function RecipeDetailModal() {
  const {
    selectedRecipeId,
    filtered,
    favorites,
    closeRecipe,
    toggleFavorite,
  } = useRecipes();

  const recipe = useMemo(
    () => (selectedRecipeId ? (filtered || []).find((r) => r.id === selectedRecipeId) : null),
    [selectedRecipeId, filtered]
  );

  const isOpen = Boolean(selectedRecipeId && recipe);
  const isFav = recipe ? favorites.includes(recipe.id) : false;
  const primaryActionRef = useRef(null);

  if (!isOpen) return null;

  const {
    id,
    title,
    description,
    image,
    tags = [],
    prepTime,
    cookTime,
    servings,
    cuisine,
    instructions = [],
    ingredients = [],
    rating,
  } = recipe;

  const totalTime = (Number(prepTime) || 0) + (Number(cookTime) || 0);

  const headerStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1.2fr',
    gap: '1rem',
    padding: '1rem',
    borderBottom: '1px solid var(--color-border)',
  };

  const bodyStyle = {
    padding: '1rem',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
  };

  const footerStyle = {
    padding: '0.75rem 1rem',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '0.5rem',
    borderTop: '1px solid var(--color-border)',
    background: 'var(--color-surface)',
    borderBottomLeftRadius: 'var(--radius-lg)',
    borderBottomRightRadius: 'var(--radius-lg)',
  };

  const titleRow = {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: '0.5rem',
  };

  const closeBtnStyle = {
    border: '1px solid var(--color-border)',
    background: 'var(--color-surface)',
    borderRadius: '10px',
    width: 36,
    height: 36,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: 'var(--shadow-xs)',
  };

  const metaItem = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.35rem',
    color: 'var(--color-text-muted)',
    fontWeight: 600,
  };

  const imgStyle = {
    width: '100%',
    height: '100%',
    minHeight: 180,
    maxHeight: 280,
    borderRadius: 'var(--radius-md)',
    objectFit: 'cover',
    border: '1px solid var(--color-border)',
    boxShadow: 'var(--shadow-sm)',
  };

  const listCard = {
    background: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-md)',
    padding: '0.75rem',
    boxShadow: 'var(--shadow-xs)',
  };

  const titleId = `recipe-modal-title-${id}`;
  const descId = `recipe-modal-desc-${id}`;

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeRecipe}
      titleId={titleId}
      descriptionId={descId}
      initialFocusRef={primaryActionRef}
    >
      <div aria-labelledby={titleId} aria-describedby={descId}>
        {/* Header */}
        <header style={headerStyle}>
          <div>
            <div style={titleRow}>
              <h2 id={titleId} style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
                {title}
              </h2>
              <button
                type="button"
                aria-label="Close dialog"
                title="Close"
                onClick={closeRecipe}
                style={closeBtnStyle}
              >
                <Icon name="close" ariaHidden={false} title="Close" />
              </button>
            </div>

            {description ? (
              <p id={descId} className="muted" style={{ marginTop: '0.25rem' }}>
                {description}
              </p>
            ) : (
              <p id={descId} className="visually-hidden">Recipe details</p>
            )}

            {/* Tags */}
            {tags.length > 0 || cuisine ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', marginTop: '0.5rem' }}>
                {cuisine ? (
                  <Badge color="secondary" pill title={cuisine}>
                    {cuisine}
                  </Badge>
                ) : null}
                {tags.map((t) => (
                  <Badge key={t} color="primary" pill title={t}>{t}</Badge>
                ))}
              </div>
            ) : null}

            {/* Meta */}
            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.75rem' }}>
              <span style={metaItem} aria-label={`Total time ${totalTime || 'N/A'} minutes`}>
                <Icon name="timer" ariaHidden />
                <span>{totalTime ? `${totalTime} min` : '—'}</span>
              </span>
              <span style={metaItem} aria-label={`Servings ${servings || 'N/A'}`}>
                <span>Servings:</span>
                <strong>{servings ?? '—'}</strong>
              </span>
              <span style={metaItem} aria-label={typeof rating === 'number' ? `Rating ${rating} out of 5` : 'No rating'}>
                <Icon name="star" color="var(--color-secondary)" ariaHidden />
                <span>{typeof rating === 'number' ? Math.round(rating * 10) / 10 : '—'}</span>
              </span>
            </div>
          </div>

          <div>
            <img
              src={image}
              alt={title ? `${title}${cuisine ? ` - ${cuisine}` : ''}` : 'Recipe image'}
              style={imgStyle}
            />
          </div>
        </header>

        {/* Body */}
        <div style={bodyStyle}>
          {/* Ingredients */}
          <section aria-labelledby="ingredients-title" style={listCard}>
            <h3 id="ingredients-title" className="section-title" style={{ fontSize: '1.05rem' }}>
              Ingredients
            </h3>
            <ul style={{ marginTop: '0.5rem', paddingLeft: '1rem', listStyle: 'disc' }}>
              {(ingredients || []).map((ing, i) => (
                <li key={`${i}-${ing}`} style={{ marginBottom: '0.25rem' }}>
                  {ing}
                </li>
              ))}
            </ul>
          </section>

          {/* Steps */}
          <section aria-labelledby="steps-title" style={listCard}>
            <h3 id="steps-title" className="section-title" style={{ fontSize: '1.05rem' }}>
              Steps
            </h3>
            <ol style={{ marginTop: '0.5rem', paddingLeft: '1.25rem' }}>
              {(instructions || []).map((s, i) => (
                <li key={`${i}-${s?.text}`} style={{ marginBottom: '0.35rem' }}>
                  {s?.text || ''}
                </li>
              ))}
            </ol>
          </section>
        </div>

        {/* Footer */}
        <footer style={footerStyle}>
          <Button
            variant="secondary"
            onClick={() => toggleFavorite(id)}
            ariaLabel={isFav ? `Remove ${title} from favorites` : `Add ${title} to favorites`}
          >
            <Icon
              name="star"
              ariaHidden={false}
              title={isFav ? 'Favorited' : 'Not favorited'}
              color={isFav ? 'var(--color-secondary)' : 'var(--color-text-muted)'}
            />
            {isFav ? 'Unfavorite' : 'Favorite'}
          </Button>

          <Button
            variant="primary"
            onClick={closeRecipe}
            ariaLabel="Close details"
            // focus this when opened
            ref={(el) => {
              // Support Button not forwarding ref; store DOM node
              primaryActionRef.current = el;
            }}
          >
            Close
          </Button>
        </footer>
      </div>

      {/* Responsive layout adjustments */}
      <style>{`
        @media (max-width: 800px) {
          .modal-content header {
            grid-template-columns: 1fr;
          }
          .modal-content > div:nth-of-type(2) {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </Modal>
  );
}
