<template>
  <main class="page">
    <van-nav-bar title="传承人工作台" fixed placeholder />
    <section class="stats">
      <div>
        <strong>{{ ownWorkshops.length }}</strong>
        <span>工坊</span>
      </div>
      <div>
        <strong>{{ ownCourses.length }}</strong>
        <span>课程</span>
      </div>
      <div>
        <strong>{{ bookingStore.instructorList.length }}</strong>
        <span>预约</span>
      </div>
      <div>
        <strong>{{ reviewStore.list.length }}</strong>
        <span>评价</span>
      </div>
    </section>

    <section class="section">
      <h2>我的工坊</h2>
      <WorkshopCard v-for="workshop in ownWorkshops" :key="workshop.id" :workshop="workshop" />
    </section>

    <section class="section">
      <h2>课程管理</h2>
      <CourseCard v-for="course in ownCourses" :key="course.id" :course="course" />
    </section>

    <section class="section">
      <h2>预约处理</h2>
      <BookingCard v-for="booking in bookingStore.instructorList" :key="booking.id" :booking="booking">
        <template #actions>
          <van-button v-if="booking.status !== BookingStatus.COMPLETED" size="small" type="primary" @click="bookingStore.checkIn(booking.id)">
            签到
          </van-button>
        </template>
      </BookingCard>
    </section>

    <section class="section">
      <h2>近期评价</h2>
      <ReviewCard v-for="review in reviewStore.list" :key="review.id" :review="review" />
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import BookingCard from '@/components/common/BookingCard.vue';
import CourseCard from '@/components/common/CourseCard.vue';
import ReviewCard from '@/components/common/ReviewCard.vue';
import WorkshopCard from '@/components/common/WorkshopCard.vue';
import { useAuth } from '@/hooks/useAuth';
import { useBookingStore } from '@/stores/booking';
import { useCourseStore } from '@/stores/course';
import { useReviewStore } from '@/stores/review';
import { useWorkshopStore } from '@/stores/workshop';
import { BookingStatus } from '@/types/enums';

const { user } = useAuth();
const workshopStore = useWorkshopStore();
const courseStore = useCourseStore();
const bookingStore = useBookingStore();
const reviewStore = useReviewStore();

const ownWorkshops = computed(() => workshopStore.list.filter((item) => item.instructorId === user.value?.id));
const ownCourses = computed(() => courseStore.list.filter((item) => item.instructorId === user.value?.id));

onMounted(async () => {
  await Promise.all([
    workshopStore.fetchWorkshops(),
    courseStore.fetchCourses(),
    bookingStore.fetchInstructorBookings(),
    reviewStore.fetchReviews(),
  ]);
});
</script>

<style scoped>
.page {
  min-height: 100vh;
  padding: 12px 12px 72px;
  background: #f5f7f8;
}
.stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}
.stats div {
  display: grid;
  gap: 4px;
  padding: 12px 6px;
  text-align: center;
  background: #fff;
  border: 1px solid #edf0f3;
  border-radius: 8px;
}
.stats strong {
  color: #1f6f61;
  font-size: 20px;
}
.stats span {
  color: #7a8490;
  font-size: 12px;
}
.section {
  display: grid;
  gap: 10px;
  margin-top: 14px;
}
h2 {
  margin: 4px 2px;
  font-size: 17px;
}
</style>

