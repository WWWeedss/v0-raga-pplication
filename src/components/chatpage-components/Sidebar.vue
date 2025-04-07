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
        <div class="flex items-center p-2 rounded hover:bg-gray-800 cursor-pointer">
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
          <div v-for="(chat, index) in chats" :key="index"
               class="flex items-center p-2 rounded hover:bg-gray-800 cursor-pointer">
            <MessageSquare class="h-4 w-4 mr-2 flex-shrink-0" />
            <span class="truncate">{{ chat.title }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 折叠状态下的图标菜单 -->
    <div v-if="collapsed" class="flex flex-col items-center mt-4 space-y-4 flex-1">
      <button class="p-2 rounded hover:bg-gray-800">
        <MessageSquare class="h-5 w-5" />
      </button>
      <button class="p-2 rounded hover:bg-gray-800">
        <Settings class="h-5 w-5" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ChevronLeft, ChevronRight, MessageSquare, Settings } from 'lucide-vue-next'

interface Chat {
  title: string;
}

const collapsed = ref<boolean>(false)
const chats = ref<Chat[]>([
  { title: '如何使用RAG应用？' },
  { title: '文档检索示例' },
  { title: '知识库问答' },
  { title: 'mock1' },
  { title: 'mock2' },
  { title: 'mock3' },
  { title: 'mock4' },
  { title: 'mock5' },
  { title: 'mock6' },
  { title: 'mock7' },
  { title: 'mock8' },
  { title: 'mock9' },
  { title: 'mock10' }
])

const toggleSidebar = (): void => {
  collapsed.value = !collapsed.value
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

::-webkit-scrollbar-thumb {
  background: #4b5563; /* bg-gray-600 */
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #6b7280; /* bg-gray-500 */
}
</style>