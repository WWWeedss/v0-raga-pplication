import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '../pages/LoginPage.vue'
import ChatPage from '../pages/ChatPage.vue'
import { getCurrentUser } from '../api/UserComponents'
import { inject } from 'vue'
import MedicalRecordPage from "../pages/MedicalRecordPage.vue";

// 创建路由
const routes = [
    {
        path: '/',
        redirect: '/medical'  // 改为重定向到 medical 页面
    },
    {
        path: '/login',
        name: 'Login',
        component: LoginPage
    },
    {
        path: '/medical',
        name: 'Medical',
        component: MedicalRecordPage,
        meta: { requiresAuth: true }
    },
    {
        path: '/chat',
        name: 'Chat',
        component: ChatPage,
        meta: {
            requiresAuth: true,
            hidden: true  // 标记为隐藏路由，不在导航中显示
        }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

// 判断是否登录过的函数
const isLoggedIn = () => {
    const userData = localStorage.getItem('userData')
    const lastLoginTime = localStorage.getItem('lastLoginTime')
    if (userData && lastLoginTime) {
        const timeDiff = new Date().getTime() - new Date(lastLoginTime).getTime()
        // 判断是否在 24 小时内登录过
        if (timeDiff <= 24 * 60 * 60 * 1000) {
            return true
        }
    }
    return false
}

// 导航守卫，使用 API 调用检查用户是否已登录
router.beforeEach(async (to, _from, next) => {
    const globalState = inject('globalState') as { isAuthenticating: boolean }

    if (globalState) {
        globalState.isAuthenticating = true
    }

    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (isLoggedIn()) {
            // 如果本地数据存在，且用户上一次登录在 24 小时内，允许访问
            next()
        } else {
            try {
                const response = await getCurrentUser()
                if (response.status === 200) {
                    // 登录成功，保存用户数据和登录时间到 localStorage
                    localStorage.setItem('userData', JSON.stringify(response.data))
                    localStorage.setItem('lastLoginTime', new Date().toISOString())
                    next() // 允许访问需要认证的路由
                } else {
                    next('/login') // 未登录，重定向到登录页
                }
            } catch (error) {
                console.error('验证用户登录状态失败:', error)
                next('/login')
            }
        }
    } else if (to.path === '/login') {
        if (isLoggedIn()) {
            next('/medical') // 如果已经登录，直接跳转到 medical 页面
        } else {
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