<template>
  <main class="page">
    <van-nav-bar title="我的预约" fixed placeholder />
    <van-tabs v-model:active="active" sticky offset-top="46">
      <van-tab title="待体验">
        <BookingList :items="pendingItems">
          <template #actions="{ booking }">
            <van-button size="small" plain type="danger" @click="bookingStore.cancelBooking(booking.id)">取消</van-button>
          </template>
        </BookingList>
      </van-tab>
      <van-tab title="已完成">
        <BookingList :items="completedItems" />
      </van-tab>
      <van-tab title="已取消">
        <BookingList :items="cancelledItems" />
      </van-tab>
    </van-tabs>
  </main>
</template>

<script setup lang="ts">
import { computed, defineComponent, h, onMounted, ref, type PropType } from 'vue';
import BookingCard from '@/components/common/BookingCard.vue';
import { useBookingStore } from '@/stores/booking';
import { BookingStatus } from '@/types/enums';
import type { Booking } from '@/types/entities';

const bookingStore = useBookingStore();
const active = ref(0);

const pendingItems = computed(() =>
  bookingStore.list.filter((item) => [BookingStatus.PENDING, BookingStatus.CONFIRMED].includes(item.status)),
);
const completedItems = computed(() => bookingStore.list.filter((item) => item.status === BookingStatus.COMPLETED));
const cancelledItems = computed(() =>
  bookingStore.list.filter((item) => [BookingStatus.CANCELLED, BookingStatus.NO_SHOW].includes(item.status)),
);

const BookingList = defineComponent({
  props: { items: { type: Array as PropType<Booking[]>, required: true } },
  setup(props, { slots }) {
    return () =>
      h(
        'div',
        { class: 'list' },
        props.items.length
          ? props.items.map((booking) =>
              h(BookingCard, { key: booking.id, booking }, { actions: () => slots.actions?.({ booking }) }),
            )
          : h('div', { class: 'empty' }, '暂无预约'),
      );
  },
});

onMounted(() => bookingStore.fetchMyBookings());
</script>

<style scoped>
.page {
  min-height: 100vh;
  padding-bottom: 72px;
  background: #f5f7f8;
}
:deep(.list) {
  display: grid;
  gap: 12px;
  padding: 12px;
}
:deep(.empty) {
  padding: 48px 0;
  color: #7a8490;
  text-align: center;
}
</style>
