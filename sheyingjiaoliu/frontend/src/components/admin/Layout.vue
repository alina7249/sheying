<template>
  <div class="flex h-screen bg-[#1E2532] text-[#F5F7FA] overflow-hidden">
    <!-- 侧边栏 -->
    <Sidebar :collapsed="sidebarCollapsed" />

    <!-- 主内容区 -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- 顶部导航栏 -->
      <Header :sidebarCollapsed="sidebarCollapsed" @toggleSidebar="toggleSidebar" />

      <!-- 页面内容 -->
      <main class="flex-1 overflow-y-auto p-6 bg-[#1E2532]">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Sidebar from './Sidebar.vue';
import Header from './Header.vue';

const sidebarCollapsed = ref(false);

const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value;
};
</script>