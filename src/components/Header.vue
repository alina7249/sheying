<template>
  <header :class="[
    'sticky top-0 z-50 w-full border-b transition-all duration-300',
    bgClass
  ]">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <div class="flex items-center">
          <router-link to="/" class="flex items-center">
            <div
              :class="['mr-2 text-2xl', theme === 'dark' ? 'text-[#63B3ED]' : 'text-[#4A5F8B]']"
            >
              <i class="fa-solid fa-camera"></i>
            </div>
            <span :class="['text-xl font-bold', theme === 'dark' ? 'text-[#F5F7FA]' : 'text-[#1E2532]']">
              影研社
            </span>
          </router-link>
        </div>

        <!-- Desktop Navigation -->
        <nav class="hidden md:flex items-center space-x-8">
          <router-link
            v-for="link in navLinks"
            :key="link.path"
            :to="link.path"
            :class="getNavClass(route.path === link.path)"
          >
            {{ link.name }}
          </router-link>
          
          <!-- Admin Link -->
          <router-link
            to="/admin"
            :class="getNavClass(route.path.startsWith('/admin'))"
          >
            管理后台
          </router-link>

          <!-- Auth Section -->
          <template v-if="isAuthenticated">
            <div class="relative">
              <button
                class="flex items-center space-x-2"
                @click="toggleProfileDropdown"
                aria-label="打开个人信息下拉菜单"
              >
                <img
                  :src="userAvatar"
                  :alt="username"
                  :class="[
                    'w-10 h-10 rounded-full object-cover border-2 cursor-pointer transition-transform',
                    theme === 'dark' ? 'border-[#4A5F8B]' : 'border-[#63B3ED]'
                  ]"
                />
                <span
                  :class="['font-medium hidden lg:inline', theme === 'dark' ? 'text-[#F5F7FA]' : 'text-[#1E2532]']"
                >
                  {{ username }}
                </span>
              </button>
            </div>
          </template>
          <template v-else>
            <div class="flex items-center space-x-3">
              <router-link
                to="/login"
                :class="[
                  'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  theme === 'dark'
                    ? 'text-[#F5F7FA] border border-[#4A5F8B] hover:bg-[#4A5F8B]/20'
                    : 'text-[#1E2532] border border-gray-300 hover:bg-gray-100'
                ]"
              >
                登录
              </router-link>
              <router-link
                to="/register"
                :class="[
                  'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  theme === 'dark'
                    ? 'text-[#1E2532] bg-[#4A5F8B] hover:bg-[#6B7C93]'
                    : 'text-white bg-[#63B3ED] hover:bg-[#4299E1]'
                ]"
              >
                注册
              </router-link>
            </div>
          </template>
        </nav>

        <!-- Mobile Menu -->
        <div class="md:hidden flex items-center space-x-3">
          <button
            @click="toggleTheme"
            :class="[
              'p-2 rounded-full transition-colors',
              theme === 'dark' ? 'bg-[#2D3748] text-[#B8C6D8]' : 'bg-gray-100 text-[#6B7C93]'
            ]"
            :aria-label="theme === 'dark' ? '切换到浅色模式' : '切换到深色模式'"
          >
            <i :class="['fa-solid', theme === 'dark' ? 'fa-sun' : 'fa-moon']"></i>
          </button>
          <template v-if="isAuthenticated">
            <button
              @click="toggleProfileDropdown"
              :class="['p-2 rounded-full transition-colors', theme === 'dark' ? 'hover:bg-[#2D3748]' : 'hover:bg-gray-100']"
              aria-label="打开个人侧边栏"
            >
              <img
                :src="userAvatar"
                :alt="username"
                class="w-8 h-8 rounded-full object-cover cursor-pointer"
              />
            </button>
          </template>
          <button
            @click="isMobileMenuOpen = !isMobileMenuOpen"
            :class="[
              'p-2 rounded-full transition-colors',
              theme === 'dark' ? 'hover:bg-[#2D3748] text-[#B8C6D8]' : 'hover:bg-gray-100 text-[#6B7C93]'
            ]"
            aria-label="Open menu"
          >
            <i :class="['fa-solid', isMobileMenuOpen ? 'fa-times' : 'fa-bars', theme === 'dark' ? 'text-[#B8C6D8]' : 'text-[#6B7C93]']"></i>
          </button>
        </div>
      </div>

      <!-- Mobile Menu Content -->
      <transition name="slide">
        <div v-if="isMobileMenuOpen" :class="[
          'md:hidden py-4 space-y-4 border-t',
          theme === 'dark' ? 'border-[#4A5F8B] bg-[#1E2532]' : 'border-gray-200 bg-white'
        ]">
          <router-link
            v-for="link in navLinks"
            :key="link.path"
            :to="link.path"
            :class="getMobileNavClass(route.path === link.path)"
            @click="isMobileMenuOpen = false"
          >
            {{ link.name }}
          </router-link>
          
          <template v-if="isAuthenticated">
            <div class="px-4 space-y-2">
              <div class="grid grid-cols-3 gap-3">
                <router-link
                  :to="`/profile/${user?.id}`"
                  :class="getMobileIconClass()"
                  @click="isMobileMenuOpen = false"
                >
                  <i class="fa-solid fa-image mb-1"></i>作品
                </router-link>
                <router-link
                  to="#"
                  :class="getMobileIconClass()"
                  @click="isMobileMenuOpen = false"
                >
                  <i class="fa-solid fa-heart mb-1"></i>收藏
                </router-link>
                <router-link
                  to="#"
                  :class="getMobileIconClass()"
                  @click="isMobileMenuOpen = false"
                >
                  <i class="fa-solid fa-cog mb-1"></i>设置
                </router-link>
                <router-link
                  to="/admin"
                  :class="getMobileAdminIconClass()"
                  @click="isMobileMenuOpen = false"
                >
                  <i class="fa-solid fa-user-shield mb-1"></i>管理后台
                </router-link>
              </div>
              <button
                @click="handleLogout"
                :class="getMobileButtonClass()"
              >
                <i class="fa-solid fa-sign-out-alt mr-2"></i>退出登录
              </button>
            </div>
          </template>
          <template v-else>
            <div class="px-4 space-y-3">
              <router-link
                to="/login"
                :class="getMobileButtonClass()"
                @click="isMobileMenuOpen = false"
              >
                登录
              </router-link>
              <router-link
                to="/register"
                :class="[
                  'block w-full text-center px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                  theme === 'dark' ? 'text-[#1E2532] bg-[#4A5F8B] hover:bg-[#6B7C93]' : 'text-white bg-[#63B3ED] hover:bg-[#4299E1]'
                ]"
                @click="isMobileMenuOpen = false"
              >
                注册
              </router-link>
            </div>
          </template>
        </div>
      </transition>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
// import { useAuthStore } from '@/store/authStore'

const router = useRouter()
const route = useRoute()

// 模拟状态
const isAuthenticated = ref(false)
const user = ref<any>(null)
const theme = ref('dark')

const isMobileMenuOpen = ref(false)
const isProfileDropdownOpen = ref(false)
const scrolled = ref(false)

const mockUserData = {
  username: '@光影捕手',
  level: '新锐摄影师',
  levelNum: 3,
  progress: 120,
  progressMax: 200,
  stats: {
    posts: 12,
    likes: 236,
    collections: 48
  }
}

const navLinks = [
  { name: '作品库', path: '/' },
  { name: '器材中心', path: '/equipment' },
  { name: '课程', path: '/online-courses' },
  { name: '社区', path: '/community' },
  { name: '资源', path: '/resources' },
  { name: 'AI助手', path: '/ai-chat' },
  { name: '活动与赛事', path: '/events-and-contests' }
]

const userAvatar = computed(() => 
  user.value?.avatar || 
  'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photographer%20avatar%20professional&sign=b0609ecfca466fa5510f7df4adb33529'
)

const username = computed(() => user.value?.username || mockUserData.username)

const bgClass = computed(() => {
  if (scrolled.value) {
    return theme.value === 'dark' 
      ? 'bg-[#1E2532]/95 backdrop-blur-sm border-[#4A5F8B]' 
      : 'bg-white/95 backdrop-blur-sm shadow-md border-gray-200'
  }
  return theme.value === 'dark' 
    ? 'bg-[#1E2532] border-[#4A5F8B]' 
    : 'bg-white border-gray-200'
})

const getNavClass = (isActive: boolean) => {
  const base = 'font-medium transition-colors relative'
  if (isActive) {
    const textClass = theme.value === 'dark' ? 'text-[#F5F7FA]' : 'text-[#1E2532]'
    const borderClass = theme.value === 'dark' ? 'after:bg-[#4A5F8B]' : 'after:bg-[#63B3ED]'
    return `${base} ${textClass} after:content-[""] after:block after:w-full after:h-[2px] ${borderClass} after:absolute after:bottom-[-6px] after:left-0`
  }
  const textClass = theme.value === 'dark' ? 'text-[#B8C6D8]/70 hover:text-[#F5F7FA]' : 'text-[#6B7C93]/70 hover:text-[#1E2532]'
  return `${base} ${textClass}`
}

const getMobileNavClass = (isActive: boolean) => {
  if (isActive) {
    return theme.value === 'dark'
      ? 'block px-4 py-2 font-medium text-[#F5F7FA] bg-[#2D3748] rounded-lg border-l-2 border-[#4A5F8B]'
      : 'block px-4 py-2 font-medium text-[#1E2532] bg-gray-100 rounded-lg border-l-2 border-[#63B3ED]'
  }
  return theme.value === 'dark'
    ? 'block px-4 py-2 font-medium text-[#B8C6D8]/70 hover:text-[#F5F7FA] transition-colors'
    : 'block px-4 py-2 font-medium text-[#6B7C93]/70 hover:text-[#1E2532] transition-colors'
}

const getMobileIconClass = () => {
  return theme.value === 'dark'
    ? 'flex flex-col items-center justify-center p-3 rounded-lg text-sm font-medium bg-[#2D3748] text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors'
    : 'flex flex-col items-center justify-center p-3 rounded-lg text-sm font-medium bg-gray-100 text-[#6B7C93] hover:bg-gray-200 hover:text-[#1E2532] transition-colors'
}

const getMobileAdminIconClass = () => {
  return theme.value === 'dark'
    ? 'flex flex-col items-center justify-center p-3 rounded-lg text-sm font-medium bg-[#4A5F8B]/20 text-[#4A5F8B] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors'
    : 'flex flex-col items-center justify-center p-3 rounded-lg text-sm font-medium bg-[#63B3ED]/10 text-[#63B3ED] hover:bg-[#63B3ED]/20 hover:text-[#4299E1] transition-colors'
}

const getMobileButtonClass = () => {
  return theme.value === 'dark'
    ? 'w-full flex items-center justify-center px-4 py-3 rounded-lg text-sm font-medium bg-[#2D3748] text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors'
    : 'w-full flex items-center justify-center px-4 py-3 rounded-lg text-sm font-medium bg-gray-100 text-[#6B7C93] hover:bg-gray-200 hover:text-[#1E2532] transition-colors'
}

const toggleTheme = () => {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'
}

const toggleProfileDropdown = () => {
  isProfileDropdownOpen.value = !isProfileDropdownOpen.value
}

const handleLogout = () => {
  isAuthenticated.value = false
  user.value = null
  isMobileMenuOpen.value = false
}

const handleScroll = () => {
  scrolled.value = window.scrollY > 50
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
  max-height: 500px;
  opacity: 1;
}

.slide-enter-from,
.slide-leave-to {
  max-height: 0;
  opacity: 0;
}
</style>
