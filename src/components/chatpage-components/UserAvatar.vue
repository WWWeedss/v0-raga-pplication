<template>
  <div class="relative text-black">
    <button @click="isOpen = !isOpen" class="flex items-center space-x-2 hover:bg-gray-200">
      <div class="h-8 w-8 rounded-full bg-green-200 flex items-center justify-center ">
        <User class="h-4 w-4" />
      </div>
      <span class="hidden md:inline">{{ userData.username }}</span>
      <ChevronDown class="h-4 w-4" />
    </button>

    <div v-if="isOpen" class="absolute right-0 mt-2 w-48  rounded-md shadow-lg py-1 z-10 border border-gray-600">
      <a @click="logoutAndClearData" class="cursor-pointer block px-4 py-2 text-sm text-black hover:bg-gray-200">退出登录</a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { User, ChevronDown } from 'lucide-vue-next'
import {logout} from "../../api/UserComponents.ts";
import { useRouter } from "vue-router";
import type {UserModel} from "../../models/UserModel.ts";

const isOpen = ref<boolean>(false)

const router = useRouter()

const userData:UserModel = JSON.parse(localStorage.getItem('userData') || '{}')

const logoutAndClearData = async () => {
  const response = await logout();
  if (response.status === 200) {
    // 清除用户数据
    localStorage.removeItem('userData')
    router.push('/login')
  } else {
    console.error('Logout failed:', response)
  }
}
</script>