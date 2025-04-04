<template>
  <div class="flex h-screen w-screen overflow-hidden">
    <!-- 侧边栏 -->
    <Sidebar ref="sidebarRef" />

    <!-- 主内容区 -->
    <div class="flex flex-col flex-1 overflow-hidden bg-gray-800 text-gray-100">
      <!-- 顶部导航栏 -->
      <header class="bg-gray-800 border-b border-gray-700 p-4 flex justify-between items-center">
        <button @click="toggleSidebar" class="p-1 rounded hover:bg-gray-700 md:hidden">
          <Menu class="h-6 w-6" />
        </button>
        <h1 class="text-xl font-bold text-white">RAG知识库问答</h1>
        <UserAvatar username="张三" />
      </header>

      <!-- 聊天区域 -->
      <div class="flex-1 overflow-auto p-4" ref="chatContainer">
        <div class="max-w-4xl mx-auto h-full">
          <ChatMessage
              v-for="(message, index) in messages"
              :key="index"
              :message="message"
          />
          <TypingIndicator v-if="isLoading" />
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
                class="flex-1 p-2 bg-gray-700 border border-gray-600 rounded-l-md text-white placeholder-gray-400 focus:outline-none  focus:border-transparent"
                :disabled="isLoading"
            />
            <button
                type="submit"
                class="bg-purple-600 text-white px-4 py-2 rounded-r-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                :disabled="isLoading || !newMessage.trim()"
            >
              <Send v-if="!isLoading" class="h-5 w-5" />
              <div v-else class="h-5 w-5 flex items-center justify-center">
                <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
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
import TypingIndicator from '../components/chatpage-components/TypingIndicator.vue'

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
const isLoading = ref<boolean>(false)
const messages = ref<Message[]>([
  {
    role: 'assistant',
    content: '您好！我是RAG知识库助手，有什么可以帮您的？'
  },
  {
    role: 'user',
    content: '什么是RAG技术？'
  },
  {
    role: 'assistant',
    content: '# RAG技术简介\n\nRAG（**Retrieval-Augmented Generation**）是一种结合了检索和生成的AI技术。它通过从知识库中检索相关信息，然后利用这些信息来增强大型语言模型的回答，从而提供更准确、更新和更可靠的回复。\n\n## RAG的主要组成部分\n\n1. **检索系统**：负责从知识库中找到与用户查询相关的文档或信息\n2. **生成系统**：通常是大型语言模型，用于生成最终回答\n\n## RAG的优势\n\n* 减少幻觉（hallucination）问题\n* 提供最新信息\n* 可以引用信息来源\n* 更好地处理专业领域问题\n\n```python\n# RAG简单实现示例\ndef rag_system(query, knowledge_base):\n    # 1. 检索相关文档\n    relevant_docs = retrieve_documents(query, knowledge_base)\n    \n    # 2. 构建增强提示\n    enhanced_prompt = f"基于以下信息回答问题:\\n{relevant_docs}\\n\\n问题: {query}"\n    \n    # 3. 生成回答\n    answer = llm_generate(enhanced_prompt)\n    \n    return answer\n```'
  }
])

const toggleSidebar = (): void => {
  if (sidebarRef.value) {
    sidebarRef.value.toggleSidebar()
  }
}

const sendMessage = async (): Promise<void> => {
  if (!newMessage.value.trim() || isLoading.value) return

  // 添加用户消息
  const userMessage = newMessage.value
  messages.value.push({ role: 'user', content: userMessage })
  newMessage.value = ''

  // 滚动到底部
  await nextTick()
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }

  // 显示加载状态
  isLoading.value = true

  // 模拟AI回复延迟
  setTimeout(async () => {
    // 根据用户问题生成不同的回复
    let botResponse = ''

    if (userMessage.includes('向量数据库')) {
      botResponse = '# 向量数据库在RAG中的应用\n\n向量数据库是RAG系统的核心组件之一，它专门用于存储和检索向量嵌入（vector embeddings）。\n\n## 常见的向量数据库\n\n1. **Pinecone**：完全托管的向量数据库服务\n2. **Milvus**：开源向量数据库，支持大规模相似性搜索\n3. **Faiss**：Facebook AI开发的高效相似性搜索库\n4. **Weaviate**：开源的向量搜索引擎\n5. **Chroma**：为RAG应用专门设计的嵌入式向量数据库\n\n## 向量数据库的工作原理\n\n向量数据库将文档或文本片段转换为高维向量，然后使用高效的算法（如近似最近邻搜索）来找到与查询向量最相似的文档向量。'
    } else if (userMessage.includes('嵌入') || userMessage.includes('embedding')) {
      botResponse = '# 嵌入（Embeddings）在RAG中的作用\n\n嵌入是将文本转换为数值向量的过程，这些向量捕获了文本的语义信息。\n\n## 嵌入模型\n\n常用的嵌入模型包括：\n\n* **OpenAI的text-embedding-ada-002**\n* **Sentence-BERT**\n* **GTE (General Text Embeddings)**\n* **BGE (BAAI General Embeddings)**\n\n## 嵌入在RAG中的应用\n\n1. **文档索引**：将知识库中的所有文档转换为向量\n2. **查询处理**：将用户查询转换为向量\n3. **相似度匹配**：通过计算向量间的相似度（如余弦相似度）找到相关文档'
    } else if (userMessage.includes('检索')) {
      botResponse = '# RAG中的检索策略\n\n有效的检索是RAG系统成功的关键。以下是几种常见的检索策略：\n\n## 1. 密集检索 (Dense Retrieval)\n\n使用神经网络生成的密集向量表示文档和查询，通过计算向量相似度进行检索。\n\n## 2. 混合检索 (Hybrid Retrieval)\n\n结合关键词搜索（如BM25）和密集检索的优点，提高检索准确性。\n\n## 3. 重排序 (Re-ranking)\n\n先使用快速但不太精确的方法检索候选文档，然后使用更复杂的模型对结果进行重新排序。\n\n## 4. 多跳检索 (Multi-hop Retrieval)\n\n通过多次检索解决复杂问题，每次检索基于前一次的结果。'
    } else {
      botResponse = '我可以回答您关于RAG（检索增强生成）技术的问题。例如：\n\n* 向量数据库在RAG中的应用\n* 嵌入（Embeddings）的作用\n* 不同的检索策略\n* RAG系统的评估方法\n* 如何处理长文本\n\n请告诉我您想了解的具体方面。'
    }

    // 添加AI回复
    messages.value.push({
      role: 'assistant',
      content: botResponse
    })

    // 关闭加载状态
    isLoading.value = false

    // 滚动到底部
    await nextTick()
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight
    }
  }, 2000) // 模拟2秒的回复延迟
}

onMounted((): void => {
  // 初始滚动到底部
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
})
</script>