import { useState } from 'react';
import usePageTitle from '../../hooks/usePageTitle.js';
import { Field, TextInput, Textarea } from '../../components/Field.jsx';
import { DemoBanner } from '../../components/States.jsx';
import { BUSINESS } from '../../data/media.js';

const FIELDS = [
  { key: 'name', label: 'Business name', editable: false },
  { key: 'tagline', label: 'Tagline', editable: true },
  { key: 'slogan', label: 'Slogan', editable: true },
  { key: 'message', label: 'Marketing message', editable: true },
  { key: 'email', label: 'Official email', editable: false },
  { key: 'phone', label: 'Phone', editable: false },
  { key: 'whatsapp', label: 'WhatsApp', editable: false },
  { key: 'instagram', label: 'Instagram', editable: false },
  { key: 'coverage', label: 'Shipping coverage', editable: false },
];

export default function AdminContent() {
  usePageTitle('Website Content');
  const [values, setValues] = useState(() =>
    Object.fromEntries(FIELDS.map((f) => [f.key, BUSINESS[f.key]]))
  );
  const [saved, setSaved] = useState(false);

  return (
    <div className="space-y-6">
      <p className="max-w-2xl text-[13.5px] text-ink/55">
        Core brand copy used across the website. Editable fields update the local preview; locked
        fields (contact details) are managed as environment configuration.
      </p>

      {saved && (
        <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-[13px] text-emerald-700">
          Content saved locally. Production content management requires the backend content API.
        </p>
      )}

      <div className="card max-w-3xl p-7 md:p-9">
        <div className="grid gap-5 sm:grid-cols-2">
          {FIELDS.map((f) => (
            <div key={f.key} className={f.key === 'coverage' ? 'sm:col-span-2' : ''}>
              <Field label={f.label}>
                {f.key === 'coverage' ? (
                  <Textarea rows={2} value={values[f.key]} disabled className="opacity-60" />
                ) : (
                  <TextInput
                    value={values[f.key]}
                    disabled={!f.editable}
                    className={!f.editable ? 'opacity-60' : ''}
                    onChange={(e) => {
                      setValues((v) => ({ ...v, [f.key]: e.target.value }));
                      setSaved(false);
                    }}
                  />
                )}
              </Field>
            </div>
          ))}
        </div>
        <div className="mt-7 flex items-center gap-4">
          <button
            className="btn-primary"
            onClick={() => setSaved(true)}
          >
            Save content
          </button>
          <span className="text-[12px] text-ink/45">Brand identity fields stay locked to preserve consistency.</span>
        </div>
      </div>

      <DemoBanner note="The site intentionally avoids invented content — history, certifications, prices, addresses, hours and partnerships are only added once the business confirms them." />
    </div>
  );
}
