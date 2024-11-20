<template>
  <FullscreenLoader v-if="authStore.isChecking" />
  <RouterView v-else />
  <VueQueryDevtools />
</template>

<script setup lang="ts">
import { VueQueryDevtools } from '@tanstack/vue-query-devtools';
import { useAuthStore } from './modules/auth/stores/auth.store';
import { AuthStatus } from './modules/auth/interfaces/auth-status.enum';
import { useRoute, useRouter } from 'vue-router';
import FullscreenLoader from './modules/common/components/FullscreenLoader.vue';

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

authStore.$subscribe(
  (mutation, state) => {
    if (state.authStatus === AuthStatus.Checking) {
      authStore.checkAuthStatus();
      return;
    }

    if (route.path.includes('/auth') && state.authStatus === AuthStatus.Authenticated) {
      router.replace({ name: 'home' });
    }
  },
  {
    immediate: true,
  },
);
</script>
