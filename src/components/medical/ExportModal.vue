<template>
  <Transition name="modal-fade">
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black bg-opacity-50" @click="closeModal"></div>

      <div class="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden">
        <div class="flex justify-between items-center p-4 border-b border-gray-200">
          <h3 class="text-xl font-semibold text-gray-900">导出报告</h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
            <X class="h-5 w-5" />
          </button>
        </div>

        <div class="p-6 space-y-4">
          <!-- 导出格式选择 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">导出格式</label>
            <select
                v-model="selectedFormat"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="txt">TXT 格式 (.txt)</option>
              <option value="html">HTML 格式 (.html)</option>
              <option value="csv">CSV 格式 (.csv)</option>
              <option value="json">JSON 格式 (.json)</option>
            </select>
          </div>

          <!-- 包含内容选择 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">包含内容</label>
            <div class="space-y-2">
              <label class="flex items-center">
                <input
                    type="checkbox"
                    v-model="includePatientInfo"
                    class="mr-2 rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <span class="text-sm">患者基本信息</span>
              </label>
              <label class="flex items-center">
                <input
                    type="checkbox"
                    v-model="includeMedicalHistory"
                    class="mr-2 rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <span class="text-sm">病史信息</span>
              </label>
              <label class="flex items-center">
                <input
                    type="checkbox"
                    v-model="includeSymptomsDescription"
                    class="mr-2 rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <span class="text-sm">症状描述</span>
              </label>
              <label class="flex items-center">
                <input
                    type="checkbox"
                    v-model="includeDrugAdvice"
                    class="mr-2 rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <span class="text-sm">开药建议</span>
              </label>
              <label class="flex items-center">
                <input
                    type="checkbox"
                    v-model="includeDrugLogic"
                    class="mr-2 rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <span class="text-sm">开药逻辑</span>
              </label>
              <label class="flex items-center">
                <input
                    type="checkbox"
                    v-model="includeHealthAdvice"
                    class="mr-2 rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <span class="text-sm">保健建议</span>
              </label>
            </div>
          </div>

          <!-- 文件名设置 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">文件名</label>
            <input
                v-model="fileName"
                type="text"
                placeholder="医疗报告"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <p class="text-xs text-gray-500 mt-1">不需要包含文件扩展名</p>
          </div>

          <!-- 导出状态 -->
          <div v-if="isExporting" class="flex items-center justify-center p-4 bg-green-50 rounded-md">
            <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-green-600 mr-2"></div>
            <span class="text-green-700">正在生成文件...</span>
          </div>

          <!-- 错误信息 -->
          <div v-if="errorMessage" class="p-3 bg-red-50 border border-red-200 rounded-md">
            <p class="text-red-600 text-sm">{{ errorMessage }}</p>
          </div>
        </div>

        <div class="flex justify-end p-4 border-t border-gray-200 bg-gray-50 space-x-3">
          <button
              @click="closeModal"
              :disabled="isExporting"
              class="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50 transition-colors"
          >
            取消
          </button>
          <button
              @click="exportReport"
              :disabled="isExporting || !hasSelectedContent"
              class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {{ isExporting ? '导出中...' : '导出报告' }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed, inject } from 'vue';
import { X } from 'lucide-vue-next';
import { useReportStore } from '../../stores/reportStore.ts';

const reportStore = useReportStore();
const showToast = inject<(message: string, type?: 'success' | 'like' | 'dislike') => void>('showToast');

defineProps<{
  isOpen: boolean;
}>();
const emit = defineEmits<{
  (e: 'close'): void;
}>();

// 导出配置
const selectedFormat = ref('txt');
const fileName = ref('医疗报告');
const isExporting = ref(false);
const errorMessage = ref('');

// 内容选择
const includePatientInfo = ref(true);
const includeMedicalHistory = ref(true);
const includeSymptomsDescription = ref(true);
const includeDrugAdvice = ref(true);
const includeDrugLogic = ref(true);
const includeHealthAdvice = ref(true);

// 检查是否选择了内容
const hasSelectedContent = computed(() => {
  return includePatientInfo.value ||
      includeMedicalHistory.value ||
      includeSymptomsDescription.value ||
      includeDrugAdvice.value ||
      includeDrugLogic.value ||
      includeHealthAdvice.value;
});

// 生成当前时间戳
const getCurrentTimestamp = (): string => {
  const now = new Date();
  return now.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

// 生成 TXT 格式内容
const generateTxtContent = (): string => {
  let content = `医疗诊疗报告\n`;
  content += `生成时间：${getCurrentTimestamp()}\n`;
  content += `${'='.repeat(50)}\n\n`;

  if (includePatientInfo.value) {
    content += `患者基本信息\n`;
    content += `${'-'.repeat(20)}\n`;
    content += `姓名：${reportStore.patientName || '未填写'}\n`;
    content += `年龄：${reportStore.patientAge || '未填写'}\n`;
    content += `性别：${reportStore.patientGender || '未填写'}\n\n`;
  }

  if (includeMedicalHistory.value && reportStore.medicalHistory) {
    content += `病史信息\n`;
    content += `${'-'.repeat(20)}\n`;
    content += `${reportStore.medicalHistory}\n\n`;
  }

  if (includeSymptomsDescription.value && reportStore.symptomsDescription) {
    content += `症状描述\n`;
    content += `${'-'.repeat(20)}\n`;
    content += `${reportStore.symptomsDescription}\n\n`;
  }

  if (includeDrugAdvice.value && reportStore.drugAdvice) {
    content += `开药建议\n`;
    content += `${'-'.repeat(20)}\n`;
    content += `${reportStore.drugAdvice}\n\n`;
  }

  if (includeDrugLogic.value && reportStore.drugLogic) {
    content += `开药逻辑\n`;
    content += `${'-'.repeat(20)}\n`;
    content += `${reportStore.drugLogic}\n\n`;
  }

  if (includeHealthAdvice.value && reportStore.healthAdvice) {
    content += `保健建议\n`;
    content += `${'-'.repeat(20)}\n`;
    content += `${reportStore.healthAdvice}\n\n`;
  }

  content += `${'='.repeat(50)}\n`;
  content += `报告结束\n`;

  return content;
};

// 生成 HTML 格式内容
const generateHtmlContent = (): string => {
  let html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>医疗诊疗报告</title>
    <style>
        body { font-family: 'Microsoft YaHei', Arial, sans-serif; line-height: 1.6; margin: 40px; color: #333; }
        .header { text-align: center; border-bottom: 2px solid #4CAF50; padding-bottom: 20px; margin-bottom: 30px; }
        .title { color: #2E7D32; font-size: 28px; margin-bottom: 10px; }
        .timestamp { color: #666; font-size: 14px; }
        .section { margin-bottom: 25px; }
        .section-title { color: #2E7D32; font-size: 18px; font-weight: bold; border-left: 4px solid #4CAF50; padding-left: 10px; margin-bottom: 10px; }
        .content { background-color: #f9f9f9; padding: 15px; border-radius: 5px; white-space: pre-wrap; }
        .patient-info { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px; }
        .info-item { background-color: #e8f5e8; padding: 10px; border-radius: 5px; }
        .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class="header">
        <h1 class="title">医疗诊疗报告</h1>
        <p class="timestamp">生成时间：${getCurrentTimestamp()}</p>
    </div>`;

  if (includePatientInfo.value) {
    html += `
    <div class="section">
        <h2 class="section-title">患者基本信息</h2>
        <div class="patient-info">
            <div class="info-item"><strong>姓名：</strong>${reportStore.patientName || '未填写'}</div>
            <div class="info-item"><strong>年龄：</strong>${reportStore.patientAge || '未填写'}</div>
            <div class="info-item"><strong>性别：</strong>${reportStore.patientGender || '未填写'}</div>
        </div>
    </div>`;
  }

  if (includeMedicalHistory.value && reportStore.medicalHistory) {
    html += `
    <div class="section">
        <h2 class="section-title">病史信息</h2>
        <div class="content">${reportStore.medicalHistory}</div>
    </div>`;
  }

  if (includeSymptomsDescription.value && reportStore.symptomsDescription) {
    html += `
    <div class="section">
        <h2 class="section-title">症状描述</h2>
        <div class="content">${reportStore.symptomsDescription}</div>
    </div>`;
  }

  if (includeDrugAdvice.value && reportStore.drugAdvice) {
    html += `
    <div class="section">
        <h2 class="section-title">开药建议</h2>
        <div class="content">${reportStore.drugAdvice}</div>
    </div>`;
  }

  if (includeDrugLogic.value && reportStore.drugLogic) {
    html += `
    <div class="section">
        <h2 class="section-title">开药逻辑</h2>
        <div class="content">${reportStore.drugLogic}</div>
    </div>`;
  }

  if (includeHealthAdvice.value && reportStore.healthAdvice) {
    html += `
    <div class="section">
        <h2 class="section-title">保健建议</h2>
        <div class="content">${reportStore.healthAdvice}</div>
    </div>`;
  }

  html += `
    <div class="footer">
        <p>此报告由智能诊疗辅助系统生成</p>
    </div>
</body>
</html>`;

  return html;
};

// 生成 CSV 格式内容
const generateCsvContent = (): string => {
  let csv = '项目,内容\n';
  csv += `生成时间,"${getCurrentTimestamp()}"\n`;

  if (includePatientInfo.value) {
    csv += `患者姓名,"${(reportStore.patientName || '未填写').replace(/"/g, '""')}"\n`;
    csv += `患者年龄,"${(reportStore.patientAge || '未填写').replace(/"/g, '""')}"\n`;
    csv += `患者性别,"${(reportStore.patientGender || '未填写').replace(/"/g, '""')}"\n`;
  }

  if (includeMedicalHistory.value && reportStore.medicalHistory) {
    csv += `病史信息,"${reportStore.medicalHistory.replace(/"/g, '""').replace(/\n/g, ' ')}"\n`;
  }

  if (includeSymptomsDescription.value && reportStore.symptomsDescription) {
    csv += `症状描述,"${reportStore.symptomsDescription.replace(/"/g, '""').replace(/\n/g, ' ')}"\n`;
  }

  if (includeDrugAdvice.value && reportStore.drugAdvice) {
    csv += `开药建议,"${reportStore.drugAdvice.replace(/"/g, '""').replace(/\n/g, ' ')}"\n`;
  }

  if (includeDrugLogic.value && reportStore.drugLogic) {
    csv += `开药逻辑,"${reportStore.drugLogic.replace(/"/g, '""').replace(/\n/g, ' ')}"\n`;
  }

  if (includeHealthAdvice.value && reportStore.healthAdvice) {
    csv += `保健建议,"${reportStore.healthAdvice.replace(/"/g, '""').replace(/\n/g, ' ')}"\n`;
  }

  return csv;
};

// 生成 JSON 格式内容
const generateJsonContent = (): string => {
  const data: any = {
    reportInfo: {
      title: '医疗诊疗报告',
      generatedAt: getCurrentTimestamp(),
      format: 'JSON'
    }
  };

  if (includePatientInfo.value) {
    data.patientInfo = {
      name: reportStore.patientName || '未填写',
      age: reportStore.patientAge || '未填写',
      gender: reportStore.patientGender || '未填写'
    };
  }

  if (includeMedicalHistory.value && reportStore.medicalHistory) {
    data.medicalHistory = reportStore.medicalHistory;
  }

  if (includeSymptomsDescription.value && reportStore.symptomsDescription) {
    data.symptomsDescription = reportStore.symptomsDescription;
  }

  if (includeDrugAdvice.value && reportStore.drugAdvice) {
    data.drugAdvice = reportStore.drugAdvice;
  }

  if (includeDrugLogic.value && reportStore.drugLogic) {
    data.drugLogic = reportStore.drugLogic;
  }

  if (includeHealthAdvice.value && reportStore.healthAdvice) {
    data.healthAdvice = reportStore.healthAdvice;
  }

  return JSON.stringify(data, null, 2);
};

// 下载文件
const downloadFile = (content: string, filename: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// 导出报告
const exportReport = async () => {
  if (!hasSelectedContent.value) {
    errorMessage.value = '请至少选择一项内容进行导出';
    return;
  }

  isExporting.value = true;
  errorMessage.value = '';

  try {
    let content = '';
    let mimeType = '';
    let fileExtension = '';

    switch (selectedFormat.value) {
      case 'txt':
        content = generateTxtContent();
        mimeType = 'text/plain;charset=utf-8';
        fileExtension = '.txt';
        break;
      case 'html':
        content = generateHtmlContent();
        mimeType = 'text/html;charset=utf-8';
        fileExtension = '.html';
        break;
      case 'csv':
        content = generateCsvContent();
        mimeType = 'text/csv;charset=utf-8';
        fileExtension = '.csv';
        break;
      case 'json':
        content = generateJsonContent();
        mimeType = 'application/json;charset=utf-8';
        fileExtension = '.json';
        break;
      default:
        throw new Error('不支持的文件格式');
    }

    // 模拟处理时间
    await new Promise(resolve => setTimeout(resolve, 1000));

    const finalFileName = (fileName.value || '医疗报告') + fileExtension;
    downloadFile(content, finalFileName, mimeType);

    showToast?.(`报告已成功导出为 ${selectedFormat.value.toUpperCase()} 格式`, 'success');
    closeModal();

  } catch (error) {
    console.error('导出失败:', error);
    errorMessage.value = error instanceof Error ? error.message : '导出失败，请重试';
    showToast?.('报告导出失败', 'dislike');
  } finally {
    isExporting.value = false;
  }
};

// 关闭弹窗
const closeModal = () => {
  if (!isExporting.value) {
    errorMessage.value = '';
    emit('close');
  }
};
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
