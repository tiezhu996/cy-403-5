<template>
  <article class="review-card">
    <div class="head">
      <div class="user">
        <van-image round width="32" height="32" :src="review.student?.avatar" />
        <span>{{ review.student?.name ?? '学员' }}</span>
      </div>
      <van-rate :model-value="review.rating" size="14" color="#d7682d" readonly />
    </div>
    <p>{{ review.content }}</p>
    <div v-if="review.images?.length" class="images">
      <van-image v-for="image in review.images" :key="image" :src="image" fit="cover" radius="6" />
    </div>
  </article>
</template>

<script setup lang="ts">
import type { Review } from '@/types/entities';

defineProps<{ review: Review }>();
</script>

<style scoped>
.review-card {
  padding: 12px;
  background: #fff;
  border: 1px solid #edf0f3;
  border-radius: 8px;
}
.head,
.user {
  display: flex;
  align-items: center;
}
.head {
  justify-content: space-between;
}
.user {
  gap: 8px;
  font-size: 13px;
  font-weight: 600;
}
p {
  margin: 10px 0 0;
  color: #4f5b67;
  font-size: 13px;
  line-height: 1.6;
}
.images {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-top: 10px;
}
.images :deep(.van-image) {
  aspect-ratio: 1;
}
</style>

