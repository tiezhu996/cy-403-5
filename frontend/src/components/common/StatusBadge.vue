<template>
  <van-tag :type="type" round>{{ text }}</van-tag>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { BookingStatus, bookingStatusText } from '@/types/enums';

const props = defineProps<{ status: BookingStatus | string }>();

const text = computed(() => bookingStatusText[props.status as BookingStatus] ?? props.status);
const type = computed(() => {
  if (props.status === BookingStatus.COMPLETED) return 'success';
  if (props.status === BookingStatus.CANCELLED || props.status === BookingStatus.NO_SHOW) return 'default';
  if (props.status === BookingStatus.CONFIRMED) return 'primary';
  return 'warning';
});
</script>

