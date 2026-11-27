// ============================================================
// DBZ notification service.
// Backend will deliver registration, password reset, booking, quotation
// and shipment status notifications via SMTP (deliveredbyzay@gmail.com).
// All email secrets stay on the backend — never in the frontend env.
// ============================================================

import { apiRequest, USE_MOCK } from './api.js';
import { MOCK_NOTIFICATIONS } from '../data/mock/mockData.js';
import { devStore } from '../data/mock/devStore.js';

export async function listFor(email) {
  if (!USE_MOCK) return apiRequest('/api/notifications/mine');
  const dev = devStore
    .get('admin_notifications', [])
    .filter((n) => !n.audience || n.audience === 'all' || n.audience === email);
  const sample = MOCK_NOTIFICATIONS.filter(
    (n) => n.audience === 'all' || n.audience === email
  );
  return [...dev, ...sample].sort((a, b) => new Date(b.date) - new Date(a.date));
}

export function unreadCount(list = []) {
  return list.filter((n) => !n.read).length;
}

export async function markRead(id) {
  if (!USE_MOCK) {
    return apiRequest(`/api/notifications/${encodeURIComponent(id)}/read`, { method: 'POST' });
  }
  const dev = devStore.get('dev_notifications_read', []);
  if (!dev.includes(id)) devStore.set('dev_notifications_read', [...dev, id]);
  return { ok: true };
}

export function appliedReadState(list = []) {
  const read = devStore.get('dev_notifications_read', []);
  return list.map((n) => ({ ...n, read: n.read || read.includes(n.id) }));
}

export async function adminSend({ audience = 'all', title, body }) {
  if (!USE_MOCK) {
    return apiRequest('/api/admin/notifications', { method: 'POST', body: { audience, title, body } });
  }
  // --- development mock ---
  const notification = {
    id: `n-${Date.now().toString(36)}`,
    title,
    body: `${body} (Sent from admin panel — demonstration mode)`,
    date: new Date().toISOString(),
    read: false,
    audience,
    source: 'dev',
  };
  devStore.push('admin_notifications', notification);
  return {
    ...notification,
    deliveryNote:
      'Queued locally in demonstration mode. Email delivery requires backend SMTP configuration.',
  };
}
