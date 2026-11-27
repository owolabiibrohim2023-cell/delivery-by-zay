import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Globe,
  MapPin,
  MessageCircle,
  Navigation,
  PackageSearch,
  Phone,
  ShieldCheck,
  SlidersHorizontal,
  Star,
  Zap,
} from 'lucide-react';
import usePageTitle from '../hooks/usePageTitle.js';
import Section, { SectionHeading } from '../components/Section.jsx';
import Reveal from '../components/Reveal.jsx';
import Button from '../components/Button.jsx';
import Photo from '../components/Photo.jsx';
import Gallery from '../components/Gallery.jsx';
import { BUSINESS, mapsUrl } from '../data/media.js';
import { REVIEWS, REVIEWS_SUMMARY, GOOGLE_LISTING_URL } from '../data/reviews.js';

/* ------------------------------------------------------------------ data */

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

const STEPS = [
  {
    n: '01',
    title: 'Book Your Shipment',
    body: 'Customers provide their shipment details and booking information.',
    photo: { src: '/images/dbz-counter-scale.jpg', alt: 'Customer parcels being checked in and weighed at the DBZ counter', width: 591, height: 1044 },
  },
  {
    n: '02',
    title: 'Shipment Processing',
    body: 'The shipment is received and processed according to the applicable service arrangements.',
    photo: { src: '/images/packing-staff-dbz-sign.jpg', alt: 'DBZ staff member processing a customer package at the office', width: 591, height: 1052 },
  },
  {
    n: '03',
    title: 'Track Your Shipment',
    body: 'Customers use their tracking reference to check available shipment updates.',
    photo: { src: '/images/step-track-phone.jpg', alt: 'Customer checking shipment tracking updates on her phone beside two parcels', width: 1200, height: 900 },
  },
  {
    n: '04',
    title: 'Delivery',
    body: 'The shipment proceeds through the delivery process to its destination.',
    photo: { src: '/images/step-delivery-handover.jpg', alt: 'Delivery courier in a plain navy uniform handing a parcel to its recipient at the doorstep', width: 1200, height: 900 },
  },
];

const WHY = [
  { icon: Globe, title: 'Global Shipping Network', body: 'Connecting Nigeria to the world through reliable international shipping routes' },
  { icon: ShieldCheck, title: 'Reliable Handling', body: 'Professional, secure handling with careful documentation from drop-off to delivery.' },
  { icon: PackageSearch, title: 'Shipment Tracking', body: 'Track your package with a unique tracking number and stay updated on its delivery progress' },
  { icon: SlidersHorizontal, title: 'Flexible Shipping Options', body: 'Air or Sea Freight, Door to door or warehouse pick up. Options shaped around your convenience' },
  { icon: MessageCircle, title: 'Customer Support', body: 'Real people on WhatsApp, phone and email when you need answers about your shipment.' },
];

const GALLERY_PHOTOS = [
  { src: '/images/boxes-wide-truck.jpg', alt: 'About forty taped shipping boxes lined up beside a blue truck', width: 1280, height: 591 },
  { src: '/images/cargo-pallet-top.jpg', alt: 'Taped cardboard boxes stacked on a pallet jack', width: 591, height: 1156 },
  { src: '/images/packing-staff-dbz-sign.jpg', alt: 'Staff member packing a customer box at the DBZ office', width: 591, height: 1052 },
  { src: '/images/dbz-counter-scale.jpg', alt: 'Open cartons of customer goods at the DBZ counter with the weighing scale', width: 591, height: 1044 },
  { src: '/images/fragile-bale-trolley.jpg', alt: 'Boxes and fragile items wrapped and secured for shipping on a trolley', width: 952, height: 1269 },
  { src: '/images/uk-cargo-boxes.jpg', alt: 'Cartons of customer goods packed for shipment to the UK, USA and Canada', width: 720, height: 1280 },
  { src: '/images/gallery-01.jpg', alt: 'Consolidated cargo shipment ready to depart for Canada', width: 720, height: 1280 },
  { src: '/images/gallery-02.jpg', alt: 'Fragile boxed cargo secured on a warehouse trolley', width: 592, height: 1121 },
];

const BADGES = [
  { icon: Zap, label: 'Fast' },
  { icon: ShieldCheck, label: 'Safe' },
  { icon: BadgeCheck, label: 'Reliable' },
];

/* ------------------------------------------------------------------ hero */

function Hero() {
  return (
    <section
      className="relative overflow-hidden bg-ink text-white"
      aria-label="DBZ international shipping introduction"
    >
      <div className="shell relative z-10 grid items-center gap-10 pb-14 pt-12 md:pb-20 md:pt-16 lg:grid-cols-[1.05fr_0.9fr] lg:gap-14">
        {/* Copy — left column */}
        <div>
          <Reveal>
            <span className="eyebrow eyebrow--light">International Logistics</span>
            <h1 className="h-display mt-5 text-4xl sm:text-5xl lg:text-[60px] lg:leading-[1.1]">
              Your World. Our Delivery{' '}
              <span className="text-gold-gradient">Network.</span>
            </h1>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-white/70 md:text-[16px]">
              DBZ – Delivered by Zay helps customers and businesses ship internationally from
              Nigeria. From a single parcel to consolidated cargo, we move your shipment from
              Abuja or Lagos to the UK, USA, Canada and more than 220 countries worldwide.
            </p>
            <p className="mt-4 max-w-xl text-[14px] leading-relaxed text-white/55 md:text-[15px]">
              One trusted partner, clear communication and careful handling — from booking to
              final delivery.
            </p>

            <div className="mt-8 flex max-w-sm flex-col gap-3.5 sm:max-w-none sm:flex-row sm:flex-wrap">
              <Button to="/book-shipment" arrow className="sm:min-w-[220px]">
                Book a Shipment
              </Button>
              <Button to="/track" variant="white" className="sm:min-w-[220px]">
                <PackageSearch className="h-4 w-4" strokeWidth={2} />
                Track Shipment
              </Button>
              <Button to="/get-a-quote" variant="gold-outline" className="sm:min-w-[220px]">
                Get a Quote
              </Button>
            </div>
          </Reveal>

          <Reveal delay={0.14}>
            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
              {BADGES.map(({ icon: Icon, label }, i) => (
                <span key={label} className="flex items-center gap-6">
                  {i > 0 && <span className="hidden h-8 w-px bg-white/15 sm:block" aria-hidden="true" />}
                  <span className="inline-flex items-center gap-2.5 text-[14.5px] font-semibold text-white/85">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full border border-brand/60 text-brand">
                      <Icon className="h-4 w-4" strokeWidth={1.75} />
                    </span>
                    {label}
                  </span>
                </span>
              ))}
            </div>
            <p className="mt-8 text-center text-[13px] text-white/45 sm:text-left">
              Your trusted shipping partner.
            </p>
          </Reveal>
        </div>

        {/* Visual — aircraft and DBZ-branded cargo crate at sunset (flyer photo) */}
        <Reveal delay={0.12} className="relative">
          <Photo
            src="/images/hero-aircraft.jpg?v=2"
            alt="Aircraft at sunset with a DBZ-branded cargo crate loaded on a trolley"
            width={420}
            height={830}
            eager
            className="aspect-[4/5] w-full rounded-2xl shadow-lift md:aspect-[5/6]"
            fallback={
              <div
                className="relative flex aspect-[4/5] w-full items-center justify-center overflow-hidden rounded-2xl shadow-lift"
                style={{ background: 'radial-gradient(120% 120% at 80% 10%, #16306a 0%, #0A1A3A 55%, #071228 100%)' }}
              >
                <span className="ghost-word bottom-2 right-2 text-[9rem] text-white" aria-hidden="true">DBZ</span>
                <p className="relative z-10 text-[13px] font-medium text-white/60">Air &amp; sea cargo to 220+ destinations</p>
              </div>
            }
          />
        </Reveal>
      </div>

      {/* Gold wave dividing into the cream section below */}
      <svg
        className="relative z-10 block h-[60px] w-full md:h-[90px]"
        viewBox="0 0 1440 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d="M0,64 C240,20 480,18 720,46 C960,74 1200,74 1440,38 L1440,100 L0,100 Z" fill="#F7F3EA" />
      </svg>
    </section>
  );
}

/* --------------------------------------------------- explore destinations */

function Explore() {
  return (
    <Section className="bg-mist">
      <div className="shell">
        <div className="text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-ink">
            <Globe className="h-7 w-7 text-brand" strokeWidth={1.5} />
          </span>
          <h2 className="h-display mt-6 text-3xl md:text-[44px]">Where would you like to ship?</h2>
          <p className="mt-3 text-[15px] text-ink/60">Explore our International Shipping Destinations</p>
        </div>

        <Reveal delay={0.1}>
          <div className="mx-auto mt-10 max-w-xl">
            <Link
              to="/destinations"
              className="card card-hover group flex items-center gap-5 p-6"
            >
              <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-ink">
                <Globe className="h-8 w-8 text-brand" strokeWidth={1.5} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[22px] font-bold leading-tight">220+ Countries</span>
                <span className="mt-1 inline-flex items-center gap-1.5 text-[14px] font-semibold text-brand-deep">
                  Explore Destinations
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </span>
            </Link>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <Photo
            src="/images/boxes-wide-truck.jpg"
            alt="About forty taped shipping boxes lined up beside a blue truck, ready for departure"
            width={1280}
            height={591}
            className="mx-auto mt-10 aspect-[1280/591] w-full max-w-4xl rounded-2xl shadow-card"
          />
        </Reveal>
      </div>
    </Section>
  );
}

/* -------------------------------------------------------------- services */

function ServicesSection() {
  return (
    <>
      {/* What We Do */}
      <Section>
        <div className="shell">
          <SectionHeading
            eyebrow="What We Do"
            title="International Shipping Made Easy"
            lead="Reliable international shipping from Nigeria to the UK, USA, Canada and over 220 countries worldwide. From personal parcels to commercial cargo, we make shipping easy, secure and reliable."
          />
        </div>
      </Section>

      {/* Our Services */}
      <Section className="bg-mist pt-0">
        <div className="shell">
          <SectionHeading eyebrow="Our Services" title="Shipping services shaped around you" />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICES.map((s, i) => (
              <Reveal key={s.id} delay={i * 0.06} className="h-full">
                <article className="card card-hover flex h-full flex-col overflow-hidden">
                  <Photo
                    src={s.photo.src}
                    alt={s.photo.alt}
                    width={s.photo.width}
                    height={s.photo.height}
                    className="aspect-[4/3] w-full"
                  />
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="text-[19px] font-bold leading-snug">{s.title}</h3>
                    <p className="mt-2.5 flex-1 text-[13.5px] leading-relaxed text-ink/60">{s.body}</p>
                    <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
                      <Link to={`/services#${s.id}`} className="text-[13.5px] font-semibold text-ink underline decoration-brand decoration-2 underline-offset-4">
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
        </div>
      </Section>
    </>
  );
}

/* ---------------------------------------------------------- how it works */

function HowItWorks() {
  return (
    <Section>
      <div className="shell">
        <SectionHeading
          eyebrow="How It Works"
          title="From Booking to Delivery."
          lead="How your shipping works."
        />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <Reveal key={step.n} delay={i * 0.06} className="h-full">
              <div className="card flex h-full flex-col overflow-hidden">
                <div className="relative shrink-0">
                  <Photo
                    src={step.photo.src}
                    alt={step.photo.alt}
                    width={step.photo.width}
                    height={step.photo.height}
                    className="aspect-[4/3] w-full"
                  />
                  {/* Step number chip — solid navy + gold, never hidden behind the image */}
                  <span
                    className="absolute left-4 top-4 z-10 flex h-12 w-12 items-center justify-center rounded-xl bg-ink font-display text-[17px] font-bold text-brand shadow-lift"
                    aria-label={`Step ${step.n}`}
                  >
                    {step.n}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="font-mono text-[10.5px] text-ink/45">Step {step.n} of 04</p>
                  <h3 className="mt-2 text-[17px] font-bold leading-snug">{step.title}</h3>
                  <p className="mt-2.5 flex-1 text-[13px] leading-relaxed text-ink/55">{step.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ why */

function WhySection() {
  return (
    <Section className="bg-mist">
      <div className="shell">
        <SectionHeading eyebrow="Why DBZ" title="Why Customers Ship With Us" />
        <div className="mt-12 grid gap-x-12 gap-y-9 md:grid-cols-2 lg:grid-cols-3">
          {WHY.map(({ icon: Icon, title, body }, i) => (
            <Reveal key={title} delay={i * 0.05}>
              <div className="flex gap-5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-ink text-brand">
                  <Icon className="h-5 w-5" strokeWidth={1.75} />
                </span>
                <div>
                  <h3 className="text-[17px] font-bold">{title}</h3>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-ink/55">{body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ---------------------------------------------------------------- reviews */

function Stars({ count = 5 }) {
  return (
    <span className="inline-flex gap-0.5" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="h-4 w-4 fill-brand text-brand" />
      ))}
    </span>
  );
}

function Reviews() {
  return (
    <Section>
      <div className="shell">
        <SectionHeading eyebrow="Testimonials" title="What Customers Say" lead={REVIEWS_SUMMARY} />
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {REVIEWS.map((r, i) => (
            <Reveal key={r.name} delay={i * 0.07} className="h-full">
              <figure className="card flex h-full flex-col p-7">
                <div className="flex items-center justify-between gap-3">
                  <Stars count={r.stars} />
                  <span className="rounded border border-ink/10 px-2 py-0.5 font-mono text-[10.5px] text-ink/45">Google</span>
                </div>
                <blockquote className="mt-4 flex-1 text-[13.5px] leading-relaxed text-ink/70">{r.text}</blockquote>
                <figcaption className="mt-6 border-t border-ink/10 pt-4">
                  <p className="text-[14px] font-semibold">{r.name}</p>
                  <p className="mt-0.5 text-[12px] text-ink/45">{r.when}</p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
        {GOOGLE_LISTING_URL ? (
          <Reveal delay={0.15}>
            <div className="mt-10 text-center">
              <a href={GOOGLE_LISTING_URL} target="_blank" rel="noreferrer" className="btn-outline">
                See all reviews on Google <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </Reveal>
        ) : null}
      </div>
    </Section>
  );
}

/* -------------------------------------------------------------- locations */

function LocationsSection() {
  return (
    <Section className="bg-mist">
      <div className="shell grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <SectionHeading
            eyebrow="Drop-off locations"
            title="Find Our Locations"
            lead="Visit our Abuja or Lagos office to drop off your shipment, or arrange a collection at your convenience."
          />
          <Reveal delay={0.12}>
            <div className="mt-8 space-y-4">
              {BUSINESS.locations.map((loc) => (
                <div key={loc.id} className="card p-6">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink text-brand">
                      <MapPin className="h-5 w-5" strokeWidth={1.75} />
                    </span>
                    <p className="text-[16px] font-bold">{loc.city}</p>
                  </div>
                  <p className="mt-3 text-[13.5px] leading-relaxed text-ink/60">{loc.address}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px]">
                    <a href={mapsUrl(loc.mapsQuery)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 font-semibold text-brand-deep">
                      <Navigation className="h-3.5 w-3.5" /> Get Directions
                    </a>
                    <a href={`tel:${BUSINESS.phone}`} className="inline-flex items-center gap-1.5 font-semibold text-ink">
                      <Phone className="h-3.5 w-3.5 text-brand-deep" /> {BUSINESS.phone}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
        <Reveal delay={0.15}>
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
  );
}

/* ------------------------------------------------------------------ page */

export default function Home() {
  usePageTitle(null);

  return (
    <>
      {/* 1 — Hero */}
      <Hero />

      {/* 2 — Explore destinations */}
      <Explore />

      {/* 3 + 4 — What we do & Our services */}
      <ServicesSection />

      {/* 5 — How it works */}
      <HowItWorks />

      {/* 7 — Why customers ship with us */}
      <WhySection />

      {/* 7b — Behind the Scenes gallery */}
      <Section className="pt-0">
        <div className="shell">
          <Reveal>
            <Gallery photos={GALLERY_PHOTOS} />
          </Reveal>
        </div>
      </Section>

      {/* 8 — Find our locations */}
      <LocationsSection />

      {/* 9 — What customers say */}
      <Reviews />

      {/* 10 — Closing banner */}
      <section className="relative overflow-hidden bg-coal text-white">
        <div className="shell relative z-10 py-20 text-center md:py-28">
          <Reveal>
            <span className="eyebrow eyebrow--light">Ready when you are</span>
            <h2 className="h-display mx-auto mt-6 max-w-4xl text-4xl sm:text-5xl md:text-6xl">
              Ready to Ship <span className="text-gold-gradient">Beyond Borders?</span>
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-[15px] leading-relaxed text-white/60">
              Book your shipment or request a quote. Our team is here to make international
              shipping simple and stress-free.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Button to="/book-shipment">Book a Shipment</Button>
              <Button to="/track" variant="ghost-light">
                Track Your Package <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
