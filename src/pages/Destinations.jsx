import { useMemo, useState } from 'react';
import { Search, X } from 'lucide-react';
import usePageTitle from '../hooks/usePageTitle.js';
import Section, { SectionHeading } from '../components/Section.jsx';
import PageHero from '../components/PageHero.jsx';
import Reveal from '../components/Reveal.jsx';
import Button from '../components/Button.jsx';
import { COUNTRIES } from '../data/countries.js';
import { AIR_CARGO_NOTE } from '../data/destinations.js';

/* Flag emoji derived from the ISO alpha-2 code (same approach as countries.js). */
function flagOf(code) {
  return code
    .toUpperCase()
    .split('')
    .map((c) => String.fromCodePoint(127397 + c.charCodeAt(0)))
    .join('');
}

export default function Destinations() {
  usePageTitle('Destinations');
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = COUNTRIES.map(([code, name]) => ({ code, name }));
    const filtered = q ? list.filter((c) => c.name.toLowerCase().includes(q)) : list;
    return [...filtered].sort((a, b) => a.name.localeCompare(b.name));
  }, [query]);

  return (
    <>
      <PageHero
        eyebrow="Destinations"
        title="Where We Ship"
        ghost="Destinations"
        lead="DBZ ships from Nigeria to more than 220 countries and territories worldwide via Express Shipping."
      />

      <Section className="bg-mist">
        <div className="shell">
          <SectionHeading
            eyebrow="International Shipping Destinations"
            title="Over 220 Countries and Territories"
            lead="Every destination below is available through our Express Shipping service. Search the list to confirm where your package can go."
          />

          <Reveal delay={0.08}>
            <p className="mt-8 inline-flex max-w-2xl rounded-xl border border-ink/10 bg-white px-5 py-3.5 text-[13.5px] leading-relaxed text-ink/65">
              {AIR_CARGO_NOTE}
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mx-auto mt-10 max-w-xl">
              <label htmlFor="destination-search" className="field-label">
                Search destinations
              </label>
              <div className="relative mt-2">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink/35" />
                <input
                  id="destination-search"
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Type a country — e.g. United Kingdom"
                  className="field w-full pl-11 pr-11"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-ink/40 hover:bg-mist hover:text-ink"
                    aria-label="Clear search"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <p className="mt-3 text-[12.5px] text-ink/45" role="status">
                Showing {results.length} of {COUNTRIES.length} destinations
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <ul className="mt-10 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {results.map(({ code, name }) => (
                <li
                  key={code}
                  className="card flex items-center gap-3 !px-4 !py-3 text-[13.5px]"
                >
                  <span aria-hidden="true">{flagOf(code)}</span>
                  <span className="font-medium">{name}</span>
                </li>
              ))}
            </ul>
            {results.length === 0 && (
              <p className="mt-10 text-center text-[14px] text-ink/50">
                No destination matches “{query}”. Chat with us on WhatsApp — we may still be able
                to help.
              </p>
            )}
          </Reveal>

          <Reveal delay={0.15}>
            <div className="mt-14 flex flex-wrap items-center justify-center gap-4">
              <Button to="/get-a-quote?service=Express%20Shipping">Get a Quote</Button>
              <Button to="/services/express-shipping" variant="outline">
                About Express Shipping
              </Button>
            </div>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
