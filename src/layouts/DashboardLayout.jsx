import { useEffect, useState } from 'react';
import { Link, Navigate, NavLink, Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Bell,
  CreditCard,
  ClipboardList,
  FileText,
  Globe,
  LayoutDashboard,
  LogOut,
  MapPin,
  Menu,
  Package,
  PackageSearch,
  PlusCircle,
  RefreshCcw,
  Settings,
  ShieldCheck,
  Users,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { appliedReadState, listFor, unreadCount } from '../services/notificationService.js';
import { BUSINESS } from '../data/media.js';

const CUSTOMER_NAV = [
  { to: '/dashboard', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/dashboard/shipments', label: 'My Shipments', icon: Package },
  { to: '/dashboard/track', label: 'Track Shipment', icon: PackageSearch },
  { to: '/dashboard/book', label: 'Book Shipment', icon: PlusCircle },
  { to: '/dashboard/payments', label: 'Payments', icon: CreditCard },
  { to: '/dashboard/quotes', label: 'My Quotes', icon: FileText },
  { to: '/dashboard/notifications', label: 'Notifications', icon: Bell, badge: 'notifications' },
  { to: '/dashboard/profile', label: 'My Profile', icon: Users },
  { to: '/dashboard/settings', label: 'Account Settings', icon: Settings },
];

const ADMIN_NAV = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/admin/customers', label: 'Customers', icon: Users },
  { to: '/admin/shipments', label: 'Shipments', icon: Package },
  { to: '/admin/shipments/create', label: 'Create Shipment', icon: PlusCircle },
  { to: '/admin/tracking', label: 'Update Tracking', icon: RefreshCcw },
  { to: '/admin/bookings', label: 'Bookings', icon: ClipboardList },
  { to: '/admin/quotes', label: 'Quotations', icon: FileText },
  { to: '/admin/payments', label: 'Payments', icon: CreditCard },
  { to: '/admin/destinations', label: 'Destinations', icon: Globe },
  { to: '/admin/locations', label: 'Drop-off Locations', icon: MapPin },
  { to: '/admin/notifications', label: 'Notifications', icon: Bell },
  { to: '/admin/content', label: 'Website Content', icon: FileText },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

function SidebarContent({ kind, onNavigate, unread }) {
  const { user, logout } = useAuth();
  const items = kind === 'admin' ? ADMIN_NAV : CUSTOMER_NAV;
  return (
    <div className="flex h-full flex-col">
      <Link to="/" className="flex items-center px-5 pb-6 pt-6" onClick={onNavigate}>
        <img
          src="/images/d3z-logo.jpg"
          alt="DBZ — Delivered By Zay"
          className="h-10 w-auto rounded-lg"
          width="124"
          height="44"
          loading="eager"
          decoding="async"
        />
        <span className="ml-3 rounded-full border border-white/15 px-2.5 py-0.5 font-mono text-[9.5px] text-white/50">
          {kind === 'admin' ? 'Admin' : 'Customer'}
        </span>
      </Link>
      <nav className="flex-1 overflow-y-auto px-3 pb-6">
        <ul className="space-y-1">
          {items.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.end}
                onClick={onNavigate}
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[13.5px] font-medium transition-all ${
                    isActive
                      ? 'bg-white/10 text-white'
                      : 'text-white/55 hover:bg-white/5 hover:text-white'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon className={`h-[17px] w-[17px] ${isActive ? 'text-brand' : 'text-white/40 group-hover:text-white/70'}`} strokeWidth={2} />
                    <span className="flex-1">{item.label}</span>
                    {item.badge === 'notifications' && unread > 0 && (
                      <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1.5 font-mono text-[10px] font-bold text-ink">
                        {unread}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="border-t border-white/10 px-5 py-4">
        <p className="truncate text-[13px] font-semibold">{user?.name || 'Signed in'}</p>
        <p className="truncate text-[11.5px] text-white/45">{user?.email}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            onClick={() => {
              logout();
              onNavigate?.();
            }}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 text-[11px] font-semibold text-white/60 transition-colors hover:border-brand hover:text-brand"
          >
            <LogOut className="h-3.5 w-3.5" /> Logout
          </button>
          <Link to="/" className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 text-[11px] font-semibold text-white/60 transition-colors hover:border-brand hover:text-brand">
            Website
          </Link>
        </div>
      </div>
    </div>
  );
}

/**
 * Shared authenticated shell for the customer dashboard and admin panel.
 * NOTE: route guarding here is a UX convenience only — authorization MUST
 * be enforced by the FastAPI backend (JWT + roles) in production.
 */
export default function DashboardLayout({ kind }) {
  const { user, ready, isAdmin, mockMode, mockNote } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [unread, setUnread] = useState(0);

  const allowed = kind === 'admin' ? isAdmin : !!user;
  const adminTryingCustomer = kind === 'customer' && isAdmin;

  useEffect(() => {
    let alive = true;
    if (user) {
      listFor(user.email)
        .then((list) => alive && setUnread(unreadCount(appliedReadState(list))))
        .catch(() => {});
    }
    return () => {
      alive = false;
    };
  }, [user, location.pathname]);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink">
        <div className="h-8 w-8 animate-pulse bg-brand" />
      </div>
    );
  }

  if (!allowed) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname, reason: kind === 'admin' ? 'admin' : 'customer' }}
      />
    );
  }

  const title =
    (kind === 'admin' ? ADMIN_NAV : CUSTOMER_NAV).find((i) =>
      i.end ? location.pathname === i.to : location.pathname.startsWith(i.to)
    )?.label || (kind === 'admin' ? 'Admin Panel' : 'Customer Dashboard');

  return (
    <div className="min-h-screen bg-mist">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[264px] bg-ink text-white lg:block">
        <SidebarContent kind={kind} unread={unread} />
      </aside>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div className="fixed inset-0 z-[80] lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-ink/60" onClick={() => setMobileOpen(false)} />
            <motion.aside
              className="absolute inset-y-0 left-0 w-[280px] bg-ink text-white"
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              <SidebarContent kind={kind} unread={unread} onNavigate={() => setMobileOpen(false)} />
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="lg:pl-[264px]">
        {/* Top bar */}
        <div className="sticky top-0 z-30 border-b border-ink/10 bg-white/85 backdrop-blur-md">
          <div className="flex items-center justify-between gap-4 px-5 py-3.5 md:px-8">
            <div className="flex items-center gap-3">
              <button
                className="rounded-lg border border-ink/15 p-2 lg:hidden"
                onClick={() => setMobileOpen(true)}
                aria-label="Open dashboard menu"
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
              <div>
                <h1 className="h-display text-xl md:text-2xl">{title}</h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {adminTryingCustomer && (
                <Link to="/admin" className="hidden rounded-full border border-ink/15 px-4 py-2 text-[11px] font-semibold hover:border-brand sm:inline-flex">
                  <ShieldCheck className="mr-1.5 inline h-3.5 w-3.5 text-brand" /> Switch to admin
                </Link>
              )}
              {mockMode && (
                <span className="hidden rounded-full border border-brand/40 bg-brand/10 px-3 py-1.5 font-mono text-[10px] font-semibold text-brand-deep md:inline-flex">
                  Dev preview · mock data
                </span>
              )}
            </div>
          </div>
          {mockMode && (
            <p className="border-t border-brand/20 bg-brand/10 px-5 py-2 text-[11.5px] text-brand-deep md:px-8">
              {mockNote}
            </p>
          )}
        </div>

        <main className="px-5 py-7 md:px-8 md:py-9">
          <Outlet />
        </main>

        <footer className="px-5 pb-8 text-[11.5px] text-ink/40 md:px-8">
          {BUSINESS.name} · {BUSINESS.email} · {BUSINESS.phone}
        </footer>
      </div>
    </div>
  );
}
