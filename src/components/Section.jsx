import Reveal from './Reveal.jsx';

export function SectionHeading({ eyebrow, title, lead, light = false, align = 'left', className = '' }) {
  return (
    <Reveal className={`${align === 'center' ? 'text-center' : ''} ${className}`}>
      {eyebrow && (
        <span className={`eyebrow ${light ? 'eyebrow--light' : ''}`}>{eyebrow}</span>
      )}
      <h2
        className={`h-display mt-4 text-4xl sm:text-5xl lg:text-[56px] ${light ? 'text-white' : ''} ${
          align === 'center' ? 'mx-auto max-w-3xl' : 'max-w-3xl'
        }`}
      >
        {title}
      </h2>
      {lead && (
        <p
          className={`mt-5 max-w-2xl text-[15px] leading-relaxed md:text-[16px] ${
            light ? 'text-white/65' : 'text-ink/60'
          } ${align === 'center' ? 'mx-auto' : ''}`}
        >
          {lead}
        </p>
      )}
    </Reveal>
  );
}

export default function Section({ id, children, className = '', dark = false }) {
  return (
    <section id={id} className={`relative py-20 md:py-28 ${dark ? 'bg-ink text-white' : ''} ${className}`}>
      {children}
    </section>
  );
}
