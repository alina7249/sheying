<template>
  <header class="bg-[#2D3748] border-b border-[#4A5F8B] h-16 flex items-center px-6 justify-between">
    <!-- 左侧切换按钮 -->
    <div class="flex items-center">
      <button
        @click="$emit('toggleSidebar')"
        class="mr-4 text-[#B8C6D8] hover:text-[#F5F7FA] transition-colors p-2 rounded-lg hover:bg-[#4A5F8B]/20"
        aria-label="Toggle sidebar"
      >
        <i :class="['fa-solid', sidebarCollapsed ? 'fa-chevron-right' : 'fa-chevron-left']"></i>
      </button>

      <!-- 面包屑导航 -->
      <div class="hidden md:flex items-center text-sm text-[#B8C6D8]">
        <template v-for="(crumb, index) in breadcrumbs" :key="crumb.path">
          <a
            :href="crumb.path"
            :class="[
              'hover:text-[#F5F7FA] transition-colors',
              index === breadcrumbs.length - 1 ? 'text-[#F5F7FA]' : ''
            ]"
          >
            {{ crumb.label }}
          </a>
          <i v-if="index < breadcrumbs.length - 1" class="fa-solid fa-chevron-right mx-2 text-xs"></i>
        </template>
      </div>
    </div>

    <!-- 右侧工具栏 -->
    <div class="flex items-center space-x-4">
      <!-- 搜索框 -->
      <form @submit.prevent="handleSearch" class="relative hidden md:block">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="搜索..."
          class="bg-[#1E2532] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all w-64"
        />
        <i class="fa-solid fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6B7C93]"></i>
      </form>

      <!-- 通知图标 -->
      <button
        @click="showNotifications = !showNotifications"
        class="relative p-2 text-[#B8C6D8] hover:text-[#F5F7FA] transition-colors rounded-lg hover:bg-[#4A5F8B]/20"
      >
        <i class="fa-solid fa-bell"></i>
        <span class="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
      </button>

      <!-- 用户菜单 -->
      <div class="relative group">
        <button
          class="flex items-center space-x-2 p-1 rounded-lg hover:bg-[#4A5F8B]/20 transition-colors"
        >
          <div class="w-8 h-8 rounded-full bg-[#4A5F8B]/20 flex items-center justify-center text-[#4A5F8B]">
            <i class="fa-solid fa-user-shield"></i>
          </div>
          <span class="hidden md:inline text-sm font-medium">管理员</span>
          <i class="fa-solid fa-chevron-down text-xs text-[#6B7C93]"></i>
        </button>

        <!-- 下拉菜单 -->
        <div class="absolute right-0 mt-2 w-48 bg-[#2D3748] border border-[#4A5F8B] rounded-lg shadow-lg py-2 z-10 hidden group-hover:block">
          <button class="w-full text-left px-4 py-2 text-sm text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors">
            <i class="fa-solid fa-user mr-2"></i> 个人资料
          </button>
          <button class="w-full text-left px-4 py-2 text-sm text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors">
            <i class="fa-solid fa-cog mr-2"></i> 设置
          </button>
          <div class="border-t border-[#4A5F8B] my-1"></div>
          <button
            @click="handleLogout"
            class="w-full text-left px-4 py-2 text-sm text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors"
          >
            <i class="fa-solid fa-sign-out-alt mr-2"></i> 退出登录
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAdminAuth } from '../../hooks/useAdminAuth';
import { adminMenuConfig } from '../../lib/adminMenuConfig';

defineProps<{
  sidebarCollapsed: boolean;
}>();

defineEmits<{
  (e: 'toggleSidebar'): void;
}>();

const route = useRoute();
const router = useRouter();
const { logout } = useAdminAuth();

const showNotifications = ref(false);
const searchQuery = ref('');

// 构建面包屑
const breadcrumbs = computed(() => {
  const pathParts = route.path.split('/').filter(part => part);
  const crumbs: { label: string; path: string }[] = [];

  let cumulativePath = '/';

  // 添加首页
  crumbs.push({
    label: '首页',
    path: '/admin'
  });

  // 添加其他路径部分
  pathParts.forEach(part => {
    cumulativePath += part + '/';
    // 查找对应的菜单项
    const menuItem = findMenuItemByPath(cumulativePath.slice(0, -1));
    if (menuItem) {
      crumbs.push({
        label: menuItem.label,
        path: cumulativePath.slice(0, -1)
      });
    }
  });

  return crumbs;
});

// 递归查找菜单项
const findMenuItemByPath = (path: string): { label: string; path: string } | null => {
  for (const item of adminMenuConfig) {
    if (item.path === path) return item;
    if (item.children) {
      const found = item.children.find(child => child.path === path);
      if (found) return found;
    }
  }
  return null;
};

const handleSearch = () => {
  console.log('Searching for:', searchQuery.value);
};

const handleLogout = () => {
  logout();
  router.push('/login');
};
</script>