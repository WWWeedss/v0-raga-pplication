<template>
  <div class="bg-white rounded-lg border border-gray-200 p-6">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-lg font-semibold text-gray-900">病史</h2>
      <div class="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-full">
        可手动编辑或通过上传病历自动填入
      </div>
    </div>

    <div class="min-h-[120px]">
      <textarea
          v-model="reportStore.medicalHistory"
          placeholder="请输入患者病史信息，或通过上传病历自动生成..."
          rows="6"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
      ></textarea>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useReportStore} from "../../../stores/reportStore.ts";

const reportStore = useReportStore();
</script>
