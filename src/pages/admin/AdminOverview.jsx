import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ClipboardList, FileText, Package, Users } from 'lucide-react';
import usePageTitle from '../../hooks/usePageTitle.js';
import StatCard from '../../components/StatCard.jsx';
import Badge from '../../components/Badge.jsx';
import { LoadingState, DemoBanner } from '../../components/States.jsx';
import * as shipmentService from '../../services/shipmentService.js';
import * as bookingService from '../../services/bookingService.js';
import * as quoteService from '../../services/quoteService.js';
import * as adminService from '../../services/adminService.js';
import { formatDate } from '../../utils/format.js';

export default function AdminOverview() {
  usePageTitle('Admin Overview');
  const [data, setData] = useState(null);

  useEffect(() => {
    let alive = true;
    // Real server-side stats when the backend is connected; the lists still
    // load from the per-domain services (mock fallback inside each service).
    Promise.all([
      adminService.getStats(),
      shipmentService.adminList().catch(() => []),
      bookingService.adminList().catch(() => []),
      quoteService.adminList().catch(() => []),
    ])
      .then(([stats, shipments, bookings, quotes]) =>
        alive && setData({ stats, shipments, bookings, quotes }),
      )
      .catch(() => alive && setData({ stats: null, shipments: [], bookings: [], quotes: [] }));
    return () => {
      alive = false;
    };
  }, []);

  if (!data) return <LoadingState label="Loading overview" />;

  const pendingBookings = data.stats?.bookings?.pending ?? data.bookings.filter((b) => b.status === 'Pending Review').length;
  const newQuotes = data.stats?.quotes?.new ?? data.quotes.filter((q) => q.status === 'New').length;
  const activeShipments = data.stats?.shipments?.active ?? data.shipments.filter((s) => !['Delivered'].includes(s.status)).length;
  const customers = data.stats?.customers;
  const isRealStats = Boolean(data.stats);

  return (
    <div className="space-y-8">
      <div className="card-dark relative overflow-hidden p-7 text-white md:p-9">
        <span className="ghost-word -bottom-6 right-4 text-[110px] text-white/[.05]" aria-hidden="true">
          Admin
        </span>
        <div className="relative z-10">
          <span className="eyebrow eyebrow--light">Operations</span>
          <h2 className="h-display mt-3 text-3xl md:text-4xl">Control room.</h2>
          <p className="mt-2 max-w-xl text-[13.5px] text-white/55">
            Bookings to approve, quotations to answer and shipments to move. All admin actions are
            enforced server-side in production.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/admin/bookings" className="btn-primary btn-sm">Review bookings</Link>
            <Link to="/admin/tracking" className="btn-ghost-light btn-sm">Update tracking</Link>
          </div>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard value={customers ?? 0} label="Customers" sub={isRealStats ? 'Registered accounts' : 'Connect backend for live count'} delay={0.02} />
        <StatCard value={pendingBookings} label="Pending bookings" sub="Awaiting review" delay={0.05} />
        <StatCard value={newQuotes} label="New quotations" sub="Awaiting response" delay={0.1} />
        <StatCard value={activeShipments} label="Active shipments" sub="Not yet delivered" delay={0.15} />
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {[
          { to: '/admin/bookings', icon: ClipboardList, title: 'Bookings', body: `${data.bookings.length} total · ${pendingBookings} pending`, cta: 'Manage' },
          { to: '/admin/quotes', icon: FileText, title: 'Quotations', body: `${data.quotes.length} total · ${newQuotes} new`, cta: 'Respond' },
          { to: '/admin/shipments', icon: Package, title: 'Shipments', body: `${data.shipments.length} total · ${activeShipments} active`, cta: 'Open' },
        ].map(({ to, icon: Icon, title, body, cta }) => (
          <Link key={to} to={to} className="card card-hover group flex items-center gap-5 p-6">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-ink text-brand">
              <Icon className="h-5 w-5" strokeWidth={1.75} />
            </span>
            <div className="min-w-0 flex-1">
              <h3 className="text-[19px]">{title}</h3>
              <p className="mt-0.5 text-[12.5px] text-ink/50">{body}</p>
            </div>
            <span className="font-mono text-[11px] font-semibold text-ink/45 group-hover:text-ink">
              {cta} <ArrowRight className="inline h-3.5 w-3.5" />
            </span>
          </Link>
        ))}
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl">Latest bookings</h3>
          <Link to="/admin/bookings" className="link-underline text-[13px]">All bookings <ArrowRight className="h-3.5 w-3.5" /></Link>
        </div>
        <div className="card divide-y divide-ink/5">
          {[...data.bookings].slice(0, 5).map((b) => (
            <div key={b.id} className="flex flex-wrap items-center justify-between gap-3 px-6 py-4">
              <div>
                <p className="font-mono text-[13.5px] font-semibold">{b.reference}</p>
                <p className="mt-0.5 text-[12.5px] text-ink/50">
                  {b.sender?.fullName} → {b.receiver?.city}, {b.receiver?.country} · {formatDate(b.createdAt)}
                </p>
              </div>
              <Badge value={b.status === 'Approved' ? 'Delivered' : b.status === 'Rejected' ? 'On Hold' : 'Processing'} />
            </div>
          ))}
        </div>
      </div>

      <DemoBanner note="Admin demo mode — sample and locally-created records only. Production data, authorization and exports are enforced by the FastAPI backend." />
    </div>
  );
}
