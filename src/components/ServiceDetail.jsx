import { Link } from 'react-router-dom';
import { ArrowRight, Mail, MessageCircle, Check } from 'lucide-react';
import Section from './Section.jsx';
import PageHero from './PageHero.jsx';
import Photo from './Photo.jsx';
import Reveal from './Reveal.jsx';
import Button from './Button.jsx';
import { BUSINESS } from '../data/media.js';

/**
 * Shared layout for the four DBZ service detail pages:
 * number + title intro, optional key facts, Benefits, Process,
 * Request a Quote and Ask about this service.
 */
export default function ServiceDetail({
  slug,
  number,
  title,
  lead,
  intro,
  photo,
  facts = [],
  benefits = [],
  process = [],
  extraPhotos = [],
}) {
  return (
    <>
      <PageHero eyebrow={`Service ${number} of 4`} title={title} ghost={title} lead={intro} />

      {/* Intro with photo */}
      <Section className="bg-mist">
        <div className="shell grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <span className="eyebrow">{`Service ${number}`}</span>
            <h2 className="h-display mt-4 text-3xl md:text-[44px]">{lead}</h2>
            <p className="mt-6 text-[15px] leading-relaxed text-ink/60">{intro}</p>
            <div className="mt-8 flex flex-wrap gap-3.5">
              <Button to={`/get-a-quote?service=${encodeURIComponent(title)}`}>
                Request a Quote
              </Button>
              <Button to="/services" variant="outline">
                All Services
              </Button>
            </div>
          </Reveal>
          <Reveal delay={0.12}>
            <Photo
              src={photo.src}
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              className="aspect-[4/3] w-full rounded-2xl shadow-lift"
            />
          </Reveal>
        </div>
      </Section>

      {/* Key facts (transit times, destinations — as confirmed by the business) */}
      {facts.length > 0 && (
        <Section className="pt-0">
          <div className="shell">
            <Reveal>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {facts.map((f) => (
                  <div key={f.label} className="card p-6">
                    <p className="text-[12.5px] font-semibold text-brand-deep">{f.label}</p>
                    <p className="mt-2 text-[17px] font-bold leading-snug">{f.value}</p>
                    {f.note && <p className="mt-2 text-[12.5px] leading-relaxed text-ink/50">{f.note}</p>}
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </Section>
      )}

      {/* Benefits */}
      {benefits.length > 0 && (
        <Section className="bg-mist pt-0">
          <div className="shell">
            <Reveal>
              <span className="eyebrow">Benefits</span>
              <h2 className="h-display mt-4 text-3xl md:text-[40px]">What You Get</h2>
            </Reveal>
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {benefits.map((b, i) => (
                <Reveal key={b.title} delay={i * 0.05} className="h-full">
                  <div className="card flex h-full gap-4 p-6">
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ink text-brand">
                      <Check className="h-4 w-4" strokeWidth={2.5} />
                    </span>
                    <div>
                      <h3 className="text-[16.5px] font-bold">{b.title}</h3>
                      <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink/55">{b.body}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </Section>
      )}

      {/* Process */}
      {process.length > 0 && (
        <Section>
          <div className="shell">
            <Reveal>
              <span className="eyebrow">Process</span>
              <h2 className="h-display mt-4 text-3xl md:text-[40px]">How It Works</h2>
            </Reveal>
            <div className="mt-10 space-y-4">
              {process.map((step, i) => (
                <Reveal key={step.title} delay={i * 0.05}>
                  <div className="card flex flex-col gap-4 p-6 sm:flex-row sm:items-center">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-ink font-mono text-[16px] font-bold text-brand">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <h3 className="text-[16.5px] font-bold">{step.title}</h3>
                      <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink/55">{step.body}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </Section>
      )}

      {/* Extra photos */}
      {extraPhotos.length > 0 && (
        <Section className="bg-mist pt-0">
          <div className="shell grid gap-5 sm:grid-cols-2">
            {extraPhotos.map((p) => (
              <Reveal key={p.src}>
                <Photo
                  src={p.src}
                  alt={p.alt}
                  width={p.width}
                  height={p.height}
                  className="aspect-[4/3] w-full rounded-2xl shadow-card"
                />
              </Reveal>
            ))}
          </div>
        </Section>
      )}

      {/* Request a quote / ask about this service */}
      <Section className="pt-0">
        <div className="shell">
          <Reveal>
            <div className="rounded-3xl bg-ink p-8 text-white md:p-12">
              <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
                <div>
                  <h2 className="h-display text-3xl md:text-4xl">Ready to get started?</h2>
                  <p className="mt-3 max-w-xl text-[14px] leading-relaxed text-white/60">
                    Request a quote for {title.toLowerCase()} or ask us anything about your
                    shipment — we are happy to help.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3.5">
                  <Button to={`/get-a-quote?service=${encodeURIComponent(title)}`}>
                    Request a Quote
                  </Button>
                </div>
              </div>
              <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 border-t border-white/10 pt-7 text-[13.5px]">
                <a
                  href={BUSINESS.whatsappLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 font-semibold text-brand-light"
                >
                  <MessageCircle className="h-4 w-4" /> Ask on WhatsApp
                </a>
                <a
                  href={`mailto:${BUSINESS.email}?subject=${encodeURIComponent(`Question about ${title}`)}`}
                  className="inline-flex items-center gap-2 font-semibold text-white/70"
                >
                  <Mail className="h-4 w-4" /> {BUSINESS.email}
                </a>
                <Link to="/destinations" className="inline-flex items-center gap-2 font-semibold text-white/70">
                  See where we ship <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
