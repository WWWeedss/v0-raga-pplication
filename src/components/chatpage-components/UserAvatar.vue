<template>
  <div class="relative">
    <button @click="isOpen = !isOpen" class="flex items-center space-x-2 hover:bg-gray-700">
      <div class="h-8 w-8 rounded-full bg-purple-600 flex items-center justify-center text-white">
        <User class="h-4 w-4" />
      </div>
      <span class="hidden md:inline">{{ props.username }}</span>
      <ChevronDown class="h-4 w-4" />
    </button>

    <div v-if="isOpen" class="absolute right-0 mt-2 w-48 bg-gray-700 rounded-md shadow-lg py-1 z-10 border border-gray-600">
      <a href="#" class="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-600">个人资料</a>
      <a href="#" class="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-600">退出登录</a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { User, ChevronDown } from 'lucide-vue-next'

interface Props {
  username: string;
}

const props = withDefaults(defineProps<Props>(), {
  username: '用户'
})

const isOpen = ref<boolean>(false)
</script>