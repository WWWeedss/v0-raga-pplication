<template>
  <div class="relative group">
    <button
        @click="$emit('click')"
        class="w-8 h-8 flex items-center justify-center rounded-md text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
    >
      <component :is="icon" class="h-5 w-5" />
    </button>

    <!-- 悬浮提示 -->
    <div class="absolute left-12 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
      {{ tooltip }}
      <div class="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-0 h-0 border-t-2 border-b-2 border-r-2 border-transparent border-r-gray-900"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  icon: any;
  tooltip: string;
}>();

defineEmits(['click']);
</script>
