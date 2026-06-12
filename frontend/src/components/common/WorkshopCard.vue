<template>
  <article class="workshop-card" @click="$router.push(`/workshops/${workshop.id}`)">
    <van-image class="cover" :src="workshop.coverImage" fit="cover" radius="8" />
    <div class="body">
      <div class="title-row">
        <h3>{{ workshop.name }}</h3>
        <span class="rating">{{ Number(workshop.rating).toFixed(1) }}</span>
      </div>
      <p>{{ workshop.description }}</p>
      <div class="meta">{{ workshop.address }}</div>
      <div class="tags">
        <van-tag v-for="tag in workshop.tags" :key="tag" plain type="primary">{{ workshopTagText[tag] }}</van-tag>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { Workshop } from '@/types/entities';
import { workshopTagText } from '@/types/enums';

defineProps<{ workshop: Workshop }>();
</script>

<style scoped>
.workshop-card {
  overflow: hidden;
  background: #fff;
  border: 1px solid #edf0f3;
  border-radius: 8px;
}
.cover {
  display: block;
  width: 100%;
  height: 132px;
}
.body {
  padding: 12px;
}
.title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
h3 {
  margin: 0;
  font-size: 16px;
  line-height: 1.3;
}
p {
  display: -webkit-box;
  margin: 8px 0;
  overflow: hidden;
  color: #4f5b67;
  font-size: 13px;
  line-height: 1.45;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
.rating {
  color: #d7682d;
  font-weight: 700;
}
.meta {
  color: #7a8490;
  font-size: 12px;
}
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 10px;
}
</style>

