import { http } from './http';
import type { Review } from '@/types/entities';

export function getReviews(params?: { courseId?: number; workshopId?: number }) {
  return http.get<unknown, Review[]>('/reviews', { params });
}

export function createReviewApi(payload: { bookingId: number; rating: number; content: string; images?: string[] }) {
  return http.post<unknown, Review>('/reviews', payload);
}

