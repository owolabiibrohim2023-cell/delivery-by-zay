import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import usePageTitle from '../../hooks/usePageTitle.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { Field, TextInput, Checkbox } from '../../components/Field.jsx';
import { DemoBanner } from '../../components/States.jsx';
import { changePassword } from '../../services/authService.js';
import { USE_MOCK, MOCK_MODE_NOTE } from '../../services/api.js';

export default function AccountSettings() {
  usePageTitle('Account Settings');
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [pw, setPw] = useState({ current: '', next: '', confirm: '' });
  const [pwErrors, setPwErrors] = useState({});
  const [pwBusy, setPwBusy] = useState(false);
  const [pwSaved, setPwSaved] = useState(false);
  const [prefs, setPrefs] = useState({ statusUpdates: true, quotes: true, marketing: false });

  const changePw = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!pw.current) errs.current = 'Enter your current password.';
    if (pw.next.length < 8) errs.next = 'Use at least 8 characters.';
    if (pw.next !== pw.confirm) errs.confirm = 'Passwords do not match.';
    setPwErrors(errs);
    if (Object.keys(errs).length) return;

    setPwBusy(true);
    try {
      await changePassword({ currentPassword: pw.current, newPassword: pw.next });
      setPwSaved(true);
      setPw({ current: '', next: '', confirm: '' });
    } catch (err) {
      setPwErrors({ form: err.message });
    } finally {
      setPwBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Notification preferences */}
      <section className="card p-7 md:p-9">
        <h3 className="text-[20px]">Notification preferences</h3>
        <p className="mt-1.5 text-[13px] text-ink/50">
          Choose what DBZ notifies you about. Email delivery activates with the backend.
        </p>
        <div className="mt-5 space-y-4">
          {[
            ['statusUpdates', 'Shipment status updates', 'Booking, transit, customs and delivery milestones.'],
            ['quotes', 'Quotation responses', 'When the team replies to a quote request.'],
            ['marketing', 'Offers and news', 'Occasional updates about DBZ services.'],
          ].map(([key, title, body]) => (
            <div key={key} className="flex items-start justify-between gap-4 border-b border-ink/5 pb-4 last:border-0 last:pb-0">
              <div>
                <p className="text-[14px] font-semibold">{title}</p>
                <p className="mt-0.5 text-[12.5px] text-ink/50">{body}</p>
              </div>
              <Checkbox
                label=""
                checked={prefs[key]}
                onChange={(e) => setPrefs((p) => ({ ...p, [key]: e.target.checked }))}
              />
            </div>
          ))}
        </div>
        <p className="mt-5 font-mono text-[10.5px] text-ink/40">
          Preferences stored locally in demonstration mode.
        </p>
      </section>

      {/* Password */}
      <section className="card p-7 md:p-9">
        <h3 className="text-[20px]">Change password</h3>
        <p className="mt-1.5 text-[13px] text-ink/50">
          Signed in as <strong className="text-ink">{user?.email}</strong>
        </p>
        <form className="mt-6 grid max-w-lg gap-5" onSubmit={changePw} noValidate>
          <Field label="Current password" required error={pwErrors.current}>
            <TextInput type="password" value={pw.current} onChange={(e) => setPw((p) => ({ ...p, current: e.target.value }))} autoComplete="current-password" />
          </Field>
          <Field label="New password" required error={pwErrors.next}>
            <TextInput type="password" value={pw.next} onChange={(e) => setPw((p) => ({ ...p, next: e.target.value }))} autoComplete="new-password" />
          </Field>
          <Field label="Confirm new password" required error={pwErrors.confirm}>
            <TextInput type="password" value={pw.confirm} onChange={(e) => setPw((p) => ({ ...p, confirm: e.target.value }))} autoComplete="new-password" />
          </Field>
          {pwErrors.form && <p className="field-error">{pwErrors.form}</p>}
          {pwSaved && (
            <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-[13px] text-emerald-700">
              Password updated.
            </p>
          )}
          <div>
            <button className="btn-primary" disabled={pwBusy}>
              {pwBusy ? 'Updating…' : 'Update password'}
            </button>
          </div>
        </form>
        {USE_MOCK && <DemoBanner className="mt-6" note={MOCK_MODE_NOTE} />}
      </section>

      {/* Danger zone */}
      <section className="card border-red-200 p-7 md:p-9">
        <h3 className="text-[20px]">Sign out</h3>
        <p className="mt-1.5 text-[13px] text-ink/50">End your session on this device.</p>
        <button
          className="btn-outline mt-5 border-red-300 text-red-600 hover:border-red-500 hover:bg-red-500 hover:text-white"
          onClick={() => {
            logout();
            navigate('/');
          }}
        >
          Log out
        </button>
      </section>
    </div>
  );
}
