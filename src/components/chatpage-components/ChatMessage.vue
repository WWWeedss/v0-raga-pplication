<template>
  <div :class="[
    'flex w-full mb-4 items-start',
    isUser ? 'justify-end' : 'justify-start'
  ]">
    <div v-if="!isUser" class="flex-shrink-0 mr-4">
      <div class="bg-gray-700 rounded-full p-2">
        <Bot class="h-5 w-5 text-white" />
      </div>
    </div>

    <div :class="[
      'p-4',
      isUser ? 'bg-purple-600 text-white max-w-[50%] rounded-lg' : 'text-white max-w-full bg-gray-800'
    ]">
      <!-- 引用计数器 -->
      <div
          v-if="!isUser && message.sourceDocuments && message.sourceDocuments.length > 0"
          @click="$emit('showReferences', message.sourceDocuments)"
          class="inline-block bg-gray-700 text-xs text-white px-2 py-1 rounded-full mb-2 cursor-pointer hover:bg-gray-600 transition-colors"
      >
        <div class="flex items-center">
          <FileText class="h-3 w-3 mr-1" />
          {{ message.sourceDocuments.length }} 条引用
        </div>
      </div>

      <!-- 消息内容 -->
      <div v-if="isUser" class="whitespace-pre-wrap">{{ message.content }}</div>
      <div v-else v-html="renderedContent" class="markdown-body"></div>
    </div>

    <div v-if="isUser" class="flex-shrink-0 ml-4">
      <div class="bg-purple-600 rounded-full p-2">
        <User class="h-5 w-5 text-white" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import MarkdownIt from 'markdown-it';
import { FileText, User, Bot } from 'lucide-vue-next';
import type { source_document } from "../../models/LLMResponseModels.ts";

interface MessageType {
  content: string;
  isUser: boolean;
  sourceDocuments?: source_document[];
}

const props = defineProps<{
  message: MessageType;
  isUser: boolean;
}>();

const md = new MarkdownIt();

const renderedContent = computed(() => {
  if (props.isUser) return props.message.content;
  return md.render(props.message.content);
});
</script>

<style scoped>
.markdown-body {
  color: white;
}

.markdown-body h1,
.markdown-body h2,
.markdown-body h3,
.markdown-body h4,
.markdown-body h5,
.markdown-body h6 {
  color: white;
  margin-top: 1.5em;
  margin-bottom: 0.5em;
}

.markdown-body h1 {
  font-size: 1.5em;
}

.markdown-body h2 {
  font-size: 1.3em;
}

.markdown-body h3 {
  font-size: 1.1em;
}

.markdown-body p {
  margin-bottom: 1em;
}

.markdown-body ul,
.markdown-body ol {
  padding-left: 1.5em;
  margin-bottom: 1em;
}

.markdown-body li {
  margin-bottom: 0.5em;
}

.markdown-body code {
  background-color: rgba(255, 255, 255, 0.1);
  padding: 0.2em 0.4em;
  border-radius: 3px;
  font-family: monospace;
}

.markdown-body pre {
  background-color: rgba(0, 0, 0, 0.3);
  padding: 1em;
  border-radius: 5px;
  overflow-x: auto;
  margin-bottom: 1em;
}

.markdown-body pre code {
  background-color: transparent;
  padding: 0;
}

.markdown-body a {
  color: #a78bfa;
  text-decoration: none;
}

.markdown-body a:hover {
  text-decoration: underline;
}

.markdown-body blockquote {
  border-left: 4px solid #4b5563;
  padding-left: 1em;
  color: #9ca3af;
  margin-bottom: 1em;
}

.markdown-body table {
  border-collapse: collapse;
  width: 100%;
  margin-bottom: 1em;
}

.markdown-body th,
.markdown-body td {
  border: 1px solid #4b5563;
  padding: 0.5em;
}

.markdown-body th {
  background-color: rgba(255, 255, 255, 0.1);
}
</style>