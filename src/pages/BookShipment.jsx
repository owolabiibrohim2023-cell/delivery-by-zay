import usePageTitle from '../hooks/usePageTitle.js';
import PageHero from '../components/PageHero.jsx';
import Section, { SectionHeading } from '../components/Section.jsx';
import Reveal from '../components/Reveal.jsx';
import BookingWizard from '../components/BookingWizard.jsx';
import { DemoBanner } from '../components/States.jsx';
import { USE_MOCK, MOCK_MODE_NOTE } from '../services/api.js';
import { ClipboardList, MapPin, PackageCheck } from 'lucide-react';

export default function BookShipment() {
  usePageTitle('Book Shipment');
  return (
    <>
      <PageHero
        eyebrow="Book Shipment"
        title="Book your shipment in four steps."
        ghost="Book"
        lead="Sender details, receiver details, package information, confirmation. Once the DBZ team approves your booking, a tracking number is issued."
      />

      <Section className="bg-mist">
        <div className="shell">
          {USE_MOCK && <DemoBanner note={MOCK_MODE_NOTE} className="mb-8" />}
          <div className="grid gap-10 lg:grid-cols-[1fr_280px]">
            <BookingWizard />
            <aside className="space-y-5">
              {[
                { icon: ClipboardList, title: 'Have this ready', body: 'Receiver address with postal code, package description, weight and dimensions.' },
                { icon: MapPin, title: 'Drop-off or pickup', body: 'Bring the parcel to Abuja or Lagos, or request package collection.' },
                { icon: PackageCheck, title: 'After booking', body: 'We review the booking, confirm rates by quotation and issue tracking when approved.' },
              ].map(({ icon: Icon, title, body }, i) => (
                <Reveal key={title} delay={i * 0.07}>
                  <div className="card p-6">
                    <Icon className="h-6 w-6 text-brand-deep" strokeWidth={1.5} />
                    <h3 className="mt-3 text-[18px]">{title}</h3>
                    <p className="mt-2 text-[13px] leading-relaxed text-ink/55">{body}</p>
                  </div>
                </Reveal>
              ))}
            </aside>
          </div>
        </div>
      </Section>
    </>
  );
}
