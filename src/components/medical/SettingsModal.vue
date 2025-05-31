<template>
  <Transition name="modal-fade">
    <div v-if="props.isOpen" class="fixed inset-0 z-50 flex items-center justify-center">
      <!-- 背景遮罩 -->
      <div class="absolute inset-0 bg-black bg-opacity-50" @click="closeModal"></div>

      <!-- 弹窗内容 -->
      <div class="relative bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden">
        <!-- 弹窗标题 -->
        <div class="flex justify-between items-center p-4 border-b border-gray-700">
          <h3 class="text-xl font-semibold text-white">系统设置</h3>
          <button
              @click="closeModal"
              class="text-gray-400 hover:text-white transition-colors"
          >
            <X class="h-5 w-5" />
          </button>
        </div>

        <!-- 弹窗内容 -->
        <div class="p-6">
          <div class="space-y-6">
            <!-- top_k 设置 -->
            <div class="space-y-2">
              <div class="flex justify-between items-center">
                <label for="top_k" class="block text-sm font-medium text-gray-200">
                  引用数量 (top_k)
                </label>
                <span class="text-xs text-gray-400">控制每次回答显示的引用数量</span>
              </div>

              <div class="flex items-center space-x-4">
                <input
                    type="range"
                    id="top_k"
                    v-model="topK"
                    min="1"
                    max="10"
                    step="1"
                    class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
                <div class="w-12 h-10 flex items-center justify-center bg-gray-700 rounded-md">
                  <span class="text-white font-medium">{{ topK }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 弹窗底部按钮 -->
        <div class="flex justify-end p-4 border-t border-gray-700 bg-gray-900">
          <button
              @click="saveSettings"
              class="px-4 py-2 bg-green-400 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors"
          >
            保存设置
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { X } from 'lucide-vue-next';

const props = defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

// 设置项
const topK = ref(3);

// 初始化设置
onMounted(() => {
  const savedTopK = localStorage.getItem('top_k');
  if (savedTopK) {
    topK.value = parseInt(savedTopK);
  }
});

// 关闭弹窗
const closeModal = () => {
  emit('close');
};

// 保存设置
const saveSettings = () => {
  localStorage.setItem('top_k', topK.value.toString());
  emit('close');
};
</script>

<style scoped>
/* 弹窗动画 */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

/* 自定义滑块样式 */
input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  background: lightgreen; /* green-400 */
  border-radius: 50%;
  cursor: pointer;
}

input[type="range"]::-moz-range-thumb {
  width: 18px;
  height: 18px;
  background: #a8f7; /* purple-600 */
  border-radius: 50%;
  cursor: pointer;
}
</style>