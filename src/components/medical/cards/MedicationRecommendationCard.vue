<template>
  <div class="bg-white rounded-lg border border-gray-200 p-6">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-lg font-semibold text-gray-900">开药建议</h2>
      <div class="flex items-center space-x-2">
        <input
            v-model="additionalRequirement"
            placeholder="输入进一步生成要求..."
            class="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent w-64"
        />
        <button
            @click="generateRecommendation"
            :disabled="isGenerating"
            class="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <RefreshCw class="h-4 w-4" :class="{ 'animate-spin': isGenerating }" />
          <span>{{ isGenerating ? '生成中...' : '单步生成' }}</span>
        </button>
      </div>
    </div>

    <div class="space-y-4">
      <!-- 医生编辑内容 - 上方 -->
      <div class="space-y-2">
        <h3 class="text-sm font-medium text-gray-700 flex items-center">
          <User class="h-4 w-4 mr-1 text-blue-600" />
          医生审核建议
        </h3>
        <div class="min-h-[150px]">
          <textarea
              v-model="reportStore.drugAdvice"
              placeholder="请审核并编辑AI建议，或输入您的开药建议..."
              class="w-full h-full min-h-[150px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
          ></textarea>
        </div>
      </div>

      <!-- AI生成内容 - 下方，仅在有内容时显示 -->
      <div v-if="aiRecommendation" class="space-y-2">
        <h3 class="text-sm font-medium text-gray-700 flex items-center">
          <Bot class="h-4 w-4 mr-1 text-green-600" />
          AI生成建议
        </h3>
        <div class="min-h-[150px] p-4 border border-gray-200 rounded-md bg-gray-50">
          <div class="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">
            {{ aiRecommendation }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { RefreshCw, Bot, User } from 'lucide-vue-next';
import {useReportStore} from "../../../stores/reportStore.ts";

const isGenerating = ref(false);
const aiRecommendation = ref('');
const reportStore = useReportStore();
const additionalRequirement = ref('');

const generateRecommendation = async () => {
  isGenerating.value = true;
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 2000));

    let baseRecommendation = `基于患者症状，建议使用以下药物：

1. 阿莫西林胶囊 0.5g
   - 用法：每日3次，饭后服用
   - 疗程：7-10天

2. 布洛芬缓释胶囊 0.3g
   - 用法：每日2次，饭后服用
   - 注意：避免空腹服用

3. 维生素C片 0.1g
   - 用法：每日1次
   - 作用：增强免疫力`;

    // 如果有额外要求，添加到建议中
    if (additionalRequirement.value.trim()) {
      baseRecommendation += `\n\n根据您的额外要求"${additionalRequirement.value}"，补充建议：\n- 请密切观察患者反应\n- 如有不适请及时调整用药`;
    }

    aiRecommendation.value = baseRecommendation;
  } finally {
    isGenerating.value = false;
  }
};
</script>
