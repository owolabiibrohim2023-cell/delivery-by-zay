import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Bell, Package, PackageCheck, Truck } from 'lucide-react';
import usePageTitle from '../../hooks/usePageTitle.js';
import { useAuth } from '../../context/AuthContext.jsx';
import StatCard from '../../components/StatCard.jsx';
import Badge from '../../components/Badge.jsx';
import DataTable from '../../components/DataTable.jsx';
import { EmptyState, LoadingState } from '../../components/States.jsx';
import * as shipmentService from '../../services/shipmentService.js';
import * as notificationService from '../../services/notificationService.js';
import { formatDate } from '../../utils/format.js';

export default function DashboardOverview() {
  usePageTitle('Dashboard');
  const { user } = useAuth();
  const [shipments, setShipments] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    let alive = true;
    shipmentService
      .listMine(user?.email)
      .then((list) => alive && setShipments(list))
      .catch(() => alive && setShipments([]));
    notificationService
      .listFor(user?.email)
      .then((list) => alive && setNotifications(notificationService.appliedReadState(list)))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [user]);

  if (!shipments) return <LoadingState label="Loading dashboard" />;

  const stats = {
    total: shipments.length,
    pending: shipments.filter((s) => ['Booking Received', 'Processing'].includes(s.status)).length,
    transit: shipments.filter((s) =>
      ['Shipment Received', 'In Transit', 'Customs Clearance', 'Out for Delivery'].includes(s.status)
    ).length,
    delivered: shipments.filter((s) => s.status === 'Delivered').length,
  };

  const recent = [...shipments]
    .sort((a, b) => new Date(b.history?.[0]?.timestamp || 0) - new Date(a.history?.[0]?.timestamp || 0))
    .slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Greeting */}
      <div className="card-dark relative overflow-hidden p-7 text-white md:p-9">
        <span className="ghost-word -bottom-6 right-4 text-[110px] text-white/[.05]" aria-hidden="true">
          DBZ
        </span>
        <div className="relative z-10">
          <span className="eyebrow eyebrow--light">Overview</span>
          <h2 className="h-display mt-3 text-3xl md:text-4xl">
            Welcome back, {user?.name?.split(' ')[0] || 'shipper'}.
          </h2>
          <p className="mt-2 text-[13.5px] text-white/55">
            {BUSINESS_TAGLINE}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/dashboard/book" className="btn-primary btn-sm">Book shipment</Link>
            <Link to="/dashboard/track" className="btn-ghost-light btn-sm">Track shipment</Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard value={stats.total} label="Total shipments" sub="All time" />
        <StatCard value={stats.pending} label="Pending" sub="Booking received or processing" delay={0.05} />
        <StatCard value={stats.transit} label="In transit" sub="Moving through the network" delay={0.1} />
        <StatCard value={stats.delivered} label="Delivered" sub="Completed deliveries" delay={0.15} />
      </div>

      {/* Recent shipments */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl">Recent shipments</h3>
          <Link to="/dashboard/shipments" className="link-underline text-[13px]">
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        {recent.length ? (
          <DataTable
            rows={recent}
            columns={[
              { key: 'trackingNumber', label: 'Tracking #', render: (r) => <span className="font-mono font-semibold">{r.trackingNumber}</span> },
              { key: 'destination', label: 'Destination', render: (r) => `${r.destination.city}, ${r.destination.country}` },
              { key: 'shipDate', label: 'Shipped', render: (r) => formatDate(r.shipDate) },
              { key: 'status', label: 'Status', render: (r) => <Badge value={r.status} /> },
              {
                key: 'actions',
                label: '',
                className: 'text-right',
                render: (r) => (
                  <Link to={`/dashboard/shipments/${r.id}`} className="font-mono text-[11px] font-semibold text-ink/50 hover:text-ink">
                    Details →
                  </Link>
                ),
              },
            ]}
          />
        ) : (
          <EmptyState
            title="No shipments yet"
            body="Your bookings will appear here once you ship your first parcel with DBZ."
            action={<Link to="/dashboard/book" className="btn-primary btn-sm">Book your first shipment</Link>}
          />
        )}
      </div>

      {/* Notifications preview */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl">Notifications</h3>
          <Link to="/dashboard/notifications" className="link-underline text-[13px]">
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="card divide-y divide-ink/5">
          {notifications.slice(0, 4).map((n) => (
            <div key={n.id} className="flex items-start gap-4 px-6 py-4">
              <Bell className={`mt-0.5 h-5 w-5 shrink-0 ${n.read ? 'text-ink/25' : 'text-brand-deep'}`} />
              <div className="min-w-0 flex-1">
                <p className={`text-[13.5px] ${n.read ? 'text-ink/55' : 'font-semibold'}`}>{n.title}</p>
                <p className="mt-0.5 line-clamp-1 text-[12.5px] text-ink/45">{n.body}</p>
              </div>
              <span className="shrink-0 font-mono text-[10px] text-ink/35">
                {formatDate(n.date)}
              </span>
            </div>
          ))}
          {!notifications.length && (
            <p className="px-6 py-8 text-center text-[13px] text-ink/45">No notifications yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

const BUSINESS_TAGLINE = 'Your trusted shipping partner — here’s what is moving right now.';
