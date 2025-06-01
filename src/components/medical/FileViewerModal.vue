<template>
  <Transition name="modal-fade">
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black bg-opacity-50" @click="closeModal"></div>

      <div class="relative bg-white rounded-lg shadow-xl w-full max-w-6xl mx-4 overflow-hidden max-h-[80vh]">
        <!-- 头部 -->
        <div class="flex justify-between items-center p-6 border-b border-gray-200">
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 rounded-full flex items-center justify-center"
                 :class="getFileTypeStyle(file?.file_type || 'unknown')">
              <component :is="getFileTypeIcon(file?.file_type || 'unknown')" class="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900">{{ file?.file_name || '文件查看器' }}</h3>
              <p class="text-sm text-gray-500">{{ getFileTypeLabel(file?.file_type || 'unknown') }}</p>
            </div>
          </div>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
            <X class="h-5 w-5" />
          </button>
        </div>

        <!-- 文件信息 -->
        <div v-if="file" class="px-6 py-3 bg-gray-50 border-b border-gray-200">
          <div class="flex items-center space-x-6 text-sm text-gray-600">
            <div class="flex items-center space-x-1">
              <Calendar class="h-4 w-4" />
              <span>{{ formatDate(file.uploaded_at || '') }}</span>
            </div>
            <div class="flex items-center space-x-1">
              <Hash class="h-4 w-4" />
              <span>{{ file.entry_count || 0 }} 条记录</span>
            </div>
            <div class="flex items-center space-x-1">
              <FileText class="h-4 w-4" />
              <span>{{ getFileExtension(file.file_name || '') }} 格式</span>
            </div>
          </div>
        </div>

        <!-- 内容区域 -->
        <div class="flex-1 overflow-hidden">
          <!-- 加载状态 -->
          <div v-if="isLoading" class="flex justify-center items-center py-12">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            <span class="ml-3 text-gray-600">加载文件内容中...</span>
          </div>

          <!-- 错误状态 -->
          <div v-else-if="errorMessage" class="p-6">
            <div class="bg-red-50 border border-red-200 rounded-lg p-4">
              <div class="flex items-center">
                <AlertCircle class="h-5 w-5 text-red-600 mr-2" />
                <span class="text-red-800 font-medium">加载失败</span>
              </div>
              <p class="text-red-700 mt-1">{{ errorMessage }}</p>
            </div>
          </div>

          <!-- 文件内容 -->
          <div v-else-if="fileContent" :class="getContentContainerClass()">
            <!-- JSON 格式 -->
            <div v-if="isJsonFile" class="p-6">
              <pre class="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm font-mono">{{ formattedJsonContent }}</pre>
            </div>

            <!-- XLSX 格式 - 改进的显示 -->
            <div v-else-if="isXlsxFile" class="p-6">
              <div v-if="xlsxHeaders.length > 0" class="space-y-4">
                <!-- 表格信息和控制 -->
                <div class="flex items-center justify-between mb-4">
                  <div class="flex items-center space-x-4">
                    <div class="text-sm text-gray-600">
                      共 {{ xlsxHeaders.length }} 列，{{ xlsxRows.length }} 行数据
                    </div>
                    <div class="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                      {{ getFileTypeLabel(file?.file_type || 'unknown') }}
                    </div>
                  </div>
                  <div class="flex items-center space-x-2">
                    <button
                        @click="toggleFullWidth"
                        class="flex items-center space-x-1 px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                    >
                      <component :is="isFullWidth ? Minimize2 : Maximize2" class="h-3 w-3" />
                      <span>{{ isFullWidth ? '适应内容' : '全宽显示' }}</span>
                    </button>
                    <div v-if="xlsxRows.length > pageSize" class="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded">
                      分页显示，每页 {{ pageSize }} 条
                    </div>
                  </div>
                </div>

                <!-- 表格容器 - 动态高度 -->
                <div class="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                  <div class="overflow-x-auto" :style="getTableContainerStyle()">
                    <table class="w-full divide-y divide-gray-200" :class="{ 'table-fixed': !isFullWidth }">
                      <!-- 表头 -->
                      <thead class="bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0 z-10">
                      <tr>
                        <th v-for="(header, index) in xlsxHeaders" :key="index"
                            class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-300 last:border-r-0"
                            :class="getColumnWidthClass(index)"
                            :title="header">
                          <div class="flex items-center space-x-1">
                            <span class="truncate">{{ header }}</span>
                            <span class="text-xs text-gray-400 font-normal">({{ index + 1 }})</span>
                          </div>
                        </th>
                      </tr>
                      </thead>
                      <!-- 表体 -->
                      <tbody class="bg-white divide-y divide-gray-200">
                      <tr v-for="(row, rowIndex) in displayedXlsxRows" :key="rowIndex"
                          class="hover:bg-blue-50 transition-colors duration-150"
                          :class="{ 'bg-gray-50': rowIndex % 2 === 1 }">
                        <td v-for="(cell, cellIndex) in row" :key="cellIndex"
                            class="px-4 py-3 text-sm text-gray-900 border-r border-gray-200 last:border-r-0 align-top"
                            :class="getColumnWidthClass(cellIndex)">
                          <div class="relative group">
                            <div class="truncate" :title="cell || ''"
                                 :class="{ 'text-gray-400 italic': !cell }">
                              {{ cell || '暂无数据' }}
                            </div>
                            <!-- 长内容的悬浮显示 -->
                            <div v-if="cell && cell.length > 50"
                                 class="absolute left-0 top-full mt-1 p-2 bg-gray-900 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 max-w-xs whitespace-normal pointer-events-none">
                              {{ cell }}
                            </div>
                          </div>
                        </td>
                      </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <!-- 数据统计 -->
                <div class="flex items-center justify-between text-xs text-gray-500 bg-gray-50 px-4 py-2 rounded">
                  <div class="flex items-center space-x-4">
                    <span>数据完整性: {{ calculateDataCompleteness() }}%</span>
                    <span>非空字段: {{ countNonEmptyFields() }} / {{ xlsxHeaders.length * xlsxRows.length }}</span>
                  </div>
                  <div class="flex items-center space-x-2">
                    <span>表格模式:</span>
                    <span class="px-2 py-1 bg-white rounded border">
                      {{ isFullWidth ? '全宽显示' : '固定列宽' }}
                    </span>
                  </div>
                </div>

                <!-- 分页控制 -->
                <div v-if="xlsxRows.length > pageSize" class="flex items-center justify-between mt-6 p-4 bg-gray-50 rounded-lg">
                  <div class="text-sm text-gray-600">
                    显示第 {{ (currentPage - 1) * pageSize + 1 }} - {{ Math.min(currentPage * pageSize, xlsxRows.length) }} 条，共 {{ xlsxRows.values.length }} 条记录
                  </div>
                  <div class="flex items-center space-x-3">
                    <button
                        @click="currentPage = 1"
                        :disabled="currentPage <= 1"
                        class="px-2 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      首页
                    </button>
                    <button
                        @click="currentPage = Math.max(1, currentPage - 1)"
                        :disabled="currentPage <= 1"
                        class="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      上一页
                    </button>
                    <span class="text-sm text-gray-600 px-2">
                      {{ currentPage }} / {{ totalPages }}
                    </span>
                    <button
                        @click="currentPage = Math.min(totalPages, currentPage + 1)"
                        :disabled="currentPage >= totalPages"
                        class="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      下一页
                    </button>
                    <button
                        @click="currentPage = totalPages"
                        :disabled="currentPage >= totalPages"
                        class="px-2 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      末页
                    </button>
                  </div>
                </div>
              </div>
              <div v-else class="text-center py-8 text-gray-500">
                <Database class="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p class="text-lg font-medium">无法解析 XLSX 文件内容</p>
                <p class="text-sm">请检查文件格式是否正确</p>
              </div>
            </div>

            <!-- CSV 格式 -->
            <div v-else-if="isCsvFile" class="p-6">
              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
                  <thead class="bg-gray-50">
                  <tr>
                    <th v-for="(header, index) in csvHeaders" :key="index"
                        class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 last:border-r-0">
                      {{ header }}
                    </th>
                  </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="(row, rowIndex) in csvRows.slice(0, 100)" :key="rowIndex" class="hover:bg-gray-50">
                    <td v-for="(cell, cellIndex) in row" :key="cellIndex"
                        class="px-4 py-2 text-sm text-gray-900 border-r border-gray-200 last:border-r-0 max-w-xs truncate">
                      {{ cell }}
                    </td>
                  </tr>
                  </tbody>
                </table>
                <div v-if="csvRows.length > 100" class="mt-4 text-center text-sm text-gray-500">
                  显示前 100 行，共 {{ csvRows.length }} 行数据
                </div>
              </div>
            </div>

            <!-- TXT 和其他格式 -->
            <div v-else class="p-6">
              <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <pre class="whitespace-pre-wrap text-sm text-gray-800 font-mono leading-relaxed">{{ fileContent }}</pre>
              </div>
            </div>
          </div>
        </div>

        <!-- 底部操作栏 -->
        <div class="flex justify-between items-center p-6 border-t border-gray-200 bg-gray-50">
          <div class="text-sm text-gray-500">
            只读模式 - 文件内容仅供查看
          </div>
          <div class="flex space-x-3">
            <button
                @click="copyContent"
                :disabled="!fileContent"
                class="flex items-center space-x-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Copy class="h-4 w-4" />
              <span>复制内容</span>
            </button>
            <button
                @click="closeModal"
                class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              关闭
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed, watch, inject } from 'vue';
import {
  X, FileText, Calendar, Hash, AlertCircle, Copy,
  Pill, Heart, HelpCircle, Maximize2, Minimize2, Database
} from 'lucide-vue-next';
import type { KnowledgeFileResponse } from '../../models/KnowledgeFileModel';
import { getKnowledgeFile } from '../../api/KnowledgeComponents';

const props = defineProps<{
  isOpen: boolean;
  file: KnowledgeFileResponse | null;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const showToast = inject<(message: string, type?: 'success' | 'like' | 'dislike') => void>('showToast');

// 状态管理
const isLoading = ref(false);
const errorMessage = ref('');
const fileContent = ref('');

// 分页相关
const currentPage = ref(1);
const pageSize = ref(50);

// XLSX 显示控制
const isFullWidth = ref(false);
const columnWidths = ref<Record<number, string>>({});

// 计算属性
const isJsonFile = computed(() => {
  return props.file?.file_name?.toLowerCase().endsWith('.json') || false;
});

const isCsvFile = computed(() => {
  const fileName = props.file?.file_name?.toLowerCase() || '';
  return fileName.endsWith('.csv');
});

const isXlsxFile = computed(() => {
  const fileName = props.file?.file_name?.toLowerCase() || '';
  return fileName.endsWith('.xlsx');
});

const formattedJsonContent = computed(() => {
  if (!isJsonFile.value || !fileContent.value) return '';
  try {
    const parsed = JSON.parse(fileContent.value);
    return JSON.stringify(parsed, null, 2);
  } catch {
    return fileContent.value;
  }
});

// CSV 相关
const csvHeaders = ref<string[]>([]);
const csvRows = ref<string[][]>([]);

// XLSX 相关
const xlsxHeaders = ref<string[]>([]);
const xlsxRows = ref<string[][]>([]);

const displayedXlsxRows = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return xlsxRows.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(xlsxRows.value.length / pageSize.value);
});

// 表格最大高度计算
const getTableContainerStyle = () => {
  const rowCount = displayedXlsxRows.value.length;
  const headerHeight = 48; // 表头高度
  const rowHeight = 52; // 每行高度
  const borderHeight = 2; // 上下边框

  // 计算实际内容需要的高度
  const contentHeight = headerHeight + (rowCount * rowHeight) + borderHeight;

  // 设置合理的最大高度限制（视口高度的60%或500px，取较小值）
  const viewportHeight = window.innerHeight || 800;
  const maxHeight = Math.min(viewportHeight * 0.6, 500);

  // 如果内容高度小于等于最大高度，使用实际内容高度
  if (contentHeight <= maxHeight) {
    return {
      height: `${contentHeight}px`,
      overflowY: 'visible' as const
    };
  }

  // 如果内容超出最大高度，使用最大高度并启用滚动
  return {
    maxHeight: `${maxHeight}px`,
    overflowY: 'auto' as const
  };
};

// 切换全宽显示
const toggleFullWidth = () => {
  isFullWidth.value = !isFullWidth.value;
};

// 获取列宽样式类
const getColumnWidthClass = (index: number) => {
  if (isFullWidth.value) return '';

  // 根据列索引返回不同的宽度类
  if (columnWidths.value[index]) return columnWidths.value[index];

  // 默认列宽设置
  if (index === 0) return 'w-64'; // 标题列宽一些
  if (index === 1) return 'w-64'; // 链接列宽一些
  if (index === 2) return 'w-40'; // 编号列窄一些
  if (index >= 3 && index <= 6) return 'w-32'; // 名称相关列适中
  if (index >= 7 && index <= 10) return 'w-28'; // 分类相关列适中

  // 内容较多的列
  if (xlsxHeaders.value[index]?.includes('适应症') ||
      xlsxHeaders.value[index]?.includes('不良反应') ||
      xlsxHeaders.value[index]?.includes('用法用量') ||
      xlsxHeaders.value[index]?.includes('禁忌') ||
      xlsxHeaders.value[index]?.includes('注意事项')) {
    return 'w-80';
  }

  return 'w-40'; // 默认宽度
};

// 解析 CSV 内容
const parseCsvContent = (content: string) => {
  const lines = content.split('\n').filter(line => line.trim());
  if (lines.length === 0) return;

  // 简单的 CSV 解析（不处理复杂的引号转义）
  csvHeaders.value = lines[0].split(',').map(header => header.trim());
  csvRows.value = lines.slice(1).map(line =>
      line.split(',').map(cell => cell.trim())
  );
};

// 解析 XLSX ��容 - 处理新的分隔符格式
const parseXlsxContent = (content: string) => {
  try {
    // 重置数据
    xlsxHeaders.value = [];
    xlsxRows.value = [];
    columnWidths.value = {};
    currentPage.value = 1;

    // 使用 "==========" 分割大的数据块
    const dataBlocks = content.split('==========').filter(block => block.trim());
    if (dataBlocks.length === 0) return;

    // 第一个块是标题行
    const headerBlock = dataBlocks[0].trim();
    xlsxHeaders.value = headerBlock.split('||').map(header => header.trim());

    // 处理数据行
    for (let i = 1; i < dataBlocks.length; i++) {
      const dataBlock = dataBlocks[i].trim();
      if (!dataBlock) continue;

      // 按 "||" 分割列数据
      const cells = dataBlock.split('||');

      // 确保每行的列数与表头一致
      const row: string[] = [];
      for (let j = 0; j < xlsxHeaders.value.length; j++) {
        const cellContent = cells[j] ? cells[j].trim() : '';
        row.push(cellContent);

        // 分析内容长度，设置合适的列宽
        if (cellContent && cellContent.length > 0) {
          const contentLength = cellContent.length;
          const currentWidth = columnWidths.value[j];

          // 根据内容长度动态调整列宽，取最大值
          let newWidth = 'w-32'; // 默认宽度
          if (contentLength > 200) {
            newWidth = 'w-96';
          } else if (contentLength > 100) {
            newWidth = 'w-80';
          } else if (contentLength > 50) {
            newWidth = 'w-64';
          } else if (contentLength > 20) {
            newWidth = 'w-48';
          } else if (contentLength > 10) {
            newWidth = 'w-40';
          } else {
            newWidth = 'w-32';
          }

          // 如果当前列还没有设置宽度，或者新内容更长，则更新宽度
          if (!currentWidth || getWidthValue(newWidth) > getWidthValue(currentWidth)) {
            columnWidths.value[j] = newWidth;
          }
        }
      }

      xlsxRows.value.push(row);
    }

    console.log('XLSX 解析结果:', {
      headers: xlsxHeaders.value,
      rowCount: xlsxRows.value.length,
      columnWidths: columnWidths.value
    });

  } catch (error) {
    console.error('解析 XLSX 内容失败:', error);
    xlsxHeaders.value = [];
    xlsxRows.value = [];
  }
};

// 获取宽度数值用于比较
const getWidthValue = (widthClass: string): number => {
  const widthMap: Record<string, number> = {
    'w-32': 32,
    'w-40': 40,
    'w-48': 48,
    'w-64': 64,
    'w-80': 80,
    'w-96': 96
  };
  return widthMap[widthClass] || 32;
};

// 计算数据完整性
const calculateDataCompleteness = (): number => {
  if (xlsxRows.value.length === 0 || xlsxHeaders.value.length === 0) return 0;

  const totalCells = xlsxRows.value.length * xlsxHeaders.value.length;
  const nonEmptyCells = xlsxRows.value.reduce((count, row) => {
    return count + row.filter(cell => cell && cell.trim()).length;
  }, 0);

  return Math.round((nonEmptyCells / totalCells) * 100);
};

// 计算非空字段数量
const countNonEmptyFields = (): number => {
  return xlsxRows.value.reduce((count, row) => {
    return count + row.filter(cell => cell && cell.trim()).length;
  }, 0);
};

// 获取文件扩展名
const getFileExtension = (fileName: string) => {
  const ext = fileName.toLowerCase().split('.').pop();
  return ext ? ext.toUpperCase() : 'UNKNOWN';
};

// 获取文件类型样式
const getFileTypeStyle = (fileType: string) => {
  const styles = {
    qa: 'bg-blue-600',
    pharmaceutical: 'bg-green-600',
    health: 'bg-purple-600',
    unknown: 'bg-gray-600'
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

// 加载文件内容
const loadFileContent = async () => {
  if (!props.file?.file_name) return;

  isLoading.value = true;
  errorMessage.value = '';
  fileContent.value = '';

  try {
    const content = await getKnowledgeFile(props.file.file_name);
    fileContent.value = content;

    // 根据文件类型解析内容
    if (isXlsxFile.value) {
      parseXlsxContent(content);
    } else if (isCsvFile.value) {
      parseCsvContent(content);
    }
  } catch (error) {
    console.error('加载文件内容失败:', error);
    errorMessage.value = error instanceof Error ? error.message : '加载文件内容失败';
  } finally {
    isLoading.value = false;
  }
};

// 复制内容
const copyContent = async () => {
  if (!fileContent.value) return;

  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(fileContent.value);
      showToast?.('文件内容已复制到剪贴板', 'success');
    } else {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = fileContent.value;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);

      if (successful) {
        showToast?.('文件内容已复制到剪贴板', 'success');
      }
    }
  } catch (error) {
    console.error('复制失败:', error);
    showToast?.('复制失败', 'dislike');
  }
};

// 关闭弹窗
const closeModal = () => {
  emit('close');
};

// 监听文件变化
watch(() => props.file, (newFile) => {
  if (newFile && props.isOpen) {
    loadFileContent();
  }
}, { immediate: true });

// 监听弹窗打开状态
watch(() => props.isOpen, (isOpen) => {
  if (isOpen && props.file) {
    loadFileContent();
  }
});

// 获取内容容器样式类
const getContentContainerClass = () => {
  if (isXlsxFile.value && xlsxRows.value.length > 0) {
    // XLSX 文件不再需要额外的 overflow-y-auto，因为高度在表格容器内部控制
    return '';
  }
  // 其他文件类型保持原有的固定高度
  return 'h-[50vh] overflow-y-auto';
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

/* 表格样式优化 */
table {
  border-collapse: separate;
  border-spacing: 0;
}

th, td {
  word-wrap: break-word;
  overflow-wrap: break-word;
  vertical-align: top;
}

.table-fixed {
  table-layout: fixed;
}

/* 滚动条美化 */
.overflow-x-auto::-webkit-scrollbar {
  height: 8px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
