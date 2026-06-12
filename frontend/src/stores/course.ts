import { defineStore } from 'pinia';
import { getCourse, getCourses } from '@/api/course';
import type { Course } from '@/types/entities';

export const useCourseStore = defineStore('course', {
  state: () => ({
    list: [] as Course[],
    current: null as Course | null,
    loading: false,
  }),
  actions: {
    async fetchCourses(params?: { workshopId?: number }) {
      this.loading = true;
      try {
        this.list = await getCourses(params);
      } finally {
        this.loading = false;
      }
    },
    async fetchCourse(id: number) {
      this.current = await getCourse(id);
      return this.current;
    },
  },
});

