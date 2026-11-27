import { useState } from 'react';
import usePageTitle from '../../hooks/usePageTitle.js';
import { Field, TextInput, Select, Textarea } from '../../components/Field.jsx';
import { DemoBanner } from '../../components/States.jsx';
import { adminSend, listFor } from '../../services/notificationService.js';
import { MOCK_CUSTOMERS } from '../../data/mock/mockData.js';
import { formatDateTime } from '../../utils/format.js';

export default function AdminNotifications() {
  usePageTitle('Manage Notifications');
  const [form, setForm] = useState({ audience: 'all', title: '', body: '' });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(null);
  const [log, setLog] = useState([]);

  const submit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title is required.';
    if (!form.body.trim()) errs.body = 'Message body is required.';
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setBusy(true);
    try {
      const res = await adminSend(form);
      setSent(res);
      setLog((l) => [{ ...form, date: new Date().toISOString() }, ...l]);
      setForm({ audience: form.audience, title: '', body: '' });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <form className="card h-fit p-7 md:p-9" onSubmit={submit} noValidate>
          <h3 className="text-[20px]">Send notification</h3>
          <p className="mt-1.5 text-[13px] text-ink/50">
            In-app now; email delivery activates with backend SMTP configuration.
          </p>
          <div className="mt-6 grid gap-5">
            <Field label="Audience">
              <Select value={form.audience} onChange={(e) => setForm((f) => ({ ...f, audience: e.target.value }))}>
                <option value="all">All customers</option>
                {MOCK_CUSTOMERS.map((c) => (
                  <option key={c.id} value={c.email}>{c.name} ({c.email})</option>
                ))}
              </Select>
            </Field>
            <Field label="Title" required error={errors.title}>
              <TextInput value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="e.g. Shipment dispatched" invalid={!!errors.title} />
            </Field>
            <Field label="Message" required error={errors.body}>
              <Textarea rows={4} value={form.body} onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))} placeholder="Write the notification…" invalid={!!errors.body} />
            </Field>
            <div>
              <button className="btn-primary" disabled={busy}>{busy ? 'Sending…' : 'Send notification'}</button>
            </div>
          </div>
          {sent?.deliveryNote && (
            <p className="mt-5 rounded-xl border border-brand/40 bg-brand/10 px-4 py-3 text-[12.5px] text-brand-deep">
              {sent.deliveryNote}
            </p>
          )}
        </form>

        <div className="card h-fit p-7">
          <h3 className="text-[18px]">Recent sends</h3>
          {log.length ? (
            <ul className="mt-4 space-y-3">
              {log.map((n, i) => (
                <li key={i} className="rounded-xl bg-mist p-4">
                  <p className="text-[13.5px] font-semibold">{n.title}</p>
                  <p className="mt-0.5 line-clamp-2 text-[12.5px] text-ink/50">{n.body}</p>
                  <p className="mt-1.5 font-mono text-[10px] text-ink/35">
                    {n.audience} · {formatDateTime(n.date)}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-[13px] text-ink/45">Nothing sent this session.</p>
          )}
        </div>
      </div>

      <DemoBanner note="Notification types prepared: registration, password reset, booking confirmation/approval, quotation response, shipment status changes, dispatch and delivery. All email sending is backend-side." />
    </div>
  );
}
