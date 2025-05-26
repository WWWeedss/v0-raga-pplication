<template>
  <Transition name="modal-fade">
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black bg-opacity-50" @click="closeModal"></div>

      <div class="relative bg-white rounded-lg shadow-xl w-full max-w-6xl mx-4 overflow-hidden max-h-[70vh]">
        <div class="flex justify-between items-center p-6 border-b border-gray-200">
          <h3 class="text-xl font-semibold text-gray-900">知识库管理</h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
            <X class="h-5 w-5" />
          </button>
        </div>

        <div class="flex h-[calc(70vh-80px)]">
          <!-- 左侧：上传区域 -->
          <div class="w-1/3 border-r border-gray-200 p-6 overflow-y-auto">
            <h4 class="font-medium text-gray-900 mb-4">上传知识库文件</h4>

            <!-- 知识库类型选择 -->
            <div class="space-y-3 mb-6">
              <div
                  v-for="type in knowledgeTypes"
                  :key="type.value"
                  @click="selectedType = type.value"
                  class="relative p-3 border-2 rounded-lg cursor-pointer transition-all duration-200"
                  :class="selectedType === type.value
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'"
              >
                <div class="flex items-center space-x-3">
                  <div class="flex-shrink-0">
                    <div class="w-8 h-8 rounded-full flex items-center justify-center"
                         :class="selectedType === type.value ? 'bg-green-600' : 'bg-gray-400'">
                      <component :is="type.icon" class="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <div class="flex-1">
                    <h5 class="text-sm font-medium text-gray-900">{{ type.label }}</h5>
                    <p class="text-xs text-gray-500">{{ type.description }}</p>
                  </div>
                </div>
                <!-- 选中指示器 -->
                <div v-if="selectedType === type.value"
                     class="absolute top-2 right-2 w-4 h-4 bg-green-600 rounded-full flex items-center justify-center">
                  <Check class="h-2 w-2 text-white" />
                </div>
              </div>
            </div>

            <!-- 文件上传区域 -->
            <div class="space-y-4">
              <div class="text-xs text-gray-500 text-center">
                支持格式：.txt, .csv, .json, .xlsx
              </div>

              <!-- 拖拽上传区域 -->
              <div
                  @drop="handleDrop"
                  @dragover="handleDragOver"
                  @dragleave="handleDragLeave"
                  @click="triggerFileInput"
                  class="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200"
                  :class="{
                    'border-green-300 bg-green-50': isDragOver,
                    'border-gray-300 hover:border-gray-400': !isDragOver && !selectedFile && !isUploading,
                    'border-green-500 bg-green-50': selectedFile && !isUploading,
                    'border-gray-200 bg-gray-50': isUploading
                  }"
              >
                <!-- 上传状态显示 -->
                <div v-if="!selectedFile && !isUploading">
                  <Upload class="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p class="text-sm text-gray-600 mb-1">拖拽文件到此处或点击上传</p>
                  <p class="text-xs text-gray-500">最大 50MB</p>
                </div>

                <!-- 已选择文件显示 -->
                <div v-else-if="selectedFile && !isUploading" class="space-y-2">
                  <div class="flex items-center justify-center">
                    <component :is="getFileIcon(selectedFile.name)" class="h-6 w-6 mr-2" :class="getFileIconColor(selectedFile.name)" />
                    <span class="text-sm text-gray-700 font-medium truncate">{{ selectedFile.name }}</span>
                  </div>
                  <p class="text-xs text-gray-500">{{ formatFileSize(selectedFile.size) }}</p>
                  <button
                      @click.stop="removeFile"
                      class="text-red-500 hover:text-red-700 text-xs underline"
                  >
                    移除文件
                  </button>
                </div>

                <!-- 上传中状态 -->
                <div v-else-if="isUploading" class="space-y-3">
                  <div class="flex items-center justify-center">
                    <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
                  </div>
                  <p class="text-sm text-gray-600 font-medium">文件处理中...</p>
                  <p class="text-xs text-gray-500">请耐心等待，处理时间取决于文件大小</p>
                </div>

                <!-- 隐藏的文件输入 -->
                <input
                    ref="fileInput"
                    type="file"
                    class="hidden"
                    accept=".txt,.csv,.json,.xlsx"
                    @change="handleFileSelect"
                />
              </div>

              <!-- 错误信息显示 -->
              <div v-if="errorMessage" class="p-2 bg-red-50 border border-red-200 rounded-md">
                <p class="text-red-600 text-xs">{{ errorMessage }}</p>
              </div>

              <!-- 上传按钮 -->
              <div class="flex space-x-2">
                <button
                    @click="resetUpload"
                    :disabled="isUploading"
                    class="flex-1 px-3 py-2 text-sm text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  重置
                </button>
                <button
                    @click="startUpload"
                    :disabled="!selectedFile || !selectedType || isUploading"
                    class="flex-1 px-3 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {{ isUploading ? '处理中...' : '开始上传' }}
                </button>
              </div>
            </div>
          </div>

          <!-- 右侧：文件列表 -->
          <div class="flex-1 flex flex-col">
            <!-- 文件列表头部 -->
            <div class="p-6 border-b border-gray-200">
              <div class="flex justify-between items-center mb-4">
                <h4 class="font-medium text-gray-900">知识库文件列表</h4>
                <button
                    @click="refreshFiles"
                    :disabled="isLoading"
                    class="flex items-center space-x-1 px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <RefreshCw class="h-3 w-3" :class="{ 'animate-spin': isLoading }" />
                  <span>刷新</span>
                </button>
              </div>

              <!-- 知识库类型切换 -->
              <div class="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                <button
                    v-for="tab in knowledgeTabs"
                    :key="tab.value"
                    @click="activeTab = tab.value"
                    class="flex-1 px-3 py-1 text-xs font-medium rounded-md transition-colors"
                    :class="activeTab === tab.value
                      ? 'bg-white text-green-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'"
                >
                  <div class="flex items-center justify-center space-x-1">
                    <component :is="tab.icon" class="h-3 w-3" />
                    <span>{{ tab.label }}</span>
                    <span v-if="getFileCountByType(tab.value) > 0"
                          class="bg-gray-200 text-gray-700 px-1 py-0.5 rounded-full text-xs">
                      {{ getFileCountByType(tab.value) }}
                    </span>
                  </div>
                </button>
              </div>
            </div>

            <!-- 文件列表内容 -->
            <div class="flex-1 overflow-y-auto p-6">
              <div v-if="isLoading" class="flex justify-center items-center py-8">
                <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
                <span class="ml-2 text-sm text-gray-600">加载中...</span>
              </div>

              <div v-else-if="filteredFiles.length === 0" class="text-center py-8">
                <Database class="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p class="text-sm text-gray-500">{{ activeTab === 'all' ? '暂无知识库文件' : `暂无${getCurrentTabLabel()}文件` }}</p>
              </div>

              <div v-else class="space-y-2">
                <div
                    v-for="file in filteredFiles"
                    :key="file.file_id"
                    class="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div class="flex items-center space-x-3 flex-1 min-w-0">
                    <div class="flex-shrink-0">
                      <div class="w-8 h-8 rounded-full flex items-center justify-center"
                           :class="getFileTypeStyle(file.file_type || 'unknown')">
                        <component :is="getFileTypeIcon(file.file_type || 'unknown')" class="h-4 w-4 text-white" />
                      </div>
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center space-x-2">
                        <component :is="getFileIcon(file.file_name || '')" class="h-4 w-4 flex-shrink-0" :class="getFileIconColor(file.file_name || '')" />
                        <h5 class="text-sm font-medium text-gray-900 truncate">
                          {{ file.file_name }}
                        </h5>
                      </div>
                      <div class="flex items-center space-x-3 mt-1">
                        <span class="text-xs text-gray-500">
                          {{ getFileTypeLabel(file.file_type || 'unknown') }}
                        </span>
                        <span class="text-xs text-gray-500">
                          {{ file.entry_count || 0 }} 条记录
                        </span>
                        <span class="text-xs text-gray-500">
                          {{ formatDate(file.uploaded_at || '') }}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div class="flex items-center space-x-2">
                    <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                          :class="getFileTypeStyle(file.file_type || 'unknown', true)">
                      {{ file.entry_count || 0 }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>

  <!-- 自定义上传成功弹窗 -->
  <UploadSuccessToast
      :message="uploadSuccessMessage"
      :show="showUploadSuccess"
      :details="uploadSuccessDetails"
      @hide="showUploadSuccess = false"
  />
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import {
  X, Upload, Check, RefreshCw, Database,
  FileText, Pill, Heart, HelpCircle,
  File, FileSpreadsheet, Code, Archive
} from 'lucide-vue-next';
import {
  getKnowledgeFiles,
  uploadQaFile,
  uploadPharmaceuticalFile,
  uploadHealthFile
} from '../../api/KnowledgeComponents';
import type { KnowledgeFileResponse } from '../../models/KnowledgeFileModel';
import UploadSuccessToast from '../common/UploadSuccessToast.vue';

defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

// 知识库类型配置
const knowledgeTypes = [
  {
    value: 'qa',
    label: '医疗知识库',
    description: '医疗问答、诊断知识',
    icon: FileText
  },
  {
    value: 'pharmaceutical',
    label: '药品知识库',
    description: '药物信息、用药指导',
    icon: Pill
  },
  {
    value: 'health',
    label: '保健知识库',
    description: '健康建议、保健知识',
    icon: Heart
  }
];

// 知识库标签页配置
const knowledgeTabs = [
  { value: 'all', label: '全部', icon: Database },
  { value: 'qa', label: '医疗', icon: FileText },
  { value: 'pharmaceutical', label: '药品', icon: Pill },
  { value: 'health', label: '保健', icon: Heart }
];

// 状态管理
const activeTab = ref<string>('all');
const selectedType = ref<string>('qa');
const selectedFile = ref<File | null>(null);
const isUploading = ref(false);
const isLoading = ref(false);
const isDragOver = ref(false);
const errorMessage = ref('');
const fileInput = ref<HTMLInputElement | null>(null);
const files = ref<KnowledgeFileResponse[]>([]);

// 上传成功弹窗相关状态
const showUploadSuccess = ref(false);
const uploadSuccessMessage = ref('');
const uploadSuccessDetails = ref<{
  fileName: string;
  knowledgeType: string;
  entryCount: number;
} | undefined>(undefined);

// 计算属性
const filteredFiles = computed(() => {
  if (activeTab.value === 'all') {
    return files.value;
  }
  return files.value.filter(file => file.file_type === activeTab.value);
});

// 获取文件图标（根据文件扩展名）
const getFileIcon = (fileName: string) => {
  const ext = fileName.toLowerCase().split('.').pop();
  switch (ext) {
    case 'txt':
      return FileText;
    case 'csv':
    case 'xlsx':
      return FileSpreadsheet;
    case 'json':
      return Code;
    default:
      return File;
  }
};

// 获取文件图标颜色
const getFileIconColor = (fileName: string) => {
  const ext = fileName.toLowerCase().split('.').pop();
  switch (ext) {
    case 'txt':
      return 'text-blue-600';
    case 'csv':
    case 'xlsx':
      return 'text-green-600';
    case 'json':
      return 'text-purple-600';
    default:
      return 'text-gray-600';
  }
};

// 获取当前标签页标签
const getCurrentTabLabel = () => {
  const tab = knowledgeTabs.find(t => t.value === activeTab.value);
  return tab ? tab.label : '文件';
};

// 获取指定类型的文件数量
const getFileCountByType = (type: string) => {
  if (type === 'all') return files.value.length;
  return files.value.filter(file => file.file_type === type).length;
};

// 获取文件类型样式
const getFileTypeStyle = (fileType: string, isTag: boolean = false) => {
  const styles = {
    qa: isTag ? 'bg-blue-100 text-blue-800' : 'bg-blue-600',
    pharmaceutical: isTag ? 'bg-green-100 text-green-800' : 'bg-green-600',
    health: isTag ? 'bg-purple-100 text-purple-800' : 'bg-purple-600',
    unknown: isTag ? 'bg-gray-100 text-gray-800' : 'bg-gray-600'
  };
  return styles[fileType as keyof typeof styles] || styles.unknown;
};

// 获取文件类型图标
const getFileTypeIcon = (fileType: string) => {
  const icons = {
    qa: FileText,
    pharmaceutical: Pill,
    health: Heart,
    unknown: HelpCircle
  };
  return icons[fileType as keyof typeof icons] || icons.unknown;
};

// 获取文件类型标签
const getFileTypeLabel = (fileType: string) => {
  const labels = {
    qa: '医疗知识库',
    pharmaceutical: '药品知识库',
    health: '保健知识库',
    unknown: '未知类型'
  };
  return labels[fileType as keyof typeof labels] || labels.unknown;
};

// 格式化文件大小
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// 格式化日期
const formatDate = (dateString: string) => {
  if (!dateString) return '未知时间';
  try {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return '时间格式错误';
  }
};

// 验证文件类型
const validateFile = (file: File): boolean => {
  const allowedTypes = ['text/plain', 'text/csv', 'application/json', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
  const allowedExtensions = ['.txt', '.csv', '.json', '.xlsx'];

  const isValidType = allowedTypes.includes(file.type);
  const isValidExtension = allowedExtensions.some(ext =>
      file.name.toLowerCase().endsWith(ext)
  );

  return isValidType || isValidExtension;
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
  if (!isUploading.value) {
    fileInput.value?.click();
  }
};

// 处理文件
const processFile = (file: File) => {
  clearError();

  // 验证文件类型
  if (!validateFile(file)) {
    errorMessage.value = '请选择支持的文件格式：.txt, .csv, .json, .xlsx';
    return;
  }

  // 验证文件大小 (限制为 50MB)
  if (file.size > 50 * 1024 * 1024) {
    errorMessage.value = '文件大小不能超过 50MB';
    return;
  }

  selectedFile.value = file;
};

// 移除文件
const removeFile = () => {
  selectedFile.value = null;
  clearError();
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

// 清除错误信息
const clearError = () => {
  errorMessage.value = '';
};

// 重置上传
const resetUpload = () => {
  selectedFile.value = null;
  clearError();
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

// 开始上传
const startUpload = async () => {
  if (!selectedFile.value || !selectedType.value) {
    errorMessage.value = '请选择文件和知识库类型';
    return;
  }

  isUploading.value = true;
  clearError();

  try {
    let response: KnowledgeFileResponse;

    // 根据选择的类型调用不同的上传接口
    switch (selectedType.value) {
      case 'qa':
        response = await uploadQaFile(selectedFile.value);
        break;
      case 'pharmaceutical':
        response = await uploadPharmaceuticalFile(selectedFile.value);
        break;
      case 'health':
        response = await uploadHealthFile(selectedFile.value);
        break;
      default:
        throw new Error('未知的知识库类型');
    }

    // 上传成功
    const typeLabel = getFileTypeLabel(selectedType.value);
    uploadSuccessMessage.value = `成功向 **${typeLabel}** 中添加 **${response.entry_count || 0}** 条知识条目`;
    uploadSuccessDetails.value = {
      fileName: selectedFile.value.name,
      knowledgeType: typeLabel,
      entryCount: response.entry_count || 0
    };
    showUploadSuccess.value = true;

    // 刷新文件列表
    await loadFiles();

    // 延迟重置，让用户看到完成状态
    setTimeout(() => {
      resetUpload();
    }, 1000);

  } catch (error) {
    console.error('上传失败:', error);
    errorMessage.value = error instanceof Error ? error.message : '上传失败，请重试';
  } finally {
    isUploading.value = false;
  }
};

// 加载文件列表
const loadFiles = async () => {
  isLoading.value = true;
  try {
    const fileType = activeTab.value === 'all' ? undefined : activeTab.value;
    files.value = await getKnowledgeFiles(fileType, 0, 1000);
  } catch (error) {
    console.error('加载文件列表失败:', error);
  } finally {
    isLoading.value = false;
  }
};

// 刷新文件列表
const refreshFiles = () => {
  loadFiles();
};

// 关闭弹窗
const closeModal = () => {
  emit('close');
};

// 监听标签页变化
watch(activeTab, () => {
  loadFiles();
});

// 页面加载时获取文件列表
onMounted(() => {
  loadFiles();
});
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

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
