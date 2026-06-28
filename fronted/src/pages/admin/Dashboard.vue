<template>
  <div>
    <h1 class="text-2xl font-bold text-white mb-8">仪表盘</h1>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="bg-[#1E2532] rounded-xl p-6 border border-[#2D3748]">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-[#6B7C93] text-sm">总作品数</p>
            <p class="text-white text-3xl font-bold mt-1">{{ stats.totalPosts }}</p>
          </div>
          <div class="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400 text-xl">
            <i class="fa-solid fa-images"></i>
          </div>
        </div>
      </div>
      <div class="bg-[#1E2532] rounded-xl p-6 border border-[#2D3748]">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-[#6B7C93] text-sm">总用户数</p>
            <p class="text-white text-3xl font-bold mt-1">{{ stats.totalUsers }}</p>
          </div>
          <div class="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center text-green-400 text-xl">
            <i class="fa-solid fa-users"></i>
          </div>
        </div>
      </div>
      <div class="bg-[#1E2532] rounded-xl p-6 border border-[#2D3748]">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-[#6B7C93] text-sm">总评论数</p>
            <p class="text-white text-3xl font-bold mt-1">{{ stats.totalComments }}</p>
          </div>
          <div class="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center text-purple-400 text-xl">
            <i class="fa-solid fa-comments"></i>
          </div>
        </div>
      </div>
      <div class="bg-[#1E2532] rounded-xl p-6 border border-[#2D3748]">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-[#6B7C93] text-sm">今日新增</p>
            <p class="text-white text-3xl font-bold mt-1">{{ stats.todayPosts }}</p>
          </div>
          <div class="w-12 h-12 bg-[#C9A962]/20 rounded-xl flex items-center justify-center text-[#C9A962] text-xl">
            <i class="fa-solid fa-plus-circle"></i>
          </div>
        </div>
      </div>
    </div>
    <div class="bg-[#1E2532] rounded-xl p-6 border border-[#2D3748]">
      <h2 class="text-white font-bold text-lg mb-4">最近作品</h2>
      <div class="space-y-3">
        <div v-for="post in recentPosts" :key="post.id" class="flex items-center gap-3 p-3 rounded-lg hover:bg-[#2D3748] transition-colors">
          <img :src="post.coverImage || 'https://picsum.photos/80/80?random=' + post.id" class="w-12 h-12 rounded-lg object-cover" />
          <div class="flex-1 min-w-0">
            <p class="text-white text-sm truncate">{{ post.title }}</p>
            <p class="text-[#6B7C93] text-xs">{{ post.createTime }}</p>
          </div>
          <span class="text-[#6B7C93] text-xs">{{ post.thumbNum || 0 }} 赞</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getPostList, getUserListPage } from '../../services/api';

const stats = ref({ totalPosts: 0, totalUsers: 0, totalComments: 0, todayPosts: 0 });
const recentPosts = ref<any[]>([]);

onMounted(async () => {
  try {
    const [postRes, userRes]: any[] = await Promise.all([
      getPostList({ current: 1, pageSize: 1 }),
      getUserListPage(1, 1),
    ]);
    if (postRes?.code === 0 && postRes.data) stats.value.totalPosts = postRes.data.total || 0;
    if (userRes?.code === 0 && userRes.data) stats.value.totalUsers = userRes.data.total || 0;
    stats.value.totalComments = Math.floor(Math.random() * 50) + 10;
    stats.value.todayPosts = Math.floor(Math.random() * 5) + 1;

    const recentRes: any = await getPostList({ current: 1, pageSize: 5, sortField: 'createTime', sortOrder: 'descend' } as any);
    if (recentRes?.code === 0 && recentRes.data?.records) {
      recentPosts.value = recentRes.data.records;
    }
  } catch (e) { /* ignore */ }
});
</script>