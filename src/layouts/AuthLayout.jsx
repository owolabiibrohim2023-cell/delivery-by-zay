import { Outlet, Link } from 'react-router-dom';
import { BUSINESS } from '../data/media.js';

export default function AuthLayout() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Form side */}
      <div className="flex flex-col bg-paper">
        <div className="flex items-center justify-between px-5 py-5 md:px-10">
          <Link to="/" className="inline-block transition-transform duration-300 hover:scale-[1.02]" aria-label="DBZ – Delivered by Zay home">
            <img
              src="/images/d3z-logo.jpg"
              alt="DBZ — Delivered By Zay"
              className="h-10 w-auto rounded-lg md:h-11"
              width="124"
              height="44"
              loading="eager"
              decoding="async"
            />
          </Link>
          <Link to="/" className="font-sans text-[12px] font-medium text-ink/50 hover:text-ink">
            ← Back to site
          </Link>
        </div>
        <main className="flex flex-1 items-center justify-center px-5 py-10 md:px-10">
          <div className="w-full max-w-md">
            <Outlet />
          </div>
        </main>
        <footer className="px-5 py-5 text-center font-mono text-[10.5px] text-ink/40 md:px-10">
          {BUSINESS.slogan} · {BUSINESS.email}
        </footer>
      </div>

      {/* Brand side */}
      <aside className="relative hidden overflow-hidden bg-ink text-white lg:block">
        <span className="ghost-word bottom-8 left-0 text-[16vw]" aria-hidden="true">DBZ</span>
        <div className="relative z-10 flex h-full flex-col justify-between p-12">
          <span className="eyebrow eyebrow--light">Customer Portal</span>
          <div>
            <h2 className="h-display text-6xl xl:text-7xl">
              Shipping,<br />
              <span className="text-brand">handled.</span>
            </h2>
            <p className="mt-6 max-w-md text-[15px] leading-relaxed text-white/60">
              Book shipments, follow every parcel from Lagos or Abuja to the UK, USA, Canada and
              beyond — all from one dashboard.
            </p>
            <ul className="mt-8 space-y-2.5 font-mono text-[12px] text-white/50">
              <li className="flex items-center gap-3"><span className="h-1.5 w-1.5 bg-brand" /> Shipment tracking</li>
              <li className="flex items-center gap-3"><span className="h-1.5 w-1.5 bg-brand" /> Booking management</li>
              <li className="flex items-center gap-3"><span className="h-1.5 w-1.5 bg-brand" /> Quotation requests</li>
              <li className="flex items-center gap-3"><span className="h-1.5 w-1.5 bg-brand" /> Notifications</li>
            </ul>
          </div>
          <p className="font-mono text-[11px] text-white/35">
            {BUSINESS.message}
          </p>
        </div>
      </aside>
    </div>
  );
}
