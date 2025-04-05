<template>
  <div class="fixed inset-0 flex items-center justify-center bg-gray-900 z-50">
    <div class="text-center">
      <div class="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mb-4"></div>
      <h2 class="text-xl font-semibold text-white">{{ message }}</h2>
      <p class="text-gray-400 mt-2">请稍候...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  message?: string;
}>();
</script>