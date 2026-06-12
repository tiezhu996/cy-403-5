import { defineStore } from 'pinia';
import { createReviewApi, getReviews } from '@/api/review';
import type { Review } from '@/types/entities';

export const useReviewStore = defineStore('review', {
  state: () => ({
    list: [] as Review[],
  }),
  actions: {
    async fetchReviews(params?: { courseId?: number; workshopId?: number }) {
      this.list = await getReviews(params);
    },
    async submitReview(payload: { bookingId: number; rating: number; content: string; images?: string[] }) {
      const review = await createReviewApi(payload);
      this.list.unshift(review);
      return review;
    },
  },
});

