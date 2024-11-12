<template>
  <section class="py-10 bg-gray-100">
    <div
      class="mx-auto grid max-w-6xl grid-cols-1 gap-6 p-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
    >
      <product-card v-for="product in products" :key="product.id" :product="product" />
    </div>
  </section>
</template>

<script setup lang="ts">
import ProductCard from './ProductCard.vue';
import type { Product } from '../interfaces/product.interface';

interface Props {
  products: Product[];
}

defineProps<Props>();
</script>
