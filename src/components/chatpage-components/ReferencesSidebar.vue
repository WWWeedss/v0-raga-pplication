<template>
  <div
      class="fixed right-0 top-0 h-full bg-gray-800 border-l border-gray-700 transition-all duration-300 overflow-hidden z-10"
      :class="{ 'w-96': isOpen, 'w-0': !isOpen }"
  >
    <div class="flex flex-col h-full" v-if="isOpen">
      <div class="flex justify-between items-center p-4 border-b border-gray-700">
        <h2 class="font-bold text-white">引用来源 ({{ sortedReferences.length }})</h2>
        <button @click="$emit('close')" class="text-gray-400 hover:text-white">
          <X class="h-5 w-5" />
        </button>
      </div>

      <div class="flex-1 overflow-y-auto p-4">
        <div v-if="sortedReferences.length === 0" class="text-gray-400 text-center mt-8">
          没有可用的引用来源
        </div>

        <div v-else class="space-y-4">
          <div
              v-for="(reference, index) in sortedReferences"
              :key="index"
              class="bg-gray-900 rounded-lg p-4 border border-gray-700"
          >
            <div class="flex justify-between items-start mb-2">
              <span class="bg-purple-600 text-white text-xs px-2 py-1 rounded-full">来源 {{ index + 1 }}</span>
              <span class="text-gray-400 text-xs">相关度: {{ (reference.score * 100).toFixed(1) }}%</span>
            </div>

            <div class="bg-gray-800 p-3 rounded-md mt-2 border border-gray-700">
              <div class="text-xs text-gray-400 mb-1">提问</div>
              <div class="text-sm text-gray-300">{{ reference.metadata.query }}</div>
            </div>

            <div class="bg-gray-800 p-3 rounded-md mt-2 border border-gray-700">
              <div class="text-xs text-gray-400 mb-1">回答</div>
              <div class="text-sm text-gray-300">{{ reference.metadata.response }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { X } from 'lucide-vue-next';
import { computed } from 'vue';

interface SourceDocument {
  content: string;
  metadata: {
    query: string;
    response: string;
  };
  score: number;
}

const props = defineProps<{
  isOpen: boolean;
  references: SourceDocument[];
}>();

defineEmits<{
  (e: 'close'): void;
}>();

// 按照 score 排序引用，从高到低
const sortedReferences = computed(() => {
  return [...props.references].sort((a, b) => b.score - a.score);
});
</script>

<style scoped>
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #1f2937; /* bg-gray-800 */
}

::-webkit-scrollbar-thumb {
  background: #4b5563; /* bg-gray-600 */
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #6b7280; /* bg-gray-500 */
}
</style>