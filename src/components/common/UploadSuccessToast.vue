<template>
  <Transition name="upload-toast">
    <div
        v-if="visible"
        class="fixed top-4 right-4 z-50 bg-white border border-gray-200 rounded-lg shadow-xl px-6 py-4 max-w-sm"
    >
      <div class="flex items-start space-x-3">
        <!-- 成功图标 -->
        <div class="flex-shrink-0">
          <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle class="h-5 w-5 text-green-600" />
          </div>
        </div>

        <!-- 内容 -->
        <div class="flex-1 min-w-0">
          <h4 class="text-sm font-medium text-gray-900 mb-1">上传成功</h4>
          <p class="text-sm text-gray-600 leading-relaxed" v-html="formattedMessage"></p>

          <!-- 详细信息 -->
          <div v-if="details" class="mt-2 space-y-1">
            <div class="flex items-center text-xs text-gray-500">
              <FileText class="h-3 w-3 mr-1" />
              <span>{{ details.fileName }}</span>
            </div>
            <div class="flex items-center text-xs text-gray-500">
              <Database class="h-3 w-3 mr-1" />
              <span>{{ details.knowledgeType }}</span>
            </div>
            <div class="flex items-center text-xs text-gray-500">
              <Hash class="h-3 w-3 mr-1" />
              <span>{{ details.entryCount }} 条记录</span>
            </div>
          </div>
        </div>

        <!-- 关闭按钮 -->
        <button
            @click="close"
            class="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X class="h-4 w-4" />
        </button>
      </div>

      <!-- 进度条 -->
      <div class="mt-3 w-full bg-gray-200 rounded-full h-1">
        <div
            class="bg-green-600 h-1 rounded-full transition-all duration-300 ease-out"
            :style="{ width: `${progress}%` }"
        ></div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue';
import { CheckCircle, X, FileText, Database, Hash } from 'lucide-vue-next';

interface UploadDetails {
  fileName: string;
  knowledgeType: string;
  entryCount: number;
}

const props = defineProps<{
  message: string;
  show: boolean;
  details?: UploadDetails;
  duration?: number;
}>();

const emit = defineEmits<{
  (e: 'hide'): void;
}>();

const visible = ref(false);
const progress = ref(0);
let hideTimer: NodeJS.Timeout | null = null;
let progressTimer: NodeJS.Timeout | null = null;

const formattedMessage = computed(() => {
  return props.message.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
});

const close = () => {
  visible.value = false;
  if (hideTimer) {
    clearTimeout(hideTimer);
    hideTimer = null;
  }
  if (progressTimer) {
    clearInterval(progressTimer);
    progressTimer = null;
  }
  setTimeout(() => emit('hide'), 300); // 等待动画完成
};

const startProgressBar = () => {
  const duration = props.duration || 2500;
  const interval = 50;
  const step = (interval / duration) * 100;

  progress.value = 0;
  progressTimer = setInterval(() => {
    progress.value += step;
    if (progress.value >= 100) {
      if (progressTimer) {
        clearInterval(progressTimer);
        progressTimer = null;
      }
      close();
    }
  }, interval);
};

watch(() => props.show, (newVal) => {
  if (newVal) {
    visible.value = true;
    startProgressBar();
  }
});

onMounted(() => {
  if (props.show) {
    visible.value = true;
    startProgressBar();
  }
});
</script>

<style scoped>
.upload-toast-enter-active {
  transition: all 0.3s ease-out;
}

.upload-toast-leave-active {
  transition: all 0.3s ease-in;
}

.upload-toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.upload-toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
