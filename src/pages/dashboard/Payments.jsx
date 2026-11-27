import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AlertCircle, CheckCircle2, CreditCard, ExternalLink, Info, ShieldCheck } from 'lucide-react';
import usePageTitle from '../../hooks/usePageTitle.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { EmptyState, LoadingState, DemoBanner, ErrorState } from '../../components/States.jsx';
import {
  listMine,
  initialize,
  verify,
  canRetry,
  PAYMENT_STATUS_STYLES,
} from '../../services/paymentService.js';
import { USE_MOCK, MOCK_MODE_NOTE } from '../../services/api.js';
import { formatDateTime, formatMoney } from '../../utils/format.js';

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1 font-mono text-[10.5px] font-semibold ${
        PAYMENT_STATUS_STYLES[status] || 'bg-mist text-ink border-ink/15'
      }`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

const STATUS_HINTS = {
  Pending: 'Awaiting payment — click Pay Now to open the secure Paystack checkout.',
  Successful: 'Payment verified with Paystack. Nothing further is owed.',
  Failed: 'The payment attempt failed or was declined. You can retry below.',
  Abandoned: 'The checkout closed before payment. You can retry below.',
};

export default function Payments() {
  usePageTitle('Payments');
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [payments, setPayments] = useState(null);
  const [payingId, setPayingId] = useState(null); // prevents double submission
  const [actionError, setActionError] = useState('');
  const [result, setResult] = useState(null); // verification result banner

  // Paystack redirects back to /dashboard/payments?reference=<ref>
  const callbackReference = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get('reference') || params.get('trxref') || '';
  }, [location.search]);

  async function load() {
    try {
      const list = await listMine(user?.email);
      setPayments(list);
    } catch (err) {
      setPayments([]);
      setActionError(err.message || 'Could not load your payments.');
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.email]);

  // Auto-verify on return from Paystack (server-side verification — the
  // result page itself is NEVER treated as proof of payment).
  useEffect(() => {
    if (!callbackReference) return;
    (async () => {
      setActionError('');
      try {
        const res = await verify(callbackReference);
        setResult(res);
        await load();
      } catch (err) {
        setResult({
          verified: false,
          status: null,
          message: err.message || 'Verification failed — please contact support before retrying.',
        });
      } finally {
        // strip the callback query from the URL
        navigate('/dashboard/payments', { replace: true });
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callbackReference]);

  const startPayment = async (payment) => {
    if (payingId) return; // one checkout at a time — no accidental double pay
    setPayingId(payment.id);
    setActionError('');
    setResult(null);
    try {
      const res = await initialize(payment.id);
      if (!res?.authorization_url) {
        throw new Error('Paystack did not return a checkout URL. Please try again.');
      }
      // Redirect to the secure Paystack checkout page
      window.location.href = res.authorization_url;
    } catch (err) {
      setActionError(err.message || 'Could not start the payment. Please try again.');
      setPayingId(null);
    }
  };

  if (!payments) return <LoadingState label="Loading payments" />;

  return (
    <div className="space-y-6">
      <div className="card-dark relative overflow-hidden p-7 text-white md:p-8">
        <span className="ghost-word -bottom-6 right-4 text-[100px] text-white/[.05]" aria-hidden="true">
          Pay
        </span>
        <div className="relative z-10">
          <span className="eyebrow eyebrow--light">Payments</span>
          <h2 className="h-display mt-3 text-2xl md:text-3xl">Invoices &amp; secure checkout.</h2>
          <p className="mt-2 max-w-xl text-[13.5px] leading-relaxed text-white/55">
            Pay your DBZ invoices with Paystack. Every successful payment is verified
            server-to-server — the checkout page alone is never treated as proof of payment.
          </p>
          <p className="mt-3 inline-flex items-center gap-2 font-mono text-[10.5px] text-brand">
            <ShieldCheck className="h-3.5 w-3.5" /> Secured by Paystack · NGN
          </p>
        </div>
      </div>

      {USE_MOCK && <DemoBanner note={MOCK_MODE_NOTE} />}

      {/* Result of the return-from-Paystack verification */}
      {result && (
        <div
          role="status"
          className={`flex items-start gap-3 rounded-2xl border p-5 ${
            result.verified
              ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
              : 'border-brand/40 bg-brand/10 text-brand-deep'
          }`}
        >
          {result.verified ? (
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
          ) : (
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          )}
          <div>
            <p className="font-semibold">
              {result.verified ? 'Payment successful.' : 'Payment not completed.'}
            </p>
            <p className="mt-1 text-[13px] leading-relaxed">{result.message}</p>
            {result.reference && (
              <p className="mt-1.5 font-mono text-[11.5px]">Ref: {result.reference}</p>
            )}
          </div>
        </div>
      )}

      {actionError && <ErrorState message={actionError} />}

      {payments.length ? (
        <div className="space-y-4">
          {payments.map((p) => (
            <article key={`${p.id}-${p.reference}`} className="card p-6 md:p-7">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-mono text-[13.5px] font-bold">{p.reference}</p>
                  <p className="mt-1.5 text-[14px] font-semibold">
                    {formatMoney(p.amount, p.currency)}
                  </p>
                  {p.description && (
                    <p className="mt-1 max-w-lg text-[13px] leading-relaxed text-ink/55">{p.description}</p>
                  )}
                  <p className="mt-2 font-mono text-[10.5px] text-ink/40">
                    Invoice created {formatDateTime(p.created_at)}
                    {p.booking_reference ? ` · Booking ${p.booking_reference}` : ''}
                    {p.paid_at ? ` · Paid ${formatDateTime(p.paid_at)}` : ''}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-3">
                  <StatusBadge status={p.status} />
                  {p.status === 'Successful' ? (
                    <span className="inline-flex items-center gap-1.5 font-mono text-[10.5px] text-emerald-700">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Verified
                    </span>
                  ) : canRetry(p) ? (
                    <button
                      onClick={() => startPayment(p)}
                      disabled={payingId !== null}
                      className="btn-primary btn-sm"
                      aria-label={`Pay ${formatMoney(p.amount, p.currency)} for ${p.reference}`}
                    >
                      {payingId === p.id ? (
                        <>
                          <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-ink/30 border-t-ink" />
                          Opening checkout…
                        </>
                      ) : (
                        <>
                          <CreditCard className="h-3.5 w-3.5" />
                          {p.status === 'Pending' ? 'Pay Now' : 'Retry payment'}
                        </>
                      )}
                    </button>
                  ) : null}
                </div>
              </div>
              {p.status !== 'Successful' && (
                <p className="mt-4 flex items-start gap-2 border-t border-ink/5 pt-3 text-[12.5px] text-ink/50">
                  <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  {STATUS_HINTS[p.status] || STATUS_HINTS.Pending}
                </p>
              )}
            </article>
          ))}

          <p className="flex items-start gap-2 text-[12px] leading-relaxed text-ink/45">
            <ExternalLink className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            You will be redirected to the secure Paystack checkout page and returned here
            automatically. Statuses update only after server-side verification with Paystack.
            Need help with an invoice? <Link to="/contact" className="link-underline">Contact support</Link>.
          </p>
        </div>
      ) : (
        <EmptyState
          title="No payments yet"
          body="When the DBZ team approves your booking and issues an invoice, it appears here with a Pay Now button."
          action={<Link to="/dashboard/book" className="btn-primary btn-sm">Book a shipment</Link>}
        />
      )}
    </div>
  );
}
