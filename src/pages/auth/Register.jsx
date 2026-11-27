import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import usePageTitle from '../../hooks/usePageTitle.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { Field, TextInput, Checkbox } from '../../components/Field.jsx';
import { DemoBanner } from '../../components/States.jsx';
import { USE_MOCK, MOCK_MODE_NOTE } from '../../services/api.js';
import { isEmail, isPhone } from '../../utils/format.js';

export default function Register() {
  usePageTitle('Create Account');
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [agree, setAgree] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.name.trim()) errs.name = 'Full name is required.';
    if (!isEmail(form.email)) errs.email = 'A valid email is required.';
    if (form.phone && !isPhone(form.phone)) errs.phone = 'Phone number looks invalid.';
    if (form.password.length < 8) errs.password = 'Use at least 8 characters.';
    if (form.password !== form.confirm) errs.confirm = 'Passwords do not match.';
    if (!agree) errs.agree = 'Please accept the terms to continue.';
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setBusy(true);
    setError('');
    try {
      await register(form);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.message || 'Could not create your account.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <span className="eyebrow">Customer Registration</span>
      <h1 className="h-display mt-4 text-4xl md:text-5xl">Create your account.</h1>
      <p className="mt-3 text-[14px] text-ink/55">
        Ship smarter — booking history, tracking, quotes and notifications in one place.
      </p>

      {USE_MOCK && <DemoBanner className="mt-6" note={MOCK_MODE_NOTE} />}

      {error && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">
          {error}
        </div>
      )}

      <form className="mt-8 space-y-5" onSubmit={submit} noValidate>
        <Field label="Full name" required error={errors.name}>
          <TextInput value={form.name} onChange={set('name')} placeholder="Your full name" autoComplete="name" invalid={!!errors.name} />
        </Field>
        <Field label="Email" required error={errors.email}>
          <TextInput type="email" value={form.email} onChange={set('email')} placeholder="you@email.com" autoComplete="email" invalid={!!errors.email} />
        </Field>
        <Field label="Phone" error={errors.phone}>
          <TextInput value={form.phone} onChange={set('phone')} placeholder="08XX XXX XXXX" autoComplete="tel" invalid={!!errors.phone} />
        </Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Password" required error={errors.password}>
            <TextInput type="password" value={form.password} onChange={set('password')} placeholder="At least 8 characters" autoComplete="new-password" invalid={!!errors.password} />
          </Field>
          <Field label="Confirm password" required error={errors.confirm}>
            <TextInput type="password" value={form.confirm} onChange={set('confirm')} placeholder="Repeat password" autoComplete="new-password" invalid={!!errors.confirm} />
          </Field>
        </div>
        <div>
          <Checkbox
            label="I agree to the terms of service and privacy policy."
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
          />
          {errors.agree && <p className="field-error">{errors.agree}</p>}
        </div>
        <button type="submit" className="btn-primary w-full" disabled={busy}>
          {busy ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      <p className="mt-8 text-center text-[13.5px] text-ink/55">
        Already have an account?{' '}
        <Link to="/login" className="link-underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
