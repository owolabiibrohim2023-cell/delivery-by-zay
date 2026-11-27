import { useState } from 'react';
import { CheckCircle2, Instagram, Mail, MessageCircle, Phone } from 'lucide-react';
import usePageTitle from '../hooks/usePageTitle.js';
import PageHero from '../components/PageHero.jsx';
import Section, { SectionHeading } from '../components/Section.jsx';
import Reveal from '../components/Reveal.jsx';
import { Field, TextInput, Select, Textarea } from '../components/Field.jsx';
import { DemoBanner, ErrorState } from '../components/States.jsx';
import { BUSINESS } from '../data/media.js';
import { isEmail, isPhone, required } from '../utils/format.js';
import { USE_MOCK, MOCK_MODE_NOTE } from '../services/api.js';

const SUBJECTS = ['General enquiry', 'Book a shipment', 'Track a shipment', 'Quotation follow-up', 'Business & bulk shipping', 'Report an issue'];

export default function Contact() {
  usePageTitle('Contact');
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!required(form.name)) errs.name = 'Your name is required.';
    if (!required(form.email) || !isEmail(form.email)) errs.email = 'A valid email is required.';
    if (form.phone && !isPhone(form.phone)) errs.phone = 'Phone number looks invalid.';
    if (!required(form.subject)) errs.subject = 'Choose a subject.';
    if (!required(form.message)) errs.message = 'Tell us how we can help.';
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setSubmitting(true);
    setSubmitError('');
    // In production this posts to POST /api/contact which emails deliveredbyzay@gmail.com.
    await new Promise((r) => setTimeout(r, 650));
    try {
      setSent(true);
    } catch {
      setSubmitError('Could not send your message. Please reach us on WhatsApp.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Talk to a real person."
        ghost="Talk"
        lead="Questions about a shipment, a quotation or shipping options? Reach us on WhatsApp, phone or email — or send a message below."
      />

      <Section className="bg-mist">
        <div className="shell grid gap-12 lg:grid-cols-[1fr_340px]">
          {/* Channels */}
          <Reveal>
            <div className="grid gap-5 sm:grid-cols-2">
              <a href={BUSINESS.whatsappLink} target="_blank" rel="noreferrer" className="card card-hover group p-7">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-ink text-brand transition-colors group-hover:bg-brand group-hover:text-ink">
                  <MessageCircle className="h-5 w-5" strokeWidth={1.75} />
                </span>
                <h2 className="mt-5 text-[22px]">WhatsApp</h2>
                <p className="mt-1.5 font-mono text-[13px] text-ink/60">{BUSINESS.whatsapp}</p>
                <p className="mt-3 text-[12.5px] text-ink/50">Fastest channel for shipment questions.</p>
              </a>
              <a href={`tel:${BUSINESS.phone}`} className="card card-hover group p-7">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-ink text-brand transition-colors group-hover:bg-brand group-hover:text-ink">
                  <Phone className="h-5 w-5" strokeWidth={1.75} />
                </span>
                <h2 className="mt-5 text-[22px]">Phone</h2>
                <p className="mt-1.5 font-mono text-[13px] text-ink/60">{BUSINESS.phone}</p>
                <p className="mt-3 text-[12.5px] text-ink/50">Call for urgent shipment matters.</p>
              </a>
              <a href={`mailto:${BUSINESS.email}`} className="card card-hover group p-7">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-ink text-brand transition-colors group-hover:bg-brand group-hover:text-ink">
                  <Mail className="h-5 w-5" strokeWidth={1.75} />
                </span>
                <h2 className="mt-5 text-[22px]">Email</h2>
                <p className="mt-1.5 font-mono text-[13px] text-ink/60">{BUSINESS.email}</p>
                <p className="mt-3 text-[12.5px] text-ink/50">Official business address and reply-to.</p>
              </a>
              <a href={BUSINESS.instagramLink} target="_blank" rel="noreferrer" className="card card-hover group p-7">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-ink text-brand transition-colors group-hover:bg-brand group-hover:text-ink">
                  <Instagram className="h-5 w-5" strokeWidth={1.75} />
                </span>
                <h2 className="mt-5 text-[22px]">Instagram</h2>
                <p className="mt-1.5 font-mono text-[13px] text-ink/60">{BUSINESS.instagram}</p>
                <p className="mt-3 text-[12.5px] text-ink/50">Updates, stories and shipping tips.</p>
              </a>
            </div>

            {/* Form */}
            <div className="mt-12">
              <SectionHeading
                eyebrow="Send a message"
                title="Or leave us a note."
              />
              {sent ? (
                <div className="card mt-8 p-8 text-center md:p-12">
                  <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-500" />
                  <h3 className="h-display mt-4 text-3xl">Message sent.</h3>
                  <p className="mx-auto mt-3 max-w-md text-[13.5px] text-ink/55">
                    Thank you, {form.name.split(' ')[0]}. We have your message and will reply to{' '}
                    <strong className="text-ink">{form.email}</strong>. For anything urgent, message
                    us on WhatsApp.
                  </p>
                  {USE_MOCK && <DemoBanner className="mt-8 text-left" note={MOCK_MODE_NOTE} />}
                </div>
              ) : (
                <form className="card mt-8 p-6 md:p-9" onSubmit={submit} noValidate>
                  {submitError && <ErrorState message={submitError} className="mb-6" />}
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Name" required error={errors.name}>
                      <TextInput value={form.name} onChange={set('name')} placeholder="Your full name" invalid={!!errors.name} />
                    </Field>
                    <Field label="Email" required error={errors.email}>
                      <TextInput type="email" value={form.email} onChange={set('email')} placeholder="you@email.com" invalid={!!errors.email} />
                    </Field>
                    <Field label="Phone" error={errors.phone}>
                      <TextInput value={form.phone} onChange={set('phone')} placeholder="08XX XXX XXXX" invalid={!!errors.phone} />
                    </Field>
                    <Field label="Subject" required error={errors.subject}>
                      <Select value={form.subject} onChange={set('subject')} placeholder="Choose a subject" options={SUBJECTS} invalid={!!errors.subject} />
                    </Field>
                    <div className="sm:col-span-2">
                      <Field label="Message" required error={errors.message}>
                        <Textarea rows={5} value={form.message} onChange={set('message')} placeholder="How can we help?" invalid={!!errors.message} />
                      </Field>
                    </div>
                  </div>
                  <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
                    {USE_MOCK ? (
                      <DemoBanner note="Demonstration mode — messages are not transmitted until the backend contact endpoint is connected." className="max-w-md" />
                    ) : (
                      <p className="text-[12px] text-ink/45">We reply to messages in the order received.</p>
                    )}
                    <button type="submit" className="btn-primary" disabled={submitting}>
                      {submitting ? 'Sending…' : 'Send message'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </Reveal>

          {/* Side panel */}
          <aside className="space-y-5">
            <Reveal delay={0.1}>
              <div className="card-dark p-7 text-white">
                <h3 className="text-[20px]">Drop-off locations</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-white/55">
                  We operate drop-off points in <strong className="text-white">Abuja</strong> and{' '}
                  <strong className="text-white">Lagos</strong>. Addresses and opening hours are
                  confirmed on request while the official details are being finalised.
                </p>
                <ul className="mt-5 space-y-2 font-mono text-[11.5px] text-white/50">
                  <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 bg-brand" /> Abuja drop-off point</li>
                  <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 bg-brand" /> Lagos drop-off point</li>
                </ul>
                <a href="/locations" className="btn-ghost-light btn-sm mt-6">View locations page</a>
              </div>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="card p-7">
                <h3 className="text-[20px]">Shipping from outside Lagos or Abuja?</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-ink/55">
                  Message us — we will advise on the best way to get your parcel into the DBZ
                  network, including package collection options.
                </p>
              </div>
            </Reveal>
          </aside>
        </div>
      </Section>
    </>
  );
}
