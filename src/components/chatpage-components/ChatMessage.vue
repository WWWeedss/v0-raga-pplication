<template>
  <div class="flex mb-4" :class="message.role === 'user' ? 'justify-end' : 'justify-start'">
    <div class="flex max-w-3xl" :class="message.role === 'user' ? 'flex-row-reverse' : ''">
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
           :class="message.role === 'user' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-white'">
        <p>{{ message.content }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { User, Bot } from 'lucide-vue-next'

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

defineProps<{
  message: Message;
}>()
</script>