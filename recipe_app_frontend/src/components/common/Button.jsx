 /* Reusable Button component with primary/secondary variants, loading/disabled states */

 // PUBLIC_INTERFACE
 export default function Button({
   children,
   variant = 'primary',
   fullWidth = false,
   loading = false,
   disabled = false,
   type = 'button',
   onClick,
   ariaLabel,
   ref, // accept ref passthrough use (compat)
 }) {
   /**
    * PUBLIC_INTERFACE
    * Button
    * Props:
    * - variant: 'primary' | 'secondary'
    * - fullWidth: boolean
    * - loading: boolean
    * - disabled: boolean
    * - type: button type attribute
    * - onClick: click handler
    * - ariaLabel: accessible label
    */
   const isDisabled = disabled || loading;

   const base = {
     border: '1px solid var(--color-border)',
     borderRadius: '10px',
     padding: '0.625rem 1rem',
     fontWeight: 600,
     cursor: isDisabled ? 'not-allowed' : 'pointer',
     width: fullWidth ? '100%' : 'auto',
     transition: 'background-color var(--transition-base), color var(--transition-base), box-shadow var(--transition-base), transform var(--transition-base), border-color var(--transition-base)',
     display: 'inline-flex',
     alignItems: 'center',
     justifyContent: 'center',
     gap: '0.5rem',
     boxShadow: 'var(--shadow-xs)',
     outline: 'none',
   };

   const variants = {
     primary: {
       background: 'var(--color-primary)',
       color: '#ffffff',
       border: '1px solid rgba(37,99,235,0.1)',
     },
     secondary: {
       background: 'var(--color-surface)',
       color: 'var(--color-text)',
       border: '1px solid var(--color-border)',
     },
   };

   const hover = {
     primary: {
       filter: 'brightness(0.98)',
       boxShadow: 'var(--shadow-sm)',
       transform: 'translateY(-1px)',
     },
     secondary: {
       background: '#f3f4f6', // gray-100
       boxShadow: 'var(--shadow-sm)',
       transform: 'translateY(-1px)',
     },
   };

   const active = {
     transform: 'translateY(0)',
     boxShadow: 'var(--shadow-xs)',
   };

   const loadingSpinner = (
     <span
       role="progressbar"
       aria-label="Loading"
       aria-live="polite"
       style={{
         width: '1rem',
         height: '1rem',
         borderRadius: '50%',
         border: '2px solid rgba(255,255,255,0.6)',
         borderTopColor: variant === 'secondary' ? 'var(--color-text)' : '#ffffff',
         borderLeftColor: 'transparent',
         animation: 'spin 1s linear infinite',
       }}
     />
   );

   const style = { ...base, ...variants[variant] };

   return (
     <button
       ref={ref}
       type={type}
       onClick={isDisabled ? undefined : onClick}
       aria-disabled={isDisabled}
       aria-label={ariaLabel}
       style={style}
       onMouseEnter={(e) => {
         if (isDisabled) return;
         Object.assign(e.currentTarget.style, hover[variant]);
       }}
       onMouseLeave={(e) => {
         if (isDisabled) return;
         // Reset hover styles
         Object.assign(e.currentTarget.style, {
           transform: 'translateY(0)',
           boxShadow: 'var(--shadow-xs)',
           background: variants[variant].background,
           filter: 'none',
         });
       }}
       onMouseDown={(e) => {
         if (isDisabled) return;
         Object.assign(e.currentTarget.style, active);
       }}
       onKeyDown={(e) => {
         if ((e.key === 'Enter' || e.key === ' ') && !isDisabled) {
           Object.assign(e.currentTarget.style, active);
         }
       }}
       onKeyUp={(e) => {
         if (isDisabled) return;
         Object.assign(e.currentTarget.style, hover[variant]);
       }}
     >
       {loading ? loadingSpinner : null}
       <span>{children}</span>
       <style>{`
         @keyframes spin { 
           from { transform: rotate(0deg); } 
           to { transform: rotate(360deg); } 
         }
         button:focus-visible {
           outline: var(--focus-ring);
           outline-offset: var(--focus-offset);
         }
       `}</style>
     </button>
   );
 }
