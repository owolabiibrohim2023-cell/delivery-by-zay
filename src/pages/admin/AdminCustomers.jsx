import { useEffect, useState } from 'react';
import usePageTitle from '../../hooks/usePageTitle.js';
import DataTable from '../../components/DataTable.jsx';
import { Select } from '../../components/Field.jsx';
import { LoadingState } from '../../components/States.jsx';
import * as adminService from '../../services/adminService.js';
import { formatDate } from '../../utils/format.js';

export default function AdminCustomers() {
  usePageTitle('Manage Customers');
  const [query, setQuery] = useState('');
  const [rows, setRows] = useState(null);

  useEffect(() => {
    let alive = true;
    const t = setTimeout(() => {
      adminService
        .getCustomers({ q: query })
        .then((list) => alive && setRows(list))
        .catch(() => alive && setRows([]));
    }, 250); // debounced server-side search
    return () => {
      alive = false;
      clearTimeout(t);
    };
  }, [query]);

  if (!rows) return <LoadingState label="Loading customers" />;

  return (
    <div className="space-y-6">
      <p className="max-w-2xl text-[13.5px] text-ink/55">
        Registered customer accounts. Customer records, roles and data access are managed and
        secured by the backend in production.
      </p>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search name or email…"
        className="field max-w-sm"
        aria-label="Search customers"
      />
      <DataTable
        rows={rows}
        columns={[
          { key: 'name', label: 'Customer', render: (c) => <span className="font-semibold">{c.name}</span> },
          { key: 'email', label: 'Email', render: (c) => <span className="font-mono text-[12.5px]">{c.email}</span> },
          { key: 'phone', label: 'Phone', render: (c) => c.phone },
          { key: 'city', label: 'City', render: (c) => c.city },
          { key: 'joined', label: 'Joined', render: (c) => formatDate(c.joined) },
          { key: 'shipments', label: 'Shipments', render: (c) => c.shipments },
          {
            key: 'status',
            label: 'Status',
            render: (c) => (
              <span className={`inline-flex rounded-full border px-3 py-1 font-mono text-[10.5px] font-semibold ${c.status === 'Active' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-mist text-ink/60 border-ink/15'}`}>
                {c.status}
              </span>
            ),
          },
        ]}
      />
    </div>
  );
}
