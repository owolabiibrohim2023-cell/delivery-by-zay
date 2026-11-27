import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import usePageTitle from '../../hooks/usePageTitle.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { Field, TextInput, Checkbox } from '../../components/Field.jsx';
import { DemoBanner } from '../../components/States.jsx';
import { DEV_ACCOUNTS } from '../../services/authService.js';
import { USE_MOCK } from '../../services/api.js';

export default function Login() {
  usePageTitle('Customer Login');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const from = location.state?.from || null;
  const reason = location.state?.reason;

  const submit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.email) errs.email = 'Email is required.';
    if (!form.password) errs.password = 'Password is required.';
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setBusy(true);
    setError('');
    try {
      const user = await login(form);
      navigate(user.role === 'admin' ? '/admin' : from || '/dashboard', { replace: true });
    } catch (err) {
      setError(err.message || 'Could not sign you in.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <span className="eyebrow">Customer Login</span>
      <h1 className="h-display mt-4 text-4xl md:text-5xl">Welcome back.</h1>
      <p className="mt-3 text-[14px] text-ink/55">
        {reason === 'admin'
          ? 'Admin access is required for that page.'
          : 'Sign in to manage shipments, quotes and notifications.'}
      </p>

      {USE_MOCK && (
        <DemoBanner
          className="mt-6"
          note={`Development accounts — customer: ${DEV_ACCOUNTS[0].email} / ${DEV_ACCOUNTS[0].password} · admin: ${DEV_ACCOUNTS[1].email} / ${DEV_ACCOUNTS[1].password}`}
        />
      )}

      {error && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">
          {error}
        </div>
      )}

      <form className="mt-8 space-y-5" onSubmit={submit} noValidate>
        <Field label="Email" required error={errors.email}>
          <TextInput
            type="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            placeholder="you@email.com"
            autoComplete="email"
            invalid={!!errors.email}
          />
        </Field>
        <Field label="Password" required error={errors.password}>
          <div className="relative">
            <TextInput
              type={show ? 'text' : 'password'}
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              placeholder="••••••••"
              autoComplete="current-password"
              className="pr-12"
              invalid={!!errors.password}
            />
            <button
              type="button"
              onClick={() => setShow((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-2 text-ink/40 hover:text-ink"
              aria-label={show ? 'Hide password' : 'Show password'}
            >
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </Field>
        <div className="flex items-center justify-between">
          <Checkbox label="Remember me" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
          <Link to="/forgot-password" className="text-[13px] font-semibold text-ink/60 underline decoration-brand underline-offset-4 hover:text-ink">
            Forgot password?
          </Link>
        </div>
        <button type="submit" className="btn-primary w-full" disabled={busy}>
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <p className="mt-8 text-center text-[13.5px] text-ink/55">
        New to DBZ?{' '}
        <Link to="/register" className="link-underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}
