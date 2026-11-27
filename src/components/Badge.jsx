import { STATUS_STYLES } from '../data/mock/mockData.js';

const DEFAULT_STYLE = 'bg-mist text-ink border-ink/15';

export default function Badge({ value, className = '' }) {
  const style = STATUS_STYLES[value] || DEFAULT_STYLE;
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1 font-mono text-[10.5px] font-semibold ${style} ${className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {value}
    </span>
  );
}
