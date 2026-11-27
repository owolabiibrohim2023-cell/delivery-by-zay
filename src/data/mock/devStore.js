// ============================================================
// DBZ development data store.
// Mock-mode persistence in localStorage ONLY for development.
// This is never used as the production database — production data
// lives in PostgreSQL behind the FastAPI service.
// ============================================================

const KEY = 'd3z_dev_store_v1';

function readAll() {
  try {
    return JSON.parse(window.localStorage.getItem(KEY)) || {};
  } catch {
    return {};
  }
}

function writeAll(store) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(store));
  } catch {
    /* storage unavailable — mock data stays in memory for the session */
  }
}

export const devStore = {
  get(key, fallback = []) {
    const store = readAll();
    return store[key] ?? fallback;
  },
  set(key, value) {
    const store = readAll();
    store[key] = value;
    writeAll(store);
    return value;
  },
  push(key, item) {
    const store = readAll();
    store[key] = [...(store[key] || []), item];
    writeAll(store);
    return item;
  },
  update(key, id, patch) {
    const store = readAll();
    const list = (store[key] || []).map((item) =>
      item.id === id ? { ...item, ...patch } : item
    );
    store[key] = list;
    writeAll(store);
    return list.find((item) => item.id === id) || null;
  },
  remove(key, id) {
    const store = readAll();
    store[key] = (store[key] || []).filter((item) => item.id !== id);
    writeAll(store);
  },
};

export const DEV_USERS_KEY = 'd3z_dev_users';
export const DEV_SESSION_KEY = 'd3z_dev_session';

export const DEV_ACCOUNTS = [
  {
    id: 'u-demo',
    name: 'Demo Customer',
    email: 'demo@d3z.test',
    phone: '0803 000 0000',
    city: 'Lagos',
    role: 'customer',
    password: 'demo123',
  },
  {
    id: 'u-admin',
    name: 'Zay Admin',
    email: 'admin@d3z.test',
    phone: '08149748188',
    city: 'Lagos',
    role: 'admin',
    password: 'admin123',
  },
];

export function readDevUsers() {
  try {
    return JSON.parse(window.localStorage.getItem(DEV_USERS_KEY)) || [];
  } catch {
    return [];
  }
}

export function writeDevUsers(users) {
  try {
    window.localStorage.setItem(DEV_USERS_KEY, JSON.stringify(users));
  } catch {
    /* ignore */
  }
}
