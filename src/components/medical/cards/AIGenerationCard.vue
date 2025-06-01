<template>
  <div class="bg-white rounded-lg border border-gray-200 p-6">
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center space-x-2">
        <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
          <Bot class="h-4 w-4 text-green-600" />
        </div>
        <h2 class="text-lg font-semibold text-gray-900">AI智能生成</h2>
      </div>
      <div class="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-full">
        基于症状描述生成诊疗建议
      </div>
    </div>

    <div class="space-y-4">
      <!-- 生成要求输入框 -->
      <div class="space-y-2">
        <label class="block text-sm font-medium text-gray-700">
          生成要求 <span class="text-gray-400">(可选)</span>
        </label>
        <textarea
            v-model="additionalRequirement"
            placeholder="请输入特殊要求或注意事项，例如：患者对青霉素过敏、需要考虑儿童用药等..."
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none text-sm"
        ></textarea>
      </div>

      <!-- 生成按钮区域 -->
      <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div class="flex items-center space-x-2 text-sm text-gray-600">
          <Sparkles class="h-4 w-4 text-green-600" />
          <span>将生成：开药建议、开药逻辑、保健建议，注意会覆盖已有内容！</span>
        </div>
        <button
            @click="generateAllRecommendations"
            :disabled="isGenerating || !reportStore.symptomsDescription.trim()"
            class="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
        >
          <RefreshCw class="h-4 w-4" :class="{ 'animate-spin': isGenerating }" />
          <span>{{ isGenerating ? '生成中...' : '一键生成' }}</span>
        </button>
      </div>

      <!-- 生成进度指示 -->
      <div v-if="isGenerating" class="space-y-2">
        <div class="flex items-center justify-between text-sm">
          <span class="text-gray-600">生成进度</span>
          <span class="text-gray-600">{{ currentStep }}/3</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div
              class="bg-green-600 h-2 rounded-full transition-all duration-500"
              :style="{ width: `${(currentStep / 3) * 100}%` }"
          ></div>
        </div>
        <div class="text-xs text-gray-500 text-center">
          {{ generationSteps[currentStep - 1] || '准备中...' }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Bot, Sparkles, RefreshCw } from 'lucide-vue-next';
import { useReportStore } from "../../../stores/reportStore.ts";
import {
  generateHealthyAdviceResponse,
  generateMedicalLogicResponse,
  generateMedicalRecommendationResponse
} from "../../../api/ReportComponents.ts";

const reportStore = useReportStore();
const isGenerating = ref(false);
const additionalRequirement = ref('');
const currentStep = ref(0);

const generationSteps = [
  '正在生成开药建议...',
  '正在生成开药逻辑...',
  '正在生成保健建议...'
];

const generateAllRecommendations = async () => {
  if (!reportStore.symptomsDescription.trim()) {
    return;
  }

  isGenerating.value = true;
  currentStep.value = 0;

  try {
    // 步骤1：生成开药建议
    currentStep.value = 1;
    reportStore.drugAdvice = await generateMedicalRecommendationResponse(reportStore, additionalRequirement.value);

    // 步骤2：生成开药逻辑
    currentStep.value = 2;
    reportStore.drugLogic = await generateMedicalLogicResponse(reportStore, additionalRequirement.value);

    // 步骤3：生成保健建议
    currentStep.value = 3;
    reportStore.healthAdvice = await generateHealthyAdviceResponse(reportStore, additionalRequirement.value);

  } finally {
    isGenerating.value = false;
    currentStep.value = 0;
  }
};
</script>
