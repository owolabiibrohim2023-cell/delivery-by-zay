// ============================================================
// DBZ shipment & tracking service.
// Admin-managed tracking first; external carrier tracking links are
// provided for DHL / UPS / FedEx / Aramex. Direct carrier API
// integration is NOT implemented yet and is never claimed.
// ============================================================

import { apiRequest, USE_MOCK, ApiError } from './api.js';
import { MOCK_SHIPMENTS, SHIPMENT_STATUSES } from '../data/mock/mockData.js';
import { devStore } from '../data/mock/devStore.js';
import { generateRef } from '../utils/format.js';

export { SHIPMENT_STATUSES };

export const CARRIER_LINKS = [
  { name: 'DHL', url: (n) => `https://www.dhl.com/en/express/tracking.html?AWB=${encodeURIComponent(n)}&brand=DHL` },
  { name: 'UPS', url: (n) => `https://www.ups.com/track?tracknum=${encodeURIComponent(n)}` },
  { name: 'FedEx', url: (n) => `https://www.fedex.com/fedextrack/?trknbr=${encodeURIComponent(n)}` },
  { name: 'Aramex', url: (n) => `https://www.aramex.com/track/track-shipping-results?shipmentNumber=${encodeURIComponent(n)}` },
];

function allMockShipments() {
  // Sample records + shipments created through the dev admin tools.
  const created = devStore.get('admin_shipments', []).map((s) => ({ ...s, source: 'dev-admin' }));
  return [...created, ...MOCK_SHIPMENTS.map((s) => ({ ...s, source: 'sample' }))];
}

function normalize(number) {
  return String(number || '').trim().toUpperCase().replace(/\s+/g, '');
}

export const TRACKING_MODES = [
  {
    value: 'in_transit',
    title: 'In-Transit Tracking',
    body: 'Milestone updates posted by the DBZ team — active here once payment is confirmed.',
  },
  {
    value: 'courier',
    title: 'Courier Tracking',
    body: "Track on the carrier's own portal (DHL, UPS, Aramex, FedEx) after handover.",
  },
];

export async function track(trackingNumber, mode = 'in_transit') {
  if (!USE_MOCK) {
    return apiRequest(
      `/api/shipments/track/${encodeURIComponent(trackingNumber)}?mode=${encodeURIComponent(mode)}`,
    );
  }
  // --- development mock ---
  await new Promise((r) => setTimeout(r, 550)); // simulate network latency
  const needle = normalize(trackingNumber);
  const found = allMockShipments().find((s) => normalize(s.trackingNumber) === needle);
  if (!found) {
    throw new Error(
      `No shipment found for "${trackingNumber}" in the demonstration dataset. Try a sample number such as DBZ-DEMO-001.`
    );
  }
  // Payment gate — no active tracking process before payment is verified.
  if (found.paid === false) {
    throw new ApiError(
      'Payment pending — active tracking starts as soon as your payment is confirmed. Pay from your dashboard (Payments) or contact the DBZ team on WhatsApp.',
      402,
      { code: 'PAYMENT_PENDING' },
    );
  }
  return { ...found, paid: found.paid ?? true, trackingMode: found.trackingMode || mode, demo: true };
}

export async function listMine(email) {
  if (!USE_MOCK) {
    return apiRequest('/api/shipments/mine', { token: undefined });
  }
  const all = allMockShipments();
  return all.filter((s) => (email ? s.customerEmail === email : true));
}

export async function getById(id) {
  if (!USE_MOCK) {
    return apiRequest(`/api/shipments/${encodeURIComponent(id)}`);
  }
  return allMockShipments().find((s) => s.id === id) || null;
}

export async function adminList() {
  if (!USE_MOCK) return apiRequest('/api/admin/shipments');
  return allMockShipments();
}

export async function adminCreate(payload) {
  if (!USE_MOCK) {
    return apiRequest('/api/admin/shipments', { method: 'POST', body: payload });
  }
  // --- development mock ---
  const shipment = {
    id: `s-${Date.now().toString(36)}`,
    trackingNumber: payload.trackingNumber || generateRef('D3Z'),
    customerEmail: payload.customerEmail || 'unassigned@d3z.test',
    customerName: payload.customerName || 'Unassigned (dev)',
    origin: payload.origin,
    destination: payload.destination,
    method: payload.method || 'Air Freight',
    service: payload.service || 'International Shipping',
    weight: payload.weight || null,
    pieces: payload.pieces || 1,
    description: payload.description || '',
    shipDate: payload.shipDate || '',
    estimatedDelivery: payload.estimatedDelivery || '',
    status: payload.status || 'Booking Received',
    carrier: payload.carrier || 'To be assigned',
    history: [
      {
        status: payload.status || 'Booking Received',
        location: payload.origin?.city || 'Nigeria',
        note: payload.notes || 'Shipment record created by administrator (development mode).',
        timestamp: new Date().toISOString(),
      },
    ],
    demo: true,
  };
  devStore.push('admin_shipments', shipment);
  return shipment;
}

export async function adminUpdateTracking(id, { status, location, note, estimatedDelivery, carrier }) {
  if (!USE_MOCK) {
    return apiRequest(`/api/admin/shipments/${encodeURIComponent(id)}/tracking`, {
      method: 'POST',
      body: { status, location, note, estimated_delivery: estimatedDelivery, carrier },
    });
  }
  // --- development mock ---
  const list = devStore.get('admin_shipments', []);
  const inMock = list.find((s) => s.id === id);
  if (!inMock) {
    // Sample records are immutable demo data — return a transient copy.
    const sample = MOCK_SHIPMENTS.find((s) => s.id === id);
    if (!sample) throw new Error('Shipment not found.');
    return {
      ...sample,
      status: status || sample.status,
      demoNote:
        'Sample records are read-only. Created (dev) shipments update the local development store.',
    };
  }
  const updated = devStore.update('admin_shipments', id, {
    status: status || inMock.status,
    estimatedDelivery: estimatedDelivery ?? inMock.estimatedDelivery,
    carrier: carrier ?? inMock.carrier,
    history: [
      ...(inMock.history || []),
      {
        status: status || inMock.status,
        location: location || '',
        note: note || '',
        timestamp: new Date().toISOString(),
      },
    ],
  });
  return updated;
}

export function isSampleShipment(id) {
  return MOCK_SHIPMENTS.some((s) => s.id === id);
}
