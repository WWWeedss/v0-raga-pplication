<template>
  <div class="flex mb-4 justify-start">
    <div class="flex w-full">
      <div class="flex-shrink-0 h-8 w-8 rounded-full overflow-hidden flex items-center justify-center mr-2">
        <div class="bg-gray-600 h-full w-full flex items-center justify-center">
          <Bot class="h-4 w-4 text-white" />
        </div>
      </div>

      <div class="p-3 rounded-lg bg-gray-800 text-white">
        <div class="typing-indicator">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Bot } from 'lucide-vue-next'
</script>

<style scoped>
.typing-indicator {
  display: flex;
  align-items: center;
}

.typing-indicator span {
  height: 8px;
  width: 8px;
  margin: 0 2px;
  background-color: #9ca3af;
  border-radius: 50%;
  display: inline-block;
  opacity: 0.4;
}

.typing-indicator span:nth-child(1) {
  animation: pulse 1s infinite ease-in-out;
}

.typing-indicator span:nth-child(2) {
  animation: pulse 1s infinite ease-in-out 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation: pulse 1s infinite ease-in-out 0.4s;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.4;
  }
  50% {
    transform: scale(1.2);
    opacity: 1;
  }
}
</style>