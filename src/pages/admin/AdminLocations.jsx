import { useState } from 'react';
import usePageTitle from '../../hooks/usePageTitle.js';
import { Field, TextInput } from '../../components/Field.jsx';
import { DemoBanner } from '../../components/States.jsx';
import { MOCK_LOCATIONS } from '../../data/mock/mockData.js';

export default function AdminLocations() {
  usePageTitle('Manage Drop-off Locations');
  const [locations, setLocations] = useState(
    MOCK_LOCATIONS.map((l) => ({ ...l, addressInput: l.address === '[Official Abuja address to be confirmed]' || l.address === '[Official Lagos address to be confirmed]' ? '' : l.address, hoursInput: l.hours === '[Opening hours to be confirmed]' ? '' : l.hours }))
  );
  const [saved, setSaved] = useState(false);

  const set = (id, key, value) =>
    setLocations((list) => list.map((l) => (l.id === id ? { ...l, [key]: value } : l)));

  return (
    <div className="space-y-6">
      <p className="max-w-2xl text-[13.5px] text-ink/55">
        The website currently shows editable placeholders for addresses and opening hours. Fill in
        the official details here — in production these persist to the{' '}
        <span className="font-mono">dropoff_locations</span> table and update the Locations page.
      </p>

      {saved && (
        <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-[13px] text-emerald-700">
          Location details saved locally (development store). Connect the backend to publish.
        </p>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {locations.map((loc) => (
          <div key={loc.id} className="card p-7">
            <h3 className="text-[22px]">{loc.name}</h3>
            <div className="mt-5 grid gap-5">
              <Field label="Address">
                <TextInput value={loc.addressInput} onChange={(e) => set(loc.id, 'addressInput', e.target.value)} placeholder="Street, area, city" />
              </Field>
              <Field label="Opening hours">
                <TextInput value={loc.hoursInput} onChange={(e) => set(loc.id, 'hoursInput', e.target.value)} placeholder="e.g. Mon–Sat, 9:00–18:00" />
              </Field>
              <Field label="Contact">
                <TextInput value="08149748188 · deliveredbyzay@gmail.com" disabled className="opacity-60" />
              </Field>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <button
          className="btn-primary"
          onClick={() => setSaved(true)}
        >
          Save location details
        </button>
        <span className="text-[12px] text-ink/45">Nothing is published until the backend is connected.</span>
      </div>

      <DemoBanner note="Placeholder-first by design: no invented addresses or hours appear anywhere on the public site." />
    </div>
  );
}
