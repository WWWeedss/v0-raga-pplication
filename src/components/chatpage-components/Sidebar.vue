<template>
  <div
      class="sidebar h-screen bg-gray-900 text-white transition-all duration-300 flex flex-col"
      :class="{ 'w-64': !collapsed, 'w-16': collapsed }"
  >
    <!-- 顶部标题和折叠按钮 -->
    <div class="flex justify-between items-center p-4 h-16 border-b border-gray-700">
      <h1 class="font-bold text-xl" :class="{ 'hidden': collapsed }">RAG应用</h1>
      <button @click="toggleSidebar" class="p-1 rounded hover:bg-gray-700">
        <ChevronLeft v-if="!collapsed" class="h-5 w-5" />
        <ChevronRight v-else class="h-5 w-5" />
      </button>
    </div>

    <!-- 上半部分：功能区 -->
    <div class="flex-none p-4" :class="{ 'hidden': collapsed }">
      <div class="space-y-4">
        <div class="flex items-center p-2 rounded hover:bg-gray-800 cursor-pointer" @click="newChat">
          <MessageSquare class="h-4 w-4 mr-2" />
          <span>新建对话</span>
        </div>
      </div>
      <div class="space-y-4 mt-4">
        <div class="flex items-center p-2 rounded hover:bg-gray-800 cursor-pointer">
          <Settings class="h-4 w-4 mr-2" />
          <span>系统设置</span>
        </div>
      </div>
    </div>

    <!-- 下半部分：对话历史 -->
    <div class="flex-1 flex flex-col min-h-[50vh] overflow-hidden" :class="{ 'hidden': collapsed }">
      <h2 class="text-sm font-semibold text-gray-400 uppercase px-4 py-2 flex-none border-t border-gray-700">对话历史</h2>
      <div class="flex-1 overflow-y-auto px-4 pb-4">
        <div class="space-y-2">
          <div
              v-for="(session_item, index) in sessionStore.sessions"
              :key="index"
              @click="selectChat(index)"
              :class="[
              'flex items-center p-2 rounded cursor-pointer transition-all duration-200',
              sessionStore.currentSessionIndex === index
                ? 'bg-purple-900/50 border-l-4 border-purple-500 pl-1'
                : 'hover:bg-gray-800 border-l-4 border-transparent pl-1'
            ]"
          >
            <MessageSquare
                class="h-4 w-4 mr-2 flex-shrink-0"
                :class="sessionStore.currentSessionIndex === index ? 'text-purple-400' : ''"
            />
            <span
                class="truncate"
                :class="sessionStore.currentSessionIndex === index ? 'font-medium text-purple-200' : ''"
            >
              {{ session_item.session_data[0].content.slice(0, 20) }}{{ session_item.session_data[0].content.length > 20 ? '...' : '' }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 折叠状态下的图标菜单 -->
    <div v-if="collapsed" class="flex flex-col items-center mt-4 space-y-4 flex-1">
      <button class="p-2 rounded hover:bg-gray-800" @click="newChat">
        <MessageSquare class="h-5 w-5" />
      </button>
      <button class="p-2 rounded hover:bg-gray-800">
        <Settings class="h-5 w-5" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ChevronLeft, ChevronRight, MessageSquare, Settings } from 'lucide-vue-next'
import { useSessionStore } from "../../stores/sessionStore.ts";

const sessionStore = useSessionStore()
const collapsed = ref<boolean>(false)

// 在组件挂载时获取会话列表
onMounted(async () => {
  await sessionStore.fetchSessions();
});

const toggleSidebar = (): void => {
  collapsed.value = !collapsed.value
}

const emit = defineEmits(['selectChat', 'newChat'])

const selectChat = (index: number): void => {
  sessionStore.setCurrentSessionIndex(index);
  emit('selectChat')
}

const newChat = (): void => {
  sessionStore.setCurrentSessionIndex(-1);
  emit('newChat')
}

defineExpose({
  collapsed,
  toggleSidebar
})
</script>

<style scoped>
/* 确保滚动条样式与深色主题匹配 */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #1f2937; /* bg-gray-800 */
}

::-webkit-scrollbar-thumb {
  background: #4b5563; /* bg-gray-600 */
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #6b7280; /* bg-gray-500 */
}
</style>