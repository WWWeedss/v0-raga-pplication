<template>
  <div class="bg-white rounded-lg border border-gray-200 p-6">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-lg font-semibold text-gray-900">保健建议</h2>
      <button
          @click="generateAdvice"
          :disabled="isGenerating"
          class="flex items-center space-x-2 px-4 py-2 bg-green-400 text-white rounded-md hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <RefreshCw class="h-4 w-4" :class="{ 'animate-spin': isGenerating }" />
        <span>{{ isGenerating ? '生成中...' : '一键生成' }}</span>
      </button>
    </div>

    <div class="min-h-[200px] p-4 border border-gray-200 rounded-md bg-gray-50">
      <div v-if="advice" class="prose prose-sm max-w-none">
        {{ advice }}
      </div>
      <div v-else class="text-gray-500 text-center py-8">
        点击"一键生成"获取AI保健建议
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { RefreshCw } from 'lucide-vue-next';

const isGenerating = ref(false);
const advice = ref('');

const generateAdvice = async () => {
  isGenerating.value = true;
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 2000));
    advice.value = '保健建议：\n1. 多休息，保证充足睡眠\n2. 多饮温开水，保持室内空气流通\n3. 饮食清淡，避免辛辣刺激性食物\n4. 按时服药，如症状加重请及时就医';
  } finally {
    isGenerating.value = false;
  }
};
</script>
