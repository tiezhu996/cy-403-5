import { http } from './http';
import type { User } from '@/types/entities';

export function getUsers() {
  return http.get<unknown, User[]>('/users');
}

export function getUser(id: number) {
  return http.get<unknown, User>(`/users/${id}`);
}
