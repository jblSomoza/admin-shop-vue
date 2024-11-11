<template>
  <!-- Header Navbar -->
  <top-menu />

  <!-- Main Content -->
  <RouterView />

  <!-- Footer -->
  <CustomFooter />
</template>

<script setup lang="ts">
import TopMenu from '@/modules/shop/components/TopMenu.vue';
import CustomFooter from '@/modules/shop/components/CustomFooter.vue';
</script>
