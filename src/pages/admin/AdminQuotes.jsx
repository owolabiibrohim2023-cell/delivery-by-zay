import { useEffect, useMemo, useState } from 'react';
import usePageTitle from '../../hooks/usePageTitle.js';
import DataTable from '../../components/DataTable.jsx';
import Modal from '../../components/Modal.jsx';
import { Field, Textarea } from '../../components/Field.jsx';
import { LoadingState, DemoBanner } from '../../components/States.jsx';
import * as quoteService from '../../services/quoteService.js';
import { formatDate, formatDateTime } from '../../utils/format.js';

export default function AdminQuotes() {
  usePageTitle('Manage Quotations');
  const [quotes, setQuotes] = useState(null);
  const [responding, setResponding] = useState(null);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState(null);

  const load = () => {
    quoteService.adminList().then(setQuotes).catch(() => setQuotes([]));
  };
  useEffect(load, []);

  const pending = useMemo(() => quotes?.filter((q) => q.status === 'New').length ?? 0, [quotes]);

  const respond = async () => {
    if (!responding || !message.trim()) return;
    setBusy(true);
    try {
      const res = await quoteService.adminRespond(responding.id, message.trim());
      setNote(res?.message || 'Response saved. In production it emails the customer from deliveredbyzay@gmail.com.');
      setResponding(null);
      setMessage('');
      load();
    } finally {
      setBusy(false);
    }
  };

  if (!quotes) return <LoadingState label="Loading quotations" />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-[13.5px] text-ink/55">
          Review quotation requests and respond with official rates. <strong>{pending}</strong> awaiting response.
        </p>
      </div>

      <DataTable
        rows={quotes}
        columns={[
          { key: 'reference', label: 'Reference', render: (q) => <span className="font-mono font-semibold">{q.reference}</span> },
          { key: 'name', label: 'Customer', render: (q) => q.name },
          { key: 'route', label: 'Route', render: (q) => `${q.origin} → ${q.destination}` },
          { key: 'pkg', label: 'Package', render: (q) => `${q.packageType}${q.weight ? ` · ${q.weight} kg` : ''}` },
          { key: 'createdAt', label: 'Submitted', render: (q) => formatDate(q.createdAt) },
          {
            key: 'status',
            label: 'Status',
            render: (q) => (
              <span className={`inline-flex rounded-full border px-3 py-1 font-mono text-[10.5px] font-semibold ${
                q.status === 'New' ? 'bg-brand/15 text-ink border-brand/50' : 'bg-emerald-100 text-emerald-800 border-emerald-300'
              }`}>
                {q.status}
              </span>
            ),
          },
          {
            key: 'actions',
            label: '',
            className: 'text-right',
            render: (q) => (
              <button
                className="rounded-full bg-ink px-4 py-1.5 font-mono text-[10.5px] font-semibold text-white hover:bg-black"
                onClick={() => setResponding(q)}
              >
                {q.status === 'New' ? 'Respond' : 'View'}
              </button>
            ),
          },
        ]}
        empty="No quotation requests yet."
      />

      <Modal open={!!responding} onClose={() => setResponding(null)} title={responding?.reference || ''}>
        {responding && (
          <div className="space-y-5">
            <div className="grid gap-3 rounded-xl bg-mist p-4 text-[13px] sm:grid-cols-2">
              <div>
                <p className="font-mono text-[10px] text-ink/40">Customer</p>
                <p className="mt-1.5 font-semibold">{responding.name}</p>
                <p className="text-ink/55">{responding.email} · {responding.phone}</p>
              </div>
              <div>
                <p className="font-mono text-[10px] text-ink/40">Shipment</p>
                <p className="mt-1.5">{responding.origin} → {responding.destination}</p>
                <p className="text-ink/55">{responding.packageType}{responding.weight ? ` · ${responding.weight} kg` : ''}{responding.dimensions ? ` · ${responding.dimensions}` : ''}</p>
                <p className="text-ink/55">Preference: {responding.preference || '—'}</p>
              </div>
            </div>
            {responding.notes && (
              <p className="rounded-xl border border-ink/10 p-4 text-[13px] text-ink/60">“{responding.notes}”</p>
            )}
            <p className="text-[12px] text-ink/45">Submitted {formatDateTime(responding.createdAt)}</p>

            <Field label="Response (sent to the customer)">
              <Textarea rows={4} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Provide the official quotation details…" />
            </Field>
            <div className="flex gap-3">
              <button className="btn-primary btn-sm" onClick={respond} disabled={busy || (responding.status === 'New' && !message.trim())}>
                {busy ? 'Saving…' : responding.status === 'New' ? 'Send response' : 'Update response'}
              </button>
              <button className="btn-outline btn-sm" onClick={() => setResponding(null)}>Close</button>
            </div>
          </div>
        )}
      </Modal>

      {note && (
        <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-[13px] text-emerald-700">{note}</p>
      )}

      <DemoBanner note="Quotation responses are stored locally in demonstration mode. Production responses are emailed from the backend using the official business address." />
    </div>
  );
}
