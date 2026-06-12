import { defineStore } from 'pinia';
import { checkInBookingApi, createBookingApi, getInstructorBookings, getMyBookings, updateBookingStatusApi } from '@/api/booking';
import type { Booking } from '@/types/entities';
import { BookingStatus } from '@/types/enums';

export const useBookingStore = defineStore('booking', {
  state: () => ({
    list: [] as Booking[],
    instructorList: [] as Booking[],
    loading: false,
  }),
  actions: {
    async fetchMyBookings(status?: BookingStatus) {
      this.loading = true;
      try {
        this.list = await getMyBookings(status);
      } finally {
        this.loading = false;
      }
    },
    async fetchInstructorBookings() {
      this.instructorList = await getInstructorBookings();
    },
    async submitBooking(payload: { courseId: number; bookingDate: string; timeSlot: string; peopleCount: number; remark?: string }) {
      const booking = await createBookingApi(payload);
      this.list.unshift(booking);
      return booking;
    },
    async cancelBooking(id: number) {
      const booking = await updateBookingStatusApi(id, BookingStatus.CANCELLED);
      this.list = this.list.map((item) => (item.id === id ? booking : item));
    },
    async checkIn(id: number) {
      const booking = await checkInBookingApi(id);
      this.list = this.list.map((item) => (item.id === id ? booking : item));
      this.instructorList = this.instructorList.map((item) => (item.id === id ? booking : item));
    },
  },
});
