// ============================================================
// DBZ authentication service.
// When VITE_API_BASE_URL is configured every call is forwarded to the
// FastAPI backend (JWT /auth endpoints). Without it, an isolated
// DEVELOPMENT-ONLY mock auth runs in localStorage — never use it in
// production. Real password verification always happens on the backend.
// ============================================================

import { apiRequest, USE_MOCK } from './api.js';
import { devStore, DEV_USERS_KEY, DEV_SESSION_KEY, DEV_ACCOUNTS, readDevUsers, writeDevUsers } from '../data/mock/devStore.js';

function seedDevUsers() {
  let users = readDevUsers();
  if (!users.length) {
    users = DEV_ACCOUNTS.map(({ password, ...rest }) => ({ ...rest, password }));
    writeDevUsers(users);
  }
  return users;
}

function saveSession(user) {
  const session = {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone || '',
    role: user.role || 'customer',
    issuedAt: new Date().toISOString(),
    mock: USE_MOCK,
  };
  try {
    window.localStorage.setItem(DEV_SESSION_KEY, JSON.stringify(session));
  } catch {
    /* ignore */
  }
  return session;
}

export function readSession() {
  try {
    return JSON.parse(window.localStorage.getItem(DEV_SESSION_KEY)) || null;
  } catch {
    return null;
  }
}

function clearSession() {
  try {
    window.localStorage.removeItem(DEV_SESSION_KEY);
  } catch {
    /* ignore */
  }
}

const publicUser = ({ password, ...safe }) => safe;

export async function register({ name, email, phone, password }) {
  if (!USE_MOCK) {
    const data = await apiRequest('/api/auth/register', {
      method: 'POST',
      body: { name, email, phone, password },
    });
    saveSession(data.user || data);
    return data.user || data;
  }
  // --- development mock ---
  const users = seedDevUsers();
  const normalized = String(email).toLowerCase().trim();
  if (users.some((u) => u.email.toLowerCase() === normalized)) {
    throw new Error('An account with this email already exists (development store).');
  }
  const user = {
    id: `u-${Date.now().toString(36)}`,
    name,
    email: normalized,
    phone: phone || '',
    city: '',
    role: 'customer',
    password,
  };
  users.push(user);
  writeDevUsers(users);
  devStore.push('dev_registered', { id: user.id, email: normalized, at: new Date().toISOString() });
  return publicUser(saveSession(user));
}

export async function login({ email, password }) {
  if (!USE_MOCK) {
    const data = await apiRequest('/api/auth/login', {
      method: 'POST',
      body: { email, password },
    });
    const user = data.user || data;
    saveSession({ ...user, token: data.access_token });
    return user;
  }
  // --- development mock ---
  const users = seedDevUsers();
  const normalized = String(email).toLowerCase().trim();
  const user = users.find((u) => u.email.toLowerCase() === normalized);
  if (!user || user.password !== password) {
    throw new Error('Invalid email or password (development store).');
  }
  return publicUser(saveSession(user));
}

export function logout() {
  clearSession();
}

export async function me() {
  if (!USE_MOCK) {
    const session = readSession();
    return apiRequest('/api/auth/me', { token: session?.token });
  }
  const session = readSession();
  return session || null;
}

export async function forgotPassword(email) {
  if (!USE_MOCK) {
    return apiRequest('/api/auth/forgot-password', { method: 'POST', body: { email } });
  }
  // Mock: password reset emails are only sent once SMTP is configured on the backend.
  return {
    ok: true,
    message:
      'Demonstration mode — a reset link would be emailed by the backend once SMTP is configured.',
  };
}

export async function resetPassword({ token, password }) {
  if (!USE_MOCK) {
    return apiRequest('/api/auth/reset-password', { method: 'POST', body: { token, password } });
  }
  return { ok: true, message: 'Demonstration mode — reset handled by backend when connected.' };
}

export async function updateProfile(patch) {
  if (!USE_MOCK) {
    const session = readSession();
    return apiRequest('/api/auth/me', { method: 'PATCH', body: patch, token: session?.token });
  }
  const session = readSession();
  if (!session) throw new Error('Not signed in.');
  const users = readDevUsers();
  const idx = users.findIndex((u) => u.email.toLowerCase() === session.email.toLowerCase());
  if (idx >= 0) {
    users[idx] = { ...users[idx], ...patch };
    writeDevUsers(users);
  }
  const updated = { ...session, ...patch };
  saveSession(updated);
  return updated;
}

export async function changePassword({ currentPassword, newPassword }) {
  if (!USE_MOCK) {
    const session = readSession();
    return apiRequest('/api/auth/change-password', {
      method: 'POST',
      body: { current_password: currentPassword, new_password: newPassword },
      token: session?.token,
    });
  }
  const session = readSession();
  const users = readDevUsers();
  const idx = users.findIndex((u) => u.email.toLowerCase() === (session?.email || '').toLowerCase());
  if (idx < 0) throw new Error('Not signed in.');
  if (users[idx].password !== currentPassword) throw new Error('Current password is incorrect.');
  users[idx].password = newPassword;
  writeDevUsers(users);
  return { ok: true, message: 'Password updated (development store).' };
}

export { DEV_ACCOUNTS };
