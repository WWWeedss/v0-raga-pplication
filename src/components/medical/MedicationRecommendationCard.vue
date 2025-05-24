<template>
  <div class="bg-white rounded-lg border border-gray-200 p-6">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-lg font-semibold text-gray-900">开药建议</h2>
      <button
          @click="generateRecommendation"
          :disabled="isGenerating"
          class="flex items-center space-x-2 px-4 py-2 bg-green-400 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <RefreshCw class="h-4 w-4" :class="{ 'animate-spin': isGenerating }" />
        <span>{{ isGenerating ? '生成中...' : '一键生成' }}</span>
      </button>
    </div>

    <div class="min-h-[200px] p-4 border border-gray-200 rounded-md bg-gray-50">
      <div v-if="recommendation" class="prose prose-sm max-w-none">
        {{ recommendation }}
      </div>
      <div v-else class="text-gray-500 text-center py-8">
        点击"一键生成"获取AI开药建议
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { RefreshCw } from 'lucide-vue-next';

const isGenerating = ref(false);
const recommendation = ref('');

const generateRecommendation = async () => {
  isGenerating.value = true;
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 2000));
    recommendation.value = '基于患者症状，建议使用以下药物：\n1. 阿莫西林胶囊 0.5g，每日3次\n2. 布洛芬缓释胶囊 0.3g，每日2次\n3. 维生素C片 0.1g，每日1次';
  } finally {
    isGenerating.value = false;
  }
};
</script>
