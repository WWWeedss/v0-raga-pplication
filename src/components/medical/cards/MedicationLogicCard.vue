<template>
  <div class="bg-white rounded-lg border border-gray-200 p-6">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-lg font-semibold text-gray-900">开药逻辑</h2>
      <div class="flex items-center space-x-2">
        <input
            v-model="additionalRequirement"
            placeholder="输入进一步生成要求..."
            class="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent w-64"
        />
        <button
            @click="generateLogic"
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
          医生审核逻辑
        </h3>
        <div class="min-h-[150px]">
          <textarea
              v-model="reportStore.drugLogic"
              placeholder="请审核并编辑AI逻辑，或输入您的开药逻辑..."
              class="w-full h-full min-h-[150px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
          ></textarea>
        </div>
      </div>

      <!-- AI生成内容 - 下方，仅在有内容时显示 -->
      <div v-if="aiLogic" class="space-y-2">
        <h3 class="text-sm font-medium text-gray-700 flex items-center">
          <Bot class="h-4 w-4 mr-1 text-green-600" />
          AI生成逻辑
        </h3>
        <div class="min-h-[150px] p-4 border border-gray-200 rounded-md bg-gray-50">
          <div class="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">
            {{ aiLogic }}
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
import {generateMedicalLogicResponse} from "../../../api/ReportComponents.ts";

const isGenerating = ref(false);
const aiLogic = ref('');
const reportStore = useReportStore();
const additionalRequirement = ref('');

const generateLogic = async () => {
  if (reportStore.drugAdvice.trim() === '') {
    aiLogic.value = "开药单据为空，无法生成开药逻辑。请先输入开药建议。";
    return;
  }
  isGenerating.value = true;
  try {
    aiLogic.value = await generateMedicalLogicResponse(reportStore, additionalRequirement.value);
  } finally {
    isGenerating.value = false;
  }
};

</script>
