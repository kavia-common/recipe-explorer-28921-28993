import { useEffect, useRef } from 'react';

/**
 * PUBLIC_INTERFACE
 * Modal
 * Accessible modal dialog with:
 * - focus trap within modal content
 * - return focus to trigger on close
 * - close on Escape and on overlay click
 * - aria-modal, role="dialog", aria-labelledby, aria-describedby
 * - body scroll lock while open
 *
 * Props:
 * - isOpen: boolean
 * - onClose: () => void
 * - titleId: string - id for the modal title element
 * - descriptionId?: string - id for the modal description element
 * - initialFocusRef?: React.RefObject<HTMLElement> - element to focus when opened
 * - children: React.ReactNode
 */
export default function Modal({
  isOpen,
  onClose,
  titleId,
  descriptionId,
  initialFocusRef,
  children,
}) {
  const overlayRef = useRef(null);
  const contentRef = useRef(null);
  const previouslyFocusedRef = useRef(null);

  // Body scroll lock
  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  // Manage focus when opening and closing
  useEffect(() => {
    if (!isOpen) return;

    // Store previously focused element to restore later
    previouslyFocusedRef.current = document.activeElement;

    // Focus strategy: initialFocusRef -> first focusable -> content container
    const focusFirst = () => {
      const target =
        (initialFocusRef && initialFocusRef.current) ||
        getFocusableElements(contentRef.current)[0] ||
        contentRef.current;
      if (target && typeof target.focus === 'function') {
        target.focus();
      }
    };

    // Slight delay to ensure elements rendered
    const t = setTimeout(focusFirst, 0);

    return () => {
      clearTimeout(t);
      // Restore focus to previously focused element
      const prev = previouslyFocusedRef.current;
      if (prev && typeof prev.focus === 'function') {
        prev.focus();
      }
    };
  }, [isOpen, initialFocusRef]);

  // Key handling: Escape to close and focus trap with Tab/Shift+Tab
  useEffect(() => {
    if (!isOpen) return;

    function onKeyDown(e) {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose?.();
        return;
      }

      if (e.key === 'Tab') {
        const focusables = getFocusableElements(contentRef.current);
        if (focusables.length === 0) {
          e.preventDefault();
          contentRef.current?.focus();
          return;
        }
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const current = document.activeElement;

        if (!e.shiftKey && current === last) {
          e.preventDefault();
          first.focus();
        } else if (e.shiftKey && (current === first || current === contentRef.current)) {
          e.preventDefault();
          last.focus();
        }
      }
    }

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  function onOverlayClick(e) {
    if (e.target === overlayRef.current) {
      onClose?.();
    }
  }

  const overlayStyle = {
    position: 'fixed',
    inset: 0,
    zIndex: 50,
    background: 'var(--color-overlay, rgba(17,24,39,0.4))',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
    backdropFilter: 'blur(1px)',
  };

  const contentStyle = {
    width: '100%',
    maxWidth: '720px',
    outline: 'none',
    background: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow-lg)',
    transform: 'translateY(0)',
  };

  return (
    <div
      ref={overlayRef}
      onMouseDown={onOverlayClick}
      role="presentation"
      aria-hidden={false}
      style={overlayStyle}
    >
      <div
        ref={contentRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        tabIndex={-1}
        className="modal-content"
        style={contentStyle}
      >
        {children}
      </div>
      <style>{`
        .modal-content:focus-visible {
          outline: 3px solid rgba(37,99,235,0.55);
          outline-offset: 2px;
        }
      `}</style>
    </div>
  );
}

/**
 * Return a list of focusable elements within a container.
 */
function getFocusableElements(container) {
  if (!container) return [];
  const selector =
    [
      'a[href]',
      'area[href]',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'button:not([disabled])',
      'iframe',
      'object',
      'embed',
      '[contenteditable]',
      '[tabindex]:not([tabindex="-1"])',
    ].join(', ');
  const nodes = Array.from(container.querySelectorAll(selector));
  return nodes.filter((el) => {
    const style = window.getComputedStyle(el);
    return style.visibility !== 'hidden' && style.display !== 'none' && !el.hasAttribute('disabled');
  });
}
