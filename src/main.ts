import { createApp, reactive } from 'vue'
import './style.css'
import App from './App.vue'
import "tailwindcss/tailwind.css"
import router from './router/index.ts'
import axios from "axios";
import type { UserModel } from "./models/UserModel.ts";

// 配置 axios
axios.defaults.withCredentials = true // 确保跨域请求发送 cookies

const app = createApp(App)

// 设置全局状态
const globalState = reactive({
    isAuthenticating: false,
})

// 设置 userData 的初始值
const userData = reactive<UserModel>(JSON.parse(localStorage.getItem('userData') || '{}'))

// 设置路由
app.use(router)

// 提供全局状态和用户数据
app.provide('userData', userData)
app.provide('globalState', globalState)

// 设置路由
app.mount('#app')
