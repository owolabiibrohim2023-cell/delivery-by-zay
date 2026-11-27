import { useState } from 'react';
import usePageTitle from '../../hooks/usePageTitle.js';
import { Select, TextInput, Field } from '../../components/Field.jsx';
import { DemoBanner } from '../../components/States.jsx';
import { COUNTRIES, flagEmoji, REGIONS } from '../../data/countries.js';
import { MOCK_MANAGED_DESTINATIONS } from '../../data/mock/mockData.js';

export default function AdminDestinations() {
  usePageTitle('Manage Destinations');
  const [items, setItems] = useState(MOCK_MANAGED_DESTINATIONS);
  const [draft, setDraft] = useState({ code: '', region: 'Europe', featured: false });
  const [error, setError] = useState('');

  const add = (e) => {
    e.preventDefault();
    setError('');
    const exists = items.find((d) => d.code === draft.code);
    if (!draft.code) {
      setError('Choose a country.');
      return;
    }
    if (exists) {
      setError('This destination is already managed.');
      return;
    }
    const country = COUNTRIES.find(([code]) => code === draft.code);
    setItems((list) => [
      ...list,
      {
        id: `d-${draft.code.toLowerCase()}-${Date.now().toString(36)}`,
        code: draft.code,
        name: country?.[1] || draft.code,
        region: draft.region,
        featured: draft.featured,
        active: true,
        source: 'dev',
      },
    ]);
    setDraft({ code: '', region: 'Europe', featured: false });
  };

  const toggle = (id, key) =>
    setItems((list) => list.map((d) => (d.id === id ? { ...d, [key]: !d[key] } : d)));

  return (
    <div className="space-y-6">
      <p className="max-w-2xl text-[13.5px] text-ink/55">
        Curate which destinations appear prominently on the website. The destination database lives
        in PostgreSQL (table: <span className="font-mono">destinations</span>) in production.
      </p>

      <form className="card flex flex-wrap items-end gap-4 p-6" onSubmit={add}>
        <div className="w-64">
          <Field label="Add destination">
            <Select value={draft.code} onChange={(e) => setDraft((d) => ({ ...d, code: e.target.value }))} placeholder="Select country">
              {COUNTRIES.map(([code, name]) => (
                <option key={code} value={code}>{flagEmoji(code)} {name}</option>
              ))}
            </Select>
          </Field>
        </div>
        <div className="w-48">
          <Field label="Region">
            <Select value={draft.region} onChange={(e) => setDraft((d) => ({ ...d, region: e.target.value }))} options={REGIONS} />
          </Field>
        </div>
        <label className="flex items-center gap-2 pb-3 text-[13px] font-medium text-ink/60">
          <input type="checkbox" className="h-4 w-4 accent-brand" checked={draft.featured} onChange={(e) => setDraft((d) => ({ ...d, featured: e.target.checked }))} />
          Featured
        </label>
        <button className="btn-primary btn-sm">Add destination</button>
        {error && <p className="field-error pb-2">{error}</p>}
      </form>

      <div className="card overflow-hidden">
        <table className="w-full text-left text-[13.5px]">
          <thead>
            <tr className="border-b border-ink/10 bg-mist/60">
              {['Country', 'Region', 'Featured', 'Active', ''].map((h) => (
                <th key={h} className="px-5 py-3 font-sans text-[11px] font-semibold text-ink/50">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((d) => (
              <tr key={d.id} className="border-b border-ink/5 last:border-0">
                <td className="px-5 py-3.5">
                  <span className="mr-2">{flagEmoji(d.code)}</span>
                  <span className="font-semibold">{d.name}</span>
                </td>
                <td className="px-5 py-3.5 text-ink/55">{d.region}</td>
                <td className="px-5 py-3.5">
                  <button
                    onClick={() => toggle(d.id, 'featured')}
                    className={`h-6 w-11 rounded-full transition-colors ${d.featured ? 'bg-brand' : 'bg-ink/15'}`}
                    aria-label="Toggle featured"
                  >
                    <span className={`block h-4 w-4 rounded-full bg-white shadow transition-transform ${d.featured ? 'translate-x-7' : 'translate-x-1'}`} />
                  </button>
                </td>
                <td className="px-5 py-3.5">
                  <button
                    onClick={() => toggle(d.id, 'active')}
                    className={`h-6 w-11 rounded-full transition-colors ${d.active ? 'bg-ink' : 'bg-ink/15'}`}
                    aria-label="Toggle active"
                  >
                    <span className={`block h-4 w-4 rounded-full bg-white shadow transition-transform ${d.active ? 'translate-x-7' : 'translate-x-1'}`} />
                  </button>
                </td>
                <td className="px-5 py-3.5 text-right font-mono text-[10px] text-ink/35">{d.source || 'sample'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <DemoBanner note="Destination management updates local state only during development. Production changes persist via the backend admin API." />
    </div>
  );
}
