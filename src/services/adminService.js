// ============================================================
// DBZ admin service — dashboard statistics + customer management.
// Calls the real /api/admin/* endpoints (require_admin enforced
// server-side). Falls back to clearly-labelled sample data in
// demonstration mode (no backend configured).
// ============================================================

import { apiRequest, USE_MOCK } from './api.js';
import { MOCK_CUSTOMERS } from '../data/mock/mockData.js';

export async function getStats() {
  if (!USE_MOCK) return apiRequest('/api/admin/stats');
  // --- development mock ---
  return {
    customers: MOCK_CUSTOMERS.length,
    shipments: { total: 0, active: 0, delivered: 0 },
    bookings: { pending: 0, approved: 0 },
    quotes: { new: 0 },
    payments: { successful: 0, pending: 0, amountSuccessful: 0 },
  };
}

export async function getCustomers({ q = '', page = 1, limit = 100 } = {}) {
  if (!USE_MOCK) {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (q) params.set('q', q);
    return apiRequest(`/api/admin/customers?${params.toString()}`);
  }
  // --- development mock ---
  await new Promise((r) => setTimeout(r, 350));
  const needle = q.trim().toLowerCase();
  const rows = MOCK_CUSTOMERS.filter(
    (c) => !needle || c.name.toLowerCase().includes(needle) || c.email.toLowerCase().includes(needle),
  ).map((c, i) => ({
    id: c.id ?? `mock-${i}`,
    name: c.name,
    email: c.email,
    phone: c.phone || '',
    role: 'customer',
    city: c.city || '',
    joined: c.joined || null,
    shipments: c.shipments ?? 0,
    demo: true,
  }));
  return rows;
}
