import { Link } from 'react-router-dom';
import { ArrowUpRight, Instagram, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { BUSINESS, mapsUrl } from '../data/media.js';
import { NAV_LINKS } from './Navbar.jsx';

const SERVICE_LINKS = [
  { label: 'International Shipping', hash: 'international-shipping' },
  { label: 'Express Shipping', hash: 'express-shipping' },
  { label: 'Air & Sea Cargo', hash: 'air-sea-cargo' },
  { label: 'Secure Package Handling', hash: 'secure-handling' },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-ink text-white">
      <div className="shell relative z-10 pb-10 pt-16 md:pt-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          {/* Brand */}
          <div>
            <Link to="/" aria-label="DBZ – Delivered by Zay home" className="inline-block transition-transform duration-300 hover:scale-[1.02]">
              <img
                src="/images/d3z-logo.jpg?v=2"
                alt="DBZ — Delivered By Zay"
                className="h-12 w-auto rounded-lg md:h-14"
                width="150"
                height="56"
                loading="eager"
                decoding="async"
              />
            </Link>
            <p className="mt-4 text-[13.5px] font-medium text-white/70">{BUSINESS.tagline}</p>
            <p className="mt-1 text-[13.5px] font-semibold text-brand-light">{BUSINESS.slogan}</p>
            <p className="mt-5 max-w-sm text-[13.5px] leading-relaxed text-white/50">
              International shipping from Nigeria to the UK, USA, Canada and over 220 countries,
              with convenient drop-off locations in Abuja and Lagos.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={BUSINESS.instagramLink} target="_blank" rel="noreferrer" className="btn-ghost-light btn-sm">
                <Instagram className="h-4 w-4" /> Instagram
              </a>
              <a href={BUSINESS.whatsappLink} target="_blank" rel="noreferrer" className="btn-ghost-light btn-sm">
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </a>
            </div>
          </div>

          {/* Company */}
          <nav aria-label="Company">
            <h4 className="text-[13px] font-semibold text-white/45">Company</h4>
            <ul className="mt-5 space-y-3">
              {NAV_LINKS.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="group inline-flex items-center gap-1.5 text-[13.5px] text-white/70 transition-colors hover:text-brand-light">
                    {l.label}
                    <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Services */}
          <nav aria-label="Services">
            <h4 className="text-[13px] font-semibold text-white/45">Services</h4>
            <ul className="mt-5 space-y-3">
              {SERVICE_LINKS.map((s) => (
                <li key={s.hash}>
                  <Link to={`/services#${s.hash}`} className="text-[13.5px] text-white/70 transition-colors hover:text-brand-light">
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <h4 className="text-[13px] font-semibold text-white/45">Contact</h4>
            <ul className="mt-5 space-y-3.5 text-[13.5px] text-white/70">
              <li>
                <a href={`mailto:${BUSINESS.email}`} className="inline-flex items-center gap-2.5 transition-colors hover:text-brand-light">
                  <Mail className="h-4 w-4 shrink-0 text-brand" /> {BUSINESS.email}
                </a>
              </li>
              <li>
                <a href={`tel:${BUSINESS.phone}`} className="inline-flex items-center gap-2.5 transition-colors hover:text-brand-light">
                  <Phone className="h-4 w-4 shrink-0 text-brand" /> {BUSINESS.phone}
                </a>
              </li>
              {BUSINESS.locations.map((loc) => (
                <li key={loc.id} className="inline-flex items-start gap-2.5">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                  <span>
                    <strong className="text-white/80">{loc.city}:</strong> {loc.address}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/book-shipment" className="btn-primary btn-sm">Book a Shipment</Link>
              <Link to="/track" className="btn-ghost-light btn-sm">Track</Link>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-6 text-[12.5px] text-white/40 md:flex-row md:items-center md:justify-between">
          <p>© 2026 DBZ - Delivered by Zay. All rights reserved.</p>
          <p>{BUSINESS.slogan}</p>
        </div>
      </div>
    </footer>
  );
}
