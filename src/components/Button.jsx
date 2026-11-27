import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const VARIANTS = {
  primary: 'btn-primary',
  dark: 'btn-dark',
  outline: 'btn-outline',
  'gold-outline': 'btn-gold-outline',
  'ghost-light': 'btn-ghost-light',
  white: 'btn-white',
};

/**
 * Unified DBZ button. Renders a router Link when `to` is given,
 * an anchor when `href` is given, otherwise a <button>.
 */
export default function Button({
  children,
  to,
  href,
  variant = 'primary',
  size,
  arrow = false,
  className = '',
  ...rest
}) {
  const cls = `${VARIANTS[variant] || VARIANTS.primary} ${size === 'sm' ? 'btn-sm' : ''} ${className}`;
  const content = (
    <>
      {children}
      {arrow && <ArrowRight className="h-4 w-4" strokeWidth={2.5} />}
    </>
  );
  if (to) {
    return (
      <Link to={to} className={cls} {...rest}>
        {content}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} className={cls} {...rest}>
        {content}
      </a>
    );
  }
  return (
    <button className={cls} {...rest}>
      {content}
    </button>
  );
}
