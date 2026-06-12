import { http } from './http';
import type { Course } from '@/types/entities';

export function getCourses(params?: { workshopId?: number }) {
  return http.get<unknown, Course[]>('/courses', { params });
}

export function getCourse(id: number) {
  return http.get<unknown, Course>(`/courses/${id}`);
}

