<template>
  <div class="flex justify-center py-10 bg-gray-100 space-x-3">
    <button
      :disabled="currentPage === 1"
      @click="$router.push({ query: { page: currentPage - 1 } })"
      class="flex items-center space-x-1.5 rounded-lg px-4 py-1.5 text-white bg-blue-500 disabled:bg-gray-300 hover:bg-blue-600 transition-all"
    >
      <ArrowLeft />
      <span>Anteriores</span>
    </button>

    <button
      :disabled="hasMoreData"
      @click="$router.push({ query: { page: currentPage + 1 } })"
      class="flex items-center space-x-1.5 rounded-lg px-4 py-1.5 text-white bg-blue-500 disabled:bg-gray-300 hover:bg-blue-600 transition-all"
    >
      Siguientes
      <ArrowRight />
    </button>
  </div>
</template>

<script setup lang="ts">
import ArrowLeft from '@/icons/ArrowLeft.vue';
import ArrowRight from '@/icons/ArrowRight.vue';

interface Props {
  currentPage: number;
  hasMoreData: boolean;
}

defineProps<Props>();
</script>
