<template>
  <Transition name="toast">
    <div
        v-if="visible"
        class="fixed top-4 right-4 z-50 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2"
    >
      <component :is="iconComponent" class="h-4 w-4" />
      <span>{{ message }}</span>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { Check, ThumbsUp, ThumbsDown } from 'lucide-vue-next';

const props = defineProps<{
  message: string;
  type: 'success' | 'like' | 'dislike';
  show: boolean;
}>();

const emit = defineEmits<{
  (e: 'hide'): void;
}>();

const visible = ref(false);

const iconComponent = computed(() => {
  switch (props.type) {
    case 'success':
      return Check;
    case 'like':
      return ThumbsUp;
    case 'dislike':
      return ThumbsDown;
    default:
      return Check;
  }
});

watch(() => props.show, (newVal) => {
  if (newVal) {
    visible.value = true;
    setTimeout(() => {
      visible.value = false;
      setTimeout(() => emit('hide'), 300); // 等待动画完成
    }, 2000);
  }
});
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
