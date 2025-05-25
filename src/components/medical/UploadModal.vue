<template>
  <Transition name="modal-fade">
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black bg-opacity-50" @click="closeModal"></div>

      <div class="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden">
        <div class="flex justify-between items-center p-4 border-b border-gray-200">
          <h3 class="text-xl font-semibold text-gray-900">上传病历</h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
            <X class="h-5 w-5" />
          </button>
        </div>

        <div class="p-6">
          <!-- 文件上传区域 -->
          <div
              @drop="handleDrop"
              @dragover="handleDragOver"
              @dragleave="handleDragLeave"
              @click="triggerFileInput"
              class="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors"
              :class="{
                'border-green-300 bg-green-50': isDragOver,
                'border-gray-300': !isDragOver && !selectedFile,
                'border-green-500 bg-green-50': selectedFile && !isAnalyzing
              }"
          >
            <!-- 上传图标和文本 -->
            <div v-if="!selectedFile && !isAnalyzing">
              <Upload class="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p class="text-gray-600 mb-2">拖拽文件到此处或点击上传</p>
              <p class="text-sm text-gray-500">支持 txt 格式（demo）</p>
            </div>

            <!-- 已选择文件显示 -->
            <div v-else-if="selectedFile && !isAnalyzing" class="space-y-3">
              <div class="flex items-center justify-center">
                <FileText class="h-8 w-8 text-green-600 mr-2" />
                <span class="text-gray-700 font-medium">{{ selectedFile.name }}</span>
              </div>
              <p class="text-sm text-gray-500">文件大小: {{ formatFileSize(selectedFile.size) }}</p>
              <button
                  @click.stop="removeFile"
                  class="text-red-500 hover:text-red-700 text-sm underline"
              >
                移除文件
              </button>
            </div>

            <!-- 解析中状态 -->
            <div v-else-if="isAnalyzing" class="space-y-4">
              <div class="flex items-center justify-center">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              </div>
              <p class="text-gray-600 font-medium">解析中...</p>
              <p class="text-sm text-gray-500">正在分析病历内容，请稍候</p>
            </div>

            <!-- 隐藏的文件输入 -->
            <input
                ref="fileInput"
                type="file"
                class="hidden"
                accept=".txt"
                @change="handleFileSelect"
            />
          </div>

          <!-- 错误信息显示 -->
          <div v-if="errorMessage" class="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p class="text-red-600 text-sm">{{ errorMessage }}</p>
          </div>

          <!-- 成功信息显示 -->
          <div v-if="successMessage" class="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
            <p class="text-green-600 text-sm">{{ successMessage }}</p>
          </div>
        </div>

        <div class="flex justify-end p-4 border-t border-gray-200 bg-gray-50 space-x-3">
          <button
              @click="closeModal"
              class="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
          >
            取消
          </button>
          <button
              @click="startAnalysis"
              :disabled="!selectedFile || isAnalyzing"
              class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {{ isAnalyzing ? '解析中...' : '开始解析' }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, inject } from 'vue';
import { X, Upload, FileText } from 'lucide-vue-next';
import { analysePatientInfo } from '../../api/LLMcomponents.ts';
import type { PatientInfo } from '../../models/LLMResponseModels.ts';
import { useReportStore } from '../../stores/reportStore.ts';

const reportStore = useReportStore();
const showToast = inject<(message: string, type?: 'success' | 'like' | 'dislike') => void>('showToast');

defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

// 状态管理
const selectedFile = ref<File | null>(null);
const isAnalyzing = ref(false);
const isDragOver = ref(false);
const errorMessage = ref('');
const successMessage = ref('');
const fileInput = ref<HTMLInputElement | null>(null);

// 文件大小格式化
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// 验证文件类型
const validateFile = (file: File): boolean => {
  const allowedTypes = ['text/plain'];
  const allowedExtensions = ['.txt'];

  const isValidType = allowedTypes.includes(file.type);
  const isValidExtension = allowedExtensions.some(ext =>
      file.name.toLowerCase().endsWith(ext)
  );

  return isValidType || isValidExtension;
};

// 读取文件内容
const readFileContent = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      resolve(content);
    };
    reader.onerror = () => {
      reject(new Error('文件读取失败'));
    };
    reader.readAsText(file, 'UTF-8');
  });
};

// 处理文件选择
const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const files = target.files;

  if (files && files.length > 0) {
    processFile(files[0]);
  }
};

// 处理拖拽
const handleDrop = (event: DragEvent) => {
  event.preventDefault();
  isDragOver.value = false;

  const files = event.dataTransfer?.files;
  if (files && files.length > 0) {
    processFile(files[0]);
  }
};

const handleDragOver = (event: DragEvent) => {
  event.preventDefault();
  isDragOver.value = true;
};

const handleDragLeave = (event: DragEvent) => {
  event.preventDefault();
  isDragOver.value = false;
};

// 触发文件选择
const triggerFileInput = () => {
  if (!isAnalyzing.value) {
    fileInput.value?.click();
  }
};

// 处理文件
const processFile = (file: File) => {
  clearMessages();

  // 验证文件类型
  if (!validateFile(file)) {
    errorMessage.value = '请选择 txt 格式的文件';
    return;
  }

  // 验证文件大小 (限制为 10MB)
  if (file.size > 10 * 1024 * 1024) {
    errorMessage.value = '文件大小不能超过 10MB';
    return;
  }

  selectedFile.value = file;
  successMessage.value = '文件选择成功，点击"开始解析"进行分析';
};

// 移除文件
const removeFile = () => {
  selectedFile.value = null;
  clearMessages();
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

// 清除消息
const clearMessages = () => {
  errorMessage.value = '';
  successMessage.value = '';
};

// 开始分析
const startAnalysis = async () => {
  if (!selectedFile.value) {
    errorMessage.value = '请先选择文件';
    return;
  }

  isAnalyzing.value = true;
  clearMessages();

  try {
    // 读取文件内容
    const fileContent = await readFileContent(selectedFile.value);

    if (!fileContent.trim()) {
      throw new Error('文件内容为空');
    }
    console.log(fileContent)

    // 调用 API 分析患者信息
    const patientInfo: PatientInfo = await analysePatientInfo(fileContent);

    // 更新 store 中的患者信息
    reportStore.patientName = patientInfo.patient_name;
    reportStore.patientAge = patientInfo.patient_age;
    reportStore.patientGender = patientInfo.patient_gender;
    reportStore.medicalHistory = patientInfo.patient_medical_history;

    successMessage.value = '病历解析成功！患者信息已自动填入表单';
    showToast?.('病历解析成功，患者信息已更新', 'success');

    // 延迟关闭弹窗，让用户看到成功消息
    setTimeout(() => {
      closeModal();
    }, 2000);

  } catch (error) {
    console.error('分析失败:', error);
    errorMessage.value = error instanceof Error ? error.message : '分析失败，请重试';
    showToast?.('病历解析失败，请检查文件格式', 'dislike');
  } finally {
    isAnalyzing.value = false;
  }
};

// 关闭弹窗
const closeModal = () => {
  if (!isAnalyzing.value) {
    // 重置状态
    selectedFile.value = null;
    clearMessages();
    if (fileInput.value) {
      fileInput.value.value = '';
    }
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

/* 拖拽时的视觉反馈 */
.border-dashed {
  transition: all 0.2s ease;
}
</style>
