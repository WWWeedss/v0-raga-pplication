<template>
  <div class="flex mb-4" :class="message.role === 'user' ? 'justify-end' : 'justify-start'">
    <div class="flex"
         :class="message.role === 'user' ? 'flex-row-reverse' : ''">
      <div class="flex-shrink-0 h-8 w-8 rounded-full overflow-hidden flex items-center justify-center"
           :class="message.role === 'user' ? 'ml-2' : 'mr-2'">
        <div v-if="message.role === 'user'" class="bg-purple-600 h-full w-full flex items-center justify-center">
          <User class="h-4 w-4 text-white" />
        </div>
        <div v-else class="bg-gray-600 h-full w-full flex items-center justify-center">
          <Bot class="h-4 w-4 text-white" />
        </div>
      </div>

      <div class="p-3 rounded-lg"
           :class="[
             message.role === 'user'
               ? 'bg-purple-600 text-white max-w-[calc(50vw-40px)]'
               : 'bg-gray-800 text-white'
           ]">
        <div v-if="message.role === 'user'" class="whitespace-pre-wrap break-words">{{ message.content }}</div>
        <div v-else class="markdown-body" v-html="renderedContent"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { User, Bot } from 'lucide-vue-next'
import { computed } from 'vue'
import MarkdownIt from 'markdown-it'

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const props = defineProps<{
  message: Message;
}>()

// 创建 markdown-it 实例
const md = new MarkdownIt({
  html: false,        // 禁用 HTML 标签以防止 XSS 攻击
  breaks: true,       // 将换行符转换为 <br>
  linkify: true,      // 自动将 URL 转换为链接
  typographer: true,  // 启用一些语言中性的替换和引号
})

// 只为机器人消息渲染 Markdown
const renderedContent = computed(() => {
  if (props.message.role === 'assistant') {
    return md.render(props.message.content)
  }
  return props.message.content
})
</script>

<style>
/* Markdown 样式 */
.markdown-body {
  color: inherit;
  line-height: 1.6;
}

.markdown-body h1,
.markdown-body h2,
.markdown-body h3,
.markdown-body h4,
.markdown-body h5,
.markdown-body h6 {
  margin-top: 1.5em;
  margin-bottom: 0.5em;
  font-weight: 600;
  line-height: 1.25;
}

.markdown-body h1 { font-size: 1.5em; }
.markdown-body h2 { font-size: 1.3em; }
.markdown-body h3 { font-size: 1.1em; }

.markdown-body p,
.markdown-body ul,
.markdown-body ol {
  margin-top: 0;
  margin-bottom: 1em;
}

.markdown-body ul,
.markdown-body ol {
  padding-left: 2em;
}

.markdown-body ul { list-style-type: disc; }
.markdown-body ol { list-style-type: decimal; }

.markdown-body li + li {
  margin-top: 0.25em;
}

.markdown-body a {
  color: #58a6ff;
  text-decoration: underline;
}

.markdown-body code {
  padding: 0.2em 0.4em;
  margin: 0;
  font-size: 85%;
  background-color: rgba(110, 118, 129, 0.4);
  border-radius: 3px;
  font-family: ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, Liberation Mono, monospace;
}

.markdown-body pre {
  padding: 1em;
  overflow: auto;
  font-size: 85%;
  line-height: 1.45;
  background-color: rgba(33, 38, 45, 0.8);
  border-radius: 3px;
  margin-bottom: 1em;
}

.markdown-body pre code {
  padding: 0;
  margin: 0;
  background-color: transparent;
}

.markdown-body blockquote {
  padding: 0 1em;
  color: #8b949e;
  border-left: 0.25em solid #30363d;
  margin-bottom: 1em;
}

.markdown-body table {
  display: block;
  width: 100%;
  overflow: auto;
  margin-bottom: 1em;
  border-spacing: 0;
  border-collapse: collapse;
}

.markdown-body table th,
.markdown-body table td {
  padding: 6px 13px;
  border: 1px solid #30363d;
}

.markdown-body table tr {
  background-color: transparent;
  border-top: 1px solid #30363d;
}

.markdown-body table tr:nth-child(2n) {
  background-color: rgba(33, 38, 45, 0.5);
}

.markdown-body img {
  max-width: 100%;
  box-sizing: content-box;
  background-color: transparent;
  border-radius: 3px;
}

.markdown-body hr {
  height: 0.25em;
  padding: 0;
  margin: 24px 0;
  background-color: #30363d;
  border: 0;
}
</style>