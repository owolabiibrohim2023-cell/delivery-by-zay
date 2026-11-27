import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PartyPopper } from 'lucide-react';
import usePageTitle from '../hooks/usePageTitle.js';
import PageHero from '../components/PageHero.jsx';
import Section from '../components/Section.jsx';
import Reveal from '../components/Reveal.jsx';
import { Field, TextInput, Select, Textarea } from '../components/Field.jsx';
import { DemoBanner, ErrorState } from '../components/States.jsx';
import * as quoteService from '../services/quoteService.js';
import { BUSINESS } from '../data/media.js';
import { COUNTRIES } from '../data/countries.js';
import { AIR_CARGO_DESTINATIONS, SEA_CARGO_DESTINATIONS, EXPRESS_DESTINATIONS } from '../data/destinations.js';
import { isEmail, isPhone, required } from '../utils/format.js';
import { USE_MOCK, MOCK_MODE_NOTE } from '../services/api.js';

const SERVICE_TYPES = [
  { value: 'Express', label: 'Express' },
  { value: 'Air Cargo', label: 'Air Cargo' },
  { value: 'Sea Cargo', label: 'Sea Cargo' },
];

const EXPRESS_CARRIERS = ['DHL', 'UPS', 'Aramex', 'FedEx'];

const SENDER_LOCATIONS = [
  { value: 'Abuja', label: 'Abuja' },
  { value: 'Lagos', label: 'Lagos' },
];

const COUNTRY_OPTIONS = COUNTRIES.map(([, name]) => ({ value: name, label: name }));
const AIR_OPTIONS = AIR_CARGO_DESTINATIONS.map((d) => ({ value: d, label: d }));
const SEA_OPTIONS = SEA_CARGO_DESTINATIONS.map((d) => ({ value: d, label: d }));

/* Cards link here with ?service=<card title>; map card titles onto the three
   quote service types. Air & Sea Cargo → Air Cargo (customer can switch). */
function serviceFromQuery(param) {
  const p = (param || '').toLowerCase();
  if (p.includes('air') || p.includes('sea') || p.includes('cargo')) return 'Air Cargo';
  return 'Express';
}

export default function GetQuote() {
  usePageTitle('Get a Quote');
  const [params] = useSearchParams();

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    service: serviceFromQuery(params.get('service')),
    carrier: '',
    senderLocation: '',
    destination: '',
    weight: '',
    notes: '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [submitError, setSubmitError] = useState('');

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const destinationOptions = useMemo(() => {
    if (form.service === 'Air Cargo') return AIR_OPTIONS;
    if (form.service === 'Sea Cargo') return SEA_OPTIONS;
    return COUNTRY_OPTIONS;
  }, [form.service]);

  const changeService = (e) => {
    const service = e.target.value;
    setForm((f) => ({
      ...f,
      service,
      carrier: service === 'Express' ? f.carrier : '',
      destination: service === 'Sea Cargo' ? 'United Kingdom' : '',
    }));
  };

  const buildWhatsAppMessage = () => {
    const lines = [
      'Hello DBZ, I would like to request a shipping rate.',
      '',
      `Name: ${form.name}`,
      `Phone: ${form.phone || '—'}`,
      `Email: ${form.email || '—'}`,
      `Service type: ${form.service}`,
      form.service === 'Express' && form.carrier ? `Preferred carrier: ${form.carrier}` : '',
      `Sender location: ${form.senderLocation}, Nigeria`,
      `Receiver location: ${form.destination}`,
      `Weight: ${form.weight} kg`,
      form.notes ? `Notes: ${form.notes}` : '',
    ].filter(Boolean);
    return lines.join('\n');
  };

  const submit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!required(form.name)) errs.name = 'Your name is required.';
    const hasEmail = required(form.email);
    const hasPhone = required(form.phone);
    if (!hasEmail && !hasPhone) {
      errs.phone = 'Add a phone number and/or an email so we can reach you.';
      errs.email = 'Add a phone number and/or an email so we can reach you.';
    }
    if (hasEmail && !isEmail(form.email)) errs.email = 'That email address does not look valid.';
    if (hasPhone && !isPhone(form.phone)) errs.phone = 'That phone number does not look valid.';
    if (!required(form.senderLocation)) errs.senderLocation = 'Select where you are sending from.';
    if (!required(form.destination)) errs.destination = 'Select the receiver location.';
    if (!required(form.weight) || Number(form.weight) <= 0) errs.weight = 'Approximate weight in KG is required.';
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setSubmitting(true);
    setSubmitError('');
    try {
      // Record the request in the backend quotation pipeline when we have an
      // email to attach (the quotes API requires one). The WhatsApp message
      // always goes out — that is the direct line to the DBZ team.
      let quote = null;
      if (hasEmail) {
        quote = await quoteService.create({
          name: form.name,
          email: form.email,
          phone: form.phone || null,
          origin: `${form.senderLocation}, Nigeria`,
          destination: form.destination,
          packageType: null,
          weight: Number(form.weight),
          dimensions: null,
          preference: form.service === 'Express' && form.carrier ? `Express — ${form.carrier}` : form.service,
          notes: form.notes || null,
        });
      }

      const whatsappUrl = `${BUSINESS.whatsappLink}?text=${encodeURIComponent(buildWhatsAppMessage())}`;
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      setResult({ quote, whatsappSent: true });
    } catch (err) {
      setSubmitError(
        err.message ||
          'Could not submit the request. Please try again, or send the details to us directly on WhatsApp.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageHero
        eyebrow="Get a Quote"
        title="Request a Rate"
        ghost="Quote"
        lead="Tell us about your shipment and our team will respond with accurate rates and options. We never publish unconfirmed prices."
      />

      <Section className="bg-mist">
        <div className="shell">
          {result ? (
            <Reveal>
              <div className="card mx-auto max-w-2xl p-8 text-center md:p-12">
                <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand/20">
                  <PartyPopper className="h-7 w-7 text-brand-deep" />
                </span>
                <h2 className="h-display mt-6 text-4xl">Request received.</h2>
                <p className="mx-auto mt-5 max-w-md text-[14px] leading-relaxed text-ink/60">
                  Your rate request has been sent to the DBZ team
                  {result.quote ? ' by email' : ''} and opened in WhatsApp so you can deliver it
                  straight to us. We will respond with your rate shortly.
                </p>
                {result.quote?.reference && (
                  <>
                    <p className="mt-6 text-[13px] text-ink/50">Quotation reference</p>
                    <p className="mt-2 inline-block rounded-xl bg-mist px-6 py-3 font-mono text-[18px] font-bold">
                      {result.quote.reference}
                    </p>
                  </>
                )}
                <p className="mx-auto mt-6 max-w-md text-[13px] leading-relaxed text-ink/45">
                  If the WhatsApp chat did not open, reach us directly at{' '}
                  <a
                    className="link-underline font-semibold text-brand-deep"
                    href={BUSINESS.whatsappLink}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {BUSINESS.phone}
                  </a>
                  .
                </p>
                {USE_MOCK && <DemoBanner className="mt-8 text-left" note={MOCK_MODE_NOTE} />}
                <div className="mt-8 flex justify-center gap-4">
                  <a href="/" className="btn-primary">Back to home</a>
                </div>
              </div>
            </Reveal>
          ) : (
            <div className="grid gap-10 lg:grid-cols-[1fr_300px]">
              <Reveal>
                <form className="card p-6 md:p-9" onSubmit={submit} noValidate>
                  {submitError && <ErrorState message={submitError} className="mb-6" />}
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Full name" required error={errors.name}>
                      <TextInput value={form.name} onChange={set('name')} placeholder="Your full name" invalid={!!errors.name} />
                    </Field>
                    <Field label="Service type" required>
                      <Select value={form.service} onChange={changeService} options={SERVICE_TYPES} />
                    </Field>

                    {form.service === 'Express' && (
                      <Field label="Preferred carrier" hint="Transit times differ by carrier — see Express Shipping.">
                        <Select
                          value={form.carrier}
                          onChange={set('carrier')}
                          placeholder="Any carrier"
                          options={EXPRESS_CARRIERS.map((c) => ({ value: c, label: c }))}
                        />
                      </Field>
                    )}

                    <Field label="Phone" error={errors.phone} hint="Phone and/or email — at least one.">
                      <TextInput value={form.phone} onChange={set('phone')} placeholder="08XX XXX XXXX" invalid={!!errors.phone} />
                    </Field>
                    <Field label="Email" error={errors.email}>
                      <TextInput type="email" value={form.email} onChange={set('email')} placeholder="you@email.com" invalid={!!errors.email} />
                    </Field>

                    <Field label="Sender location" required error={errors.senderLocation}>
                      <Select value={form.senderLocation} onChange={set('senderLocation')} placeholder="Select city" options={SENDER_LOCATIONS} invalid={!!errors.senderLocation} />
                    </Field>
                    <Field
                      label="Receiver location"
                      required
                      error={errors.destination}
                      hint={form.service === 'Air Cargo' ? 'Air cargo reaches the destinations listed.' : form.service === 'Sea Cargo' ? 'Sea cargo currently serves the UK.' : 'Express reaches 220+ countries and territories.'}
                    >
                      <Select
                        key={form.service}
                        value={form.destination}
                        onChange={set('destination')}
                        placeholder="Select destination"
                        options={destinationOptions}
                        invalid={!!errors.destination}
                      />
                    </Field>

                    <Field label="Weight (KG)" required error={errors.weight}>
                      <TextInput type="number" min="0.1" step="0.1" value={form.weight} onChange={set('weight')} placeholder="e.g. 9" invalid={!!errors.weight} />
                    </Field>

                    <div className="sm:col-span-2">
                      <Field label="Additional information" hint="Contents, dimensions, timelines — anything that helps us quote accurately.">
                        <Textarea rows={4} value={form.notes} onChange={set('notes')} placeholder="Optional" />
                      </Field>
                    </div>
                  </div>

                  <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
                    <p className="max-w-sm text-[12px] leading-relaxed text-ink/45">
                      Submitting opens a WhatsApp chat with your details and sends the request to
                      our team at {BUSINESS.email}. Rates are only issued by the DBZ team.
                    </p>
                    <button type="submit" className="btn-primary" disabled={submitting}>
                      {submitting ? 'Sending…' : 'Request Rate'}
                    </button>
                  </div>
                </form>
              </Reveal>

              <aside className="space-y-5">
                <Reveal delay={0.08}>
                  <div className="card p-6">
                    <h3 className="text-[18px]">What happens next?</h3>
                    <ol className="mt-4 space-y-3.5">
                      {[
                        'Your request reaches the DBZ team by email and WhatsApp.',
                        'We confirm the best service and options for your shipment.',
                        'You receive your rate — then book and drop off, or arrange collection.',
                      ].map((s, i) => (
                        <li key={s} className="flex gap-3 text-[13px] leading-relaxed text-ink/60">
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ink font-mono text-[10px] font-bold text-brand">{i + 1}</span>
                          {s}
                        </li>
                      ))}
                    </ol>
                  </div>
                </Reveal>
                <Reveal delay={0.12}>
                  <div className="card p-6">
                    <h3 className="text-[18px]">Service coverage</h3>
                    <ul className="mt-4 space-y-3 text-[13px] leading-relaxed text-ink/60">
                      <li><strong className="text-ink">Express:</strong> 220+ countries and territories — DHL, UPS, Aramex or FedEx.</li>
                      <li><strong className="text-ink">Air cargo:</strong> UK, USA, Canada, Europe and selected African countries.</li>
                      <li><strong className="text-ink">Sea cargo:</strong> United Kingdom.</li>
                    </ul>
                  </div>
                </Reveal>
                {USE_MOCK && (
                  <Reveal delay={0.16}>
                    <DemoBanner note={MOCK_MODE_NOTE} />
                  </Reveal>
                )}
              </aside>
            </div>
          )}
        </div>
      </Section>
    </>
  );
}
