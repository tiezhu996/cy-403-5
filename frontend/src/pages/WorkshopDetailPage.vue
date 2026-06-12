<template>
  <main class="page" v-if="workshop">
    <van-nav-bar title="工坊详情" left-arrow fixed placeholder @click-left="$router.back()" />
    <van-image class="hero" :src="workshop.coverImage" fit="cover" />
    <section class="section intro">
      <div class="title-line">
        <h1>{{ workshop.name }}</h1>
        <span>{{ Number(workshop.rating).toFixed(1) }}</span>
      </div>
      <p>{{ workshop.description }}</p>
      <div class="address">{{ workshop.address }}</div>
      <div class="tags">
        <van-tag v-for="tag in workshop.tags" :key="tag" type="primary" plain>{{ workshopTagText[tag] }}</van-tag>
      </div>
    </section>

    <section class="section mentor">
      <h2>传承人</h2>
      <div class="mentor-row">
        <van-image round width="44" height="44" :src="workshop.instructor?.avatar" />
        <div>
          <strong>{{ workshop.instructor?.name }}</strong>
          <p>{{ workshop.instructor?.bio }}</p>
        </div>
      </div>
    </section>

    <section class="section">
      <h2>课程</h2>
      <div class="stack">
        <CourseCard v-for="course in courseStore.list" :key="course.id" :course="course" />
      </div>
    </section>

    <section class="section">
      <h2>评价</h2>
      <div class="stack">
        <ReviewCard v-for="review in reviewStore.list" :key="review.id" :review="review" />
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import CourseCard from '@/components/common/CourseCard.vue';
import ReviewCard from '@/components/common/ReviewCard.vue';
import { useCourseStore } from '@/stores/course';
import { useReviewStore } from '@/stores/review';
import { useWorkshopStore } from '@/stores/workshop';
import { workshopTagText } from '@/types/enums';

const route = useRoute();
const workshopStore = useWorkshopStore();
const courseStore = useCourseStore();
const reviewStore = useReviewStore();
const id = Number(route.params.id);
const workshop = computed(() => workshopStore.current);

onMounted(async () => {
  await workshopStore.fetchWorkshop(id);
  await Promise.all([courseStore.fetchCourses({ workshopId: id }), reviewStore.fetchReviews({ workshopId: id })]);
});
</script>

<style scoped>
.page {
  min-height: 100vh;
  padding-bottom: 72px;
  background: #f5f7f8;
}
.hero {
  width: 100%;
  height: 220px;
}
.section {
  padding: 16px;
  margin-top: 10px;
  background: #fff;
}
.intro {
  margin-top: 0;
}
.title-line {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
h1,
h2 {
  margin: 0;
}
h1 {
  font-size: 22px;
}
h2 {
  margin-bottom: 12px;
  font-size: 17px;
}
.title-line span {
  color: #d7682d;
  font-size: 20px;
  font-weight: 700;
}
p {
  color: #596572;
  line-height: 1.65;
}
.address {
  color: #7a8490;
  font-size: 13px;
}
.tags,
.stack {
  display: grid;
  gap: 10px;
}
.tags {
  display: flex;
  flex-wrap: wrap;
  margin-top: 12px;
}
.mentor-row {
  display: flex;
  gap: 12px;
}
.mentor-row p {
  margin: 4px 0 0;
  font-size: 13px;
}
</style>

