<template>
  <div class="bg-white rounded-lg border border-gray-200 p-6">
    <h2 class="text-lg font-semibold text-gray-900 mb-4">症状描述</h2>
    <textarea
        v-model="reportStore.symptomsDescription"
        placeholder="请输入患者症状描述..."
        rows="6"
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
    ></textarea>
  </div>
</template>

<script setup lang="ts">
import {useReportStore} from "../../../stores/reportStore.ts";

const reportStore = useReportStore();

</script>
