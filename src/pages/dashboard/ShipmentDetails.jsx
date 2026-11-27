import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import usePageTitle from '../../hooks/usePageTitle.js';
import Badge from '../../components/Badge.jsx';
import Timeline from '../../components/Timeline.jsx';
import { LoadingState, DemoBanner } from '../../components/States.jsx';
import * as shipmentService from '../../services/shipmentService.js';
import { formatDate } from '../../utils/format.js';

const Detail = ({ label, value }) => (
  <div>
    <p className="font-mono text-[10px] text-ink/40">{label}</p>
    <p className="mt-1 text-[14px] font-semibold">{value || '—'}</p>
  </div>
);

export default function ShipmentDetails() {
  const { id } = useParams();
  const [shipment, setShipment] = useState(null);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    let alive = true;
    shipmentService
      .getById(id)
      .then((s) => {
        if (!alive) return;
        if (s) setShipment(s);
        else setStatus('missing');
      })
      .catch(() => alive && setStatus('error'));
    return () => {
      alive = false;
    };
  }, [id]);

  usePageTitle(shipment ? `Shipment ${shipment.trackingNumber}` : 'Shipment Details');

  if (status === 'loading') return <LoadingState label="Loading shipment" />;
  if (status === 'missing' || !shipment) {
    return (
      <div className="card p-10 text-center">
        <h2 className="h-display text-3xl">Shipment not found.</h2>
        <p className="mt-3 text-[13.5px] text-ink/55">This shipment may belong to another account, or the record does not exist.</p>
        <Link to="/dashboard/shipments" className="btn-primary btn-sm mt-6">Back to My Shipments</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link to="/dashboard/shipments" className="link-underline text-[13px]">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to shipments
      </Link>

      <div className="card overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-ink/10 bg-mist/60 px-7 py-5">
          <div>
            <p className="font-mono text-[10.5px] text-ink/45">Tracking number</p>
            <p className="mt-1 font-mono text-[19px] font-bold">{shipment.trackingNumber}</p>
          </div>
          <Badge value={shipment.status} />
        </div>

        <div className="grid gap-6 px-7 py-7 sm:grid-cols-2 lg:grid-cols-4 md:px-9">
          <Detail label="Origin" value={`${shipment.origin.city}, ${shipment.origin.country}`} />
          <Detail label="Destination" value={`${shipment.destination.city}, ${shipment.destination.country}`} />
          <Detail label="Shipment date" value={formatDate(shipment.shipDate)} />
          <Detail label="Estimated delivery" value={shipment.estimatedDelivery ? formatDate(shipment.estimatedDelivery) : 'To be confirmed'} />
          <Detail label="Method" value={shipment.method} />
          <Detail label="Service" value={shipment.service} />
          <Detail label="Weight" value={shipment.weight ? `${shipment.weight} kg · ${shipment.pieces} pc` : '—'} />
          <Detail label="Carrier" value={shipment.carrier} />
          <div className="sm:col-span-2 lg:col-span-4">
            <Detail label="Contents" value={shipment.description} />
          </div>
        </div>
      </div>

      <div className="card p-7 md:p-9">
        <h2 className="text-[22px]">Tracking history</h2>
        <p className="mt-1 text-[12.5px] text-ink/45">All recorded milestones for this shipment.</p>
        <div className="mt-7 max-w-2xl">
          <Timeline history={shipment.history} currentStatus={shipment.status} />
        </div>
      </div>

      <div className="card p-7">
        <h2 className="text-[18px]">Also track on carrier website</h2>
        <p className="mt-1.5 text-[12.5px] text-ink/45">External official carrier tracking pages — where applicable.</p>
        <div className="mt-4 flex flex-wrap gap-2">
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
      </div>

      {shipment.source === 'sample' && (
        <DemoBanner note="This is a clearly labelled sample record used during development. Live records come from the FastAPI backend once connected." />
      )}
    </div>
  );
}
