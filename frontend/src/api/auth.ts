import { http } from './http';
import type { LoginResponse } from '@/types/entities';
import type { UserRole } from '@/types/enums';

export function loginApi(payload: { phone: string; password: string }) {
  return http.post<unknown, LoginResponse>('/auth/login', payload);
}

export function registerApi(payload: { name: string; phone: string; password: string; role?: UserRole }) {
  return http.post<unknown, LoginResponse>('/auth/register', payload);
}

export function meApi() {
  return http.get('/auth/me');
}

export function switchRoleApi(role: UserRole) {
  return http.patch<unknown, LoginResponse>('/auth/switch-role', { role });
}

