// ============================================================
// DBZ booking service.
// Mock mode creates clearly-labelled demonstration bookings stored in
// localStorage. The backend (POST /api/bookings) generates the real
// booking reference, saves it to PostgreSQL and emails the customer.
// ============================================================

import { apiRequest, USE_MOCK, MOCK_MODE_NOTE } from './api.js';
import { MOCK_BOOKINGS } from '../data/mock/mockData.js';
import { devStore } from '../data/mock/devStore.js';
import { generateRef } from '../utils/format.js';

export async function create(payload) {
  if (!USE_MOCK) {
    // The API expects snake_case tracking_mode.
    return apiRequest('/api/bookings', {
      method: 'POST',
      body: { ...payload, tracking_mode: payload.trackingMode || 'in_transit' },
    });
  }
  // --- development mock ---
  await new Promise((r) => setTimeout(r, 700));
  const booking = {
    id: `b-${Date.now().toString(36)}`,
    reference: generateRef('D3Z'),
    status: 'Pending Review',
    createdAt: new Date().toISOString(),
    customerEmail: payload.sender?.email || '',
    sender: payload.sender,
    receiver: payload.receiver,
    pkg: payload.pkg,
    trackingMode: payload.trackingMode || 'in_transit',
    source: 'dev',
    demo: true,
    note: MOCK_MODE_NOTE,
  };
  devStore.push('bookings', booking);
  return booking;
}

export async function listMine(email) {
  if (!USE_MOCK) return apiRequest('/api/bookings/mine');
  const dev = devStore
    .get('bookings', [])
    .filter((b) => (email ? b.customerEmail === email : true))
    .map((b) => ({ ...b, source: 'dev' }));
  const sample = MOCK_BOOKINGS.filter((b) => (email ? b.customerEmail === email : true)).map((b) => ({
    ...b,
    source: 'sample',
  }));
  return [...dev, ...sample];
}

export async function adminList() {
  if (!USE_MOCK) return apiRequest('/api/admin/bookings');
  const dev = devStore.get('bookings', []).map((b) => ({ ...b, source: 'dev' }));
  const sample = MOCK_BOOKINGS.map((b) => ({ ...b, source: 'sample' }));
  return [...dev, ...sample];
}

export async function adminSetStatus(id, status, rejectionReason = '') {
  if (!USE_MOCK) {
    return apiRequest(`/api/admin/bookings/${encodeURIComponent(id)}/status`, {
      method: 'POST',
      body: { status, rejection_reason: rejectionReason },
    });
  }
  // --- development mock ---
  const dev = devStore.get('bookings', []).find((b) => b.id === id);
  if (!dev) {
    return { demoOnly: true, message: 'Sample bookings are read-only demonstration records.' };
  }
  return devStore.update('bookings', id, { status, rejectionReason });
}
