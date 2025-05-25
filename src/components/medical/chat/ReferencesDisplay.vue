<template>
  <div v-if="references && references.length > 0" class="mt-2">
    <!-- References Toggle -->
    <button
        @click="toggleReferences"
        class="flex items-center space-x-1 text-xs text-gray-400 hover:text-gray-300 transition-colors"
    >
      <ChevronRight
          class="h-3 w-3 transition-transform duration-200"
          :class="{ 'rotate-90': showReferences }"
      />
      <FileText class="h-3 w-3" />
      <span>{{ references.length }} 条参考资料</span>
    </button>

    <!-- References Content -->
    <Transition name="references">
      <div v-if="showReferences" class="mt-2 space-y-2">
        <div
            v-for="(reference, index) in sortedReferences"
            :key="index"
            class="bg-gray-700 rounded-md p-3 border border-gray-600 text-xs"
        >
          <!-- Reference Header -->
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center space-x-2">
              <span class="bg-green-600 text-white px-2 py-1 rounded-full text-xs">
                引用 {{ index + 1 }}
              </span>
              <span class="text-gray-400">
                相关度: {{ (reference.score * 100).toFixed(1) }}%
              </span>
            </div>
            <button
                @click="copyReference(reference)"
                class="text-gray-400 hover:text-white transition-colors"
                title="复制引用内容"
            >
              <Copy class="h-3 w-3" />
            </button>
          </div>

          <!-- Reference Content -->
          <div class="space-y-2">
            <!-- Original Query -->
            <div class="bg-gray-800 rounded p-2">
              <div class="text-gray-400 mb-1">原始问题:</div>
              <div class="text-gray-200">{{ reference.metadata.query }}</div>
            </div>

            <!-- Response -->
            <div class="bg-gray-800 rounded p-2">
              <div class="text-gray-400 mb-1">参考回答:</div>
              <div
                  class="text-gray-200"
                  :class="{ 'line-clamp-3': !expandedRefs.has(index) }"
              >
                {{ reference.metadata.response }}
              </div>

              <!-- Expand/Collapse for long content -->
              <div v-if="reference.metadata.response.length > 150" class="mt-2">
                <button
                    @click="toggleExpanded(index)"
                    class="text-green-400 hover:text-green-300 transition-colors"
                >
                  {{ expandedRefs.has(index) ? '收起' : '展开全部' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, inject } from 'vue';
import { ChevronRight, FileText, Copy } from 'lucide-vue-next';
import type { source_document } from '../../../models/LLMResponseModels.ts';

const props = defineProps<{
  references: source_document[];
}>();

const showReferences = ref(false);
const expandedRefs = ref(new Set<number>());
const showToast = inject<(message: string, type?: 'success' | 'like' | 'dislike') => void>('showToast');

const sortedReferences = computed(() => {
  return [...props.references].sort((a, b) => b.score - a.score);
});

const toggleReferences = () => {
  showReferences.value = !showReferences.value;
};

const toggleExpanded = (index: number) => {
  if (expandedRefs.value.has(index)) {
    expandedRefs.value.delete(index);
  } else {
    expandedRefs.value.add(index);
  }
};

const copyReference = async (reference: source_document) => {
  try {
    const content = `问题: ${reference.metadata.query}\n\n回答: ${reference.metadata.response}`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(content);
      showToast?.('引用内容已复制到剪贴板', 'success');
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = content;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);

      if (successful) {
        showToast?.('引用内容已复制到剪贴板', 'success');
      }
    }
  } catch (error) {
    console.error('复制失败:', error);
  }
};
</script>

<style scoped>
.references-enter-active,
.references-leave-active {
  transition: all 0.3s ease;
}

.references-enter-from,
.references-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
