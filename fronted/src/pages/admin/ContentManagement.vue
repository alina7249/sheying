<template>
  <div>
    <h1 class="text-2xl font-bold text-white mb-8">内容管理</h1>
    <div class="bg-[#1E2532] rounded-xl border border-[#2D3748] overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-[#2D3748]">
            <tr>
              <th class="text-left p-4 text-[#B8C6D8] text-sm font-medium">作品</th>
              <th class="text-left p-4 text-[#B8C6D8] text-sm font-medium hidden md:table-cell">作者</th>
              <th class="text-left p-4 text-[#B8C6D8] text-sm font-medium hidden md:table-cell">点赞</th>
              <th class="text-left p-4 text-[#B8C6D8] text-sm font-medium hidden md:table-cell">时间</th>
              <th class="text-left p-4 text-[#B8C6D8] text-sm font-medium hidden md:table-cell">审核</th>
              <th class="text-right p-4 text-[#B8C6D8] text-sm font-medium">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading" class="border-t border-[#2D3748]">
              <td colspan="6" class="p-8 text-center text-[#6B7C93]">
                <div class="animate-spin w-6 h-6 border-2 border-[#C9A962] border-t-transparent rounded-full mx-auto"></div>
              </td>
            </tr>
            <tr v-for="post in posts" :key="post.id" class="border-t border-[#2D3748] hover:bg-[#2D3748]/30 transition-colors">
              <td class="p-4 flex items-center gap-3">
                <img :src="post.coverImage || 'https://picsum.photos/80/80?random=' + post.id" class="w-12 h-12 rounded-lg object-cover" />
                <span class="text-white text-sm truncate max-w-[200px]">{{ post.title }}</span>
              </td>
              <td class="p-4 text-[#B8C6D8] text-sm hidden md:table-cell">{{ post.user?.userName || '-' }}</td>
              <td class="p-4 text-[#B8C6D8] text-sm hidden md:table-cell">{{ post.thumbNum || 0 }}</td>
              <td class="p-4 text-[#B8C6D8] text-sm hidden md:table-cell">{{ formatDate(post.createTime) }}</td>
              <td class="p-4 text-[#B8C6D8] text-sm hidden md:table-cell">
                <span :class="post.auditStatus === 'approved' ? 'text-green-400' : post.auditStatus === 'rejected' ? 'text-red-400' : 'text-yellow-400'">
                  {{ post.auditStatus === 'approved' ? '已通过' : post.auditStatus === 'rejected' ? '已拒绝' : '待审核' }}
                </span>
              </td>
              <td class="p-4 text-right">
                <button v-if="post.auditStatus !== 'approved'" @click="handleAudit(post, 'approved')" class="px-3 py-1.5 rounded-lg bg-green-500/20 text-green-400 text-xs hover:bg-green-500/30 transition-colors mr-1">通过</button>
                <button v-if="post.auditStatus !== 'rejected'" @click="handleAudit(post, 'rejected')" class="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 text-xs hover:bg-red-500/30 transition-colors mr-1">拒绝</button>
                <button @click="handleDelete(post)" class="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 text-xs hover:bg-red-500/30 transition-colors">删除</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="total > pageSize" class="flex justify-center p-4 gap-2 border-t border-[#2D3748]">
        <button @click="current--; loadPosts()" :disabled="current === 1"
          class="px-3 py-1.5 rounded-lg bg-[#2D3748] text-[#B8C6D8] text-sm hover:bg-[#4A5F8B] hover:text-white transition-colors disabled:opacity-50">上一页</button>
        <span class="px-3 py-1.5 text-[#6B7C93] text-sm">{{ current }} / {{ Math.ceil(total / pageSize) }}</span>
        <button @click="current++; loadPosts()" :disabled="current >= Math.ceil(total / pageSize)"
          class="px-3 py-1.5 rounded-lg bg-[#2D3748] text-[#B8C6D8] text-sm hover:bg-[#4A5F8B] hover:text-white transition-colors disabled:opacity-50">下一页</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getPostList, auditPost } from '../../services/api';
import { toast } from 'vue-sonner';

const posts = ref<any[]>([]);
const loading = ref(false);
const current = ref(1);
const pageSize = 20;
const total = ref(0);

const formatDate = (date: string) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('zh-CN');
};

const loadPosts = async () => {
  loading.value = true;
  try {
    const res: any = await getPostList({ current: current.value, pageSize: pageSize });
    if (res?.code === 0 && res.data) {
      posts.value = res.data.records || [];
      total.value = res.data.total || 0;
    }
  } catch (e) { /* ignore */ }
  finally { loading.value = false; }
};

const handleAudit = async (post: any, status: string) => {
  const note = status === 'rejected' ? prompt('请输入拒绝原因：') : '';
  if (status === 'rejected' && note === null) return;
  try {
    await auditPost(post.id, status, note || undefined);
    toast.success(status === 'approved' ? '审核通过' : '已拒绝');
    loadPosts();
  } catch (e: any) {
    toast.error(e?.message || '操作失败');
  }
};

const handleDelete = async (post: any) => {
  toast.success('删除功能开发中');
};

onMounted(() => {
  loadPosts();
});
</script>