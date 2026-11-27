import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Instagram, Mail, Menu, Phone, X } from 'lucide-react';
import { BUSINESS } from '../data/media.js';
import { useAuth } from '../context/AuthContext.jsx';

export const NAV_LINKS = [
  { to: '/about', label: 'About' },
  { to: '/services', label: 'Services' },
  { to: '/destinations', label: 'Destinations' },
  { to: '/track', label: 'Track' },
  { to: '/locations', label: 'Locations' },
  { to: '/faq', label: 'FAQ' },
  { to: '/contact', label: 'Contact' },
];

function Wordmark({ className = '' }) {
  return (
    <Link
      to="/"
      className={`group inline-flex shrink-0 items-center gap-3 ${className}`}
      aria-label="DBZ – Delivered by Zay home"
    >
      <img
        src="/images/d3z-logo.jpg?v=2"
        alt="DBZ — Delivered By Zay"
        className="h-10 w-auto rounded-lg border border-ink/10 transition-transform duration-300 group-hover:scale-[1.03] md:h-11"
        width="124"
        height="44"
        loading="eager"
        decoding="async"
      />
    </Link>
  );
}

function MenuDrawer({ open, onClose }) {
  const { user } = useAuth();
  useEffect(() => {
    if (!open) return undefined;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  const links = [
    ...NAV_LINKS,
    { to: '/book-shipment', label: 'Book Shipment' },
    { to: '/get-a-quote', label: 'Get a Quote' },
  ];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col bg-ink text-white"
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -24 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
        >
          <div className="flex items-center justify-between px-5 py-5 md:px-10">
            <Wordmark />
            <button
              onClick={onClose}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 transition-colors hover:border-brand hover:text-brand"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto px-5 pb-8 pt-4 md:px-10">
            <ul className="divide-y divide-white/10">
              {links.map((link, i) => (
                <motion.li
                  key={link.to}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.035, duration: 0.35 }}
                >
                  <NavLink
                    to={link.to}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `group flex items-center justify-between py-4 font-semibold ${isActive ? 'text-brand-light' : 'text-white'}`
                    }
                  >
                    <span className="text-xl transition-colors group-hover:text-brand-light sm:text-2xl">
                      {link.label}
                    </span>
                    <ArrowUpRight className="h-5 w-5 opacity-0 transition-all group-hover:translate-x-1 group-hover:text-brand-light group-hover:opacity-100" />
                  </NavLink>
                </motion.li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              {user ? (
                <>
                  <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} onClick={onClose} className="btn-primary btn-sm">
                    {user.role === 'admin' ? 'Admin panel' : 'My dashboard'}
                  </Link>
                  <Link to="/dashboard/profile" onClick={onClose} className="btn-ghost-light btn-sm">
                    Profile
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={onClose} className="btn-primary btn-sm">
                    Customer login
                  </Link>
                  <Link to="/register" onClick={onClose} className="btn-ghost-light btn-sm">
                    Create account
                  </Link>
                </>
              )}
            </div>
          </nav>
          <div className="border-t border-white/10 px-5 py-5 md:px-10">
            <div className="flex flex-wrap items-center gap-x-8 gap-y-2 text-[12px] text-white/55">
              <a href={`mailto:${BUSINESS.email}`} className="inline-flex items-center gap-2 hover:text-brand-light">
                <Mail className="h-3.5 w-3.5" /> {BUSINESS.email}
              </a>
              <a href={`tel:${BUSINESS.phone}`} className="inline-flex items-center gap-2 hover:text-brand-light">
                <Phone className="h-3.5 w-3.5" /> {BUSINESS.phone}
              </a>
              <a href={BUSINESS.instagramLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-brand-light">
                <Instagram className="h-3.5 w-3.5" /> {BUSINESS.instagram}
              </a>
              <span className="text-brand-light">{BUSINESS.slogan}</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * DBZ site navigation — one sticky header for every public page.
 * Navy links on white, gold "Get a Quote" button; on mobile the logo
 * sits left and the menu icon right.
 */
export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  // Close the drawer whenever the route changes
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      <header className="sticky top-0 z-[60] w-full border-b border-ink/10 bg-white/95 shadow-[0_1px_0_rgba(10,26,58,0.05)] backdrop-blur-md">
        <div className="shell flex h-[68px] items-center justify-between gap-4">
          <Wordmark />

          {/* Desktop navigation */}
          <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
            {NAV_LINKS.slice(0, 6).map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `relative text-[13.5px] font-medium transition-colors ${
                    isActive ? 'text-ink' : 'text-ink/60 hover:text-ink'
                  } after:absolute after:-bottom-1.5 after:left-0 after:h-[2px] after:w-0 after:bg-brand after:transition-all hover:after:w-full ${
                    isActive ? 'after:w-full' : ''
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-3 md:gap-5">
            <a
              href={BUSINESS.instagramLink}
              target="_blank"
              rel="noreferrer"
              className="hidden text-[13px] font-medium text-ink transition-colors hover:text-ink/60 md:inline-flex"
            >
              Follow
            </a>

            <Link
              to="/get-a-quote"
              className="btn-primary btn-sm hidden sm:inline-flex"
            >
              Get a Quote
            </Link>

            {user && (
              <Link
                to={user.role === 'admin' ? '/admin' : '/dashboard'}
                className="hidden rounded-full bg-ink px-5 py-2.5 text-[12.5px] font-semibold text-white transition-colors hover:bg-coal md:inline-flex"
              >
                {user.role === 'admin' ? 'Admin' : 'Dashboard'}
              </Link>
            )}

            <button
              onClick={() => setMenuOpen(true)}
              className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-[13px] font-semibold text-ink transition-colors hover:bg-mist"
              aria-label="Open menu"
              aria-expanded={menuOpen}
              aria-controls="d3z-menu-drawer"
            >
              Menu <Menu className="h-4 w-4" strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile / full menu drawer */}
      <div id="d3z-menu-drawer">
        <MenuDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />
      </div>
    </>
  );
}
