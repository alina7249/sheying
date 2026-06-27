<template>
  <div
    :class="[
      'bg-[#2D3748] border-r border-[#4A5F8B] transition-all duration-300 flex flex-col h-full',
      collapsed ? 'w-16' : 'w-64'
    ]"
  >
    <!-- 品牌标识 -->
    <div
      :class="[
        'flex items-center p-4 border-b border-[#4A5F8B]',
        collapsed ? 'justify-center' : 'justify-start',
        'px-4'
      ]"
    >
      <template v-if="!collapsed">
        <div class="flex items-center">
          <i class="fa-solid fa-camera-retro text-2xl text-[#4A5F8B] mr-2"></i>
          <span class="text-xl font-bold">影研社管理</span>
        </div>
      </template>
      <i v-else class="fa-solid fa-camera-retro text-2xl text-[#4A5F8B]"></i>
    </div>

    <!-- 菜单项 -->
    <nav class="flex-1 overflow-y-auto p-4">
      <ul class="space-y-2">
        <li v-for="item in filteredMenuItems" :key="item.key">
          <router-link
            :to="item.path"
            :class="[
              'flex items-center p-3 rounded-lg transition-colors',
              isActive(item.path)
                ? 'bg-[#4A5F8B] text-[#F5F7FA]'
                : 'text-[#B8C6D8] hover:bg-[#4A5F8B]/20'
            ]"
          >
            <i :class="['fa-solid', item.icon, 'text-lg']"></i>
            <span v-if="!collapsed" class="ml-3">{{ item.label }}</span>
          </router-link>

          <!-- 子菜单 -->
          <ul
            v-if="item.children && !collapsed && isActive(item.path)"
            class="mt-2 pl-10 space-y-1"
          >
            <li v-for="child in item.children" :key="child.key">
              <router-link
                :to="child.path"
                :class="[
                  'flex items-center p-2 rounded-lg transition-colors',
                  isActive(child.path)
                    ? 'bg-[#4A5F8B]/50 text-[#F5F7FA]'
                    : 'text-[#B8C6D8] hover:bg-[#4A5F8B]/20'
                ]"
              >
                <span>{{ child.label }}</span>
              </router-link>
            </li>
          </ul>
        </li>
      </ul>
    </nav>

    <!-- 底部用户信息 -->
    <div v-if="!collapsed" class="p-4 border-t border-[#4A5F8B]">
      <div class="flex items-center">
        <div class="w-10 h-10 rounded-full bg-[#4A5F8B]/20 flex items-center justify-center text-[#4A5F8B] mr-3">
          <i class="fa-solid fa-user-shield"></i>
        </div>
        <div>
          <div class="text-sm font-medium">管理员</div>
          <div class="text-xs text-[#6B7C93]">
            {{ userRole === 'superAdmin' ? '超级管理员' : userRole === 'admin' ? '普通管理员' : '运营人员' }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAdminAuth } from '../../hooks/useAdminAuth';
import { adminMenuConfig } from '../../lib/adminMenuConfig';

defineProps<{
  collapsed: boolean;
}>();

const route = useRoute();
const { userRole } = useAdminAuth();

// 根据用户角色过滤菜单项
const filteredMenuItems = computed(() => {
  return adminMenuConfig.filter(item => {
    if (!item.roles) return true;
    return item.roles.includes(userRole);
  });
});

const isActive = (path: string) => {
  return route.path.includes(path);
};
</script>