import { useEffect, useState } from 'react';
import { BellRing, Check } from 'lucide-react';
import usePageTitle from '../../hooks/usePageTitle.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { EmptyState, LoadingState } from '../../components/States.jsx';
import { listFor, markRead, appliedReadState } from '../../services/notificationService.js';
import { formatDateTime } from '../../utils/format.js';

export default function Notifications() {
  usePageTitle('Notifications');
  const { user } = useAuth();
  const [items, setItems] = useState(null);

  useEffect(() => {
    let alive = true;
    listFor(user?.email)
      .then((list) => alive && setItems(appliedReadState(list)))
      .catch(() => alive && setItems([]));
    return () => {
      alive = false;
    };
  }, [user]);

  if (!items) return <LoadingState label="Loading notifications" />;

  const markAll = async () => {
    await Promise.all(items.filter((n) => !n.read).map((n) => markRead(n.id)));
    setItems((list) => list.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-[13.5px] text-ink/55">
          Booking confirmations, shipment status changes and account updates.
        </p>
        {items.some((n) => !n.read) && (
          <button onClick={markAll} className="btn-outline btn-sm">
            <Check className="h-3.5 w-3.5" /> Mark all read
          </button>
        )}
      </div>

      {items.length ? (
        <div className="space-y-3">
          {items.map((n) => (
            <article key={n.id} className={`card flex gap-4 p-5 ${n.read ? '' : 'border-brand/60 bg-brand/[.04]'}`}>
              <span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${n.read ? 'bg-ink/15' : 'bg-brand'}`} />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className={`text-[15px] ${n.read ? 'text-ink/70' : ''}`}>{n.title}</h3>
                  <span className="font-mono text-[10.5px] text-ink/40">
                    {formatDateTime(n.date)}
                  </span>
                </div>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink/55">{n.body}</p>
              </div>
              {!n.read && (
                <button
                  onClick={async () => {
                    await markRead(n.id);
                    setItems((list) => list.map((x) => (x.id === n.id ? { ...x, read: true } : x)));
                  }}
                  className="self-start rounded-full border border-ink/15 px-3 py-1.5 font-mono text-[10px] font-semibold text-ink/50 transition-colors hover:border-brand hover:text-ink"
                >
                  Mark read
                </button>
              )}
            </article>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No notifications"
          body="Booking and shipment updates will appear here."
          action={<BellRing className="h-6 w-6 text-ink/25" />}
        />
      )}
    </div>
  );
}
