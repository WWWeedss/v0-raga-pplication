<template>
  <Transition name="modal-fade">
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black bg-opacity-50" @click="closeModal"></div>

      <div class="relative bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 overflow-hidden">
        <div class="flex justify-between items-center p-4 border-b border-gray-200">
          <h3 class="text-xl font-semibold text-gray-900">知识库管理</h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
            <X class="h-5 w-5" />
          </button>
        </div>

        <div class="p-6">
          <div class="space-y-4">
            <div class="flex justify-between items-center">
              <h4 class="font-medium text-gray-900">医疗知识库</h4>
              <button class="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700">
                添加文档
              </button>
            </div>

            <div class="border border-gray-200 rounded-md">
              <div class="p-3 border-b border-gray-200 bg-gray-50">
                <div class="flex items-center justify-between">
                  <span class="text-sm font-medium">临床诊疗指南.pdf</span>
                  <span class="text-xs text-gray-500">2024-01-15</span>
                </div>
              </div>
              <div class="p-3 border-b border-gray-200">
                <div class="flex items-center justify-between">
                  <span class="text-sm font-medium">药物使用手册.pdf</span>
                  <span class="text-xs text-gray-500">2024-01-10</span>
                </div>
              </div>
              <div class="p-3">
                <div class="flex items-center justify-between">
                  <span class="text-sm font-medium">疾病诊断标准.pdf</span>
                  <span class="text-xs text-gray-500">2024-01-05</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-end p-4 border-t border-gray-200 bg-gray-50">
          <button
              @click="closeModal"
              class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            确定
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { X } from 'lucide-vue-next';

defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const closeModal = () => {
  emit('close');
};
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
