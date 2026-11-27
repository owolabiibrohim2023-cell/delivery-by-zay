import { Compass, Eye, Handshake, Heart, ShieldCheck, Target } from 'lucide-react';
import usePageTitle from '../hooks/usePageTitle.js';
import PageHero from '../components/PageHero.jsx';
import Section, { SectionHeading } from '../components/Section.jsx';
import Reveal from '../components/Reveal.jsx';
import Button from '../components/Button.jsx';
import { BUSINESS } from '../data/media.js';

const VALUES = [
  { icon: ShieldCheck, title: 'Safe handling', body: 'Every parcel is treated like it matters — because it does. Careful processing from drop-off to delivery.' },
  { icon: Handshake, title: 'Customer focus', body: 'Clear communication, honest answers and a real person you can reach on WhatsApp, phone or email.' },
  { icon: Compass, title: 'Simplicity', body: 'Shipping internationally should not be complicated. We handle the logistics so you can shop and ship with ease.' },
  { icon: Heart, title: 'Pride in delivery', body: 'We deliver on the promise in our name — Delivered by Zay. Every completed delivery is our best advert.' },
];

export default function About() {
  usePageTitle('About Us');
  return (
    <>
      <PageHero
        eyebrow="About DBZ"
        title="Delivered by Zay. Trusted by you."
        ghost="DBZ"
        lead="An international shipping partner built around one idea: sending a parcel from Nigeria to the rest of the world should be fast, safe and reliable."
      />

      {/* Introduction */}
      <Section>
        <div className="shell grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <SectionHeading
              eyebrow="Who we are"
              title="Your trusted shipping partner."
            />
            <Reveal delay={0.1}>
              <p className="mt-6 text-[15px] leading-relaxed text-ink/60 md:text-[16px]">
                {BUSINESS.name} is an international logistics business operating from Nigeria, with
                drop-off locations in Abuja and Lagos. We help individuals and businesses send
                parcels, documents and cargo to the UK, USA, Canada and over 220 countries and
                territories.
              </p>
              <p className="mt-4 text-[15px] leading-relaxed text-ink/60 md:text-[16px]">
                We focus on what matters to the customer: careful handling, clear communication and
                shipment visibility from the moment a booking is made until the parcel is delivered.
                <strong className="text-ink"> Shop Global, We Deliver!</strong>
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button to="/services" arrow>Our services</Button>
                <Button to="/contact" variant="outline">Talk to us</Button>
              </div>
            </Reveal>
          </div>
          <Reveal delay={0.15}>
            <img
              src="/images/packing-staff-dbz-sign.jpg"
              width={591}
              height={1052}
              alt="DBZ staff packing a customer box under the DBZ sign"
              className="aspect-[4/5] w-full rounded-2xl object-cover shadow-lift"
              loading="lazy"
            />
          </Reveal>
        </div>
      </Section>

      {/* Mission & vision */}
      <Section className="bg-ink text-white">
        <div className="shell">
          <SectionHeading light eyebrow="Direction" title="Mission & vision." />
          <div className="mt-14 grid gap-5 md:grid-cols-2">
            <Reveal>
              <div className="card-dark h-full p-8 md:p-10">
                <Target className="h-8 w-8 text-brand" strokeWidth={1.5} />
                <h3 className="mt-6 text-[30px]">Mission</h3>
                <p className="mt-4 text-[14.5px] leading-relaxed text-white/65">
                  To make international shipping from Nigeria simple, transparent and dependable —
                  giving every customer professional handling, clear pricing through quotations and
                  full visibility of their shipment.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="card-dark h-full p-8 md:p-10">
                <Eye className="h-8 w-8 text-brand" strokeWidth={1.5} />
                <h3 className="mt-6 text-[30px]">Vision</h3>
                <p className="mt-4 text-[14.5px] leading-relaxed text-white/65">
                  To become the shipping partner Nigerians recommend first — a homegrown brand
                  trusted across the UK, USA, Canada and every destination our customers need to
                  reach.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* Values */}
      <Section className="bg-mist">
        <div className="shell">
          <SectionHeading eyebrow="Values" title="What we stand for." />
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map(({ icon: Icon, title, body }, i) => (
              <Reveal key={title} delay={i * 0.06}>
                <div className="card h-full p-7">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-ink text-brand">
                    <Icon className="h-5 w-5" strokeWidth={1.75} />
                  </span>
                  <h3 className="mt-5 text-[20px]">{title}</h3>
                  <p className="mt-2.5 text-[13px] leading-relaxed text-ink/55">{body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {/* Commitment + network */}
      <Section>
        <div className="shell grid gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <img
              src="/images/boxes-wide-truck.jpg"
              width={1280}
              height={591}
              alt="Taped shipping boxes lined up beside a truck before departure"
              className="aspect-[4/3] w-full rounded-2xl object-cover shadow-lift"
              loading="lazy"
            />
          </Reveal>
          <div>
            <SectionHeading
              eyebrow="Commitment & network"
              title="Committed to safe international delivery."
            />
            <Reveal delay={0.1}>
              <ul className="mt-7 space-y-5">
                {[
                  ['Commitment to safe delivery', 'Secure package handling and professional documentation practices on every shipment we accept.'],
                  ['Customer-focused service', 'Support before, during and after shipping — from packaging advice to delivery confirmation.'],
                  ['A growing shipping network', 'Origin hubs in Abuja and Lagos connecting to the UK, USA, Canada and 220+ countries and territories.'],
                  ['One point of contact', 'Booking, tracking, quotations and support — all handled by one dedicated team.'],
                ].map(([title, body]) => (
                  <li key={title} className="flex gap-4">
                    <span className="mt-1.5 h-2.5 w-2.5 shrink-0 bg-brand" />
                    <div>
                      <h4 className="font-sans text-[15.5px] font-semibold">{title}</h4>
                      <p className="mt-1 text-[13.5px] leading-relaxed text-ink/55">{body}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* CTA */}
      <section className="bg-coal text-white">
        <div className="shell flex flex-wrap items-center justify-between gap-6 py-14">
          <h2 className="h-display max-w-xl text-4xl md:text-5xl">Ship with a partner that delivers.</h2>
          <div className="flex flex-wrap gap-4">
            <Button to="/book-shipment" arrow>Book a shipment</Button>
            <Button to="/get-a-quote" variant="ghost-light">Get a quote</Button>
          </div>
        </div>
      </section>
    </>
  );
}
