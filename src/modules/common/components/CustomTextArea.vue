<template>
  <div>
    <input
      :type="type"
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement)?.value ?? '')"
      @blur="$emit('blur')"
      class="form-control"
      :class="['form-control', { 'border-red-500': error }]"
    />

    <span v-if="error" class="text-red-400">{{ error }}</span>
  </div>
</template>

<script lang="ts" setup>
withDefaults(
  defineProps<{
    modelValue?: string | number;
    error?: string;
    type?: 'text' | 'number';
  }>(),
  {
    type: 'text',
  },
);

defineEmits(['update:modelValue', 'blur']);
</script>

<style scoped>
.form-control {
  @apply shadow h-32 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none;
}
</style>
