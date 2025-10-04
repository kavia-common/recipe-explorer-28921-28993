//
// Ocean Professional theme tokens and helpers
//

// PUBLIC_INTERFACE
export const theme = {
  colors: {
    primary: '#2563EB', // blue-600
    secondary: '#F59E0B', // amber-500 (used for success/accent)
    success: '#10B981', // emerald-500 for explicit success
    warning: '#F59E0B', // amber-500
    error: '#EF4444', // red-500
    bg: '#f9fafb', // gray-50
    surface: '#ffffff', // white
    text: '#111827', // gray-900
    textMuted: '#6B7280', // gray-500
    border: '#E5E7EB', // gray-200
    overlay: 'rgba(17, 24, 39, 0.4)', // gray-900/40
  },
  spacing: {
    xs: '0.25rem', // 4px
    sm: '0.5rem',  // 8px
    md: '0.75rem', // 12px
    lg: '1rem',    // 16px
    xl: '1.5rem',  // 24px
    '2xl': '2rem', // 32px
    '3xl': '3rem', // 48px
  },
  radii: {
    sm: '6px',
    md: '10px',
    lg: '14px',
    pill: '9999px',
    round: '50%',
  },
  shadows: {
    xs: '0 1px 2px rgba(0,0,0,0.04)',
    sm: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)',
    md: '0 4px 6px rgba(0,0,0,0.10), 0 2px 4px rgba(0,0,0,0.06)',
    lg: '0 10px 15px rgba(0,0,0,0.12), 0 4px 6px rgba(0,0,0,0.08)',
    inset: 'inset 0 1px 2px rgba(0,0,0,0.06)',
  },
  transitions: {
    fast: '150ms ease',
    base: '200ms ease',
    slow: '300ms ease',
  },
};

// PUBLIC_INTERFACE
export const utils = {
  // Convert px to rem based on 16px root
  pxToRem(px) {
    return `${px / 16}rem`;
  },
  // Create rgba from hex
  hexToRgba(hex, alpha = 1) {
    const h = hex.replace('#', '');
    const bigint = parseInt(h, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  },
};

// Default export for convenience
export default theme;
