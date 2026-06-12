<template>
  <van-field :model-value="modelValue" label="日期" readonly is-link @click="show = true" />
  <van-calendar v-model:show="show" :min-date="minDate" @confirm="onConfirm" />
</template>

<script setup lang="ts">
import dayjs from 'dayjs';
import { ref } from 'vue';

defineProps<{ modelValue: string }>();
const emit = defineEmits<{ 'update:modelValue': [value: string] }>();

const show = ref(false);
const minDate = new Date();

function onConfirm(value: Date) {
  emit('update:modelValue', dayjs(value).format('YYYY-MM-DD'));
  show.value = false;
}
</script>

