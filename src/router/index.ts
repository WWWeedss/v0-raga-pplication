import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '../pages/LoginPage.vue'
import ChatPage from '../pages/ChatPage.vue'
import { getCurrentUser } from '../api/UserComponents'
import { inject } from 'vue'

// 创建路由
const routes = [
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        name: 'Login',
        component: LoginPage
    },
    {
        path: '/chat',
        name: 'Chat',
        component: ChatPage,
        meta: { requiresAuth: true }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

// 导航守卫，使用 API 调用检查用户是否已登录
router.beforeEach(async (to, _from , next) => {
    // 获取全局状态
    const globalState = inject('globalState') as { isAuthenticating: boolean }

    // 如果 globalState 存在，显示加载状态
    if (globalState) {
        globalState.isAuthenticating = true
    }

    // 检查路由是否需要认证
    if (to.matched.some(record => record.meta.requiresAuth)) {
        try {
            const response = await getCurrentUser()

            if (response.data.code === 200) {
                next() // 允许访问需要认证的路由
            } else {
                next('/login') // 未登录，重定向到登录页
            }
        } catch (error) {
            console.error('验证用户登录状态失败:', error)
            next('/login')
        }
    } else if (to.path === '/login') {
        try {
            const response = await getCurrentUser()

            if (response.data.code === 200) {
                next('/chat')
            } else {
                next() // 允许访问登录页
            }
        } catch (error) {
            next() // 允许访问登录页
        }
    } else {
        next() // 对于不需要认证的其他路由，直接允许访问
    }
})

// 路由解析完成后，隐藏加载状态
router.afterEach(() => {
    const globalState = inject('globalState') as { isAuthenticating: boolean }
    if (globalState) {
        setTimeout(() => {
            globalState.isAuthenticating = false
        }, 300) // 添加短暂延迟，确保平滑过渡
    }
})

export default router
