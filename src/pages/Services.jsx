import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import usePageTitle from '../hooks/usePageTitle.js';
import Section, { SectionHeading } from '../components/Section.jsx';
import PageHero from '../components/PageHero.jsx';
import Reveal from '../components/Reveal.jsx';
import Photo from '../components/Photo.jsx';

/* The four DBZ services — photos are the client's real uploads. */
const SERVICES = [
  {
    id: 'international-shipping',
    title: 'International Shipping',
    body: 'Door-to-door delivery and warehouse pickup options for parcels and packages from Nigeria to destinations worldwide.',
    photo: { src: '/images/dbz-counter-scale.jpg', alt: 'Customer parcels and packages at the DBZ counter with the weighing scale', width: 591, height: 1044 },
  },
  {
    id: 'express-shipping',
    title: 'Express Shipping',
    body: 'Fast-priority international delivery for customers who need their packages shipped urgently.',
    // TODO: swap to '/images/ups-yellow-box.jpg' (800×1000) once the client uploads it.
    photo: { src: '/images/fragile-bale-trolley.jpg', alt: 'Boxes and fragile items wrapped and secured for express shipping on a trolley', width: 952, height: 1269 },
  },
  {
    id: 'air-sea-cargo',
    title: 'Air & Sea Cargo',
    body: 'International cargo solutions for larger shipments, bulk goods and consolidated consignments.',
    photo: { src: '/images/cargo-pallet-top.jpg', alt: 'Taped cargo boxes stacked on a pallet jack ready for shipment', width: 591, height: 1156 },
  },
  {
    id: 'secure-handling',
    title: 'Secure Package Handling',
    body: 'Careful, professional handling with proper documentation at every stage of the journey.',
    photo: { src: '/images/packing-staff-dbz-sign.jpg', alt: 'Staff member packing a customer box under the DBZ sign', width: 591, height: 1052 },
  },
];

export default function Services() {
  usePageTitle('Services');

  return (
    <>
      <PageHero eyebrow="Our Services" title="Shipping Services" ghost="Services" />

      <Section className="bg-mist">
        <div className="shell">
          <SectionHeading
            eyebrow="What We Do"
            title="International Shipping Made Easy"
            lead="Reliable international shipping from Nigeria to the UK, USA, Canada and over 220 countries worldwide. From personal parcels to commercial cargo, we make shipping easy, secure and reliable."
          />

          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {SERVICES.map((s, i) => (
              <Reveal key={s.id} delay={i * 0.06} className="h-full">
                <article id={s.id} className="card card-hover flex h-full flex-col overflow-hidden scroll-mt-28">
                  <Photo
                    src={s.photo.src}
                    alt={s.photo.alt}
                    width={s.photo.width}
                    height={s.photo.height}
                    className="aspect-[16/9] w-full"
                  />
                  <div className="flex flex-1 flex-col p-7">
                    <h2 className="text-[21px] font-bold">{s.title}</h2>
                    <p className="mt-3 flex-1 text-[14px] leading-relaxed text-ink/60">{s.body}</p>
                    <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2">
                      <Link to={`/services/${s.id}`} className="btn-outline !px-5 !py-2.5 !text-[13px]">
                        Learn More
                      </Link>
                      <Link to={`/get-a-quote?service=${encodeURIComponent(s.title)}`} className="text-[13.5px] font-semibold text-brand-deep">
                        Request a Quote →
                      </Link>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>

          {/* quick jump strip */}
          <div className="no-scrollbar mt-12 flex gap-2.5 overflow-x-auto pb-1">
            {SERVICES.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="chip whitespace-nowrap"
              >
                {s.title}
              </a>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}
