<template>
  <div
      class="sidebar h-screen bg-gray-900 text-white transition-all duration-300"
      :class="{ 'w-64': !collapsed, 'w-16': collapsed }"
  >
    <div class="flex justify-between items-center p-4">
      <h1 class="font-bold text-xl" :class="{ 'hidden': collapsed }">RAG应用</h1>
      <button @click="toggleSidebar" class="p-1 rounded hover:bg-gray-700">
        <ChevronLeft v-if="!collapsed" class="h-5 w-5" />
        <ChevronRight v-else class="h-5 w-5" />
      </button>
    </div>

    <div class="px-4 py-2" :class="{ 'hidden': collapsed }">
      <div class="space-y-4">
        <div class="space-y-2">
          <h2 class="text-sm font-semibold text-gray-400 uppercase">对话</h2>
          <div v-for="(chat, index) in chats" :key="index"
               class="flex items-center p-2 rounded hover:bg-gray-800 cursor-pointer">
            <MessageSquare class="h-4 w-4 mr-2" />
            <span class="truncate">{{ chat.title }}</span>
          </div>
        </div>

        <div class="space-y-2">
          <h2 class="text-sm font-semibold text-gray-400 uppercase">设置</h2>
          <div class="flex items-center p-2 rounded hover:bg-gray-800 cursor-pointer">
            <Settings class="h-4 w-4 mr-2" />
            <span>系统设置</span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="collapsed" class="flex flex-col items-center mt-4 space-y-4">
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
  { title: '知识库问答' }
])

const toggleSidebar = (): void => {
  collapsed.value = !collapsed.value
}

defineExpose({
  collapsed
})
</script>