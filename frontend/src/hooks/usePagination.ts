import { computed, ref } from 'vue';

export function usePagination<T>(source: () => T[], pageSize = 10) {
  const page = ref(1);
  const total = computed(() => source().length);
  const items = computed(() => source().slice(0, page.value * pageSize));
  const finished = computed(() => items.value.length >= total.value);

  function loadMore() {
    if (!finished.value) {
      page.value += 1;
    }
  }

  function reset() {
    page.value = 1;
  }

  return { page, items, total, finished, loadMore, reset };
}

