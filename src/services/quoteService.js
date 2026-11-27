// ============================================================
// DBZ quotation service.
// No shipping rates are ever invented on the frontend. Quotations are
// reviewed and answered by administrators (backend-managed).
// ============================================================

import { apiRequest, USE_MOCK, MOCK_MODE_NOTE } from './api.js';
import { MOCK_QUOTES } from '../data/mock/mockData.js';
import { devStore } from '../data/mock/devStore.js';
import { generateRef } from '../utils/format.js';

export async function create(payload) {
  if (!USE_MOCK) {
    return apiRequest('/api/quotes', { method: 'POST', body: payload });
  }
  // --- development mock ---
  await new Promise((r) => setTimeout(r, 600));
  const quote = {
    id: `q-${Date.now().toString(36)}`,
    reference: generateRef('QTE'),
    status: 'New',
    createdAt: new Date().toISOString(),
    ...payload,
    source: 'dev',
    demo: true,
    note: MOCK_MODE_NOTE,
  };
  devStore.push('quotes', quote);
  return quote;
}

export async function listMine(email) {
  if (!USE_MOCK) return apiRequest('/api/quotes/mine');
  const dev = devStore.get('quotes', []).filter((q) => (email ? q.email === email : true));
  const sample = MOCK_QUOTES.filter((q) => (email ? q.email === email : true));
  return [...dev, ...sample];
}

export async function adminList() {
  if (!USE_MOCK) return apiRequest('/api/admin/quotes');
  const dev = devStore.get('quotes', []).map((q) => ({ ...q, source: 'dev' }));
  return [...dev, ...MOCK_QUOTES.map((q) => ({ ...q, source: 'sample' }))];
}

export async function adminRespond(id, message) {
  if (!USE_MOCK) {
    return apiRequest(`/api/admin/quotes/${encodeURIComponent(id)}/respond`, {
      method: 'POST',
      body: { message },
    });
  }
  const dev = devStore.get('quotes', []).find((q) => q.id === id);
  if (!dev) {
    return { demoOnly: true, message: 'Sample quotations are read-only demonstration records.' };
  }
  return devStore.update('quotes', id, { status: 'Responded', response: message });
}
