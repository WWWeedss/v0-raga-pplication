<template>
  <Transition name="modal-fade">
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black bg-opacity-50" @click="closeModal"></div>

      <div class="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden">
        <div class="flex justify-between items-center p-4 border-b border-gray-200">
          <h3 class="text-xl font-semibold text-gray-900">导出报告</h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
            <X class="h-5 w-5" />
          </button>
        </div>

        <div class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">导出格式</label>
            <select class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
              <option>PDF 格式</option>
              <option>Word 格式</option>
              <option>Excel 格式</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">包含内容</label>
            <div class="space-y-2">
              <label class="flex items-center">
                <input type="checkbox" checked class="mr-2" />
                <span class="text-sm">患者基本信息</span>
              </label>
              <label class="flex items-center">
                <input type="checkbox" checked class="mr-2" />
                <span class="text-sm">开药建议</span>
              </label>
              <label class="flex items-center">
                <input type="checkbox" checked class="mr-2" />
                <span class="text-sm">开药逻辑</span>
              </label>
              <label class="flex items-center">
                <input type="checkbox" checked class="mr-2" />
                <span class="text-sm">保健建议</span>
              </label>
            </div>
          </div>
        </div>

        <div class="flex justify-end p-4 border-t border-gray-200 bg-gray-50">
          <button
              @click="exportReport"
              class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            导出报告
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

const exportReport = () => {
  // 导出逻辑
  console.log('导出报告');
  closeModal();
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
