import { MapPin, Navigation, Phone } from 'lucide-react';
import usePageTitle from '../hooks/usePageTitle.js';
import Section, { SectionHeading } from '../components/Section.jsx';
import PageHero from '../components/PageHero.jsx';
import Photo from '../components/Photo.jsx';
import Reveal from '../components/Reveal.jsx';
import { BUSINESS, mapsUrl } from '../data/media.js';

export default function Locations() {
  usePageTitle('Locations');

  return (
    <>
      <PageHero
        eyebrow="Locations"
        title="Find Our Locations"
        ghost="Locations"
        lead="Visit our Abuja or Lagos office to drop off your shipment, or arrange a collection at your convenience."
      />

      <Section className="bg-mist">
        <div className="shell grid items-start gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Drop-off locations"
              title="Two Locations, One Standard of Care"
              lead="Our team is on ground at both locations to weigh, document and receive your packages."
            />

            <div className="mt-10 space-y-5">
              {BUSINESS.locations.map((loc, i) => (
                <Reveal key={loc.id} delay={i * 0.08}>
                  <div className="card p-7">
                    <div className="flex items-center gap-3.5">
                      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-ink text-brand">
                        <MapPin className="h-5 w-5" strokeWidth={1.75} />
                      </span>
                      <div>
                        <p className="text-[18px] font-bold">{loc.city}</p>
                        <p className="text-[12.5px] text-ink/45">{loc.name}</p>
                      </div>
                    </div>
                    <p className="mt-4 text-[14px] leading-relaxed text-ink/65">{loc.address}</p>
                    <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2.5 text-[13.5px]">
                      <a
                        href={mapsUrl(loc.mapsQuery)}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 font-semibold text-brand-deep"
                      >
                        <Navigation className="h-4 w-4" /> Get Directions
                      </a>
                      <a href={`tel:${BUSINESS.phone}`} className="inline-flex items-center gap-2 font-semibold text-ink">
                        <Phone className="h-4 w-4 text-brand-deep" /> {BUSINESS.phone}
                      </a>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.16}>
              <p className="mt-8 max-w-lg text-[13px] leading-relaxed text-ink/50">
                Opening the same phone number for both locations — call or WhatsApp{' '}
                <a href={`tel:${BUSINESS.phone}`} className="link-underline font-semibold text-ink">
                  {BUSINESS.phone}
                </a>{' '}
                and our team will direct you to the right desk.
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.12}>
            <Photo
              src="/images/warehouse.jpg"
              alt="Organised warehouse shelving at a DBZ handling location"
              width={1024}
              height={1280}
              className="aspect-[4/5] w-full rounded-2xl shadow-lift"
            />
          </Reveal>
        </div>
      </Section>
    </>
  );
}
