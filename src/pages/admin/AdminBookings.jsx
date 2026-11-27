import { useEffect, useMemo, useState } from 'react';
import usePageTitle from '../../hooks/usePageTitle.js';
import DataTable from '../../components/DataTable.jsx';
import Modal from '../../components/Modal.jsx';
import { Field, Select, Textarea } from '../../components/Field.jsx';
import { LoadingState, DemoBanner } from '../../components/States.jsx';
import * as bookingService from '../../services/bookingService.js';
import { formatDate, formatDateTime } from '../../utils/format.js';

export default function AdminBookings() {
  usePageTitle('Manage Bookings');
  const [bookings, setBookings] = useState(null);
  const [filter, setFilter] = useState('All');
  const [review, setReview] = useState(null); // booking being reviewed
  const [decision, setDecision] = useState(null); // 'approve' | 'reject'
  const [reason, setReason] = useState('');
  const [busy, setBusy] = useState(false);

  const load = () => {
    bookingService.adminList().then(setBookings).catch(() => setBookings([]));
  };

  useEffect(load, []);

  const rows = useMemo(() => {
    if (!bookings) return [];
    return filter === 'All' ? bookings : bookings.filter((b) => b.status === filter);
  }, [bookings, filter]);

  const decide = async () => {
    if (!review || !decision) return;
    setBusy(true);
    try {
      await bookingService.adminSetStatus(review.id, decision === 'approve' ? 'Approved' : 'Rejected', decision === 'reject' ? reason : '');
      setReview(null);
      setDecision(null);
      setReason('');
      load();
    } finally {
      setBusy(false);
    }
  };

  if (!bookings) return <LoadingState label="Loading bookings" />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Select value={filter} onChange={(e) => setFilter(e.target.value)} className="!w-56">
          {['All', 'Pending Review', 'Approved', 'Rejected'].map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </Select>
        <p className="font-mono text-[11px] text-ink/40">
          {rows.length} booking{rows.length === 1 ? '' : 's'}
        </p>
      </div>

      <DataTable
        rows={rows}
        columns={[
          { key: 'reference', label: 'Reference', render: (b) => <span className="font-mono font-semibold">{b.reference}</span> },
          { key: 'sender', label: 'Sender', render: (b) => `${b.sender?.fullName} (${b.sender?.state})` },
          { key: 'receiver', label: 'Destination', render: (b) => `${b.receiver?.city}, ${b.receiver?.country}` },
          { key: 'pkg', label: 'Package', render: (b) => `${b.pkg?.type} · ${b.pkg?.weight} kg · ${b.pkg?.quantity} pc` },
          { key: 'createdAt', label: 'Submitted', render: (b) => formatDate(b.createdAt) },
          {
            key: 'status',
            label: 'Status',
            render: (b) => (
              <span className={`inline-flex rounded-full border px-3 py-1 font-mono text-[10.5px] font-semibold ${
                b.status === 'Approved' ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                : b.status === 'Rejected' ? 'bg-red-50 text-red-700 border-red-300'
                : 'bg-brand/15 text-ink border-brand/50'
              }`}>
                {b.status}
              </span>
            ),
          },
          {
            key: 'actions',
            label: 'Actions',
            className: 'text-right',
            render: (b) =>
              b.status === 'Pending Review' ? (
                <button className="rounded-full bg-ink px-4 py-1.5 font-mono text-[10.5px] font-semibold text-white hover:bg-black" onClick={() => setReview(b)}>
                  Review
                </button>
              ) : (
                <button className="font-mono text-[10.5px] font-semibold text-ink/40 hover:text-ink" onClick={() => setReview(b)}>
                  View
                </button>
              ),
          },
        ]}
        empty="No bookings match this filter."
      />

      {/* Review modal */}
      <Modal open={!!review} onClose={() => setReview(null)} title={review?.reference || ''}>
        {review && (
          <div className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-mist p-4 text-[13px]">
                <p className="font-mono text-[10px] text-ink/40">Sender</p>
                <p className="mt-1.5 font-semibold">{review.sender?.fullName}</p>
                <p className="text-ink/55">{review.sender?.email}</p>
                <p className="text-ink/55">{review.sender?.phone}</p>
                <p className="mt-2 text-ink/55">{review.sender?.pickupAddress}, {review.sender?.state}, {review.sender?.country}</p>
              </div>
              <div className="rounded-xl bg-mist p-4 text-[13px]">
                <p className="font-mono text-[10px] text-ink/40">Receiver</p>
                <p className="mt-1.5 font-semibold">{review.receiver?.fullName}</p>
                <p className="text-ink/55">{review.receiver?.email || '—'}</p>
                <p className="text-ink/55">{review.receiver?.phone}</p>
                <p className="mt-2 text-ink/55">
                  {review.receiver?.address}, {review.receiver?.city}, {review.receiver?.country} {review.receiver?.postalCode}
                </p>
              </div>
            </div>
            <div className="rounded-xl bg-mist p-4 text-[13px]">
              <p className="font-mono text-[10px] text-ink/40">Package</p>
              <p className="mt-1.5">
                <strong>{review.pkg?.category}</strong> — {review.pkg?.description}
              </p>
              <p className="mt-1 text-ink/55">
                {review.pkg?.type} · {review.pkg?.weight} kg · {review.pkg?.quantity} pc · {review.pkg?.dimensions}
              </p>
              <p className="mt-1 text-ink/55">
                {review.pkg?.method} · {review.pkg?.deliveryOption}
              </p>
            </div>
            <p className="text-[12px] text-ink/45">Submitted {formatDateTime(review.createdAt)}</p>

            {review.status === 'Pending Review' ? (
              <>
                {!decision && (
                  <div className="flex flex-wrap gap-3">
                    <button className="btn-primary btn-sm" onClick={() => setDecision('approve')}>
                      Approve booking
                    </button>
                    <button className="btn-outline btn-sm border-red-300 text-red-600 hover:border-red-500 hover:bg-red-500 hover:text-white" onClick={() => setDecision('reject')}>
                      Reject
                    </button>
                  </div>
                )}
                {decision === 'approve' && (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                    <p className="text-[13.5px] text-emerald-800">
                      Approve this booking? A tracking number will be issued and the customer notified once the backend is connected.
                    </p>
                    <div className="mt-4 flex gap-3">
                      <button className="btn-primary btn-sm" onClick={decide} disabled={busy}>
                        {busy ? 'Working…' : 'Confirm approval'}
                      </button>
                      <button className="btn-outline btn-sm" onClick={() => setDecision(null)}>Cancel</button>
                    </div>
                  </div>
                )}
                {decision === 'reject' && (
                  <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                    <Field label="Reason (sent to the customer)">
                      <Textarea rows={2} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Explain what is needed to resubmit…" />
                    </Field>
                    <div className="mt-4 flex gap-3">
                      <button className="btn-dark btn-sm border-red-400 bg-red-600 text-white hover:bg-red-700" onClick={decide} disabled={busy || !reason.trim()}>
                        {busy ? 'Working…' : 'Confirm rejection'}
                      </button>
                      <button className="btn-outline btn-sm" onClick={() => setDecision(null)}>Cancel</button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <p className="rounded-xl bg-mist px-4 py-3 text-[13px] text-ink/55">
                {review.status === 'Rejected' && review.rejectionReason ? `Rejected — ${review.rejectionReason}` : `This booking is ${review.status}.`}
              </p>
            )}
          </div>
        )}
      </Modal>

      <DemoBanner note="Approvals and rejections are stored in the local development store for dev-created bookings; sample bookings are read-only. Production approvals are backend transactions." />
    </div>
  );
}
