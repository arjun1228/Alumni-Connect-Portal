import React from 'react';

/**
 * Logo — renders the AlumniConnect diamond mortarboard logo.
 * Accepts a className for sizing (e.g. "w-8 h-8").
 * The logo always uses its own colours so colour utilities have no effect.
 */
export const Logo = ({ className = 'w-8 h-8' }) => {
  return (
    <img
      src="/logo.jpg"
      alt="AlumniConnect logo"
      className={className}
      style={{ objectFit: 'contain' }}
      draggable={false}
    />
  );
};
