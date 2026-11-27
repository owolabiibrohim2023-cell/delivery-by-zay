import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import usePageTitle from '../../hooks/usePageTitle.js';
import { useAuth } from '../../context/AuthContext.jsx';
import DataTable from '../../components/DataTable.jsx';
import { EmptyState, LoadingState } from '../../components/States.jsx';
import * as quoteService from '../../services/quoteService.js';
import { formatDate } from '../../utils/format.js';

function quoteBadge(status) {
  const map = {
    New: 'bg-brand/15 text-ink border-brand/50',
    Responded: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  };
  return map[status] || 'bg-mist text-ink border-ink/15';
}

export default function MyQuotes() {
  usePageTitle('My Quotes');
  const { user } = useAuth();
  const [quotes, setQuotes] = useState(null);

  useEffect(() => {
    let alive = true;
    quoteService
      .listMine(user?.email)
      .then((list) => alive && setQuotes(list))
      .catch(() => alive && setQuotes([]));
    return () => {
      alive = false;
    };
  }, [user]);

  if (!quotes) return <LoadingState label="Loading quotations" />;

  return (
    <div className="space-y-6">
      <p className="max-w-2xl text-[13.5px] text-ink/55">
        Quotation requests you have submitted. The DBZ team responds with official rates —
        never estimated prices.
      </p>
      {quotes.length ? (
        <DataTable
          rows={quotes}
          columns={[
            { key: 'reference', label: 'Reference', render: (q) => <span className="font-mono font-semibold">{q.reference}</span> },
            { key: 'destination', label: 'Route', render: (q) => `${q.origin} → ${q.destination}` },
            { key: 'packageType', label: 'Package', render: (q) => `${q.packageType}${q.weight ? ` · ${q.weight} kg` : ''}` },
            { key: 'createdAt', label: 'Submitted', render: (q) => formatDate(q.createdAt) },
            {
              key: 'status',
              label: 'Status',
              render: (q) => (
                <span className={`inline-flex rounded-full border px-3 py-1 font-mono text-[10.5px] font-semibold ${quoteBadge(q.status)}`}>
                  {q.status}
                </span>
              ),
            },
            {
              key: 'response',
              label: 'Response',
              render: (q) => (q.response ? <span className="block max-w-[220px] truncate text-[12.5px] text-ink/55">{q.response}</span> : '—'),
            },
          ]}
        />
      ) : (
        <EmptyState
          title="No quotations yet"
          body="Request a quotation and it will appear here with the team’s response."
          action={<Link to="/get-a-quote" className="btn-primary btn-sm">Get a quote</Link>}
        />
      )}
    </div>
  );
}
