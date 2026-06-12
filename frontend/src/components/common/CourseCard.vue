<template>
  <article class="course-card">
    <van-image class="thumb" :src="course.coverImage" fit="cover" radius="8" />
    <div class="content">
      <h3>{{ course.title }}</h3>
      <p>{{ course.description }}</p>
      <div class="line">
        <span>{{ course.durationHours }} 小时</span>
        <span>最多 {{ course.maxParticipants }} 人</span>
      </div>
      <div class="footer">
        <strong>{{ formatPrice(course.price) }}</strong>
        <van-button size="small" type="primary" :to="`/courses/${course.id}/book`">预约</van-button>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { Course } from '@/types/entities';
import { formatPrice } from '@/utils/format';

defineProps<{ course: Course }>();
</script>

<style scoped>
.course-card {
  display: grid;
  grid-template-columns: 112px 1fr;
  gap: 12px;
  padding: 12px;
  background: #fff;
  border: 1px solid #edf0f3;
  border-radius: 8px;
}
.thumb {
  width: 112px;
  height: 104px;
}
h3 {
  margin: 0;
  font-size: 15px;
}
p {
  display: -webkit-box;
  margin: 6px 0;
  overflow: hidden;
  color: #596572;
  font-size: 12px;
  line-height: 1.45;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
.line,
.footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.line {
  color: #7a8490;
  font-size: 12px;
}
strong {
  color: #c55c25;
  font-size: 16px;
}
</style>

