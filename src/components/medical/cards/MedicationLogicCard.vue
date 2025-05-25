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
          <span>{{ isGenerating ? '生成中...' : '一键生成' }}</span>
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
              v-model="doctorLogic"
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

const isGenerating = ref(false);
const aiLogic = ref('');
const doctorLogic = ref('');
const additionalRequirement = ref('');

const generateLogic = async () => {
  isGenerating.value = true;
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 2000));

    let baseLogic = `开药逻辑分析：

1. 症状分析
   - 患者主诉发热、咳嗽
   - 体温38.5°C，持续2天
   - 咳嗽有痰，无血丝

2. 诊断依据
   - 临床症状符合上呼吸道感染
   - 血常规显示白细胞轻度升高
   - 胸片未见明显异常

3. 用药原理
   - 阿莫西林：广谱抗生素，针对细菌感染
   - 布洛芬：解热镇痛，缓解发热症状
   - 维生素C：辅助治疗，增强免疫力`;

    // 如果有额外要求，添加到逻辑中
    if (additionalRequirement.value.trim()) {
      baseLogic += `\n\n根据您的额外要求"${additionalRequirement.value}"，补充分析：\n- 需要考虑患者个体差异\n- 建议定期复查评估疗效`;
    }

    aiLogic.value = baseLogic;
  } finally {
    isGenerating.value = false;
  }
};
</script>
