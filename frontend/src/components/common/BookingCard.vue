<template>
  <article class="booking-card">
    <div class="top">
      <div>
        <h3>{{ booking.course?.title ?? '课程' }}</h3>
        <p>{{ booking.course?.workshop?.name }}</p>
      </div>
      <StatusBadge :status="booking.status" />
    </div>
    <div class="details">
      <span>{{ booking.bookingDate }}</span>
      <span>{{ booking.timeSlot }}</span>
      <span>{{ booking.peopleCount }} 人</span>
    </div>
    <div class="no">预约号 {{ booking.bookingNo }}</div>
    <div v-if="$slots.actions" class="actions">
      <slot name="actions" />
    </div>
  </article>
</template>

<script setup lang="ts">
import type { Booking } from '@/types/entities';
import StatusBadge from './StatusBadge.vue';

defineProps<{ booking: Booking }>();
</script>

<style scoped>
.booking-card {
  padding: 14px;
  background: #fff;
  border: 1px solid #edf0f3;
  border-radius: 8px;
}
.top {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}
h3 {
  margin: 0;
  font-size: 15px;
}
p,
.no {
  margin: 6px 0 0;
  color: #7a8490;
  font-size: 12px;
}
.details {
  display: flex;
  gap: 10px;
  margin-top: 12px;
  color: #3f4852;
  font-size: 13px;
}
.actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 12px;
}
</style>

