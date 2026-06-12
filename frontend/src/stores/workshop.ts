import { defineStore } from 'pinia';
import { getWorkshop, getWorkshops } from '@/api/workshop';
import type { Workshop } from '@/types/entities';
import type { WorkshopTag } from '@/types/enums';

export const useWorkshopStore = defineStore('workshop', {
  state: () => ({
    list: [] as Workshop[],
    current: null as Workshop | null,
    loading: false,
  }),
  actions: {
    async fetchWorkshops(params?: { tag?: WorkshopTag; minRating?: number; district?: string }) {
      this.loading = true;
      try {
        this.list = await getWorkshops(params);
      } finally {
        this.loading = false;
      }
    },
    async fetchWorkshop(id: number) {
      this.current = await getWorkshop(id);
      return this.current;
    },
  },
});

