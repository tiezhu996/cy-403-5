import dayjs from 'dayjs';
import { computed, reactive } from 'vue';
import { showToast } from 'vant';
import { useBookingStore } from '@/stores/booking';
import type { Course } from '@/types/entities';

export function useBooking(course: () => Course | null) {
  const bookingStore = useBookingStore();
  const form = reactive({
    bookingDate: dayjs().add(1, 'day').format('YYYY-MM-DD'),
    timeSlot: '',
    peopleCount: 1,
    remark: '',
  });

  const availableSlots = computed(() => course()?.scheduleRule.slots ?? []);

  function validate() {
    if (!course()) {
      showToast('课程信息未加载');
      return false;
    }
    if (dayjs(form.bookingDate).isBefore(dayjs(), 'day')) {
      showToast('预约日期不能早于今天');
      return false;
    }
    if (!form.timeSlot) {
      showToast('请选择体验时段');
      return false;
    }
    if (form.peopleCount > (course()?.maxParticipants ?? 1)) {
      showToast('人数超过课程容量');
      return false;
    }
    return true;
  }

  async function submit() {
    const current = course();
    if (!validate() || !current) {
      return null;
    }
    return bookingStore.submitBooking({
      courseId: current.id,
      bookingDate: form.bookingDate,
      timeSlot: form.timeSlot,
      peopleCount: form.peopleCount,
      remark: form.remark,
    });
  }

  return { form, availableSlots, submit, cancelBooking: bookingStore.cancelBooking };
}

