import { action, computed, makeObservable, observable, runInAction } from 'mobx';
import { authApi, type SignInPayload } from '../api/auth.api';
import { REFRESH_KEY, TOKEN_KEY } from '../lib/auth';

interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

class AuthStore {
  user: AuthUser | null = null;
  accessToken: string | null = localStorage.getItem(TOKEN_KEY);
  loading = false;
  error: string | null = null;

  constructor() {
    makeObservable(this, {
      user: observable,
      accessToken: observable,
      loading: observable,
      error: observable,
      isAuthenticated: computed,
      signIn: action,
      signOut: action,
    });
  }

  get isAuthenticated() {
    return !!this.accessToken;
  }

  async signIn(payload: SignInPayload) {
    this.loading = true;
    this.error = null;
    try {
      const data = await authApi.signIn(payload);
      runInAction(() => {
        this.accessToken = data.accessToken;
        this.user = data.user;
        localStorage.setItem(TOKEN_KEY, data.accessToken);
        localStorage.setItem(REFRESH_KEY, data.refreshToken);
      });
    } catch {
      runInAction(() => {
        this.error = 'Email ou mot de passe incorrect.';
      });
      throw new Error(this.error ?? 'Auth error');
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  signOut() {
    this.user = null;
    this.accessToken = null;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
  }
}

export const authStore = new AuthStore();
