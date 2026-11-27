import Reveal from './Reveal.jsx';

export default function StatCard({ value, label, sub, dark = false, delay = 0 }) {
  return (
    <Reveal delay={delay}>
      <div
        className={`h-full rounded-2xl border p-6 transition-all duration-300 md:p-7 ${
          dark
            ? 'border-white/10 bg-white/[.04] hover:border-brand/50'
            : 'border-ink/10 bg-white shadow-card hover:-translate-y-1 hover:shadow-lift'
        }`}
      >
        <div className={`h-display text-4xl md:text-5xl ${dark ? 'text-brand' : ''}`}>{value}</div>
        <div className={`mt-2 font-sans text-[13px] font-semibold ${dark ? 'text-white/80' : 'text-ink'}`}>
          {label}
        </div>
        {sub && <p className={`mt-1.5 text-[12.5px] leading-relaxed ${dark ? 'text-white/50' : 'text-ink/50'}`}>{sub}</p>}
      </div>
    </Reveal>
  );
}
