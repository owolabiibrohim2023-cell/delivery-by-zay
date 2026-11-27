import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import Photo from './Photo.jsx';

/**
 * "Behind the Scenes" gallery — responsive grid of the client's real
 * photos with click-to-enlarge lightbox.
 */
export default function Gallery({ photos, title = 'Behind the Scenes', subtitle = 'A look at the packages we ship.' }) {
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (!selected) return undefined;
    const onKey = (e) => e.key === 'Escape' && setSelected(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selected]);

  return (
    <div>
      <div>
        {title && <h2 className="h-display text-3xl md:text-4xl">{title}</h2>}
        {subtitle && <p className="mt-2.5 text-[14.5px] text-ink/55">{subtitle}</p>}
      </div>
      <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {photos.map((p) => (
          <button
            key={p.src}
            type="button"
            onClick={() => setSelected(p)}
            className="group relative block overflow-hidden rounded-xl focus-visible:ring-2 focus-visible:ring-brand"
            aria-label={`Enlarge photo: ${p.alt}`}
          >
            <Photo
              src={p.src}
              alt={p.alt}
              width={p.width}
              height={p.height}
              className="aspect-square h-full w-full transition-transform duration-500 group-hover:scale-[1.06]"
            />
            <span className="pointer-events-none absolute inset-0 bg-ink/0 transition-colors duration-300 group-hover:bg-ink/15" />
          </button>
        ))}
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 z-[110] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label={selected.alt}
          >
            <div className="absolute inset-0 bg-ink/85" onClick={() => setSelected(null)} aria-hidden="true" />
            <motion.figure
              className="relative z-10 max-h-[88vh] w-full max-w-3xl"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              <img
                src={selected.src.includes('?') ? selected.src : `${selected.src}?v=2`}
                alt={selected.alt}
                className="max-h-[78vh] w-full rounded-2xl object-contain"
              />
              <figcaption className="mt-3 text-center text-[13px] text-white/80">{selected.alt}</figcaption>
              <button
                onClick={() => setSelected(null)}
                className="absolute -top-3 right-0 flex h-10 w-10 items-center justify-center rounded-full bg-white text-ink shadow-lift transition-transform hover:scale-105"
                aria-label="Close enlarged photo"
              >
                <X className="h-5 w-5" />
              </button>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
