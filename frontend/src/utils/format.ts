import { bookingStatusText, BookingStatus } from '@/types/enums';

export function formatPrice(value: number) {
  return `¥${Number(value).toFixed(0)}`;
}

export function formatBookingStatus(status: BookingStatus) {
  return bookingStatusText[status] ?? status;
}

