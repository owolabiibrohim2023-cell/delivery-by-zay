import Reveal from './Reveal.jsx';

/**
 * Consistent page header for inner pages:
 * navy band, subtle background typography, gold accent.
 */
export default function PageHero({ eyebrow, title, lead, ghost, children }) {
  return (
    <header className="relative overflow-hidden bg-ink text-white">
      <span className="ghost-word -bottom-6 left-0 text-[20vw] md:text-[15vw]" aria-hidden="true">
        {ghost || title}
      </span>
      <div className="shell relative z-10 pb-20 pt-36 md:pb-28 md:pt-44">
        <Reveal>
          {eyebrow && <span className="eyebrow eyebrow--light">{eyebrow}</span>}
          <h1 className="h-display mt-5 max-w-4xl text-4xl sm:text-5xl md:text-6xl">{title}</h1>
          {lead && <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-white/65 md:text-[17px]">{lead}</p>}
          {children && <div className="mt-8">{children}</div>}
        </Reveal>
      </div>
      <div className="h-1.5 w-full bg-brand" />
    </header>
  );
}
