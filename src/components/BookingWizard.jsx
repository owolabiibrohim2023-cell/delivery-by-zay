import { useState } from 'react';
import { Check, CheckCircle2, ChevronLeft, ChevronRight, PartyPopper } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Field, TextInput, Select, Textarea, Checkbox } from './Field.jsx';
import { DemoBanner } from './States.jsx';
import * as bookingService from '../services/bookingService.js';
import { COUNTRIES } from '../data/countries.js';
import { isEmail, isPhone, required, formatDateTime } from '../utils/format.js';
import { USE_MOCK } from '../services/api.js';

const STEPS = ['Sender', 'Receiver', 'Package', 'Review'];

const PACKAGE_TYPES = ['Box', 'Carton', 'Bag', 'Pallet', 'Crate', 'Envelope', 'Document', 'Other'];
const CATEGORIES = [
  'Personal Effects',
  'Documents',
  'Foodstuff (dry, sealed)',
  'Electronics',
  'Clothing & Fashion',
  'Commercial Goods',
  'Household Goods',
  'Other (describe below)',
];
const METHODS = ['Air Freight', 'Ocean Freight', 'Advise me'];
const DELIVERY_OPTIONS = ['Door-to-door delivery', 'Pickup at destination office', 'Airport-to-airport', 'Advise me'];

const COUNTRY_OPTIONS = COUNTRIES.map(([code, name]) => ({ value: name, label: name }));
const NG_STATES = ['Abia','Adamawa','Akwa Ibom','Anambra','Bauchi','Bayelsa','Benue','Borno','Cross River','Delta','Ebonyi','Edo','Ekiti','Enugu','FCT (Abuja)','Gombe','Imo','Jigawa','Kaduna','Kano','Katsina','Kebbi','Kogi','Kwara','Lagos','Nasarawa','Niger','Ogun','Ondo','Osun','Oyo','Plateau','Rivers','Sokoto','Taraba','Yobe','Zamfara'];

const TRACKING_MODES = [
  {
    value: 'in_transit',
    title: 'In-Transit Tracking',
    body: 'Follow every DBZ milestone here on this site — from drop-off to delivery.',
  },
  {
    value: 'courier',
    title: 'Courier Tracking',
    body: "Track on the carrier's own portal (DHL, UPS, Aramex or FedEx) once your parcel is handed over.",
  },
];

const EMPTY = {
  trackingMode: 'in_transit',
  sender: { fullName: '', email: '', phone: '', pickupAddress: '', state: '', country: 'Nigeria' },
  receiver: { fullName: '', email: '', phone: '', address: '', city: '', state: '', country: '', postalCode: '' },
  pkg: { type: '', category: '', description: '', weight: '', quantity: 1, dimensions: '', method: '', deliveryOption: '', insurance: false, notes: '' },
};

function validateStep(step, data) {
  const errors = {};
  const s = data.sender;
  const r = data.receiver;
  const p = data.pkg;
  if (step === 0) {
    if (!required(s.fullName)) errors.fullName = 'Full name is required.';
    if (!required(s.email) || !isEmail(s.email)) errors.email = 'A valid email is required.';
    if (!required(s.phone) || !isPhone(s.phone)) errors.phone = 'A valid phone number is required.';
    if (!required(s.pickupAddress)) errors.pickupAddress = 'Pickup address is required.';
    if (!required(s.state)) errors.state = 'State is required.';
    if (!required(s.country)) errors.country = 'Country is required.';
  }
  if (step === 1) {
    if (!required(r.fullName)) errors.fullName = 'Receiver name is required.';
    if (!required(r.phone) || !isPhone(r.phone)) errors.phone = 'A valid receiver phone is required.';
    if (r.email && !isEmail(r.email)) errors.email = 'Receiver email must be valid if provided.';
    if (!required(r.address)) errors.address = 'Delivery address is required.';
    if (!required(r.city)) errors.city = 'City is required.';
    if (!required(r.country)) errors.country = 'Country is required.';
  }
  if (step === 2) {
    if (!required(p.type)) errors.type = 'Package type is required.';
    if (!required(p.category)) errors.category = 'Shipment category is required.';
    if (!required(p.description)) errors.description = 'A short description is required.';
    if (!required(p.weight) || Number(p.weight) <= 0) errors.weight = 'Enter the weight in kg.';
    if (!required(p.dimensions)) errors.dimensions = 'Dimensions are required (e.g. 40 × 35 × 30 cm).';
    if (!required(p.method)) errors.method = 'Choose a shipping method.';
    if (!required(p.deliveryOption)) errors.deliveryOption = 'Choose a delivery option.';
    if (!required(data.trackingMode)) errors.trackingMode = 'Choose how you want to track.';
  }
  return errors;
}

const Row = ({ label, value }) => (
  <div className="flex items-start justify-between gap-6 border-b border-ink/5 py-2.5 last:border-0">
    <span className="text-[12px] font-medium text-ink/45">{label}</span>
    <span className="max-w-[60%] text-right text-[13.5px] font-medium">{value || '—'}</span>
  </div>
);

/**
 * Shared multi-step booking wizard (public page + dashboard).
 */
export default function BookingWizard() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [result, setResult] = useState(null);

  const set = (group, key, value) =>
    setData((d) => ({ ...d, [group]: { ...d[group], [key]: value } }));
  const setMode = (value) => setData((d) => ({ ...d, trackingMode: value }));

  const next = () => {
    const errs = validateStep(step, data);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setStep((s) => Math.min(s + 1, 3));
  };
  const back = () => {
    setErrors({});
    setStep((s) => Math.max(s - 1, 0));
  };

  const submit = async () => {
    setSubmitting(true);
    setSubmitError('');
    try {
      const booking = await bookingService.create({
        sender: data.sender,
        receiver: data.receiver,
        pkg: data.pkg,
        trackingMode: data.trackingMode,
      });
      setResult(booking);
    } catch (err) {
      setSubmitError(err.message || 'Could not submit your booking. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  /* ---------- success screen ---------- */
  if (result) {
    return (
      <div className="card p-8 text-center md:p-12">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand/20">
          <PartyPopper className="h-7 w-7 text-brand-deep" />
        </span>
        <h2 className="h-display mt-6 text-4xl">Booking received.</h2>
        <p className="mt-3 text-[14px] text-ink/60">
          Your booking reference is
        </p>
        <p className="mt-2 inline-block rounded-xl bg-mist px-6 py-3 font-mono text-[20px] font-bold">
          {result.reference}
        </p>
        <p className="mx-auto mt-6 max-w-md text-[13.5px] leading-relaxed text-ink/55">
          Keep this reference safe. Once the DBZ team reviews and approves your booking, your
          invoice appears under <strong className="text-ink">Dashboard → Payments</strong> — pay
          it securely via Paystack and <strong className="text-ink">active tracking unlocks
          immediately after payment is confirmed</strong>. A confirmation email will be
          sent to <strong className="text-ink">{result.customerEmail}</strong> when email
          notifications are connected.
        </p>
        {USE_MOCK && <DemoBanner className="mt-8 text-left" note={result.note} />}
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link to="/dashboard/shipments" className="btn-primary">
            <CheckCircle2 className="h-4 w-4" /> View my shipments
          </Link>
          <Link to="/dashboard/payments" className="btn-outline">Payments</Link>
        </div>
      </div>
    );
  }

  /* ---------- wizard ---------- */
  return (
    <div className="card overflow-hidden">
      {/* Stepper */}
      <div className="border-b border-ink/10 bg-mist/50 px-6 py-5 md:px-9">
        <ol className="flex items-center">
          {STEPS.map((label, i) => (
            <li key={label} className="flex flex-1 items-center last:flex-none">
              <div className="flex items-center gap-3">
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-full font-mono text-[12px] font-bold transition-colors ${
                    i < step
                      ? 'bg-ink text-brand'
                      : i === step
                        ? 'bg-brand text-ink ring-4 ring-brand/25'
                        : 'border border-ink/15 bg-white text-ink/40'
                  }`}
                >
                  {i < step ? '✓' : i + 1}
                </span>
                <span
                  className={`hidden font-sans text-[12px] font-semibold sm:block ${
                    i === step ? 'text-ink' : 'text-ink/40'
                  }`}
                >
                  {label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <span className={`mx-3 h-0.5 flex-1 rounded ${i < step ? 'bg-ink' : 'bg-ink/10'}`} />
              )}
            </li>
          ))}
        </ol>
      </div>

      <div className="p-6 md:p-9">
        {submitError && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">
            {submitError}
          </div>
        )}

        {/* Step 1 — Sender */}
        {step === 0 && (
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <h2 className="h-display text-3xl">Sender information.</h2>
              <p className="mt-1.5 text-[13px] text-ink/50">Who is sending this shipment?</p>
            </div>
            <Field label="Full name" required error={errors.fullName}>
              <TextInput value={data.sender.fullName} onChange={(e) => set('sender', 'fullName', e.target.value)} placeholder="Your full name" invalid={!!errors.fullName} />
            </Field>
            <Field label="Email" required error={errors.email}>
              <TextInput type="email" value={data.sender.email} onChange={(e) => set('sender', 'email', e.target.value)} placeholder="you@email.com" invalid={!!errors.email} />
            </Field>
            <Field label="Phone number" required error={errors.phone}>
              <TextInput value={data.sender.phone} onChange={(e) => set('sender', 'phone', e.target.value)} placeholder="08XX XXX XXXX" invalid={!!errors.phone} />
            </Field>
            <Field label="State" required error={errors.state}>
              <Select value={data.sender.state} onChange={(e) => set('sender', 'state', e.target.value)} placeholder="Select state" options={NG_STATES} invalid={!!errors.state} />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Pickup address" required error={errors.pickupAddress} hint="Where collection should happen if you request pickup.">
                <Textarea rows={2} value={data.sender.pickupAddress} onChange={(e) => set('sender', 'pickupAddress', e.target.value)} placeholder="House number, street, area, city" invalid={!!errors.pickupAddress} />
              </Field>
            </div>
            <Field label="Country" required error={errors.country}>
              <Select value={data.sender.country} onChange={(e) => set('sender', 'country', e.target.value)} placeholder="Select country" options={[{ value: 'Nigeria', label: 'Nigeria' }]} invalid={!!errors.country} />
            </Field>
          </div>
        )}

        {/* Step 2 — Receiver */}
        {step === 1 && (
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <h2 className="h-display text-3xl">Receiver information.</h2>
              <p className="mt-1.5 text-[13px] text-ink/50">Who should receive this shipment?</p>
            </div>
            <Field label="Full name" required error={errors.fullName}>
              <TextInput value={data.receiver.fullName} onChange={(e) => set('receiver', 'fullName', e.target.value)} placeholder="Receiver full name" invalid={!!errors.fullName} />
            </Field>
            <Field label="Email" error={errors.email} hint="Optional — used for delivery updates.">
              <TextInput type="email" value={data.receiver.email} onChange={(e) => set('receiver', 'email', e.target.value)} placeholder="receiver@email.com" invalid={!!errors.email} />
            </Field>
            <Field label="Phone number" required error={errors.phone}>
              <TextInput value={data.receiver.phone} onChange={(e) => set('receiver', 'phone', e.target.value)} placeholder="+44 7XXX XXXXXX" invalid={!!errors.phone} />
            </Field>
            <Field label="Postal code" error={errors.postalCode} hint="Required for most UK / US / Canada addresses.">
              <TextInput value={data.receiver.postalCode} onChange={(e) => set('receiver', 'postalCode', e.target.value)} placeholder="e.g. SW1A 1AA" />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Delivery address" required error={errors.address}>
                <Textarea rows={2} value={data.receiver.address} onChange={(e) => set('receiver', 'address', e.target.value)} placeholder="House number, street, area" invalid={!!errors.address} />
              </Field>
            </div>
            <Field label="City" required error={errors.city}>
              <TextInput value={data.receiver.city} onChange={(e) => set('receiver', 'city', e.target.value)} placeholder="City" invalid={!!errors.city} />
            </Field>
            <Field label="State / region" error={errors.state}>
              <TextInput value={data.receiver.state} onChange={(e) => set('receiver', 'state', e.target.value)} placeholder="State or region" />
            </Field>
            <Field label="Country" required error={errors.country}>
              <Select value={data.receiver.country} onChange={(e) => set('receiver', 'country', e.target.value)} placeholder="Select destination country" options={COUNTRY_OPTIONS} invalid={!!errors.country} />
            </Field>
          </div>
        )}

        {/* Step 3 — Package */}
        {step === 2 && (
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <h2 className="h-display text-3xl">Package information.</h2>
              <p className="mt-1.5 text-[13px] text-ink/50">Tell us what we are shipping.</p>
            </div>
            <Field label="Package type" required error={errors.type}>
              <Select value={data.pkg.type} onChange={(e) => set('pkg', 'type', e.target.value)} placeholder="Select type" options={PACKAGE_TYPES} invalid={!!errors.type} />
            </Field>
            <Field label="Shipment category" required error={errors.category}>
              <Select value={data.pkg.category} onChange={(e) => set('pkg', 'category', e.target.value)} placeholder="Select category" options={CATEGORIES} invalid={!!errors.category} />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Package description" required error={errors.description} hint="What is inside? Be accurate — customs documentation depends on it.">
                <TextInput value={data.pkg.description} onChange={(e) => set('pkg', 'description', e.target.value)} placeholder="e.g. Sealed carton of dry foodstuff and documents" invalid={!!errors.description} />
              </Field>
            </div>
            <Field label="Weight (kg)" required error={errors.weight}>
              <TextInput type="number" min="0.1" step="0.1" value={data.pkg.weight} onChange={(e) => set('pkg', 'weight', e.target.value)} placeholder="e.g. 4.5" invalid={!!errors.weight} />
            </Field>
            <Field label="Quantity (pieces)">
              <TextInput type="number" min="1" value={data.pkg.quantity} onChange={(e) => set('pkg', 'quantity', e.target.value)} />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Dimensions (L × W × H cm)" required error={errors.dimensions}>
                <TextInput value={data.pkg.dimensions} onChange={(e) => set('pkg', 'dimensions', e.target.value)} placeholder="e.g. 40 × 35 × 30 cm" invalid={!!errors.dimensions} />
              </Field>
            </div>
            <Field label="Shipping method" required error={errors.method}>
              <Select value={data.pkg.method} onChange={(e) => set('pkg', 'method', e.target.value)} placeholder="Select method" options={METHODS} invalid={!!errors.method} />
            </Field>
            <Field label="Preferred delivery option" required error={errors.deliveryOption}>
              <Select value={data.pkg.deliveryOption} onChange={(e) => set('pkg', 'deliveryOption', e.target.value)} placeholder="Select option" options={DELIVERY_OPTIONS} invalid={!!errors.deliveryOption} />
            </Field>
            <div className="sm:col-span-2">
              <Field
                label="How should we track your shipment?"
                required
                error={errors.trackingMode}
                hint="Active tracking starts as soon as your payment is verified — no tracking before payment."
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  {TRACKING_MODES.map((m) => {
                    const active = data.trackingMode === m.value;
                    return (
                      <button
                        key={m.value}
                        type="button"
                        onClick={() => setMode(m.value)}
                        aria-pressed={active}
                        className={`rounded-xl border p-4 text-left transition-colors ${active ? 'border-brand bg-brand/10' : 'border-ink/15 bg-white hover:border-ink/30'}`}
                      >
                        <span className="flex items-center justify-between gap-3">
                          <span className="text-[14px] font-bold">{m.title}</span>
                          <span className={`flex h-5 w-5 items-center justify-center rounded-full border ${active ? 'border-brand bg-brand text-white' : 'border-ink/25'}`}>
                            {active && <Check className="h-3 w-3" strokeWidth={3} />}
                          </span>
                        </span>
                        <span className="mt-1.5 block text-[12px] leading-relaxed text-ink/55">{m.body}</span>
                      </button>
                    );
                  })}
                </div>
              </Field>
            </div>
            <div className="sm:col-span-2">
              <Field label="Additional notes" hint="Anything our operations team should know.">
                <Textarea rows={3} value={data.pkg.notes} onChange={(e) => set('pkg', 'notes', e.target.value)} placeholder="Optional" />
              </Field>
              <div className="mt-4">
                <Checkbox
                  label="I confirm this shipment does not contain prohibited or restricted items."
                  checked={data.pkg.insurance}
                  onChange={(e) => set('pkg', 'insurance', e.target.checked)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4 — Review */}
        {step === 3 && (
          <div>
            <h2 className="h-display text-3xl">Review &amp; confirm.</h2>
            <p className="mt-1.5 text-[13px] text-ink/50">Check every detail before submitting your booking.</p>
            <div className="mt-7 grid gap-5 md:grid-cols-3">
              <div className="rounded-xl border border-ink/10 p-5">
                <h3 className="font-mono text-[11px] font-semibold text-ink/45">Sender</h3>
                <div className="mt-3">
                  <Row label="Name" value={data.sender.fullName} />
                  <Row label="Email" value={data.sender.email} />
                  <Row label="Phone" value={data.sender.phone} />
                  <Row label="Pickup" value={data.sender.pickupAddress} />
                  <Row label="State" value={data.sender.state} />
                  <Row label="Country" value={data.sender.country} />
                </div>
              </div>
              <div className="rounded-xl border border-ink/10 p-5">
                <h3 className="font-mono text-[11px] font-semibold text-ink/45">Receiver</h3>
                <div className="mt-3">
                  <Row label="Name" value={data.receiver.fullName} />
                  <Row label="Email" value={data.receiver.email || '—'} />
                  <Row label="Phone" value={data.receiver.phone} />
                  <Row label="Address" value={`${data.receiver.address}, ${data.receiver.city}`} />
                  <Row label="State" value={data.receiver.state || '—'} />
                  <Row label="Country" value={data.receiver.country} />
                  <Row label="Postal code" value={data.receiver.postalCode || '—'} />
                </div>
              </div>
              <div className="rounded-xl border border-ink/10 p-5">
                <h3 className="font-mono text-[11px] font-semibold text-ink/45">Package</h3>
                <div className="mt-3">
                  <Row label="Type" value={data.pkg.type} />
                  <Row label="Category" value={data.pkg.category} />
                  <Row label="Description" value={data.pkg.description} />
                  <Row label="Weight" value={data.pkg.weight ? `${data.pkg.weight} kg` : ''} />
                  <Row label="Quantity" value={data.pkg.quantity} />
                  <Row label="Dimensions" value={data.pkg.dimensions} />
                  <Row label="Method" value={data.pkg.method} />
                  <Row label="Delivery" value={data.pkg.deliveryOption} />
                  <Row label="Tracking" value={data.trackingMode === 'courier' ? 'Courier tracking' : 'In-transit tracking'} />
                </div>
              </div>
            </div>
            <p className="mt-6 text-[12px] leading-relaxed text-ink/45">
              Submitted {formatDateTime(new Date().toISOString())} · By submitting you confirm the
              declared contents are accurate and do not include prohibited items. Rates are
              confirmed by the DBZ team via quotation — never estimated here.
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="mt-9 flex items-center justify-between gap-4">
          <button onClick={back} className="btn-outline btn-sm" disabled={step === 0 || submitting} style={step === 0 ? { visibility: 'hidden' } : undefined}>
            <ChevronLeft className="h-4 w-4" /> Back
          </button>
          {step < 3 ? (
            <button onClick={next} className="btn-primary">
              Continue <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button onClick={submit} className="btn-primary" disabled={submitting}>
              {submitting ? 'Submitting…' : 'Confirm booking'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
