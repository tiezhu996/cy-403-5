import { http } from './http';
import type { Booking } from '@/types/entities';
import type { BookingStatus } from '@/types/enums';

export function createBookingApi(payload: {
  courseId: number;
  bookingDate: string;
  timeSlot: string;
  peopleCount: number;
  remark?: string;
}) {
  return http.post<unknown, Booking>('/bookings', payload);
}

export function getMyBookings(status?: BookingStatus) {
  return http.get<unknown, Booking[]>('/bookings/my', { params: { status } });
}

export function getInstructorBookings() {
  return http.get<unknown, Booking[]>('/bookings/instructor');
}

export function updateBookingStatusApi(id: number, status: BookingStatus) {
  return http.patch<unknown, Booking>(`/bookings/${id}/status`, { status });
}

export function checkInBookingApi(id: number) {
  return http.patch<unknown, Booking>(`/bookings/${id}/check-in`);
}

