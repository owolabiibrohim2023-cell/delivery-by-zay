import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import usePageTitle from '../../hooks/usePageTitle.js';
import { useAuth } from '../../context/AuthContext.jsx';
import Badge from '../../components/Badge.jsx';
import DataTable from '../../components/DataTable.jsx';
import { EmptyState, LoadingState } from '../../components/States.jsx';
import { Select } from '../../components/Field.jsx';
import * as shipmentService from '../../services/shipmentService.js';
import { formatDate } from '../../utils/format.js';

export default function MyShipments() {
  usePageTitle('My Shipments');
  const { user } = useAuth();
  const [shipments, setShipments] = useState(null);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    let alive = true;
    shipmentService
      .listMine(user?.email)
      .then((list) => alive && setShipments(list))
      .catch(() => alive && setShipments([]));
    return () => {
      alive = false;
    };
  }, [user]);

  const rows = useMemo(() => {
    if (!shipments) return [];
    return filter === 'All'
      ? shipments
      : shipments.filter((s) => s.status === filter);
  }, [shipments, filter]);

  if (!shipments) return <LoadingState label="Loading shipments" />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Select value={filter} onChange={(e) => setFilter(e.target.value)} className="!w-56">
          <option value="All">All statuses</option>
          {shipmentService.SHIPMENT_STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </Select>
        <Link to="/dashboard/book" className="btn-primary btn-sm">Book shipment</Link>
      </div>

      {rows.length ? (
        <DataTable
          rows={rows}
          columns={[
            { key: 'trackingNumber', label: 'Tracking #', render: (r) => <span className="font-mono font-semibold">{r.trackingNumber}</span> },
            { key: 'route', label: 'Route', render: (r) => `${r.origin.city} → ${r.destination.city}, ${r.destination.country}` },
            { key: 'method', label: 'Method', render: (r) => r.method },
            { key: 'shipDate', label: 'Shipped', render: (r) => formatDate(r.shipDate) },
            { key: 'eta', label: 'Est. delivery', render: (r) => (r.estimatedDelivery ? formatDate(r.estimatedDelivery) : 'TBC') },
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
          title={filter === 'All' ? 'No shipments yet' : `No "${filter}" shipments`}
          body={filter === 'All' ? 'Book your first shipment and it will show up here.' : 'Try a different status filter.'}
          action={filter === 'All' ? <Link to="/dashboard/book" className="btn-primary btn-sm">Book shipment</Link> : undefined}
        />
      )}
    </div>
  );
}
