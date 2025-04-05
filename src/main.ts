import {createApp, reactive} from 'vue'
import './style.css'
import App from './App.vue'
import "tailwindcss/tailwind.css"
import router from './router/index.ts'
import axios from "axios";

// 配置 axios
axios.defaults.withCredentials = true // 确保跨域请求发送 cookies

const app = createApp(App)

// 设置全局状态
const globalState = reactive({
    isAuthenticating: false
})

app.provide('globalState', globalState)  // 使用 provide 提供状态给所有组件

// 设置路由
app.use(router)

app.mount('#app')
