import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Plus } from 'lucide-react';

export default function FaqItem({ question, children }) {
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();

  return (
    <div className="border-b border-ink/10">
      <button
        className="group flex w-full items-center justify-between gap-6 py-6 text-left"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span className="font-sans text-[15.5px] font-semibold md:text-[17px]">{question}</span>
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
            open ? 'rotate-45 border-brand bg-brand text-ink' : 'border-ink/20 text-ink/60 group-hover:border-brand group-hover:text-ink'
          }`}
        >
          <Plus className="h-4 w-4" strokeWidth={2.5} />
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={reduced ? { opacity: 1 } : { height: 0, opacity: 0 }}
            animate={reduced ? {} : { height: 'auto', opacity: 1 }}
            exit={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="max-w-3xl pb-7 text-[14px] leading-relaxed text-ink/60">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
