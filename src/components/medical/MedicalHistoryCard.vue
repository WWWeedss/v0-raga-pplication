<template>
  <div class="bg-white rounded-lg border border-gray-200 p-6">
    <h2 class="text-lg font-semibold text-gray-900 mb-4">病史（自动生成）</h2>
    <div class="min-h-[120px] p-4 border border-gray-200 rounded-md bg-gray-50">
      <div v-if="history" class="text-gray-700">
        {{ history }}
      </div>
      <div v-else class="text-gray-500">
        病史信息将根据上传的病历自动生成
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const history = ref('');
</script>
