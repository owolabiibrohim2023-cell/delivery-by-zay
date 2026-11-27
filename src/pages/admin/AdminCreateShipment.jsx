import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import usePageTitle from '../../hooks/usePageTitle.js';
import { Field, TextInput, Select, Textarea } from '../../components/Field.jsx';
import { ErrorState, DemoBanner } from '../../components/States.jsx';
import * as shipmentService from '../../services/shipmentService.js';
import { COUNTRIES } from '../../data/countries.js';
import { required, isEmail, generateRef } from '../../utils/format.js';

const NG_STATES = ['Lagos', 'FCT (Abuja)', 'Rivers', 'Ogun', 'Oyo', 'Kano', 'Edo', 'Enugu', 'Other'];
const METHODS = ['Air Freight', 'Ocean Freight'];
const SERVICES = ['International Shipping', 'International Parcel Delivery', 'Door-to-Door Delivery', 'Cargo Shipping', 'Business & Bulk Shipping', 'Package Collection'];

export default function AdminCreateShipment() {
  usePageTitle('Create Shipment');
  const [form, setForm] = useState({
    customerName: '',
    customerEmail: '',
    originCity: 'Lagos',
    originState: 'Lagos',
    destCity: '',
    destCountry: '',
    method: 'Air Freight',
    service: SERVICES[0],
    weight: '',
    pieces: 1,
    description: '',
    shipDate: '',
    estimatedDelivery: '',
    carrier: '',
    notes: '',
  });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [created, setCreated] = useState(null);
  const [error, setError] = useState('');

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!required(form.customerName)) errs.customerName = 'Customer name is required.';
    if (!required(form.customerEmail) || !isEmail(form.customerEmail)) errs.customerEmail = 'A valid customer email is required.';
    if (!required(form.destCity)) errs.destCity = 'Destination city is required.';
    if (!required(form.destCountry)) errs.destCountry = 'Destination country is required.';
    if (!required(form.weight) || Number(form.weight) <= 0) errs.weight = 'Weight is required.';
    if (!required(form.description)) errs.description = 'Contents description is required.';
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setBusy(true);
    setError('');
    try {
      const shipment = await shipmentService.adminCreate({
        customerName: form.customerName,
        customerEmail: form.customerEmail,
        origin: { city: form.originCity, state: form.originState, country: 'Nigeria' },
        destination: { city: form.destCity, state: '', country: form.destCountry },
        method: form.method,
        service: form.service,
        weight: Number(form.weight),
        pieces: Number(form.pieces) || 1,
        description: form.description,
        shipDate: form.shipDate,
        estimatedDelivery: form.estimatedDelivery,
        carrier: form.carrier || 'To be assigned',
        status: 'Booking Received',
        notes: form.notes,
        trackingNumber: generateRef('D3Z'),
      });
      setCreated(shipment);
    } catch (err) {
      setError(err.message || 'Could not create the shipment.');
    } finally {
      setBusy(false);
    }
  };

  if (created) {
    return (
      <div className="card mx-auto max-w-xl p-8 text-center md:p-12">
        <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500" />
        <h2 className="h-display mt-5 text-3xl">Shipment created.</h2>
        <p className="mt-3 text-[14px] text-ink/55">Tracking number</p>
        <p className="mt-2 inline-block rounded-xl bg-mist px-6 py-3 font-mono text-[20px] font-bold">
          {created.trackingNumber}
        </p>
        <p className="mt-6 text-[13px] leading-relaxed text-ink/50">
          Share it with the customer. Status updates can be added from the Update Tracking page.
        </p>
        {created.demo && <DemoBanner className="mt-6 text-left" note="Created in the local development store — production shipments are saved to PostgreSQL via the backend." />}
        <div className="mt-8 flex justify-center gap-4">
          <Link to="/admin/tracking" className="btn-primary btn-sm">Add tracking update</Link>
          <button className="btn-outline btn-sm" onClick={() => setCreated(null)}>Create another</button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <p className="max-w-2xl text-[13.5px] text-ink/55">
        Create a shipment record manually. A tracking number is generated automatically.
      </p>
      <form className="card max-w-3xl p-7 md:p-9" onSubmit={submit} noValidate>
        {error && <ErrorState message={error} className="mb-6" />}
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Customer name" required error={errors.customerName}>
            <TextInput value={form.customerName} onChange={set('customerName')} placeholder="Customer full name" invalid={!!errors.customerName} />
          </Field>
          <Field label="Customer email" required error={errors.customerEmail}>
            <TextInput type="email" value={form.customerEmail} onChange={set('customerEmail')} placeholder="customer@email.com" invalid={!!errors.customerEmail} />
          </Field>
          <Field label="Origin city">
            <Select value={form.originCity} onChange={set('originCity')} options={['Lagos', 'Abuja', 'Other']} />
          </Field>
          <Field label="Origin state">
            <Select value={form.originState} onChange={set('originState')} options={NG_STATES} />
          </Field>
          <Field label="Destination city" required error={errors.destCity}>
            <TextInput value={form.destCity} onChange={set('destCity')} placeholder="e.g. London" invalid={!!errors.destCity} />
          </Field>
          <Field label="Destination country" required error={errors.destCountry}>
            <Select
              value={form.destCountry}
              onChange={set('destCountry')}
              placeholder="Select country"
              options={COUNTRIES.map(([, name]) => ({ value: name, label: name }))}
              invalid={!!errors.destCountry}
            />
          </Field>
          <Field label="Method">
            <Select value={form.method} onChange={set('method')} options={METHODS} />
          </Field>
          <Field label="Service">
            <Select value={form.service} onChange={set('service')} options={SERVICES} />
          </Field>
          <Field label="Weight (kg)" required error={errors.weight}>
            <TextInput type="number" min="0.1" step="0.1" value={form.weight} onChange={set('weight')} invalid={!!errors.weight} />
          </Field>
          <Field label="Pieces">
            <TextInput type="number" min="1" value={form.pieces} onChange={set('pieces')} />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Contents description" required error={errors.description}>
              <TextInput value={form.description} onChange={set('description')} placeholder="What is being shipped?" invalid={!!errors.description} />
            </Field>
          </div>
          <Field label="Shipment date">
            <TextInput type="date" value={form.shipDate} onChange={set('shipDate')} />
          </Field>
          <Field label="Estimated delivery date">
            <TextInput type="date" value={form.estimatedDelivery} onChange={set('estimatedDelivery')} />
          </Field>
          <Field label="Carrier">
            <TextInput value={form.carrier} onChange={set('carrier')} placeholder="To be assigned" />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Internal notes" hint="Visible to administrators only in production.">
              <Textarea rows={3} value={form.notes} onChange={set('notes')} />
            </Field>
          </div>
        </div>
        <div className="mt-8">
          <button className="btn-primary" disabled={busy}>
            {busy ? 'Creating…' : 'Create shipment'}
          </button>
        </div>
      </form>
    </div>
  );
}
