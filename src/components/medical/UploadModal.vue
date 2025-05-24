<template>
  <Transition name="modal-fade">
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black bg-opacity-50" @click="closeModal"></div>

      <div class="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden">
        <div class="flex justify-between items-center p-4 border-b border-gray-200">
          <h3 class="text-xl font-semibold text-gray-900">上传病历</h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
            <X class="h-5 w-5" />
          </button>
        </div>

        <div class="p-6">
          <div class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Upload class="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p class="text-gray-600 mb-2">拖拽文件到此处或点击上传</p>
            <p class="text-sm text-gray-500">支持 PDF、DOC、DOCX 格式</p>
            <input type="file" class="hidden" accept=".pdf,.doc,.docx" />
          </div>
        </div>

        <div class="flex justify-end p-4 border-t border-gray-200 bg-gray-50">
          <button
              @click="closeModal"
              class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            确认上传
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { X, Upload } from 'lucide-vue-next';

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
