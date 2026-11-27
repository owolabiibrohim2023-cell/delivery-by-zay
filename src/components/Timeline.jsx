import { CheckCircle2, Circle } from 'lucide-react';
import { formatDateTime } from '../utils/format.js';

const ORDER = [
  'Booking Received',
  'Processing',
  'Shipment Received',
  'In Transit',
  'Customs Clearance',
  'Out for Delivery',
  'Delivered',
];

/**
 * Vertical tracking timeline. `history` = [{status, location, note, timestamp}]
 */
export default function Timeline({ history = [], currentStatus }) {
  const events = [...history].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  const reachedIndex = new Set(events.map((e) => e.status));

  return (
    <ol className="relative space-y-0">
      {events.map((event, i) => {
        const isOnHold = event.status === 'On Hold';
        const isLast = i === events.length - 1;
        const active = isLast;
        return (
          <li key={`${event.timestamp}-${i}`} className="relative flex gap-4 pb-8 last:pb-0">
            {/* connector */}
            {i < events.length - 1 && (
              <span
                className="absolute left-[11px] top-7 h-[calc(100%-1.75rem)] w-0.5 bg-ink/10"
                aria-hidden="true"
              />
            )}
            <span className={`relative z-10 mt-1 flex h-6 w-6 shrink-0 items-center justify-center`}>
              {isOnHold ? (
                <span className="h-3.5 w-3.5 rounded-full bg-red-500 ring-4 ring-red-100" />
              ) : active ? (
                <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-brand ring-4 ring-brand/30 animate-pulse" />
              ) : (
                <CheckCircle2 className="h-6 w-6 fill-ink text-mist" strokeWidth={1.5} />
              )}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className={`font-sans text-[14.5px] font-semibold ${isOnHold ? 'text-red-600' : ''}`}>
                  {event.status}
                </span>
                <span className="font-mono text-[11px] text-ink/40">
                  {formatDateTime(event.timestamp)}
                </span>
              </div>
              {event.location && (
                <p className="mt-0.5 font-mono text-[11.5px] text-ink/50">
                  {event.location}
                </p>
              )}
              {event.note && <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink/60">{event.note}</p>}
            </div>
          </li>
        );
      })}
      {/* Upcoming (unreached) stages */}
      {currentStatus !== 'Delivered' && (
        <li className="flex gap-4">
          <span className="relative z-10 mt-1 flex h-6 w-6 shrink-0 items-center justify-center">
            <Circle className="h-6 w-6 text-ink/15" strokeWidth={1.5} />
          </span>
          <div className="pt-1 text-[13px] text-ink/35">
            {nextStage(reachedIndex)} — pending
          </div>
        </li>
      )}
    </ol>
  );
}

function nextStage(reachedSet) {
  const next = ORDER.find((s) => !reachedSet.has(s) && s !== 'On Hold');
  return next || 'Delivery';
}
