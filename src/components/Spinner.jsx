import { Loader2 } from 'lucide-react';

export default function Spinner({ label = 'Loading' }) {
  return (
    <div className="inline-flex items-center gap-3 text-ink/60">
      <Loader2 className="h-5 w-5 animate-spin text-brand" strokeWidth={2.5} />
      <span className="font-mono text-[11px]">{label}…</span>
    </div>
  );
}
