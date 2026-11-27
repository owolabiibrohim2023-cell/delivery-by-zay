import { useEffect, useState } from 'react';
import usePageTitle from '../../hooks/usePageTitle.js';
import { healthCheck, API_BASE_URL, USE_MOCK } from '../../services/api.js';
import { DemoBanner } from '../../components/States.jsx';

export default function AdminSettings() {
  usePageTitle('Admin Settings');
  const [health, setHealth] = useState(null);
  const [checking, setChecking] = useState(false);

  const check = async () => {
    setChecking(true);
    const res = await healthCheck();
    setHealth(res);
    setChecking(false);
  };

  useEffect(() => {
    check();
  }, []);

  const status = health?.status;
  const color =
    status === 'ok' ? 'text-emerald-600 border-emerald-300 bg-emerald-50'
    : status === 'mock' ? 'text-brand-deep border-brand/40 bg-brand/10'
    : 'text-red-600 border-red-300 bg-red-50';

  return (
    <div className="space-y-6">
      {/* API connection */}
      <section className="card p-7 md:p-9">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-[20px]">Backend connection</h3>
            <p className="mt-1.5 text-[13px] text-ink/50">
              Frontend API service layer status against the FastAPI health endpoint.
            </p>
          </div>
          <button className="btn-outline btn-sm" onClick={check} disabled={checking}>
            {checking ? 'Checking…' : 'Re-check'}
          </button>
        </div>
        <div className={`mt-6 rounded-xl border px-5 py-4 ${color}`}>
          <p className="font-mono text-[12px] font-semibold">
            {status === 'ok'
              ? 'Connected — DBZ Logistics API healthy'
              : status === 'mock'
                ? 'Demonstration mode — no backend URL configured'
                : checking
                  ? 'Checking…'
                  : 'Backend unreachable'}
          </p>
          <p className="mt-1 font-mono text-[11px] text-ink/50">
            service: {health?.service || '—'} {API_BASE_URL ? `· base: ${API_BASE_URL}` : ''}
          </p>
        </div>
        <div className="mt-6 rounded-xl bg-mist p-5 font-mono text-[11.5px] leading-relaxed text-ink/60">
          <p className="font-bold text-ink/45">Environment</p>
          <p className="mt-2">VITE_API_BASE_URL = {API_BASE_URL || '(empty — mock mode)'}</p>
          <p>Expected health response: {'{"status":"ok","service":"DBZ Logistics API"}'}</p>
          <p className="mt-2 text-ink/45">
            Set VITE_API_BASE_URL in frontend/.env to switch every service from mock data to live
            FastAPI endpoints.
          </p>
        </div>
      </section>

      {/* Platform settings */}
      <section className="card p-7 md:p-9">
        <h3 className="text-[20px]">Platform settings</h3>
        <ul className="mt-5 divide-y divide-ink/5 text-[13.5px]">
          {[
            ['Payments', 'Paystack prepared — not active until business credentials are configured server-side.'],
            ['Carrier integrations', 'Admin-managed tracking + external carrier tracking links. Direct API integration pending.'],
            ['Email notifications', 'Backend SMTP preparation — all secrets stay server-side.'],
            ['Admin security', 'Frontend route guard is UX only. Authorization is enforced by FastAPI + JWT roles.'],
            ['Database', 'PostgreSQL via Supabase — SQLAlchemy models and Alembic migrations prepared.'],
          ].map(([title, body]) => (
            <li key={title} className="flex items-start justify-between gap-6 py-4">
              <div>
                <p className="font-semibold">{title}</p>
                <p className="mt-0.5 text-[12.5px] text-ink/50">{body}</p>
              </div>
              <span className="shrink-0 rounded-full border border-ink/15 px-3 py-1 font-mono text-[10px] font-semibold text-ink/50">
                Prepared
              </span>
            </li>
          ))}
        </ul>
      </section>

      {USE_MOCK && <DemoBanner note="You are viewing the admin panel with development mock data. Demo account: admin@d3z.test / admin123" />}
    </div>
  );
}
