import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import * as authService from '../services/authService.js';
import { USE_MOCK, MOCK_MODE_NOTE } from '../services/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    authService
      .me()
      .then((u) => setUser(u))
      .catch(() => setUser(null))
      .finally(() => setReady(true));
  }, []);

  const login = useCallback(async (credentials) => {
    const u = await authService.login(credentials);
    setUser(u);
    return u;
  }, []);

  const register = useCallback(async (payload) => {
    const u = await authService.register(payload);
    setUser(u);
    return u;
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      ready,
      mockMode: USE_MOCK,
      mockNote: MOCK_MODE_NOTE,
      isAdmin: user?.role === 'admin',
      login,
      register,
      logout,
      updateLocalUser: (patch) => setUser((u) => ({ ...u, ...patch })),
    }),
    [user, ready, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
