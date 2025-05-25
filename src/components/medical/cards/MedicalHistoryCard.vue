<template>
  <div class="bg-white rounded-lg border border-gray-200 p-6">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-lg font-semibold text-gray-900">病史</h2>
      <button
          @click="toggleEdit"
          class="flex items-center space-x-2 px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
      >
        <Edit class="h-4 w-4" />
        <span>{{ isEditing ? '保存' : '编辑' }}</span>
      </button>
    </div>

    <div class="min-h-[120px]">
      <div v-if="!isEditing" class="p-4 border border-gray-200 rounded-md bg-gray-50">
        <div v-if="reportStore.medicalHistory" class="text-gray-700 whitespace-pre-wrap">
          {{ reportStore.medicalHistory }}
        </div>
        <div v-else class="text-gray-500">
          病史信息将根据上传的病历自动生成，或可手动编辑
        </div>
      </div>

      <div v-else>
        <textarea
            v-model="editableHistory"
            placeholder="请输入患者病史信息..."
            rows="6"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
        ></textarea>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Edit } from 'lucide-vue-next';
import {useReportStore} from "../../../stores/reportStore.ts";

const reportStore = useReportStore();
const editableHistory = ref(reportStore.medicalHistory);
const isEditing = ref(false);

const toggleEdit = () => {
  if (isEditing.value) {
    // 保存编辑
    reportStore.medicalHistory = editableHistory.value;
  } else {
    // 开始编辑
    editableHistory.value = reportStore.medicalHistory;
  }
  isEditing.value = !isEditing.value;
};
</script>
