import React from 'react';
import { Home } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * @param {string} to 
 * @param {number} size
 * @param {string} className
 * @param {object} props
 */
export default function HomeLink({
  to = '/',
  size = 24,
  className = '',
  ...props
}) {
  return (
    <div className={className} {...props}>
      <Link to={to}>
        <Home size={size} />
      </Link>
    </div>
  );
}
