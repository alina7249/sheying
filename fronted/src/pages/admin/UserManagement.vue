<template>
  <div>
    <h1 class="text-2xl font-bold text-white mb-8">用户管理</h1>
    <div class="bg-[#1E2532] rounded-xl border border-[#2D3748] overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-[#2D3748]">
            <tr>
              <th class="text-left p-4 text-[#B8C6D8] text-sm font-medium">用户</th>
              <th class="text-left p-4 text-[#B8C6D8] text-sm font-medium">角色</th>
              <th class="text-left p-4 text-[#B8C6D8] text-sm font-medium hidden md:table-cell">注册时间</th>
              <th class="text-right p-4 text-[#B8C6D8] text-sm font-medium">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading" class="border-t border-[#2D3748]">
              <td colspan="4" class="p-8 text-center text-[#6B7C93]">
                <div class="animate-spin w-6 h-6 border-2 border-[#C9A962] border-t-transparent rounded-full mx-auto"></div>
              </td>
            </tr>
            <tr v-else-if="users.length === 0" class="border-t border-[#2D3748]">
              <td colspan="4" class="p-8 text-center text-[#6B7C93]">暂无用户</td>
            </tr>
            <tr v-for="user in users" :key="user.id" class="border-t border-[#2D3748] hover:bg-[#2D3748]/30 transition-colors">
              <td class="p-4 flex items-center gap-3">
                <img :src="user.userAvatar || 'https://picsum.photos/80/80?random=user' + user.id" class="w-10 h-10 rounded-full object-cover" />
                <div>
                  <p class="text-white text-sm font-medium">{{ user.userName || user.userAccount }}</p>
                  <p class="text-[#6B7C93] text-xs">{{ user.userAccount }}</p>
                </div>
              </td>
              <td class="p-4">
                <span :class="['px-2 py-1 rounded-full text-xs font-medium',
                  user.userRole === 'admin' ? 'bg-[#C9A962]/20 text-[#C9A962]' : 'bg-[#4A5F8B]/20 text-[#4A5F8B]']">
                  {{ user.userRole === 'admin' ? '管理员' : '用户' }}
                </span>
              </td>
              <td class="p-4 text-[#B8C6D8] text-sm hidden md:table-cell">{{ formatDate(user.createTime) }}</td>
              <td class="p-4 text-right">
                <button
                  @click="handleBan(user)"
                  :class="['px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                    user.userRole === 'ban' ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' : 'bg-red-500/20 text-red-400 hover:bg-red-500/30']">
                  {{ user.userRole === 'ban' ? '解封' : '封禁' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="total > pageSize" class="flex justify-center p-4 gap-2 border-t border-[#2D3748]">
        <button @click="current--; loadUsers()" :disabled="current === 1"
          class="px-3 py-1.5 rounded-lg bg-[#2D3748] text-[#B8C6D8] text-sm hover:bg-[#4A5F8B] hover:text-white transition-colors disabled:opacity-50">上一页</button>
        <span class="px-3 py-1.5 text-[#6B7C93] text-sm">{{ current }} / {{ Math.ceil(total / pageSize) }}</span>
        <button @click="current++; loadUsers()" :disabled="current >= Math.ceil(total / pageSize)"
          class="px-3 py-1.5 rounded-lg bg-[#2D3748] text-[#B8C6D8] text-sm hover:bg-[#4A5F8B] hover:text-white transition-colors disabled:opacity-50">下一页</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getUserListPage, banUser, unbanUser } from '../../services/api';
import { toast } from 'vue-sonner';

const users = ref<any[]>([]);
const loading = ref(false);
const current = ref(1);
const pageSize = 20;
const total = ref(0);

const formatDate = (date: string) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('zh-CN');
};

const loadUsers = async () => {
  loading.value = true;
  try {
    const res: any = await getUserListPage(current.value, pageSize);
    if (res?.code === 0 && res.data) {
      users.value = res.data.records || [];
      total.value = res.data.total || 0;
    }
  } catch (e) { /* ignore */ }
  finally { loading.value = false; }
};

const handleBan = async (user: any) => {
  try {
    const res: any = user.userRole === 'ban' ? await unbanUser(user.id) : await banUser(user.id);
    if (res?.code === 0) {
      toast.success(user.userRole === 'ban' ? '已解封' : '已封禁');
      await loadUsers();
    }
  } catch (e: any) {
    toast.error(e?.message || '操作失败');
  }
};

onMounted(() => {
  loadUsers();
});
</script>