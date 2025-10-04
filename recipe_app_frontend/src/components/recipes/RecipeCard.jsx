import Badge from '../common/Badge';
import Icon from '../common/Icon';

/**
 * PUBLIC_INTERFACE
 * RecipeCard
 * Card UI for a recipe with image, title, tags, cook time, and rating.
 * Provides:
 * - Clickable surface to open recipe (button semantics for accessibility).
 * - Dedicated favorite toggle button with aria-pressed and title.
 *
 * Props:
 * - recipe: Recipe object
 * - isFavorite: boolean
 * - onOpen: () => void
 * - onToggleFavorite: () => void
 */
export default function RecipeCard({ recipe, isFavorite = false, onOpen, onToggleFavorite }) {
  if (!recipe) return null;

  const { title, tags = [], cookTime, rating, image, cuisine } = recipe;

  const cardStyle = {
    display: 'flex',
    flexDirection: 'column',
    background: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow-sm)',
    overflow: 'hidden',
    transition: 'box-shadow var(--transition-base), transform var(--transition-base), border-color var(--transition-base)',
    cursor: 'pointer',
  };

  const imgWrapStyle = {
    position: 'relative',
    aspectRatio: '4/3',
    background: '#f3f4f6',
    overflow: 'hidden',
  };

  const imgStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  };

  const bodyStyle = {
    padding: '0.75rem 0.75rem 0.875rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  };

  const titleStyle = {
    fontSize: '1rem',
    fontWeight: 700,
    letterSpacing: '-0.01em',
    margin: 0,
  };

  const metaRowStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '0.5rem',
    color: 'var(--color-text-muted)',
    fontSize: '0.85rem',
  };

  const tagsRowStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.375rem',
  };

  const openButtonStyle = {
    // full-card button for keyboard activation and focus ring
    appearance: 'none',
    border: 'none',
    background: 'transparent',
    textAlign: 'left',
    padding: 0,
    margin: 0,
    cursor: 'pointer',
  };

  const favBtnStyle = {
    position: 'absolute',
    top: '0.5rem',
    right: '0.5rem',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '36px',
    height: '36px',
    borderRadius: 'var(--radius-pill)',
    background: 'rgba(255,255,255,0.85)',
    border: '1px solid var(--color-border)',
    boxShadow: 'var(--shadow-xs)',
    transition: 'transform var(--transition-base), box-shadow var(--transition-base), background var(--transition-base), border-color var(--transition-base)',
    cursor: 'pointer',
  };

  function handleCardKeyDown(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onOpen?.();
    }
  }

  const ratingRounded = typeof rating === 'number' ? Math.round(rating * 10) / 10 : null;
  const cookTimeText = typeof cookTime === 'number' ? `${cookTime} min` : null;

  return (
    <article className="card" style={cardStyle}>
      <div style={imgWrapStyle}>
        <img
          src={image}
          alt={title ? `${title}${cuisine ? ` - ${cuisine}` : ''}` : 'Recipe image'}
          style={imgStyle}
          loading="lazy"
        />
        <button
          type="button"
          onClick={onToggleFavorite}
          aria-pressed={isFavorite}
          aria-label={isFavorite ? `Remove ${title} from favorites` : `Add ${title} to favorites`}
          title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          style={favBtnStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.background = 'rgba(255,255,255,0.95)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = 'var(--shadow-xs)';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.background = 'rgba(255,255,255,0.85)';
          }}
        >
          <Icon
            name="star"
            size={18}
            color={isFavorite ? 'var(--color-secondary)' : 'var(--color-text-muted)'}
            ariaHidden={false}
            title={isFavorite ? 'Favorited' : 'Not favorited'}
          />
        </button>
      </div>

      <div style={bodyStyle}>
        <button
          type="button"
          onClick={onOpen}
          onKeyDown={handleCardKeyDown}
          aria-label={`Open recipe ${title}`}
          style={openButtonStyle}
        >
          <h3 style={titleStyle}>{title}</h3>
        </button>

        <div style={metaRowStyle}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <Icon name="timer" size={16} color="var(--color-text-muted)" ariaHidden />
            <span>{cookTimeText || '—'}</span>
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }} aria-label={ratingRounded ? `Rating ${ratingRounded} out of 5` : 'No rating'}>
            <Icon name="star" size={16} color="var(--color-secondary)" ariaHidden />
            <span>{ratingRounded ?? '—'}</span>
          </div>
        </div>

        {tags.length > 0 ? (
          <div style={tagsRowStyle}>
            {tags.slice(0, 3).map((t) => (
              <Badge key={t} color="primary" pill title={t}>
                {t}
              </Badge>
            ))}
            {tags.length > 3 ? (
              <Badge color="neutral" pill title={`${tags.length - 3} more`}>
                +{tags.length - 3}
              </Badge>
            ) : null}
          </div>
        ) : null}
      </div>
    </article>
  );
}
