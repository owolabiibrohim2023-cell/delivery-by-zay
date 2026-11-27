import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';
import usePageTitle from '../../hooks/usePageTitle.js';
import DataTable from '../../components/DataTable.jsx';
import Badge from '../../components/Badge.jsx';
import { LoadingState } from '../../components/States.jsx';
import { Select } from '../../components/Field.jsx';
import * as shipmentService from '../../services/shipmentService.js';
import { formatDate } from '../../utils/format.js';

export default function AdminShipments() {
  usePageTitle('Manage Shipments');
  const [shipments, setShipments] = useState(null);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    let alive = true;
    shipmentService.adminList().then((list) => alive && setShipments(list)).catch(() => alive && setShipments([]));
    return () => {
      alive = false;
    };
  }, []);

  const rows = useMemo(() => {
    if (!shipments) return [];
    return filter === 'All' ? shipments : shipments.filter((s) => s.status === filter);
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
        <div className="flex gap-3">
          <Link to="/admin/tracking" className="btn-outline btn-sm">Update tracking</Link>
          <Link to="/admin/shipments/create" className="btn-primary btn-sm">
            <PlusCircle className="h-3.5 w-3.5" /> Create shipment
          </Link>
        </div>
      </div>

      <DataTable
        rows={rows}
        columns={[
          { key: 'trackingNumber', label: 'Tracking #', render: (s) => <span className="font-mono font-semibold">{s.trackingNumber}</span> },
          { key: 'customerName', label: 'Customer', render: (s) => s.customerName },
          { key: 'route', label: 'Route', render: (s) => `${s.origin.city} → ${s.destination.city}, ${s.destination.country}` },
          { key: 'method', label: 'Method', render: (s) => s.method },
          { key: 'shipDate', label: 'Shipped', render: (s) => formatDate(s.shipDate) },
          { key: 'status', label: 'Status', render: (s) => <Badge value={s.status} /> },
          { key: 'source', label: 'Record', render: (s) => <span className="font-mono text-[10px] text-ink/40">{s.source || 'sample'}</span> },
        ]}
        empty="No shipments match this filter."
      />
    </div>
  );
}
