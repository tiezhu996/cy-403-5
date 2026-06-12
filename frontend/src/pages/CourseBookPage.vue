<template>
  <main class="page" v-if="course">
    <van-nav-bar title="课程预约" left-arrow fixed placeholder @click-left="$router.back()" />
    <CourseCard :course="course" />
    <van-form class="form" @submit="onSubmit">
      <DatePicker v-model="form.bookingDate" />
      <TimeSlotPicker v-model="form.timeSlot" :slots="availableSlots" />
      <van-field label="人数">
        <template #input>
          <van-stepper v-model="form.peopleCount" min="1" :max="course.maxParticipants" />
        </template>
      </van-field>
      <van-field v-model="form.remark" rows="3" autosize label="备注" type="textarea" placeholder="过敏、同行儿童或其他需求" />
      <div class="submit">
        <van-button block round type="primary" native-type="submit">提交预约</van-button>
      </div>
    </van-form>
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { showSuccessToast } from 'vant';
import CourseCard from '@/components/common/CourseCard.vue';
import DatePicker from '@/components/common/DatePicker.vue';
import TimeSlotPicker from '@/components/common/TimeSlotPicker.vue';
import { useBooking } from '@/hooks/useBooking';
import { useCourseStore } from '@/stores/course';

const route = useRoute();
const router = useRouter();
const courseStore = useCourseStore();
const course = computed(() => courseStore.current);
const { form, availableSlots, submit } = useBooking(() => course.value);

async function onSubmit() {
  const booking = await submit();
  if (booking) {
    showSuccessToast('预约已提交');
    router.push('/my-bookings');
  }
}

onMounted(async () => {
  await courseStore.fetchCourse(Number(route.params.id));
  if (!form.timeSlot) {
    form.timeSlot = course.value?.scheduleRule.slots[0] ?? '';
  }
});
</script>

<style scoped>
.page {
  min-height: 100vh;
  padding: 12px 12px 72px;
  background: #f5f7f8;
}
.form {
  margin-top: 12px;
  overflow: hidden;
  border-radius: 8px;
}
.submit {
  padding: 16px;
  background: #fff;
}
</style>

