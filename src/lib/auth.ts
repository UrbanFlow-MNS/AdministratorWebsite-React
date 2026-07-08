export const TOKEN_KEY = 'uf_token';
export const REFRESH_KEY = 'uf_refresh';

const AUTH_FRONTEND_URL =
  import.meta.env.VITE_AUTH_FRONTEND_URL ?? 'https://auth.urbanflow.lazyy.fr';
const APP_NAME = 'admin';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getRefresh(): string | null {
  return localStorage.getItem(REFRESH_KEY);
}

export function setTokens(token: string, refresh?: string | null): void {
  localStorage.setItem(TOKEN_KEY, token);
  if (refresh) localStorage.setItem(REFRESH_KEY, refresh);
}

export function clearTokens(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
}

interface JwtPayload {
  exp?: number;
  [key: string]: unknown;
}

function decodeJwt(token: string): JwtPayload | null {
  try {
    const payload = token.split('.')[1];
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(json) as JwtPayload;
  } catch {
    return null;
  }
}

export function isExpired(token: string | null, skewSeconds = 10): boolean {
  if (!token) return true;
  const payload = decodeJwt(token);
  if (!payload?.exp) return true;
  return Date.now() / 1000 >= payload.exp - skewSeconds;
}

export function redirectToLogin(): void {
  const redirect = encodeURIComponent(window.location.href);
  window.location.href = `${AUTH_FRONTEND_URL}/login?app=${APP_NAME}&redirect=${redirect}`;
}

export function captureTokensFromHash(): boolean {
  const raw = window.location.hash.startsWith('#')
    ? window.location.hash.slice(1)
    : window.location.hash;
  if (!raw) return false;

  const params = new URLSearchParams(raw);
  const token = params.get('token');
  const refresh = params.get('refresh');
  if (!token) return false;

  setTokens(token, refresh);
  window.history.replaceState(null, '', window.location.pathname + window.location.search);
  return true;
}
