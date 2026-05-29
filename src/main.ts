// main.ts - Vue应用入口文件
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import { Toaster } from 'sonner'
import App from './App.vue'
import './index.css'

// 创建Pinia
const pinia = createPinia()

// 基础路由配置（可根据需要扩展）
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('@/pages/Home.vue'),
    },
  ],
})

// 创建Vue应用
const app = createApp(App)

app.use(pinia)
app.use(router)
app.mount('#root')
