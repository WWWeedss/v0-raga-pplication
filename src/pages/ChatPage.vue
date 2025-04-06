<template>
  <div class="flex h-screen overflow-hidden">
    <!-- 侧边栏 -->
    <Sidebar ref="sidebarRef" />

    <!-- 主内容区 -->
    <div class="flex-1 flex flex-col bg-gray-800 relative">
      <!-- 顶部导航栏 -->
      <div class="flex items-center justify-between p-4 h-16 border-b border-gray-700">
        <div class="w-5"></div> <!-- 占位，保持用户头像在右侧居中 -->
        <UserAvatar/>
      </div>

      <!-- 聊天区域 -->
      <div class="flex-1 overflow-y-auto p-4" ref="chatContainer">
        <div v-if="messages.length === 0" class="flex flex-col items-center justify-center h-full text-gray-400">
          <MessageSquare class="h-12 w-12 mb-4" />
          <p class="text-lg">开始一个新的对话</p>
          <p class="text-sm mt-2">输入您的问题，我会尽力回答</p>
        </div>

        <div v-else>
          <ChatMessage
              v-for="(message, index) in messages"
              :key="index"
              :message="message"
              :isUser="message.isUser"
              @showReferences="showReferences"
          />
          <TypingIndicator v-if="isLoading" />
        </div>
      </div>

      <!-- 输入区域 -->
      <div class="border-t border-gray-700 p-4">
        <div class="relative">
          <textarea
              ref="textareaRef"
              v-model="userInput"
              @keydown="handleKeyDown"
              @input="autoResize"
              placeholder="输入您的问题..."
              class="w-full bg-gray-700 text-white rounded-lg pl-4 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none min-h-[44px] max-h-[150px] overflow-y-auto"
              rows="1"
          ></textarea>
          <button
              @click="sendMessage"
              :disabled="isLoading || !userInput.trim()"
              class="absolute bottom-3 right-3 bg-purple-600 text-white rounded-full p-2 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send class="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>

    <!-- 引用边栏 -->
    <ReferencesSidebar
        :isOpen="isReferencesSidebarOpen"
        :references="currentReferences"
        @close="isReferencesSidebarOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue';
import { MessageSquare, Send } from 'lucide-vue-next';
import Sidebar from '../components/chatpage-components/Sidebar.vue';
import ChatMessage from '../components/chatpage-components/ChatMessage.vue';
import TypingIndicator from '../components/chatpage-components/TypingIndicator.vue';
import ReferencesSidebar from '../components/chatpage-components/ReferencesSidebar.vue';
import UserAvatar from '../components/chatpage-components/UserAvatar.vue';
import {ragQuery} from "../api/LLMcomponents.ts";

interface SourceDocument {
  content: string;
  metadata: {
    query: string;
    response: string;
  };
  score: number;
}

interface LLMResponse {
  answer: string;
  source_documents: SourceDocument[];
}

interface Message {
  content: string;
  isUser: boolean;
  sourceDocuments?: SourceDocument[];
}

const sidebarRef = ref<InstanceType<typeof Sidebar> | null>(null);
const chatContainer = ref<HTMLElement | null>(null);
const textareaRef = ref<HTMLTextAreaElement | null>(null);
const userInput = ref<string>('');
const messages = ref<Message[]>([]);
const isLoading = ref<boolean>(false);

// 引用边栏状态
const isReferencesSidebarOpen = ref<boolean>(false);
const currentReferences = ref<SourceDocument[]>([]);
const scrollToBottom = async (): Promise<void> => {
  await nextTick();
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
  }
};

const handleKeyDown = (e: KeyboardEvent): void => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
};

// 自动调整文本框高度
const autoResize = (): void => {
  if (textareaRef.value) {
    textareaRef.value.style.height = 'auto';
    textareaRef.value.style.height = Math.min(textareaRef.value.scrollHeight, 150) + 'px';
  }
};

const sendMessage = async (): Promise<void> => {
  if (isLoading.value || !userInput.value.trim()) return;

  const userMessage: Message = {
    content: userInput.value,
    isUser: true
  };

  messages.value.push(userMessage);
  userInput.value = '';

  // 重置文本框高度
  if (textareaRef.value) {
    textareaRef.value.style.height = 'auto';
  }

  await scrollToBottom();

  isLoading.value = true;

  try {
    // 假设这是您的API调用
    const data: LLMResponse = await ragQuery(userMessage.content);

    const botMessage: Message = {
      content: data.answer,
      isUser: false,
      sourceDocuments: data.source_documents
    };

    messages.value.push(botMessage);
  } catch (error) {
    console.error('Error fetching response:', error);
    messages.value.push({
      content: '抱歉，发生了错误，请稍后再试。',
      isUser: false
    });
  } finally {
    isLoading.value = false;
    await scrollToBottom();
  }
};

const showReferences = (references: SourceDocument[]): void => {
  currentReferences.value = references;
  isReferencesSidebarOpen.value = true;
};

// 监听消息变化，自动滚动到底部
watch(messages, () => {
  scrollToBottom();
});

onMounted(() => {
  scrollToBottom();
  // 初始化文本框高度
  autoResize();
});
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