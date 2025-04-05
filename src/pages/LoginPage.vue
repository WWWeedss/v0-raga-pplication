<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 bg-gray-800 p-8 rounded-lg shadow-lg">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-white">
          {{ isLogin ? '登录到您的账户' : '创建新账户' }}
        </h2>
        <p class="mt-2 text-center text-sm text-gray-400">
          {{ isLogin ? '或者' : '已有账户？' }}
          <a
              href="#"
              class="font-medium text-purple-500 hover:text-purple-400"
              @click.prevent="toggleMode"
          >
            {{ isLogin ? '创建新账户' : '登录' }}
          </a>
        </p>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="username" class="sr-only">用户名</label>
            <input
                id="username"
                name="username"
                type="text"
                v-model="user.username"
                required
                class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-600 placeholder-gray-500 text-white bg-gray-700 rounded-t-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                placeholder="用户名"
            />
          </div>
          <div>
            <label for="password" class="sr-only">密码</label>
            <input
                id="password"
                name="password"
                type="password"
                v-model="user.password"
                required
                class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-600 placeholder-gray-500 text-white bg-gray-700 rounded-b-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                placeholder="密码"
            />
          </div>
        </div>

        <div v-if="errorMessage" class="text-red-500 text-sm text-center">
          {{ errorMessage }}
        </div>

        <div>
          <button
              type="submit"
              class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              :disabled="isLoading"
          >
            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
              <Lock v-if="!isLoading" class="h-5 w-5 text-purple-500 group-hover:text-purple-400" />
              <div v-else class="h-5 w-5 flex items-center justify-center">
                <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            </span>
            {{ isLogin ? '登录' : '注册' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, reactive, onMounted, inject} from 'vue'
import { useRouter } from 'vue-router'
import { Lock } from 'lucide-vue-next'
import type { UserModel } from '../models/UserModel'
import { login, register } from '../api/UserComponents'

const router = useRouter()
const isLogin = ref(true)
const isLoading = ref(false)
const errorMessage = ref('')

const user = reactive<UserModel>({
  username: '',
  password: ''
})

// 切换登录/注册模式
const toggleMode = () => {
  isLogin.value = !isLogin.value
  errorMessage.value = ''

  // 清空表单
  if (!isLogin.value) {
    user.username = ''
    user.password = ''
  } else {
    // 如果切换回登录模式，填充默认用户信息
    user.username = 'WWWeeds'
    user.password = '123456'
  }
}

// 处理表单提交
const handleSubmit = async () => {
  try {
    isLoading.value = true
    errorMessage.value = ''

    if (isLogin.value) {
      // 登录逻辑
      const response = await login(user)
      console.log('登录成功:', response.data)

      // 不需要手动存储 token，因为它已经作为 cookie 存储
      // 直接跳转到聊天页面
      router.push('/chat')
    } else {
      // 注册逻辑
      const response = await register(user)
      console.log('注册成功:', response.data)

      // 自动切换到登录模式
      isLogin.value = true
      errorMessage.value = '注册成功，请登录'

      // 填充刚注册的用户名，但清空密码
      user.password = ''
    }
  } catch (error: any) {
    console.error('操作失败:', error)
    errorMessage.value = error.response?.data?.message || '操作失败，请重试'
  } finally {
    isLoading.value = false
  }
}

// 页面加载时，如果是登录模式，填充默认用户信息
onMounted(() => {
  if (isLogin.value) {
    user.username = 'WWWeeds'
    user.password = '123456'
  }
})
</script>