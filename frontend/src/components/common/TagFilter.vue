<template>
  <div class="tag-filter">
    <van-button size="small" :type="modelValue ? 'default' : 'primary'" @click="$emit('update:modelValue', undefined)">全部</van-button>
    <van-button
      v-for="item in workshopTagOptions"
      :key="item.value"
      size="small"
      :type="modelValue === item.value ? 'primary' : 'default'"
      @click="$emit('update:modelValue', item.value)"
    >
      {{ item.text }}
    </van-button>
  </div>
</template>

<script setup lang="ts">
import type { WorkshopTag } from '@/types/enums';
import { workshopTagOptions } from '@/types/enums';

defineProps<{ modelValue?: WorkshopTag }>();
defineEmits<{ 'update:modelValue': [value?: WorkshopTag] }>();
</script>

<style scoped>
.tag-filter {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding: 8px 0;
}
.tag-filter::-webkit-scrollbar {
  display: none;
}
</style>

