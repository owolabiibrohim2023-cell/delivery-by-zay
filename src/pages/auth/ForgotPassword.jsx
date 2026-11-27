import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MailCheck } from 'lucide-react';
import usePageTitle from '../../hooks/usePageTitle.js';
import { forgotPassword } from '../../services/authService.js';
import { Field, TextInput } from '../../components/Field.jsx';
import { isEmail } from '../../utils/format.js';

export default function ForgotPassword() {
  usePageTitle('Password Recovery');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    if (!isEmail(email)) {
      setError('Enter a valid email address.');
      return;
    }
    setError('');
    setBusy(true);
    try {
      const res = await forgotPassword(email);
      setSent(res.message || 'If an account exists for this email, a reset link has been sent.');
    } catch (err) {
      setError(err.message || 'Could not process the request.');
    } finally {
      setBusy(false);
    }
  };

  if (sent) {
    return (
      <div className="text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand/20">
          <MailCheck className="h-7 w-7 text-brand-deep" />
        </span>
        <h1 className="h-display mt-6 text-4xl">Check your email.</h1>
        <p className="mx-auto mt-4 max-w-sm text-[14px] leading-relaxed text-ink/55">{sent}</p>
        <Link to="/login" className="btn-primary mt-8">
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <div>
      <span className="eyebrow">Password Recovery</span>
      <h1 className="h-display mt-4 text-4xl md:text-5xl">Reset your password.</h1>
      <p className="mt-3 text-[14px] text-ink/55">
        Enter the email on your DBZ account and we will send reset instructions.
      </p>
      {error && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">
          {error}
        </div>
      )}
      <form className="mt-8 space-y-5" onSubmit={submit} noValidate>
        <Field label="Email" required error={error}>
          <TextInput
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            autoComplete="email"
          />
        </Field>
        <button type="submit" className="btn-primary w-full" disabled={busy}>
          {busy ? 'Sending…' : 'Send reset link'}
        </button>
      </form>
      <p className="mt-8 text-center text-[13.5px] text-ink/55">
        Remembered it after all?{' '}
        <Link to="/login" className="link-underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
