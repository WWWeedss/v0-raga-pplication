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
        <div
            class="flex items-center p-2 rounded hover:bg-gray-800 cursor-pointer"
            @click="openSettings"
        >
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
              :key="session_item.session_id"
              :class="[
              'group flex items-center p-2 rounded cursor-pointer transition-all duration-200 relative',
              sessionStore.currentSessionIndex === index
                ? 'bg-purple-900/50 border-l-4 border-purple-500 pl-1'
                : 'hover:bg-gray-800 border-l-4 border-transparent pl-1'
            ]"
          >
            <!-- 会话内容区域 -->
            <div class="flex items-center flex-1 min-w-0" @click="selectChat(index)">
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

            <!-- 删除按钮 -->
            <button
                @click.stop="deleteSession(index)"
                class="opacity-0 group-hover:opacity-100 ml-2 p-1 rounded hover:bg-red-600 transition-all duration-200 flex-shrink-0"
                title="删除会话"
            >
              <Trash2 class="h-3 w-3 text-gray-400 hover:text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 折叠状态下的图标菜单 -->
    <div v-if="collapsed" class="flex flex-col items-center mt-4 space-y-4 flex-1">
      <button class="p-2 rounded hover:bg-gray-800" @click="newChat">
        <MessageSquare class="h-5 w-5" />
      </button>
      <button class="p-2 rounded hover:bg-gray-800" @click="openSettings">
        <Settings class="h-5 w-5" />
      </button>
    </div>

    <!-- 设置弹窗 -->
    <SettingsModal :isOpen="isSettingsOpen" @close="closeSettings" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ChevronLeft, ChevronRight, MessageSquare, Settings, Trash2 } from 'lucide-vue-next'
import { useSessionStore } from "../../stores/sessionStore.ts";
import SettingsModal from './SettingsModal.vue';

const sessionStore = useSessionStore()
const collapsed = ref<boolean>(false)
const isSettingsOpen = ref<boolean>(false)

// 在组件挂载时获取会话列表
onMounted(async () => {
  await sessionStore.fetchSessions();
});

const toggleSidebar = (): void => {
  collapsed.value = !collapsed.value
}

const emit = defineEmits(['selectChat', 'newChat', 'sessionDeleted'])

const selectChat = (index: number): void => {
  sessionStore.setCurrentSessionIndex(index);
  emit('selectChat')
}

const newChat = (): void => {
  sessionStore.setCurrentSessionIndex(-1);
  emit('newChat')
}

// 删除会话
const deleteSession = async (index: number): Promise<void> => {
  try {
    await sessionStore.deleteSession(index);
    // 如果删除的是当前选中的会话，通知父组件
    if (sessionStore.currentSessionIndex === -1) {
      emit('sessionDeleted');
    }
  } catch (error) {
    console.error('删除会话失败:', error);
    // 这里可以添加错误提示
  }
}

// 打开设置弹窗
const openSettings = (): void => {
  isSettingsOpen.value = true;
}

// 关闭设置弹窗
const closeSettings = (): void => {
  isSettingsOpen.value = false;
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