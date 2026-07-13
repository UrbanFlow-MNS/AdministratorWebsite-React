import axios, { type InternalAxiosRequestConfig } from 'axios';
import { clearTokens, getRefresh, getToken, redirectToLogin, setTokens } from '../lib/auth';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'https://urbanflow.lazyy.fr/api';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10_000,
});

apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let refreshing: Promise<boolean> | null = null;

export function refreshSession(): Promise<boolean> {
  if (refreshing) return refreshing;

  refreshing = (async () => {
    const refresh = getRefresh();
    if (!refresh) return false;
    try {
      const res = await axios.get(`${BASE_URL}/auth/refreshToken/${refresh}`, { timeout: 10_000 });
      setTokens(res.data.accessToken, res.data.refreshToken);
      return true;
    } catch {
      return false;
    }
  })().finally(() => {
    refreshing = null;
  });

  return refreshing;
}

apiClient.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;

    if (err.response?.status === 401 && original && !original._retry) {
      original._retry = true;

      const ok = await refreshSession();
      if (ok) {
        original.headers.Authorization = `Bearer ${getToken()}`;
        return apiClient(original);
      }

      clearTokens();
      redirectToLogin();
    }

    return Promise.reject(err);
  },
);

export default apiClient;
