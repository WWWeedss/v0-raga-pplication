<template>
  <div class="flex w-screen h-screen overflow-hidden">
    <!-- 侧边栏 -->
    <Sidebar ref="sidebarRef" />

    <!-- 主内容区 -->
    <div class="flex flex-col flex-1 overflow-hidden bg-gray-800 text-gray-100">
      <!-- 顶部 title -->
      <header class="bg-gray-800 border-b border-gray-200 p-4 flex justify-between items-center">
        <button @click="toggleSidebar" class="p-1 rounded hover:bg-gray-100 md:hidden">
          <Menu class="h-6 w-6" />
        </button>
        <h1 class="text-xl font-bold">RAG知识库问答</h1>
        <UserAvatar username="张三" />
      </header>

      <!-- 聊天区域 -->
      <div class="flex-1 overflow-auto p-4" ref="chatContainer">
        <div class="max-w-4xl mx-auto">
          <ChatMessage
              v-for="(message, index) in messages"
              :key="index"
              :message="message"
          />
        </div>
      </div>

      <!-- 输入区域 -->
      <div class="p-4 border-t border-gray-700 bg-gray-800">
        <div class="max-w-4xl mx-auto">
          <form @submit.prevent="sendMessage" class="flex">
            <input
                v-model="newMessage"
                type="text"
                placeholder="输入您的问题..."
                class="flex-1 p-2 bg-gray-700 border border-gray-500 rounded-l-md text-white placeholder-gray-400 focus:outline-none
                 focus:border-transparent" />
            <button
                type="submit"
                class="bg-purple-600 text-white px-4 py-2 rounded-r-md hover:bg-purple-700 focus:outline-none"
            >
              <Send class="h-5 w-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { Menu, Send } from 'lucide-vue-next'
import Sidebar from '../components/chatpage-components/Sidebar.vue'
import ChatMessage from '../components/chatpage-components/ChatMessage.vue'
import UserAvatar from '../components/chatpage-components/UserAvatar.vue'

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface SidebarInstance {
  toggleSidebar: () => void;
}

const sidebarRef = ref<null | SidebarInstance>(null)
const chatContainer = ref<HTMLElement | null>(null)
const newMessage = ref<string>('')
const messages = ref<Message[]>([
  { role: 'assistant', content: '您好！我是RAG知识库助手，有什么可以帮您的？' },
  { role: 'user', content: '什么是RAG技术？' },
  { role: 'assistant', content: 'RAG（Retrieval-Augmented Generation）是一种结合了检索和生成的AI技术。它通过从知识库中检索相关信息，然后利用这些信息来增强大型语言模型的回答，从而提供更准确、更新和更可靠的回复。' }
])

const toggleSidebar = (): void => {
  if (sidebarRef.value) {
    sidebarRef.value.toggleSidebar()
  }
}

const sendMessage = async (): Promise<void> => {
  if (!newMessage.value.trim()) return

  // 添加用户消息
  messages.value.push({ role: 'user', content: newMessage.value })
  newMessage.value = ''

  // 滚动到底部
  await nextTick()
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }

  // 模拟AI回复
  setTimeout(() => {
    messages.value.push({
      role: 'assistant',
      content: '我正在处理您的问题，请稍候...'
    })

    // 滚动到底部
    nextTick(() => {
      if (chatContainer.value) {
        chatContainer.value.scrollTop = chatContainer.value.scrollHeight
      }
    })
  }, 1000)
}

onMounted((): void => {
  // 初始滚动到底部
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
})
</script>