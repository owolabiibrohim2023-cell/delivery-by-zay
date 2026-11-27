import { useState } from 'react';
import usePageTitle from '../../hooks/usePageTitle.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { Field, TextInput, Select } from '../../components/Field.jsx';
import { isPhone } from '../../utils/format.js';

const NG_STATES = ['Lagos','FCT (Abuja)','Rivers','Ogun','Oyo','Kano','Enugu','Abia','Anambra','Delta','Edo','Kaduna','Plateau','Other'];

export default function Profile() {
  usePageTitle('My Profile');
  const { user, updateLocalUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    city: user?.city || '',
    state: '',
  });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required.';
    if (form.phone && !isPhone(form.phone)) errs.phone = 'Phone number looks invalid.';
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setBusy(true);
    setSaved(false);
    const { updateProfile } = await import('../../services/authService.js');
    try {
      const updated = await updateProfile({ name: form.name, phone: form.phone, city: form.city });
      updateLocalUser(updated);
      setSaved(true);
    } catch (err) {
      setErrors({ form: err.message });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="card-dark flex items-center gap-5 p-7 text-white">
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand font-display text-2xl text-ink">
          {(user?.name || 'U').slice(0, 1).toUpperCase()}
        </span>
        <div>
          <h2 className="h-display text-2xl">{user?.name}</h2>
          <p className="mt-1 text-[13px] text-white/55">{user?.email}</p>
          <p className="mt-1 font-mono text-[10px] text-brand">
            {user?.role === 'admin' ? 'Administrator' : 'Customer account'}
          </p>
        </div>
      </div>

      <form className="card p-7 md:p-9" onSubmit={submit} noValidate>
        <h3 className="text-[20px]">Profile details</h3>
        <p className="mt-1.5 text-[13px] text-ink/50">
          Keep your contact details current — shipment updates use them.
        </p>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <Field label="Full name" required error={errors.name}>
            <TextInput value={form.name} onChange={set('name')} />
          </Field>
          <Field label="Email" hint="Email changes require support — contact us.">
            <TextInput value={form.email} disabled className="opacity-60" />
          </Field>
          <Field label="Phone" error={errors.phone}>
            <TextInput value={form.phone} onChange={set('phone')} placeholder="08XX XXX XXXX" />
          </Field>
          <Field label="City">
            <TextInput value={form.city} onChange={set('city')} placeholder="City" />
          </Field>
          <Field label="State">
            <Select value={form.state} onChange={set('state')} placeholder="Select state" options={NG_STATES} />
          </Field>
        </div>
        {errors.form && <p className="field-error mt-4">{errors.form}</p>}
        {saved && (
          <p className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-[13px] text-emerald-700">
            Profile saved.
          </p>
        )}
        <div className="mt-7">
          <button className="btn-primary" disabled={busy}>
            {busy ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
