import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BadgeCheck, PackageSearch, Wallet } from 'lucide-react';
import usePageTitle from '../../hooks/usePageTitle.js';
import Badge from '../../components/Badge.jsx';
import Timeline from '../../components/Timeline.jsx';
import { DemoBanner, ErrorState, LoadingState } from '../../components/States.jsx';
import * as shipmentService from '../../services/shipmentService.js';
import { MOCK_MODE_NOTE } from '../../services/api.js';
import { formatDate } from '../../utils/format.js';

export default function DashboardTrack() {
  usePageTitle('Track Shipment');
  const [number, setNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [shipment, setShipment] = useState(null);
  const [error, setError] = useState('');
  const [pendingPayment, setPendingPayment] = useState(false);

  const track = async (e) => {
    e?.preventDefault();
    if (!number.trim()) {
      setError('Enter a tracking number.');
      return;
    }
    setLoading(true);
    setError('');
    setPendingPayment(false);
    try {
      setShipment(await shipmentService.track(number));
    } catch (err) {
      setShipment(null);
      if (err?.payload?.code === 'PAYMENT_PENDING' || err?.status === 402) {
        setPendingPayment(true);
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={track} className="card flex flex-col gap-3 p-6 sm:flex-row md:p-7">
        <div className="relative flex-1">
          <PackageSearch className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink/30" />
          <input
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            placeholder="Tracking number e.g. DBZ-DEMO-001"
            className="field h-[54px] pl-12 font-mono"
            aria-label="Tracking number"
          />
        </div>
        <button className="btn-primary h-[54px] px-8" disabled={loading}>
          {loading ? 'Tracking…' : 'Track'}
        </button>
      </form>

      {/* Payment gate — no active tracking before payment is verified */}
      {pendingPayment && (
        <div className="card border-brand/40 p-7">
          <div className="flex items-start gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand/15 text-brand-deep">
              <Wallet className="h-5 w-5" strokeWidth={1.75} />
            </span>
            <div>
              <h3 className="text-[18px] font-bold">Payment pending — tracking not active yet</h3>
              <p className="mt-2 max-w-xl text-[13.5px] leading-relaxed text-ink/60">
                There is no active tracking process for this shipment until its payment is
                confirmed. Settle the invoice below — active tracking unlocks immediately after
                payment is verified.
              </p>
              <div className="mt-5">
                <Link to="/dashboard/payments" className="btn-primary btn-sm">
                  Open Payments
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {error && <ErrorState message={error} />}
      {loading && <LoadingState label="Looking up shipment" />}

      {shipment && (
        <>
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
            <div className="px-7 py-7 md:px-9">
              <h3 className="text-[20px]">Tracking history</h3>
              <div className="mt-6 max-w-2xl">
                <Timeline history={shipment.history} currentStatus={shipment.status} />
              </div>
            </div>
          </div>
          <DemoBanner note={MOCK_MODE_NOTE} />
        </>
      )}
    </div>
  );
}
