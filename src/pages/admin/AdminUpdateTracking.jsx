import { useEffect, useMemo, useState } from 'react';
import usePageTitle from '../../hooks/usePageTitle.js';
import Badge from '../../components/Badge.jsx';
import Timeline from '../../components/Timeline.jsx';
import { Field, TextInput, Select, Textarea } from '../../components/Field.jsx';
import { LoadingState, DemoBanner, ErrorState } from '../../components/States.jsx';
import * as shipmentService from '../../services/shipmentService.js';

export default function AdminUpdateTracking() {
  usePageTitle('Update Tracking');
  const [shipments, setShipments] = useState(null);
  const [selectedId, setSelectedId] = useState('');
  const [form, setForm] = useState({ status: '', location: '', note: '', estimatedDelivery: '', carrier: '' });
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let alive = true;
    shipmentService.adminList().then((list) => alive && setShipments(list)).catch(() => alive && setShipments([]));
    return () => {
      alive = false;
    };
  }, []);

  const selected = useMemo(
    () => shipments?.find((s) => s.id === selectedId) || null,
    [shipments, selectedId]
  );

  useEffect(() => {
    if (selected) {
      setForm({
        status: selected.status,
        location: '',
        note: '',
        estimatedDelivery: selected.estimatedDelivery || '',
        carrier: selected.carrier || '',
      });
    }
  }, [selectedId, selected]);

  const submit = async (e) => {
    e.preventDefault();
    if (!selected) return;
    setBusy(true);
    setMessage(null);
    setError('');
    try {
      const updated = await shipmentService.adminUpdateTracking(selected.id, form);
      setMessage(
        updated?.demoNote ||
          `Tracking updated for ${updated?.trackingNumber || selected.trackingNumber}. The customer sees the new milestone immediately.`
      );
      // refresh list
      const list = await shipmentService.adminList();
      setShipments(list);
    } catch (err) {
      setError(err.message || 'Could not update tracking.');
    } finally {
      setBusy(false);
    }
  };

  if (!shipments) return <LoadingState label="Loading shipments" />;

  return (
    <div className="space-y-6">
      <p className="max-w-2xl text-[13.5px] text-ink/55">
        Select a shipment, set the new status and add a milestone to the tracking history.
      </p>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        {/* Update form */}
        <form className="card h-fit p-7 md:p-9" onSubmit={submit} noValidate>
          <Field label="Shipment" required>
            <Select value={selectedId} onChange={(e) => setSelectedId(e.target.value)} placeholder="Select a shipment…">
              {shipments.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.trackingNumber} — {s.destination.city}, {s.destination.country} ({s.status})
                </option>
              ))}
            </Select>
          </Field>

          {selected && (
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <Field label="New status" required>
                <Select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))} options={shipmentService.SHIPMENT_STATUSES} />
              </Field>
              <Field label="Milestone location">
                <TextInput value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} placeholder="e.g. London Heathrow, UK" />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Milestone note">
                  <Textarea rows={2} value={form.note} onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))} placeholder="Shown to the customer on the timeline" />
                </Field>
              </div>
              <Field label="Estimated delivery date">
                <TextInput type="date" value={form.estimatedDelivery} onChange={(e) => setForm((f) => ({ ...f, estimatedDelivery: e.target.value }))} />
              </Field>
              <Field label="Carrier">
                <TextInput value={form.carrier} onChange={(e) => setForm((f) => ({ ...f, carrier: e.target.value }))} />
              </Field>
              <div className="sm:col-span-2">
                <button className="btn-primary" disabled={busy || !selectedId}>
                  {busy ? 'Updating…' : 'Add tracking update'}
                </button>
              </div>
            </div>
          )}

          {message && (
            <p className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-[13px] text-emerald-700">
              {message}
            </p>
          )}
          {error && <ErrorState message={error} className="mt-5" />}
        </form>

        {/* Timeline preview */}
        <div className="card h-fit p-7">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-[18px]">Timeline preview</h3>
            {selected && <Badge value={selected.status} />}
          </div>
          {selected ? (
            <>
              <p className="mt-1 font-mono text-[12px] text-ink/45">{selected.trackingNumber}</p>
              <div className="mt-6">
                <Timeline history={selected.history} currentStatus={selected.status} />
              </div>
            </>
          ) : (
            <p className="mt-6 text-[13px] text-ink/45">Select a shipment to preview its timeline.</p>
          )}
        </div>
      </div>

      <DemoBanner note="Sample shipments are read-only demonstration records; shipments created via Create Shipment update the local development store. Production updates go through POST /api/admin/shipments/:id/tracking." />
    </div>
  );
}
