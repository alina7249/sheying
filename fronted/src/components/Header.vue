<template>
  <header
    :class="['sticky top-0 z-50 w-full transition-all duration-500', getHeaderClass()]">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <div class="flex items-center">
          <router-link to="/" class="flex items-center group">
            <div class="relative mr-3">
              <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4A5F8B] to-[#63B3ED] flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <i class="fa-solid fa-camera text-white text-lg" aria-hidden="true"></i>
              </div>
              <div class="absolute inset-0 rounded-xl bg-gradient-to-br from-[#4A5F8B] to-[#63B3ED] opacity-50 blur-lg group-hover:opacity-80 transition-opacity duration-300"></div>
            </div>
            <div class="flex flex-col">
              <span class="text-xl font-bold gold-gradient tracking-tight">光影视界</span>
              <span class="text-[10px] text-[#6B7C93] -mt-1 tracking-widest uppercase">Light Vision</span>
            </div>
          </router-link>
        </div>

        <nav class="hidden md:flex items-center space-x-1">
          <router-link
            v-for="link in navLinks"
            :key="link.path"
            :to="link.path"
            :class="[
              'relative px-4 py-2 font-medium rounded-lg transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A962]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F1C2D]',
              getNavLinkClass(route.path === link.path)
            ]">
            {{ link.name }}
            <span v-if="route.path === link.path" class="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-[#C9A962] to-[#D4B97A] rounded-full"></span>
          </router-link>
          <div class="w-px h-8 bg-[#4A5F8B] mx-2"></div>
          <router-link
            to="/search-result"
            :class="[
              'relative px-4 py-2 font-medium rounded-lg transition-all duration-300',
              getNavLinkClass(route.path === '/search-result')
            ]">
            搜索
          </router-link>
          <router-link
            to="/publish"
            :class="[
              'relative px-5 py-2.5 font-semibold rounded-xl transition-all duration-300 flex items-center gap-2 overflow-hidden',
              route.path === '/publish'
                ? 'bg-gradient-to-r from-[#4A5F8B] to-[#63B3ED] text-white shadow-lg shadow-[#4A5F8B]/30'
                : 'bg-gradient-to-r from-[#4A5F8B]/10 to-[#63B3ED]/10 text-[#63B3ED] border border-[#4A5F8B]/30 hover:border-[#4A5F8B] hover:shadow-lg hover:shadow-[#4A5F8B]/20'
            ]">
            <i class="fa-solid fa-plus text-sm" aria-hidden="true"></i>
            <span>上传</span>
          </router-link>

          <!-- 已登录用户下拉菜单 -->
          <div v-if="isAuthenticated" class="relative ml-2">
            <button
              class="flex items-center space-x-3 p-1.5 rounded-xl hover:bg-[#2D3748] transition-colors duration-300 group"
              @click="toggleProfileDropdown"
              aria-label="打开个人信息下拉菜单">
              <div class="relative">
                <img
                  :src="userAvatar"
                  :alt="username"
                  class="w-10 h-10 rounded-full object-cover border-2 border-[#4A5F8B] group-hover:border-[#C9A962] transition-colors duration-300" />
                <div class="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-[#48BB78] rounded-full border-2 border-[#0F1C2D]"></div>
              </div>
              <div class="text-left hidden lg:block">
                <p class="text-sm font-semibold text-[#F5F7FA]">{{ username }}</p>
                <p class="text-[10px] text-[#6B7C93]">摄影师</p>
              </div>
              <i class="fa-solid fa-chevron-down text-xs text-[#6B7C93] group-hover:text-[#C9A962] transition-colors duration-300" aria-hidden="true"></i>
            </button>
          </div>

          <!-- 未登录显示登录注册按钮 -->
          <div v-else class="flex items-center space-x-2 ml-2">
            <router-link
              to="/login"
              class="px-4 py-2 rounded-lg text-sm font-medium text-[#B8C6D8] border border-[#4A5F8B] hover:border-[#C9A962] hover:text-[#F5F7FA] hover:bg-[#2D3748] transition-all duration-300">
              登录
            </router-link>
            <router-link
              to="/register"
              class="px-4 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-[#4A5F8B] to-[#63B3ED] text-[#F5F7FA] hover:shadow-lg hover:shadow-[#4A5F8B]/30 transition-all duration-300">
              注册
            </router-link>
          </div>
        </nav>

        <!-- 移动端 -->
        <div class="md:hidden flex items-center space-x-2">
          <button
            class="p-2 rounded-xl transition-all duration-300 hover:bg-[#2D3748]"
            @click="toggleTheme"
            :aria-label="theme === 'dark' ? '切换到浅色模式' : '切换到深色模式'">
            <i :class="['fa-solid', theme === 'dark' ? 'fa-sun text-[#C9A962]' : 'fa-moon text-[#4A5F8B]']" aria-hidden="true"></i>
          </button>
          <button
            v-if="isAuthenticated"
            class="relative p-2 rounded-xl transition-all duration-300 hover:bg-[#2D3748]"
            @click="toggleProfileDropdown"
            aria-label="打开个人侧边栏">
            <img
              :src="userAvatar"
              :alt="username"
              class="w-8 h-8 rounded-full object-cover" />
            <div class="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#48BB78] rounded-full border-2 border-[#0F1C2D]"></div>
          </button>
          <button
            class="p-2 rounded-xl transition-all duration-300 hover:bg-[#2D3748]"
            @click="isMobileMenuOpen = !isMobileMenuOpen"
            aria-label="打开菜单">
            <i :class="['fa-solid text-[#B8C6D8]', isMobileMenuOpen ? 'fa-times' : 'fa-bars']" aria-hidden="true"></i>
          </button>
        </div>
      </div>

      <!-- 移动端菜单 -->
      <Transition name="slide">
        <div
          v-if="isMobileMenuOpen"
          class="md:hidden py-6 space-y-4 border-t border-[#4A5F8B]/30 bg-[#0F1C2D]/95 backdrop-blur-xl">
          <nav class="flex flex-col space-y-1">
            <router-link
              v-for="link in navLinks"
              :key="link.path"
              :to="link.path"
              :class="[
                'flex items-center px-4 py-3 rounded-xl font-medium transition-all duration-300',
                route.path === link.path
                  ? 'bg-gradient-to-r from-[#4A5F8B]/20 to-[#63B3ED]/20 text-[#F5F7FA] border-l-2 border-[#C9A962]'
                  : 'text-[#B8C6D8]/70 hover:text-[#F5F7FA] hover:bg-[#2D3748]/50'
              ]"
              @click="isMobileMenuOpen = false">
              <i class="fa-solid mr-3 text-sm" :class="getNavIcon(link.path)" aria-hidden="true"></i>
              {{ link.name }}
            </router-link>
          </nav>
          <div class="h-px bg-gradient-to-r from-transparent via-[#4A5F8B] to-transparent my-2"></div>
          <div v-if="isAuthenticated" class="space-y-2">
            <div class="grid grid-cols-3 gap-2">
              <router-link
                to="/publish"
                class="flex flex-col items-center justify-center p-3 rounded-xl bg-[#4A5F8B]/20 text-[#63B3ED] hover:bg-[#4A5F8B]/30 transition-all duration-300"
                @click="isMobileMenuOpen = false">
                <i class="fa-solid fa-plus mb-1 text-lg" aria-hidden="true"></i>
                <span class="text-xs">上传</span>
              </router-link>
              <router-link
                to="/search-result"
                class="flex flex-col items-center justify-center p-3 rounded-xl bg-[#2D3748]/50 text-[#B8C6D8] hover:bg-[#4A5F8B]/30 hover:text-[#F5F7FA] transition-all duration-300"
                @click="isMobileMenuOpen = false">
                <i class="fa-solid fa-search mb-1 text-lg" aria-hidden="true"></i>
                <span class="text-xs">搜索</span>
              </router-link>
              <router-link
                :to="`/profile/${user?.id}`"
                class="flex flex-col items-center justify-center p-3 rounded-xl bg-[#2D3748]/50 text-[#B8C6D8] hover:bg-[#4A5F8B]/30 hover:text-[#F5F7FA] transition-all duration-300"
                @click="isMobileMenuOpen = false">
                <i class="fa-solid fa-user mb-1 text-lg" aria-hidden="true"></i>
                <span class="text-xs">个人中心</span>
              </router-link>
            </div>
            <button
              @click="handleLogout(); isMobileMenuOpen = false"
              class="w-full flex items-center justify-center px-4 py-3 rounded-xl bg-[#2D3748]/50 text-[#B8C6D8] hover:bg-[#4A5F8B]/30 hover:text-[#F5F7FA] transition-all duration-300">
              <i class="fa-solid fa-sign-out-alt mr-2" aria-hidden="true"></i>退出登录
            </button>
          </div>
          <div v-else class="space-y-2">
            <router-link
              to="/login"
              class="block w-full text-center px-4 py-3 rounded-xl bg-[#2D3748]/50 text-[#B8C6D8] hover:bg-[#4A5F8B]/30 hover:text-[#F5F7FA] transition-all duration-300"
              @click="isMobileMenuOpen = false">登录
            </router-link>
            <router-link
              to="/register"
              class="block w-full text-center px-4 py-3 rounded-xl bg-gradient-to-r from-[#4A5F8B] to-[#63B3ED] text-[#F5F7FA] hover:shadow-lg hover:shadow-[#4A5F8B]/30 transition-all duration-300"
              @click="isMobileMenuOpen = false">注册
            </router-link>
          </div>
        </div>
      </Transition>
    </div>

    <!-- 简化版用户下拉菜单 -->
    <ProfileDropdown
      v-if="isAuthenticated"
      :is-open="isProfileDropdownOpen"
      :on-close="() => isProfileDropdownOpen = false"
      :username="username"
      :avatar-src="userAvatar"
      :user-id="user?.id" />
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
const { logout, toggleTheme, fetchCurrentUser } = authStore;

const navLinks = [
  { name: '作品库', path: '/', icon: 'fa-images' },
  { name: '社区', path: '/community', icon: 'fa-users' }
];

// 使用 authStore 中的真实用户数据
const userAvatar = computed(() => {
  if (user.value?.avatar) {
    return user.value.avatar;
  }
  return 'https://picsum.photos/400/400?random=default';
});

const username = computed(() => user.value?.username || '用户');

// 页面加载时，如果 token 存在但用户信息不完整，自动获取用户信息
onMounted(async () => {
  const handleScroll = () => {
    scrolled.value = window.scrollY > 20;
  };
  window.addEventListener('scroll', handleScroll);
  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
  });

  // 如果已登录但用户信息不完整，尝试获取用户信息
  if (isAuthenticated.value && user.value && !user.value.avatar) {
    await fetchCurrentUser();
  }
});

const handleLogout = () => {
  logout();
};

const toggleProfileDropdown = () => {
  isProfileDropdownOpen.value = !isProfileDropdownOpen.value;
};

const getHeaderClass = () => {
  if (scrolled.value) {
    return 'bg-[#0F1C2D]/90 backdrop-blur-xl shadow-2xl shadow-black/30 border-b border-[#4A5F8B]/20';
  }
  return 'bg-transparent';
};

const getNavLinkClass = (isActive: boolean) => {
  if (isActive) {
    return 'text-[#F5F7FA] bg-[#2D3748]/50';
  }
  return 'text-[#B8C6D8]/70 hover:text-[#F5F7FA] hover:bg-[#2D3748]/30';
};

const getNavIcon = (path: string) => {
  const link = navLinks.find(l => l.path === path);
  return link?.icon || 'fa-circle';
};
</script>

<style scoped>
.slide-enter-active {
  transition: opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1), max-height 0.4s cubic-bezier(0.16, 1, 0.3, 1), transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden;
}

.slide-leave-active {
  transition: opacity 0.3s cubic-bezier(0.4, 0, 1, 1), max-height 0.3s cubic-bezier(0.4, 0, 1, 1), transform 0.3s cubic-bezier(0.4, 0, 1, 1);
  overflow: hidden;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  max-height: 0;
  transform: translateY(-10px);
}

.slide-enter-to,
.slide-leave-from {
  opacity: 1;
  max-height: 800px;
  transform: translateY(0);
}

@media (prefers-reduced-motion: reduce) {
  .slide-enter-active,
  .slide-leave-active {
    transition: none;
  }
}
</style>
