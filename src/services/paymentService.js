// ============================================================
// DBZ payment service — Paystack (secure redirect flow).
//
// The frontend NEVER sends amounts and NEVER verifies payments by itself:
//  • initialize()  → POST /api/payments/initialize with the payment id only.
//    The backend takes the trusted amount from its own database record,
//    converts NGN → kobo and returns the Paystack authorization URL.
//  • verify()      → GET /api/payments/verify/{reference}. The backend
//    re-verifies with Paystack (status + amount + currency) before a
//    payment is ever marked Successful.
//  • Webhooks are handled entirely on the backend (HMAC SHA512).
//
// Requires VITE_API_BASE_URL to point at the FastAPI backend with
// PAYSTACK_SECRET_KEY + PAYMENTS_ENABLED=true configured server-side.
// There is deliberately NO mock success path — fake verification is never
// simulated. Mock mode only shows clearly-labelled sample invoices.
// ============================================================

import { apiRequest, USE_MOCK } from './api.js';

export const PAYMENT_STATUSES = ['Pending', 'Successful', 'Failed', 'Abandoned'];

export const PAYMENT_STATUS_STYLES = {
  Pending: 'bg-brand/15 text-ink border-brand/50',
  Successful: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  Failed: 'bg-red-50 text-red-700 border-red-300',
  Abandoned: 'bg-mist text-ink/60 border-ink/15',
};

const SAMPLE_PAYMENTS = [
  {
    id: 901,
    reference: 'DBZ-PAY-SAMPLE1',
    booking_reference: 'D3Z-BK-4471',
    description: 'Air freight — Lagos → London, 4.5 kg carton (sample invoice)',
    user_email: 'demo@d3z.test',
    amount: 185000,
    currency: 'NGN',
    status: 'Pending',
    paid_at: null,
    created_at: '2026-11-18T15:10:00',
  },
  {
    id: 902,
    reference: 'DBZ-PAY-SAMPLE2',
    booking_reference: 'D3Z-BK-4302',
    description: 'Ocean consolidation — Houston, 9 pieces (sample invoice)',
    user_email: 'demo@d3z.test',
    amount: 620000,
    currency: 'NGN',
    status: 'Successful',
    paid_at: '2026-11-10T09:32:00',
    created_at: '2026-11-09T17:00:00',
  },
  {
    id: 903,
    reference: 'DBZ-PAY-SAMPLE3',
    booking_reference: 'D3Z-BK-4389',
    description: 'Air freight — Abuja → Dubai, 6 pieces (sample invoice)',
    user_email: 'demo@d3z.test',
    amount: 410500,
    currency: 'NGN',
    status: 'Abandoned',
    paid_at: null,
    created_at: '2026-11-06T12:45:00',
  },
];

function requireBackend() {
  throw new Error(
    'Payments require the DBZ backend. Set VITE_API_BASE_URL to your API and configure Paystack keys on the server.'
  );
}

/** List the signed-in customer's payments. */
export async function listMine(email) {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 250));
    return SAMPLE_PAYMENTS.filter((p) => !email || p.user_email === email).map((p) => ({
      ...p,
      source: 'sample',
    }));
  }
  return apiRequest('/api/payments/mine');
}

/**
 * Initialize a Paystack checkout for a trusted payment record.
 * Sends ONLY the payment id — the backend supplies the amount.
 * Returns { authorization_url, reference, amount, currency }.
 */
export async function initialize(paymentId) {
  if (USE_MOCK) requireBackend();
  return apiRequest('/api/payments/initialize', {
    method: 'POST',
    body: { payment_id: paymentId },
  });
}

/** Server-side verification for a Paystack reference (idempotent). */
export async function verify(reference) {
  if (USE_MOCK) requireBackend();
  return apiRequest(`/api/payments/verify/${encodeURIComponent(reference)}`);
}

/** Admin: list all payment records. */
export async function adminList() {
  if (USE_MOCK) return SAMPLE_PAYMENTS.map((p) => ({ ...p, source: 'sample' }));
  return apiRequest('/api/payments');
}

/** Admin: create a trusted payment record (invoice) with a server-side amount. */
export async function adminCreate(payload) {
  if (USE_MOCK) requireBackend();
  return apiRequest('/api/payments', { method: 'POST', body: payload });
}

export function canRetry(payment) {
  return ['Pending', 'Failed', 'Abandoned'].includes(payment?.status);
}
