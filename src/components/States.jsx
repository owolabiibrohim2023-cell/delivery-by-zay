import { AlertCircle, Inbox } from 'lucide-react';
import Spinner from './Spinner.jsx';

export function LoadingState({ label = 'Loading', className = '' }) {
  return (
    <div className={`flex justify-center py-14 ${className}`}>
      <Spinner label={label} />
    </div>
  );
}

export function EmptyState({ title = 'Nothing here yet', body, action, className = '' }) {
  return (
    <div className={`card flex flex-col items-center justify-center px-8 py-14 text-center ${className}`}>
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-mist">
        <Inbox className="h-5 w-5 text-ink/40" />
      </div>
      <h4 className="mt-4 text-lg normal-case font-sans font-semibold">{title}</h4>
      {body && <p className="mt-1.5 max-w-sm text-[13.5px] text-ink/55">{body}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function ErrorState({ message = 'Something went wrong.', action, className = '' }) {
  return (
    <div className={`card flex flex-col items-center justify-center border-red-200 px-8 py-12 text-center ${className}`}>
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
        <AlertCircle className="h-5 w-5 text-red-500" />
      </div>
      <h4 className="mt-4 font-sans text-lg font-semibold normal-case">Couldn’t load this</h4>
      <p className="mt-1.5 max-w-sm text-[13.5px] text-ink/55">{message}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function DemoBanner({ note, className = '' }) {
  return (
    <div
      className={`flex items-start gap-2.5 rounded-xl border border-brand/40 bg-brand/10 px-4 py-3 text-[12.5px] leading-relaxed text-brand-deep ${className}`}
      role="note"
    >
      <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-brand" />
      <span>{note}</span>
    </div>
  );
}
