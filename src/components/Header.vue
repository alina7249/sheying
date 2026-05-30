<template>
  <header
    :class="['sticky top-0 z-50 w-full border-b border-[#4A5F8B] transition-all duration-300', getBgClass()]">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <div class="flex items-center">
          <router-link to="/" class="flex items-center">
            <div
              class="mr-2 text-2xl transition-transform hover:rotate-10"
              :class="theme === 'dark' ? 'text-[#63B3ED]' : 'text-[#4A5F8B]'">
              <i class="fa-solid fa-camera"></i>
            </div>
            <span
              :class="['text-xl font-bold', theme === 'dark' ? 'text-[#F5F7FA]' : 'text-[#1E2532]']">影研社
            </span>
          </router-link>
        </div>

        <nav class="hidden md:flex items-center space-x-8">
          <router-link
            v-for="link in navLinks"
            :key="link.path"
            :to="link.path"
            :class="[
              'font-medium transition-colors relative',
              getTextClass(route.path === link.path)
            ]"
            :style="route.path === link.path ? {
              borderBottom: `2px solid ${theme === 'dark' ? '#4A5F8B' : '#63B3ED'}`,
              paddingBottom: '4px'
            } : {}">
            {{ link.name }}
          </router-link>
          <router-link
            to="/admin"
            :class="[
              'font-medium transition-colors relative',
              getTextClass(route.path.startsWith('/admin'))
            ]">
            管理后台
          </router-link>
          <router-link
            to="/membership"
            :class="[
              'font-medium transition-colors relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg',
              route.path === '/membership'
                ? 'bg-gradient-to-r from-[#4A5F8B] to-[#63B3ED] text-[#F5F7FA]'
                : 'bg-gradient-to-r from-[#4A5F8B]/20 to-[#63B3ED]/20 text-[#63B3ED] hover:from-[#4A5F8B]/30 hover:to-[#63B3ED]/30'
            ]">
            <i class="fa-solid fa-crown text-xs"></i>开通会员
          </router-link>

          <div v-if="isAuthenticated" class="relative">
            <button
              class="flex items-center space-x-2"
              @click="toggleProfileDropdown"
              aria-label="打开个人信息下拉菜单">
              <img
                :src="userAvatar"
                :alt="username"
                :class="['w-10 h-10 rounded-full object-cover border-2 cursor-pointer transition-transform hover:scale-110', theme === 'dark' ? 'border-[#4A5F8B]' : 'border-[#63B3ED]']" />
              <span
                :class="['font-medium hidden lg:inline', theme === 'dark' ? 'text-[#F5F7FA]' : 'text-[#1E2532]']">
                {{ username }}
              </span>
            </button>
          </div>
          <div v-else class="flex items-center space-x-3">
            <router-link
              to="/login"
              :class="['px-4 py-2 rounded-lg text-sm font-medium transition-colors', theme === 'dark' ? 'text-[#F5F7FA] border border-[#4A5F8B] hover:bg-[#4A5F8B]/20' : 'text-[#1E2532] border border-gray-300 hover:bg-gray-100']">登录
            </router-link>
            <router-link
              to="/register"
              :class="['px-4 py-2 rounded-lg text-sm font-medium transition-colors', theme === 'dark' ? 'text-[#1E2532] bg-[#4A5F8B] hover:bg-[#6B7C93] shadow-[0_2px_8px_rgba(74,95,139,0.3)]' : 'text-white bg-[#63B3ED] hover:bg-[#4299E1] shadow-[0_2px_8px_rgba(99,179,237,0.3)]']">注册
            </router-link>
          </div>
        </nav>

        <div class="md:hidden flex items-center space-x-3">
          <button
            class="p-2 rounded-full transition-colors"
            :class="theme === 'dark' ? 'bg-[#2D3748] text-[#B8C6D8]' : 'bg-gray-100 text-[#6B7C93]'"
            @click="toggleTheme"
            :aria-label="theme === 'dark' ? '切换到浅色模式' : '切换到深色模式'">
            <i :class="['fa-solid', theme === 'dark' ? 'fa-sun' : 'fa-moon']"></i>
          </button>
          <button
            v-if="isAuthenticated"
            class="p-2 rounded-full transition-colors"
            :class="theme === 'dark' ? 'hover:bg-[#2D3748]' : 'hover:bg-gray-100'"
            @click="toggleProfileDropdown"
            aria-label="打开个人侧边栏">
            <img
              :src="userAvatar"
              :alt="username"
              class="w-8 h-8 rounded-full object-cover cursor-pointer" />
          </button>
          <button
            class="p-2 rounded-full transition-colors"
            :class="theme === 'dark' ? 'hover:bg-[#2D3748] text-[#B8C6D8]' : 'hover:bg-gray-100 text-[#6B7C93]'"
            @click="isMobileMenuOpen = !isMobileMenuOpen"
            aria-label="Open menu">
            <i :class="['fa-solid', isMobileMenuOpen ? 'fa-times' : 'fa-bars']"></i>
          </button>
        </div>
      </div>

      <Transition name="slide">
        <div
          v-if="isMobileMenuOpen"
          :class="['md:hidden py-4 space-y-4 border-t', theme === 'dark' ? 'border-[#4A5F8B] bg-[#1E2532]' : 'border-gray-200 bg-white']">
          <router-link
            v-for="link in navLinks"
            :key="link.path"
            :to="link.path"
            :class="[
              'block px-4 py-2 font-medium transition-colors',
              route.path === link.path ? (theme === 'dark' ? 'text-[#F5F7FA] bg-[#2D3748] rounded-lg border-l-2 border-[#4A5F8B]' : 'text-[#1E2532] bg-gray-100 rounded-lg border-l-2 border-[#63B3ED]') : (theme === 'dark' ? 'text-[#B8C6D8]/70 hover:text-[#F5F7FA]' : 'text-[#6B7C93]/70 hover:text-[#1E2532]')
            ]"
            @click="isMobileMenuOpen = false">
            {{ link.name }}
          </router-link>
          <div v-if="isAuthenticated" class="px-4 space-y-2">
            <div class="grid grid-cols-3 gap-3">
              <router-link
                :to="`/profile/${user?.id}`"
                :class="['flex flex-col items-center justify-center p-3 rounded-lg text-sm font-medium transition-colors', theme === 'dark' ? 'bg-[#2D3748] text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA]' : 'bg-gray-100 text-[#6B7C93] hover:bg-gray-200 hover:text-[#1E2532]']"
                @click="isMobileMenuOpen = false">
                <i class="fa-solid fa-image mb-1"></i>作品
              </router-link>
              <router-link
                :to="isAuthenticated ? '/profile/1' : '/login'"
                :class="['flex flex-col items-center justify-center p-3 rounded-lg text-sm font-medium transition-colors', theme === 'dark' ? 'bg-[#2D3748] text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA]' : 'bg-gray-100 text-[#6B7C93] hover:bg-gray-200 hover:text-[#1E2532]']"
                @click="isMobileMenuOpen = false">
                <i class="fa-solid fa-heart mb-1"></i>收藏
              </router-link>
              <router-link
                :to="isAuthenticated ? '/profile-settings' : '/login'"
                :class="['flex flex-col items-center justify-center p-3 rounded-lg text-sm font-medium transition-colors', theme === 'dark' ? 'bg-[#2D3748] text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA]' : 'bg-gray-100 text-[#6B7C93] hover:bg-gray-200 hover:text-[#1E2532]']"
                @click="isMobileMenuOpen = false">
                <i class="fa-solid fa-cog mb-1"></i>设置
              </router-link>
              <router-link
                to="/admin"
                :class="['flex flex-col items-center justify-center p-3 rounded-lg text-sm font-medium transition-colors', theme === 'dark' ? 'bg-[#4A5F8B]/20 text-[#4A5F8B] hover:bg-[#4A5F8B] hover:text-[#F5F7FA]' : 'bg-[#63B3ED]/10 text-[#63B3ED] hover:bg-[#63B3ED]/20 hover:text-[#4299E1]']"
                @click="isMobileMenuOpen = false">
                <i class="fa-solid fa-user-shield mb-1"></i>管理后台
              </router-link>
              <router-link
                to="/membership"
                :class="['flex flex-col items-center justify-center p-3 rounded-lg text-sm font-medium transition-colors', 'bg-gradient-to-r from-[#4A5F8B]/20 to-[#63B3ED]/20 text-[#63B3ED] hover:from-[#4A5F8B]/30 hover:to-[#63B3ED]/30']"
                @click="isMobileMenuOpen = false">
                <i class="fa-solid fa-crown mb-1"></i>开通会员
              </router-link>
            </div>
            <button
              @click="handleLogout(); isMobileMenuOpen = false"
              :class="['w-full flex items-center justify-center px-4 py-3 rounded-lg text-sm font-medium transition-colors', theme === 'dark' ? 'bg-[#2D3748] text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA]' : 'bg-gray-100 text-[#6B7C93] hover:bg-gray-200 hover:text-[#1E2532]']">
              <i class="fa-solid fa-sign-out-alt mr-2"></i>退出登录
            </button>
          </div>
          <div v-else class="px-4 space-y-3">
            <router-link
              to="/login"
              :class="['block w-full text-center px-4 py-3 rounded-lg text-sm font-medium transition-colors', theme === 'dark' ? 'bg-[#2D3748] text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA]' : 'bg-gray-100 text-[#6B7C93] hover:bg-gray-200 hover:text-[#1E2532]']"
              @click="isMobileMenuOpen = false">登录
            </router-link>
            <router-link
              to="/register"
              :class="['block w-full text-center px-4 py-3 rounded-lg text-sm font-medium transition-colors', theme === 'dark' ? 'text-[#1E2532] bg-[#4A5F8B] hover:bg-[#6B7C93]' : 'text-white bg-[#63B3ED] hover:bg-[#4299E1]']"
              @click="isMobileMenuOpen = false">注册
            </router-link>
          </div>
        </div>
      </Transition>
    </div>

    <ProfileDropdown
      :is-open="isProfileDropdownOpen"
      :on-close="() => isProfileDropdownOpen = false"
      :username="username"
      :level="mockUserData.level"
      :level-num="mockUserData.levelNum"
      :progress="mockUserData.progress"
      :progress-max="mockUserData.progressMax"
      :stats="mockUserData.stats"
      :avatar-src="userAvatar" />
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '../store/authStore';
import { storeToRefs } from 'pinia';
import ProfileDropdown from './ProfileDropdown.vue';

const authStore = useAuthStore();
const route = useRoute();

const isMobileMenuOpen = ref(false);
const isProfileDropdownOpen = ref(false);
const scrolled = ref(false);

const { isAuthenticated, user, theme } = storeToRefs(authStore);
const { logout, toggleTheme } = authStore;

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
};

const navLinks = [
  { name: '作品库', path: '/' },
  { name: '器材中心', path: '/equipment-hub' },
  { name: '课程', path: '/online-courses' },
  { name: '社区', path: '/community' },
  { name: '资源', path: '/resources' },
  { name: 'AI助手', path: '/aichat' },
  { name: '活动与赛事', path: '/events-contests' }
];

const userAvatar = computed(() => user.value?.avatar || 'https://picsum.photos/400/400?random=124');
const username = computed(() => user.value?.username || mockUserData.username);

onMounted(() => {
  const handleScroll = () => {
    scrolled.value = window.scrollY > 50;
  };
  window.addEventListener('scroll', handleScroll);
  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
  });
});

const handleLogout = () => {
  logout();
};

const toggleProfileDropdown = () => {
  isProfileDropdownOpen.value = !isProfileDropdownOpen.value;
};

const getBgClass = () => {
  if (scrolled.value) {
    return theme.value === 'dark' ? 'bg-[#1E2532]/95 backdrop-blur-sm' : 'bg-white/95 backdrop-blur-sm shadow-md';
  }
  return theme.value === 'dark' ? 'bg-[#1E2532]' : 'bg-white';
};

const getTextClass = (isActive: boolean) => {
  if (isActive) {
    return theme.value === 'dark' ? 'text-[#F5F7FA]' : 'text-[#1E2532]';
  }
  return theme.value === 'dark' ? 'text-[#B8C6D8]/70 hover:text-[#F5F7FA]' : 'text-[#6B7C93]/70 hover:text-[#1E2532]';
};
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  max-height: 0;
}

.slide-enter-to,
.slide-leave-from {
  opacity: 1;
  max-height: 500px;
}
</style>