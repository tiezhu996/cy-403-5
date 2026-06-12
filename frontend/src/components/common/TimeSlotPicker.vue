<template>
  <div class="slot-picker">
    <div class="label">时段</div>
    <div class="slots">
      <van-button
        v-for="slot in slots"
        :key="slot"
        size="small"
        :type="slot === modelValue ? 'primary' : 'default'"
        @click="$emit('update:modelValue', slot)"
      >
        {{ slot }}
      </van-button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ slots: string[]; modelValue: string }>();
defineEmits<{ 'update:modelValue': [value: string] }>();
</script>

<style scoped>
.slot-picker {
  padding: 12px 16px;
  background: #fff;
}
.label {
  margin-bottom: 10px;
  color: #323233;
  font-size: 14px;
}
.slots {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
</style>

