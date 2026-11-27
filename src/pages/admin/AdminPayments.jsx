import { useEffect, useState } from 'react';
import { PlusCircle } from 'lucide-react';
import usePageTitle from '../../hooks/usePageTitle.js';
import DataTable from '../../components/DataTable.jsx';
import { Field, TextInput, Textarea } from '../../components/Field.jsx';
import { LoadingState, DemoBanner, ErrorState } from '../../components/States.jsx';
import {
  adminList,
  adminCreate,
  PAYMENT_STATUS_STYLES,
} from '../../services/paymentService.js';
import { USE_MOCK } from '../../services/api.js';
import { formatMoney, formatDateTime, required } from '../../utils/format.js';

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1 font-mono text-[10.5px] font-semibold ${
        PAYMENT_STATUS_STYLES[status] || 'bg-mist text-ink border-ink/15'
      }`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

/**
 * Admin payment management — create trusted invoices (server-side amounts)
 * and monitor payment statuses. Customer-side checkout and verification are
 * fully server-driven; nothing here touches Paystack credentials.
 */
export default function AdminPayments() {
  usePageTitle('Manage Payments');
  const [payments, setPayments] = useState(null);
  const [form, setForm] = useState({
    customer_email: '',
    booking_reference: '',
    description: '',
    amount: '',
    currency: 'NGN',
  });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [created, setCreated] = useState(null);
  const [error, setError] = useState('');

  const load = () => {
    adminList().then(setPayments).catch((err) => {
      setPayments([]);
      setError(err.message || 'Could not load payments.');
    });
  };

  useEffect(load, []);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!required(form.customer_email)) errs.customer_email = 'Customer email is required.';
    if (!required(form.amount) || Number(form.amount) <= 0) errs.amount = 'Enter a valid amount.';
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setBusy(true);
    setError('');
    try {
      const payment = await adminCreate({
        customer_email: form.customer_email.trim(),
        booking_reference: form.booking_reference.trim() || null,
        description: form.description.trim() || null,
        amount: Number(form.amount),
        currency: form.currency || 'NGN',
      });
      setCreated(payment);
      setForm({ customer_email: '', booking_reference: '', description: '', amount: '', currency: 'NGN' });
      load();
    } catch (err) {
      setError(err.message || 'Could not create the payment record.');
    } finally {
      setBusy(false);
    }
  };

  if (!payments) return <LoadingState label="Loading payments" />;

  return (
    <div className="space-y-6">
      <p className="max-w-2xl text-[13.5px] text-ink/55">
        Create invoices with trusted amounts — the customer can only pay the amount stored here.
        Paystack initialization, verification and webhooks run on the server.
      </p>

      {USE_MOCK && (
        <DemoBanner note="Payments require the FastAPI backend with Paystack keys configured server-side (PAYMENTS_ENABLED=true). Mock mode shows sample records only." />
      )}
      {error && <ErrorState message={error} />}

      {/* Create invoice */}
      <form className="card max-w-3xl p-7 md:p-8" onSubmit={submit} noValidate>
        <h3 className="flex items-center gap-2 text-[20px]">
          <PlusCircle className="h-5 w-5 text-brand-deep" /> Create payment record (invoice)
        </h3>
        {created && (
          <p className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-[13px] text-emerald-700">
            Invoice <span className="font-mono font-semibold">{created.reference}</span> created for{' '}
            {formatMoney(created.amount, created.currency)} — the customer can now pay from their
            dashboard.
          </p>
        )}
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <Field label="Customer email" required error={errors.customer_email}>
            <TextInput
              type="email"
              value={form.customer_email}
              onChange={set('customer_email')}
              placeholder="customer@email.com"
              invalid={!!errors.customer_email}
            />
          </Field>
          <Field label="Amount (NGN)" required error={errors.amount} hint="Charged in kobo by the backend (×100).">
            <TextInput
              type="number"
              min="1"
              step="0.01"
              value={form.amount}
              onChange={set('amount')}
              placeholder="e.g. 185000"
              invalid={!!errors.amount}
            />
          </Field>
          <Field label="Booking reference" hint="Optional — links the invoice to a booking.">
            <TextInput value={form.booking_reference} onChange={set('booking_reference')} placeholder="D3Z-…" hint="Invoice a booking reference and its payment-gated shipment is created automatically — tracking unlocks when this payment succeeds." />
          </Field>
          <Field label="Currency">
            <TextInput value="NGN" disabled className="opacity-60" />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Description" hint="Shown to the customer on their Payments page.">
              <Textarea
                rows={2}
                value={form.description}
                onChange={set('description')}
                placeholder="e.g. Air freight — Lagos → London, 4.5 kg carton"
              />
            </Field>
          </div>
        </div>
        <div className="mt-6">
          <button className="btn-primary" disabled={busy}>
            {busy ? 'Creating…' : 'Create invoice'}
          </button>
        </div>
      </form>

      {/* List */}
      <DataTable
        rows={payments}
        columns={[
          { key: 'reference', label: 'Reference', render: (p) => <span className="font-mono font-semibold">{p.reference}</span> },
          { key: 'user_email', label: 'Customer', render: (p) => <span className="font-mono text-[12.5px]">{p.user_email}</span> },
          { key: 'description', label: 'Description', render: (p) => (p.description ? <span className="block max-w-[240px] truncate">{p.description}</span> : '—') },
          { key: 'amount', label: 'Amount', render: (p) => formatMoney(p.amount, p.currency) },
          { key: 'booking_reference', label: 'Booking', render: (p) => p.booking_reference || '—' },
          { key: 'created_at', label: 'Created', render: (p) => formatDateTime(p.created_at) },
          { key: 'status', label: 'Status', render: (p) => <StatusBadge status={p.status} /> },
          { key: 'source', label: 'Record', render: (p) => <span className="font-mono text-[10px] text-ink/40">{p.source || 'live'}</span> },
        ]}
        empty="No payment records yet — create the first invoice above."
      />
    </div>
  );
}
