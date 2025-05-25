<template>
  <div class="bg-white rounded-lg border border-gray-200 p-6">
    <h2 class="text-lg font-semibold text-gray-900 mb-4">患者基本信息</h2>
    <div class="grid grid-cols-3 gap-4">
      <div class="space-y-2">
        <label class="block text-sm font-medium text-gray-700">患者姓名</label>
        <input
            type="text"
            v-model="reportStore.patientName"
            placeholder="自动生成"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>
      <div class="space-y-2">
        <label class="block text-sm font-medium text-gray-700">患者年龄</label>
        <input
            type="text"
            v-model="reportStore.patientAge"
            placeholder="自动生成"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>
      <div class="space-y-2">
        <label class="block text-sm font-medium text-gray-700">患者性别</label>
        <input
            type="text"
            v-model="reportStore.patientGender"
            placeholder="自动生成"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useReportStore} from "../../../stores/reportStore.ts";

const reportStore = useReportStore();
</script>
