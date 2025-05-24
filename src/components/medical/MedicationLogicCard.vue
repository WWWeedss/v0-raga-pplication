<template>
  <div class="bg-white rounded-lg border border-gray-200 p-6">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-lg font-semibold text-gray-900">开药逻辑（医生询问LLM，选择填入）</h2>
      <button
          @click="generateLogic"
          :disabled="isGenerating"
          class="flex items-center space-x-2 px-4 py-2 bg-green-400 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <RefreshCw class="h-4 w-4" :class="{ 'animate-spin': isGenerating }" />
        <span>{{ isGenerating ? '生成中...' : '一键生成' }}</span>
      </button>
    </div>

    <div class="min-h-[200px] p-4 border border-gray-200 rounded-md">
      <textarea
          v-model="logic"
          placeholder="请输入审核后的开药逻辑..."
          rows="8"
          class="w-full h-full border-none outline-none resize-none"
      ></textarea>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { RefreshCw } from 'lucide-vue-next';

const isGenerating = ref(false);
const logic = ref('');

const generateLogic = async () => {
  isGenerating.value = true;
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 2000));
    logic.value = '开药逻辑：\n1. 患者主诉发热、咳嗽，考虑上呼吸道感染\n2. 阿莫西林用于抗感染治疗\n3. 布洛芬用于退热止痛\n4. 维生素C增强免疫力';
  } finally {
    isGenerating.value = false;
  }
};
</script>
