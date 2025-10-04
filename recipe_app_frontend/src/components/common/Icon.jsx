 /* Inline SVG icon component */

 // Map of supported icons
 const icons = {
   star: (
     <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.392 4.28a1 1 0 00.95.69h4.497c.967 0 1.371 1.24.588 1.81l-3.64 2.645a1 1 0 00-.364 1.118l1.392 4.28c.3.921-.756 1.688-1.54 1.118l-3.64-2.645a1 1 0 00-1.176 0l-3.64 2.645c-.783.57-1.838-.197-1.539-1.118l1.392-4.28a1 1 0 00-.364-1.118L2.572 9.707c-.783-.57-.38-1.81.588-1.81h4.497a1 1 0 00.95-.69l1.392-4.28z" />
   ),
   search: (
     <path d="M11 19a8 8 0 105.293-14.293A8 8 0 0011 19zm10.707 1.707a1 1 0 01-1.414 0l-4.12-4.12a10 10 0 111.414-1.414l4.12 4.12a1 1 0 010 1.414z" />
   ),
   close: (
     <path d="M6.225 4.811a1 1 0 011.414 0L12 9.172l4.361-4.361a1 1 0 111.414 1.414L13.414 10.586l4.361 4.361a1 1 0 01-1.414 1.414L12 12l-4.361 4.361a1 1 0 01-1.414-1.414l4.361-4.361-4.361-4.361a1 1 0 010-1.414z" />
   ),
   timer: (
     <path d="M9 2h6v2H9V2zm3 4a8 8 0 100 16 8 8 0 000-16zm0 3a1 1 0 011 1v4l3 2a1 1 0 01-1 1 1 1 0 01-.5-.134L12 15V10a1 1 0 011-1z" />
   ),
 };

 // PUBLIC_INTERFACE
 export default function Icon({
   name,
   size = 18,
   color = 'currentColor',
   title,
   ariaHidden = true,
 }) {
   /**
    * PUBLIC_INTERFACE
    * Icon
    * Props:
    * - name: 'star' | 'search' | 'close' | 'timer'
    * - size: number
    * - color: string
    * - title: optional accessible title
    * - ariaHidden: boolean (default true)
    */
   const path = icons[name];

   if (!path) {
     // Fallback empty box to avoid runtime errors
     return <span style={{ display: 'inline-block', width: size, height: size }} aria-hidden="true" />;
   }

   const labelled = title ? { 'aria-label': title } : {};
   // Default to aria-hidden when ariaHidden=true and no label; role unnecessary when hidden
   const ariaProps = ariaHidden
     ? { 'aria-hidden': 'true' }
     : { role: 'img', ...labelled };

   return (
     <svg
       width={size}
       height={size}
       viewBox="0 0 24 24"
       fill={color}
       xmlns="http://www.w3.org/2000/svg"
       focusable="false"
       {...ariaProps}
     >
       {title ? <title>{title}</title> : null}
       {path}
     </svg>
   );
 }
