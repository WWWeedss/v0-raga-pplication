<template>
  <div class="h-full bg-gray-800 text-white flex flex-col">
    <!-- 头部 -->
    <div class="flex justify-between items-center p-4 border-b border-gray-700">
      <h2 class="font-semibold text-white">ChatBot</h2>
      <div class="flex items-center space-x-2">
        <button @click="$emit('close')" class="text-gray-400 hover:text-white">
          <X class="h-4 w-4" />
        </button>
      </div>
    </div>

    <!-- 会话历史区域 -->
    <div class="px-4 py-2 border-b border-gray-700">
      <div class="flex items-center justify-between text-sm text-gray-400">
        <span>诊疗咨询</span>
        <div class="flex items-center space-x-2">
          <!-- 会话历史 -->
          <div class="relative group">
            <ConversationHistoryDropdown @conversationSelected="loadConversation" />
          </div>

          <!-- 新建会话 -->
          <div class="relative group">
            <button @click="newChat" class="hover:text-white">
              <Plus class="h-4 w-4" />
            </button>
            <div class="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
              新建会话
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- AI 介绍 -->
    <div class="p-4 border-b border-gray-700">
      <div class="flex items-center space-x-2 mb-2">
        <div class="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
          <Bot class="h-4 w-4 text-white" />
        </div>
        <span class="font-medium">医疗AI助手</span>
      </div>
      <p class="text-sm text-gray-300">
        您好，我是您的AI医疗助手，可以帮助您解答医疗相关问题。
      </p>
      <p class="text-xs text-gray-400 mt-2">
        我由AI驱动，可能会出现错误。请务必验证生成的建议，并提供反馈以便我们学习和改进。
      </p>
    </div>

    <!-- 聊天消息区域 -->
    <div ref="messagesContainer" class="flex-1 overflow-y-auto p-4 space-y-4">
      <div v-for="(message, index) in messages" :key="index" class="space-y-2">
        <!-- 用户消息 -->
        <div v-if="message.role === 'user'" class="flex items-start space-x-2">
          <div class="w-6 h-6 bg-green-200 rounded-full flex items-center justify-center flex-shrink-0">
            <User class="h-4 w-4 text-green-800" />
          </div>
          <div class="text-sm">{{ message.content }}</div>
        </div>

        <!-- AI消息 -->
        <div v-else class="space-y-2">
          <div class="flex items-start space-x-2">
            <div class="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
              <Bot class="h-4 w-4 text-white" />
            </div>
            <span class="font-medium text-sm">医疗AI助手</span>
          </div>

          <!-- 引用信息 -->
          <div v-if="message.source_documents && message.source_documents.length > 0" class="ml-8">
            <ReferencesDisplay :references="message.source_documents" />
          </div>

          <div class="ml-8 text-sm text-gray-300">{{ message.content }}</div>

          <!-- 操作按钮 -->
          <div class="ml-8 flex items-center space-x-2 mt-2">
            <!-- 复制按钮 -->
            <div class="relative group">
              <button
                  @click="copyMessage(message.content)"
                  class="text-gray-400 hover:text-white"
              >
                <Copy class="h-4 w-4" />
              </button>
              <div class="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 transition-opacity pointer-events-none whitespace-nowrap z-50">
                复制
              </div>
            </div>

            <!-- 点赞按钮 -->
            <div class="relative group">
              <button
                  @click="likeMessage(index)"
                  class="text-gray-400 hover:text-white"
                  :class="{ 'text-green-400': message.liked }"
              >
                <ThumbsUp class="h-4 w-4" />
              </button>
              <div class="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 transition-opacity pointer-events-none whitespace-nowrap z-50">
                点赞
              </div>
            </div>

            <!-- 点踩按钮 -->
            <div class="relative group">
              <button
                  @click="dislikeMessage(index)"
                  class="text-gray-400 hover:text-white"
                  :class="{ 'text-red-400': message.disliked }"
              >
                <ThumbsDown class="h-4 w-4" />
              </button>
              <div class="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 transition-opacity pointer-events-none whitespace-nowrap z-50">
                点踩
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 加载指示器 -->
      <div v-if="isLoading" class="flex items-center space-x-2 text-gray-400">
        <div class="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
          <Bot class="h-4 w-4 text-white" />
        </div>
        <div class="flex space-x-1">
          <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
          <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
          <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
        </div>
      </div>
    </div>

    <!-- 输入区域 -->
    <div class="border-t border-gray-700 p-4">
      <div class="text-xs text-gray-400 mb-2 flex items-center">
        <Sparkles class="h-3 w-3 mr-1" />
        您今天需要什么医疗诊断帮助？
      </div>
      <div class="flex items-end space-x-2">
        <div class="flex-1 relative">
          <textarea
              v-model="inputMessage"
              @keydown="handleKeyDown"
              placeholder="向AI助手提问或输入 '/' 查看命令"
              class="w-full bg-gray-700 text-white rounded-md px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
              rows="1"
          ></textarea>
        </div>
        <button
            @click="sendMessage"
            :disabled="!inputMessage.trim() || isLoading"
            class="bg-green-600 text-white p-2 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mb-2"
        >
          <Send class="h-4 w-4" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, inject, onMounted, nextTick } from 'vue';
import {
  X, Plus, Bot, User,
  Copy, ThumbsUp, ThumbsDown, Sparkles, Send
} from 'lucide-vue-next';
import type { MessageItem, SessionRecordModel } from "../../../models/SessionRecordModel.ts";
import { useSessionStore } from "../../../stores/sessionStore.ts";
import type { UserModel } from "../../../models/UserModel.ts";
import type { LLMResponse } from "../../../models/LLMResponseModels.ts";
import { ragQueryWithHistory } from "../../../api/LLMcomponents.ts";
import ConversationHistoryDropdown from "./ConversationHistoryDropdown.vue";
import ReferencesDisplay from "./ReferencesDisplay.vue";

defineProps<{
  isOpen: boolean;
}>();

defineEmits<{
  (e: 'close'): void;
}>();

const inputMessage = ref('');
const isLoading = ref(false);
const messages = ref<MessageItem[]>([]);
// 注入Toast功能
const showToast = inject<(message: string, type?: 'success' | 'like' | 'dislike') => void>('showToast');

const messagesContainer = ref<HTMLElement | null>(null);
const scrollToBottom = async () => {
  await nextTick();
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

// 开启新对话
const newChat = () => {
  messages.value = [];
  inputMessage.value = '';
  sessionStore.setCurrentSessionIndex(-1);
};

const sessionStore = useSessionStore();
const userData: UserModel = JSON.parse(localStorage.getItem('userData') || '{}');

onMounted(async () => {
  const currentSession = sessionStore.getCurrentSession();
  if (currentSession) {
    messages.value = currentSession.session_data;
  }
});

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
};

const sendMessage = async () => {
  if (!inputMessage.value.trim() || isLoading.value) return;

  const userMessage = inputMessage.value;
  messages.value.push({
    role: 'user',
    content: userMessage,
    source_documents: []
  });

  inputMessage.value = '';
  await scrollToBottom();
  isLoading.value = true;

  try {
    const data: LLMResponse = await ragQueryWithHistory(messages.value);
    const botMessage: MessageItem = {
      content: data.answer,
      role: "assistant",
      source_documents: data.source_documents
    };

    messages.value.push(botMessage);

    if (messages.value.length === 2) {
      // 第一次问答成功，新建对话
      const sessionData: SessionRecordModel = {
        user_id: userData.user_id,
        session_data: messages.value,
        timestamp: ""
      };
      await sessionStore.addSession(sessionData);
    } else {
      // 非第一次问答，更新会话
      const curSession = sessionStore.getCurrentSession();
      if (curSession) {
        curSession.session_data = messages.value;
        await sessionStore.updateSession(curSession);
      }
    }
  } catch (error) {
    console.error('Error fetching response:', error);
    messages.value.push({
      content: '抱歉，发生了错误，请稍后再试。',
      role: "assistant",
      source_documents: []
    });
  } finally {
    isLoading.value = false;
    await scrollToBottom();
  }
};

const loadConversation = async () => {
  const currentSession = sessionStore.getCurrentSession();
  if (currentSession) {
    messages.value = currentSession.session_data;
  } else {
    // 如果没有当前会话（比如被删除了），清空消息
    messages.value = [];
  }
  await scrollToBottom();
};

const copyMessage = async (content: string) => {
  try {
    // 检查是否支持 navigator.clipboard
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(content);
      showToast?.('内容已复制到剪贴板', 'success');
      return;
    }

    // 降级方案：使用传统的 document.execCommand
    const textArea = document.createElement('textarea');
    textArea.value = content;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);

    if (successful) {
      showToast?.('内容已复制到剪贴板', 'success');
    } else {
      throw new Error('execCommand copy failed');
    }
  } catch (err) {
    console.error('复制失败:', err);
  }
};

const likeMessage = (index: number) => {
  const message = messages.value[index];
  if (message.role === 'assistant') {
    message.liked = !message.liked;
    if (message.liked) {
      message.disliked = false;
      showToast?.('感谢您的反馈！', 'like');
    }
    console.log('用户点赞了消息:', message.content);
  }
};

const dislikeMessage = (index: number) => {
  const message = messages.value[index];
  if (message.role === 'assistant') {
    message.disliked = !message.disliked;
    if (message.disliked) {
      message.liked = false;
      showToast?.('我们会改进回答质量', 'dislike');
    }
    console.log('用户点踩了消息:', message.content);
  }
};
</script>
