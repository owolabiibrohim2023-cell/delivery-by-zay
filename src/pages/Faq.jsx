import { Link } from 'react-router-dom';
import usePageTitle from '../hooks/usePageTitle.js';
import PageHero from '../components/PageHero.jsx';
import Section, { SectionHeading } from '../components/Section.jsx';
import Reveal from '../components/Reveal.jsx';
import FaqItem from '../components/FaqItem.jsx';
import Button from '../components/Button.jsx';

const GROUPS = [
  {
    name: 'Shipping & Booking',
    items: [
      ['How do I book a shipment?', 'Start on the Book Shipment page or chat with us on WhatsApp. You will provide sender details, receiver details and package information — then we confirm the booking and rates.'],
      ['What can I ship internationally?', 'We ship documents, personal effects, commercial goods and more. Some items are prohibited or restricted by customs authorities — message us before booking anything unusual and we will confirm what is possible.'],
      ['How much does shipping cost?', 'Rates depend on weight, dimensions, destination and shipping method. We provide rates only through official quotations — request one on the Get a Quote page and our team will respond.'],
      ['How long does delivery take?', 'Delivery times vary by destination, method and customs procedures. Your quotation includes timing guidance for your specific shipment.'],
      ['Where do I drop off my parcel?', 'We operate drop-off points in Abuja and Lagos. See the Locations page, or arrange package collection instead.'],
      ['Do you offer package collection?', 'Yes — package collection is one of our services. Request it when booking and our team will arrange a pickup time.'],
    ],
  },
  {
    name: 'Tracking & Delivery',
    items: [
      ['How do I track my shipment?', 'Enter your tracking number on the Track page or in your dashboard. You will see the current status, origin, destination and the full tracking history.'],
      ['Where do I find my tracking number?', 'It is issued when your booking is approved and appears in your booking confirmation email and customer dashboard.'],
      ['What do the statuses mean?', 'Your shipment moves through Booking Received, Processing, Shipment Received, In Transit, Customs Clearance, Out for Delivery and finally Delivered. On Hold means we need something from you before it can move.'],
      ['What if my shipment is On Hold?', 'Contact us immediately — most holds are resolved by providing documentation or receiver information. We will tell you exactly what is needed.'],
      ['Can I track on the carrier’s website?', 'Where applicable we provide official links to DHL, UPS, FedEx and Aramex tracking pages. DBZ tracking itself is administrator-managed for accuracy.'],
    ],
  },
  {
    name: 'Accounts & Payments',
    items: [
      ['Do I need an account to ship?', 'You can book as a guest, but a free account gives you shipment history, quotes, notifications and faster repeat bookings.'],
      ['How do I pay for my shipment?', 'Payment instructions are provided with your quotation and booking approval. Our platform is preparing Paystack integration for secure online payments.'],
      ['Is my information secure?', 'Your data is protected with modern authentication and encrypted transport. Payment credentials are never stored on our website.'],
      ['Can my business ship in bulk?', 'Yes — Business & Bulk Shipping is built for shops and commercial volumes. Contact us to set up regular shipments.'],
    ],
  },
];

export default function Faq() {
  usePageTitle('FAQ');
  return (
    <>
      <PageHero
        eyebrow="FAQ"
        title="Frequently asked questions."
        ghost="Faq"
        lead="Straight answers about booking, tracking, quotations and delivery. Can’t find what you need? Message us on WhatsApp."
      />

      <Section className="bg-mist">
        <div className="shell max-w-4xl">
          {GROUPS.map((group, gi) => (
            <Reveal key={group.name} delay={gi * 0.05} className="mb-14 last:mb-0">
              <h2 className="h-display text-3xl md:text-4xl">{group.name}</h2>
              <div className="card mt-6 px-7 py-2 md:px-9">
                {group.items.map(([q, a]) => (
                  <FaqItem key={q} question={q}>
                    {a}
                  </FaqItem>
                ))}
              </div>
            </Reveal>
          ))}

          <Reveal delay={0.1}>
            <div className="rounded-2xl bg-ink p-8 text-white md:p-12">
              <h2 className="h-display text-4xl">Still have a question?</h2>
              <p className="mt-3 max-w-lg text-[14px] leading-relaxed text-white/60">
                Our team is one message away. Ask about packaging, documentation, destinations or
                anything else about your shipment.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button to="/contact" arrow>Contact us</Button>
                <Button to="/get-a-quote" variant="ghost-light">Get a quote</Button>
              </div>
              <p className="mt-6 font-mono text-[11px] text-white/40">
                <Link to="/track" className="underline decoration-brand underline-offset-4">Track a shipment instead →</Link>
              </p>
            </div>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
