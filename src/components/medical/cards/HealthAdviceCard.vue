<template>
  <div class="bg-white rounded-lg border border-gray-200 p-6">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-lg font-semibold text-gray-900">保健建议（仅个人建议，非处方）</h2>
      <div class="flex items-center space-x-2">
        <input
            v-model="additionalRequirement"
            placeholder="输入进一步生成要求..."
            class="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent w-64"
        />
        <button
            @click="generateAdvice"
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
          医生补充建议
        </h3>
        <div class="min-h-[150px]">
          <textarea
              v-model="reportStore.healthAdvice"
              placeholder="请审核并补充AI建议，或输入您的保健建议..."
              class="w-full h-full min-h-[150px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
          ></textarea>
        </div>
      </div>

      <!-- AI生成内容 - 下方，仅在有内容时显示 -->
      <div v-if="aiAdvice" class="space-y-2">
        <h3 class="text-sm font-medium text-gray-700 flex items-center">
          <Bot class="h-4 w-4 mr-1 text-green-600" />
          AI生成建议
        </h3>
        <div class="min-h-[150px] p-4 border border-gray-200 rounded-md bg-gray-50">
          <div class="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">
            {{ aiAdvice }}
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
import {generateHealthyAdviceResponse} from "../../../api/ReportComponents.ts";

const isGenerating = ref(false);
const aiAdvice = ref('');
const additionalRequirement = ref('');
const reportStore = useReportStore();

const generateAdvice = async () => {
  isGenerating.value = true;
  try {
    aiAdvice.value = await generateHealthyAdviceResponse(reportStore, additionalRequirement.value);
  } finally {
    isGenerating.value = false;
  }
};


</script>
