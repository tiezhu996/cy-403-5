<template>
  <ErrorBoundary>
    <router-view />
    <van-tabbar v-model="active" route safe-area-inset-bottom>
      <van-tabbar-item to="/workshops" icon="shop-o">工坊</van-tabbar-item>
      <van-tabbar-item to="/my-bookings" icon="orders-o">预约</van-tabbar-item>
      <van-tabbar-item v-if="auth.isInstructor" to="/instructor/dashboard" icon="manager-o">工作台</van-tabbar-item>
      <van-tabbar-item to="/login" icon="contact-o">{{ auth.user ? auth.user.name : '登录' }}</van-tabbar-item>
    </van-tabbar>
  </ErrorBoundary>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import ErrorBoundary from '@/components/common/ErrorBoundary.vue';
import { useAuthStore } from '@/stores/user';

const active = ref(0);
const auth = useAuthStore();
</script>

