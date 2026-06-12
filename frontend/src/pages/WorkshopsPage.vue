<template>
  <main class="page">
    <van-nav-bar title="非遗工坊" fixed placeholder />
    <section class="filters">
      <van-search v-model="district" placeholder="搜索地区，如杭州、景德镇" @search="load" @clear="load" />
      <TagFilter v-model="selectedTag" />
      <div class="rating-filter">
        <span>最低评分</span>
        <van-rate v-model="minRating" :count="5" size="18" color="#d7682d" @change="load" />
      </div>
    </section>

    <van-list :loading="workshopStore.loading" :finished="pagination.finished.value" finished-text="没有更多工坊" @load="pagination.loadMore">
      <div class="grid">
        <WorkshopCard v-for="workshop in pagination.items.value" :key="workshop.id" :workshop="workshop" />
      </div>
    </van-list>
  </main>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import TagFilter from '@/components/common/TagFilter.vue';
import WorkshopCard from '@/components/common/WorkshopCard.vue';
import { usePagination } from '@/hooks/usePagination';
import { useWorkshopStore } from '@/stores/workshop';
import type { WorkshopTag } from '@/types/enums';

const workshopStore = useWorkshopStore();
const selectedTag = ref<WorkshopTag>();
const district = ref('');
const minRating = ref(0);
const pagination = usePagination(() => workshopStore.list, 8);

async function load() {
  pagination.reset();
  await workshopStore.fetchWorkshops({
    tag: selectedTag.value,
    district: district.value || undefined,
    minRating: minRating.value || undefined,
  });
}

watch(selectedTag, load);
onMounted(load);
</script>

<style scoped>
.page {
  min-height: 100vh;
  padding: 0 12px 72px;
  background: #f5f7f8;
}
.filters {
  position: sticky;
  top: 46px;
  z-index: 4;
  margin: 0 -12px 12px;
  padding: 0 12px 10px;
  background: #f5f7f8;
}
.rating-filter {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 2px 0;
  color: #596572;
  font-size: 13px;
}
.grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}
@media (min-width: 640px) {
  .grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>

