import client from './client';

export interface SignInPayload {
  email: string;
  password: string;
}

export interface SignUpPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: { id: string; email: string; firstName: string; lastName: string; role: string };
}

export const authApi = {
  signIn: (payload: SignInPayload) =>
    client.post<AuthResponse>('/auth/signIn', payload).then((r) => r.data),
  signUp: (payload: SignUpPayload) =>
    client.post<AuthResponse>('/auth/signUp', payload).then((r) => r.data),
  refreshToken: (token: string) =>
    client.get<AuthResponse>(`/auth/refreshToken/${token}`).then((r) => r.data),
  forgotPassword: (email: string) =>
    client.post(`/auth/forgot-password/${email}`).then((r) => r.data),
};
