<template>
  <slot v-if="!failed" />
  <van-empty v-else image="error" description="页面加载失败">
    <van-button type="primary" size="small" @click="reload">刷新</van-button>
  </van-empty>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  data: () => ({ failed: false }),
  errorCaptured(error) {
    console.error(error);
    this.failed = true;
    return false;
  },
  methods: {
    reload() {
      window.location.reload();
    },
  },
});
</script>
