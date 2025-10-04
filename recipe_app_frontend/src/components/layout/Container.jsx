/* Container layout component that constrains width and provides horizontal padding */

// PUBLIC_INTERFACE
export default function Container({ children, as: Tag = 'div', style }) {
  /**
   * PUBLIC_INTERFACE
   * Container
   * Props:
   * - as: string or component to render (default 'div')
   * - style: inline styles to merge
   */
  const baseStyle = {
    width: '100%',
    maxWidth: 'var(--container-max)',
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingLeft: 'var(--container-padding-x)',
    paddingRight: 'var(--container-padding-x)',
  };

  return <Tag className="container" style={{ ...baseStyle, ...style }}>{children}</Tag>;
}
