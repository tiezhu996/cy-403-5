import { http } from './http';
import type { Workshop } from '@/types/entities';
import type { WorkshopTag } from '@/types/enums';

export function getWorkshops(params?: { tag?: WorkshopTag; minRating?: number; district?: string }) {
  return http.get<unknown, Workshop[]>('/workshops', { params });
}

export function getWorkshop(id: number) {
  return http.get<unknown, Workshop>(`/workshops/${id}`);
}

export function updateWorkshopStatus(id: number, status: string) {
  return http.patch<unknown, Workshop>(`/workshops/${id}/status`, { status });
}

