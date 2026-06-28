<template>
  <div class="min-h-screen bg-[#0F1C2D] container mx-auto px-4 py-8">
    <div class="max-w-3xl mx-auto">
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-2xl font-bold text-white">
          <i class="fa-solid fa-bell mr-2 text-[#C9A962]"></i>通知中心
        </h1>
        <button
          @click="markAllRead"
          class="text-sm text-[#6B7C93] hover:text-[#C9A962] transition-colors"
          v-if="unreadCount > 0">
          全部标记为已读
        </button>
      </div>

      <div v-if="loading" class="flex items-center justify-center py-20">
        <div class="animate-spin w-8 h-8 border-2 border-[#C9A962] border-t-transparent rounded-full"></div>
      </div>

      <div v-else-if="notifications.length === 0" class="flex flex-col items-center justify-center py-20 text-[#6B7C93]">
        <i class="fa-solid fa-bell-slash text-5xl mb-4"></i>
        <p class="text-lg">暂无通知</p>
      </div>

      <div v-else class="space-y-2">
        <div
          v-for="notif in notifications"
          :key="notif.id"
          @click="handleClick(notif)"
          :class="[
            'p-4 rounded-xl cursor-pointer transition-all duration-200 border',
            notif.isRead ? 'bg-[#1E2532] border-[#2D3748]' : 'bg-[#2D3748] border-[#4A5F8B]/30 hover:border-[#C9A962]/30'
          ]">
          <div class="flex items-start gap-3">
            <div :class="[
              'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0',
              getIconClass(notif.type)
            ]">
              <i :class="['fa-solid', getIcon(notif.type)]"></i>
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between">
                <span :class="['font-medium', notif.isRead ? 'text-[#B8C6D8]' : 'text-white']">
                  {{ notif.title }}
                </span>
                <span class="text-[10px] text-[#6B7C93] ml-2 flex-shrink-0">{{ formatTime(notif.createTime) }}</span>
              </div>
              <p v-if="notif.content" class="text-[#6B7C93] text-sm mt-1 truncate">{{ notif.content }}</p>
            </div>
            <div v-if="!notif.isRead" class="w-2 h-2 bg-[#C9A962] rounded-full flex-shrink-0 mt-2"></div>
          </div>
        </div>
      </div>

      <div v-if="total > pageSize" class="flex justify-center mt-8 gap-2">
        <button
          @click="changePage(current - 1)"
          :disabled="current === 1"
          class="px-4 py-2 rounded-lg bg-[#2D3748] text-[#B8C6D8] text-sm hover:bg-[#4A5F8B] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
          上一页
        </button>
        <span class="px-4 py-2 text-[#6B7C93] text-sm">{{ current }} / {{ Math.ceil(total / pageSize) }}</span>
        <button
          @click="changePage(current + 1)"
          :disabled="current >= Math.ceil(total / pageSize)"
          class="px-4 py-2 rounded-lg bg-[#2D3748] text-[#B8C6D8] text-sm hover:bg-[#4A5F8B] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
          下一页
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getNotifications, markAllNotificationsRead, getUnreadNotificationCount } from '../services/api';

const router = useRouter();
const notifications = ref<any[]>([]);
const loading = ref(false);
const current = ref(1);
const pageSize = 20;
const total = ref(0);
const unreadCount = ref(0);

const getIcon = (type: string) => {
  const map: Record<string, string> = {
    like: 'fa-heart',
    comment: 'fa-comment',
    follow: 'fa-user-plus',
    system: 'fa-circle-info',
  };
  return map[type] || 'fa-bell';
};

const getIconClass = (type: string) => {
  const map: Record<string, string> = {
    like: 'bg-red-500/20 text-red-400',
    comment: 'bg-blue-500/20 text-blue-400',
    follow: 'bg-green-500/20 text-green-400',
    system: 'bg-[#C9A962]/20 text-[#C9A962]',
  };
  return map[type] || 'bg-[#4A5F8B]/20 text-[#4A5F8B]';
};

const formatTime = (time: string) => {
  if (!time) return '';
  const d = new Date(time);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  if (diff < 60000) return '刚刚';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`;
  if (diff < 604800000) return `${Math.floor(diff / 86400000)}天前`;
  return d.toLocaleDateString('zh-CN');
};

const loadNotifications = async () => {
  loading.value = true;
  try {
    const res: any = await getNotifications(current.value, pageSize);
    if (res?.code === 0 && res.data) {
      notifications.value = res.data.records || [];
      total.value = res.data.total || 0;
    }
    const countRes: any = await getUnreadNotificationCount();
    if (countRes?.code === 0) {
      unreadCount.value = countRes.data || 0;
    }
  } catch (e) { /* ignore */ }
  finally { loading.value = false; }
};

const markAllRead = async () => {
  try {
    await markAllNotificationsRead();
    unreadCount.value = 0;
    notifications.value.forEach(n => n.isRead = 1);
  } catch (e) { /* ignore */ }
};

const handleClick = (notif: any) => {
  if (notif.relatedId && notif.type === 'like' || notif.type === 'comment') {
    router.push(`/photo-detail/${notif.relatedId}`);
  } else if (notif.relatedId && notif.type === 'follow') {
    router.push(`/profile/${notif.relatedId}`);
  }
};

const changePage = (page: number) => {
  current.value = page;
  loadNotifications();
};

onMounted(() => {
  loadNotifications();
});
</script>