import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BadgeCheck,
  ExternalLink,
  Info,
  MapPin,
  PackageSearch,
  Plane,
  Ship,
  Wallet,
} from 'lucide-react';
import usePageTitle from '../hooks/usePageTitle.js';
import PageHero from '../components/PageHero.jsx';
import Section, { SectionHeading } from '../components/Section.jsx';
import Reveal from '../components/Reveal.jsx';
import Button from '../components/Button.jsx';
import Badge from '../components/Badge.jsx';
import Timeline from '../components/Timeline.jsx';
import { DemoBanner, ErrorState } from '../components/States.jsx';
import * as shipmentService from '../services/shipmentService.js';
import { formatDate } from '../utils/format.js';
import { BUSINESS } from '../data/media.js';

const SAMPLES = ['DBZ-DEMO-001', 'DBZ-DEMO-002', 'DBZ-DEMO-003', 'DBZ-DEMO-006'];

const MODES = shipmentService.TRACKING_MODES;

export default function Track() {
  usePageTitle('Track Shipment');
  const [number, setNumber] = useState('');
  const [mode, setMode] = useState('in_transit');
  const [loading, setLoading] = useState(false);
  const [shipment, setShipment] = useState(null);
  const [error, setError] = useState('');
  const [pendingPayment, setPendingPayment] = useState(false);

  const track = async (value) => {
    const ref = String(value ?? number).trim();
    if (!ref) {
      setError('Enter your tracking number to continue.');
      return;
    }
    setLoading(true);
    setError('');
    setPendingPayment(false);
    try {
      const result = await shipmentService.track(ref, mode);
      setShipment(result);
    } catch (err) {
      setShipment(null);
      if (err?.payload?.code === 'PAYMENT_PENDING' || err?.status === 402) {
        setPendingPayment(true);
        setError('');
      } else {
        setError(err.message || 'Tracking lookup failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  const courierMode = shipment?.trackingMode === 'courier' || (!shipment && mode === 'courier');

  return (
    <>
      <PageHero
        eyebrow="Shipment Tracking"
        title="Where is my parcel?"
        ghost="Track"
        lead="Choose how you want to follow your shipment, then enter your tracking number. Active tracking starts as soon as your payment is confirmed."
      />

      <Section>
        <div className="shell">
          <div className="mx-auto max-w-3xl">
            {/* Tracking mode selection — pick one to continue */}
            <Reveal>
              <p className="text-[13px] font-semibold text-ink/60">Select tracking type</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {MODES.map((m) => {
                  const active = mode === m.value;
                  return (
                    <button
                      key={m.value}
                      type="button"
                      onClick={() => setMode(m.value)}
                      aria-pressed={active}
                      className={`rounded-xl border p-4 text-left transition-colors ${active ? 'border-brand bg-brand/10' : 'border-ink/15 bg-white hover:border-ink/30'}`}
                    >
                      <span className="flex items-center justify-between gap-3">
                        <span className="text-[14.5px] font-bold">{m.title}</span>
                        <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${active ? 'border-brand bg-brand text-white' : 'border-ink/25'}`}>
                          {active && <BadgeCheck className="h-3.5 w-3.5" strokeWidth={2.5} />}
                        </span>
                      </span>
                      <span className="mt-1.5 block text-[12px] leading-relaxed text-ink/55">{m.body}</span>
                    </button>
                  );
                })}
              </div>
            </Reveal>

            {/* Tracking input */}
            <Reveal delay={0.06}>
              <form
                className="mt-6 flex flex-col gap-3 sm:flex-row"
                onSubmit={(e) => {
                  e.preventDefault();
                  track();
                }}
              >
                <div className="relative flex-1">
                  <PackageSearch className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink/30" />
                  <input
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    placeholder="e.g. DBZ-DEMO-001"
                    className="field h-[58px] pl-12 font-mono"
                    aria-label="Tracking number"
                  />
                </div>
                <button type="submit" className="btn-primary h-[58px] px-8" disabled={loading}>
                  {loading ? 'Tracking…' : 'Track shipment'}
                </button>
              </form>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="font-mono text-[10.5px] text-ink/40">
                  Demo numbers:
                </span>
                {SAMPLES.map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setNumber(s);
                      track(s);
                    }}
                    className="rounded-full border border-ink/15 bg-white px-3 py-1.5 font-mono text-[11px] text-ink/60 transition-colors hover:border-brand hover:text-ink"
                  >
                    {s}
                  </button>
                ))}
              </div>

              {/* Payment gate — no active tracking before payment */}
              {pendingPayment && (
                <div className="card mt-6 border-brand/40 p-7">
                  <div className="flex items-start gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand/15 text-brand-deep">
                      <Wallet className="h-5 w-5" strokeWidth={1.75} />
                    </span>
                    <div>
                      <h3 className="text-[18px] font-bold">Payment pending — tracking not active yet</h3>
                      <p className="mt-2 text-[13.5px] leading-relaxed text-ink/60">
                        There is no active tracking process for this shipment until its payment is
                        confirmed. Pay securely from your dashboard and tracking unlocks
                        immediately — milestone updates stream here{courierMode ? ' and handover unlocks courier tracking' : ''}.
                      </p>
                      <div className="mt-5 flex flex-wrap gap-3">
                        <Button to="/dashboard/payments" size="sm">Go to Payments</Button>
                        <a
                          href={BUSINESS.whatsappLink}
                          target="_blank"
                          rel="noreferrer"
                          className="btn-outline btn-sm"
                        >
                          Contact the DBZ team
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div className="mt-6">
                  <ErrorState message={error} />
                </div>
              )}
            </Reveal>
          </div>

          {/* Result */}
          {shipment && (
            <Reveal className="mt-14">
              <div className="mx-auto max-w-4xl">
                <div className="card overflow-hidden">
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-ink/10 bg-mist/60 px-7 py-5">
                    <div>
                      <p className="font-mono text-[10.5px] text-ink/45">Tracking number</p>
                      <p className="mt-1 font-mono text-[18px] font-bold">{shipment.trackingNumber}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300 bg-emerald-100 px-3 py-1 font-mono text-[10.5px] font-semibold text-emerald-800">
                        <BadgeCheck className="h-3.5 w-3.5" /> Payment confirmed
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-brand/40 bg-brand/10 px-3 py-1 font-mono text-[10.5px] font-semibold text-brand-deep">
                        {shipment.trackingMode === 'courier' ? 'Courier tracking' : 'In-transit tracking'}
                      </span>
                      <Badge value={shipment.status} />
                    </div>
                  </div>

                  <div className="grid gap-px bg-ink/10 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                      ['Origin', `${shipment.origin.city}, ${shipment.origin.country}`],
                      ['Destination', `${shipment.destination.city}, ${shipment.destination.country}`],
                      ['Shipment date', formatDate(shipment.shipDate)],
                      ['Estimated delivery', shipment.estimatedDelivery ? formatDate(shipment.estimatedDelivery) : 'To be confirmed'],
                    ].map(([label, value]) => (
                      <div key={label} className="bg-white px-6 py-5">
                        <p className="font-mono text-[10px] text-ink/40">{label}</p>
                        <p className="mt-1.5 text-[14px] font-semibold">{value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="grid gap-10 px-7 py-8 md:grid-cols-[1.2fr_1fr] md:px-9">
                    <div>
                      <h3 className="text-[22px]">Tracking history</h3>
                      <p className="mt-1 text-[12.5px] text-ink/45">
                        {shipment.trackingMode === 'courier'
                          ? 'DBZ milestones up to carrier handover. Portal tracking takes over after handover.'
                          : 'Active milestone tracking — updates appear here as the DBZ team processes your shipment.'}
                      </p>
                      <div className="mt-6">
                        <Timeline history={shipment.history} currentStatus={shipment.status} />
                      </div>
                    </div>
                    <div className="space-y-5">
                      <div className="rounded-xl bg-mist p-5">
                        <p className="font-mono text-[10px] text-ink/40">Service</p>
                        <p className="mt-1 text-[14px] font-semibold">{shipment.service}</p>
                        <p className="mt-4 font-mono text-[10px] text-ink/40">Method</p>
                        <p className="mt-1 inline-flex items-center gap-2 text-[14px] font-semibold">
                          {shipment.method?.includes('Ocean') ? <Ship className="h-4 w-4 text-brand-deep" /> : <Plane className="h-4 w-4 text-brand-deep" />}
                          {shipment.method}
                        </p>
                        {shipment.weight && (
                          <>
                            <p className="mt-4 font-mono text-[10px] text-ink/40">Weight</p>
                            <p className="mt-1 text-[14px] font-semibold">{shipment.weight} kg · {shipment.pieces} piece{shipment.pieces > 1 ? 's' : ''}</p>
                          </>
                        )}
                      </div>

                      {shipment.trackingMode === 'courier' ? (
                        <div className="rounded-xl border border-ink/10 p-5">
                          <p className="font-mono text-[10px] text-ink/40">
                            Also track on carrier website
                          </p>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {shipmentService.CARRIER_LINKS.map((c) => (
                              <a
                                key={c.name}
                                href={c.url(shipment.trackingNumber)}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 px-3.5 py-1.5 font-mono text-[11px] font-semibold text-ink/60 transition-colors hover:border-brand hover:text-ink"
                              >
                                {c.name} <ExternalLink className="h-3 w-3" />
                              </a>
                            ))}
                          </div>
                          <p className="mt-3 flex items-start gap-1.5 text-[11px] leading-relaxed text-ink/40">
                            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                            Courier tracking was selected for this shipment — links open the
                            carrier's official portal. Tracking there activates after handover.
                          </p>
                        </div>
                      ) : (
                        <div className="rounded-xl border border-ink/10 p-5">
                          <p className="font-mono text-[10px] text-ink/40">Tracking mode</p>
                          <p className="mt-2 text-[14px] font-semibold">In-transit tracking</p>
                          <p className="mt-2.5 flex items-start gap-1.5 text-[11px] leading-relaxed text-ink/45">
                            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                            This shipment is tracked by the DBZ team through every milestone right
                            here — carrier portal links are not used for in-transit tracking.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <DemoBanner
                  className="mt-6"
                  note="Demonstration mode — this is clearly labelled sample tracking data, not a live shipment. Records become accurate when the FastAPI backend is connected."
                />
              </div>
            </Reveal>
          )}
        </div>
      </Section>

      {/* Help strip */}
      <Section className="bg-mist">
        <div className="shell">
          <SectionHeading
            eyebrow="Need help?"
            title="Tracking questions, answered."
            lead="Your tracking number is issued when a booking is confirmed. Active tracking starts once your payment is verified. If your shipment shows On Hold, contact our team for the next step."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              { title: 'Where is my tracking number?', body: 'It is included in your booking confirmation and in your dashboard under My Shipments.', cta: { to: '/dashboard/shipments', label: 'Open dashboard' } },
              { title: 'When does tracking become active?', body: 'Immediately after your payment is verified. Until then the tracking page shows a payment-pending notice instead of a tracking history.', cta: { to: '/dashboard/payments', label: 'Open Payments' } },
              { title: 'In-transit or courier tracking?', body: 'Choose when booking — milestone tracking here, or the carrier portal after handover. You can also pick the type before you look up a shipment.', cta: { to: '/faq', label: 'Read FAQ' } },
            ].map((c, i) => (
              <Reveal key={c.title} delay={i * 0.06}>
                <div className="card h-full p-7">
                  <MapPin className="h-6 w-6 text-brand-deep" strokeWidth={1.5} />
                  <h3 className="mt-4 text-[20px]">{c.title}</h3>
                  <p className="mt-2.5 text-[13.5px] leading-relaxed text-ink/55">{c.body}</p>
                  <Link to={c.cta.to} className="link-underline mt-5 inline-flex text-[13px]">
                    {c.cta.label} →
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}
