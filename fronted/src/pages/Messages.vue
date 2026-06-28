<template>
  <div class="min-h-screen bg-[#0F1C2D] flex">
    <!-- 左侧会话列表 -->
    <div class="w-80 border-r border-[#2D3748] flex flex-col flex-shrink-0" :class="{ 'hidden md:flex': activeConversation }">
      <div class="p-4 border-b border-[#2D3748]">
        <h2 class="text-lg font-bold text-white">
          <i class="fa-solid fa-comments mr-2 text-[#C9A962]"></i>私信
        </h2>
      </div>
      <div class="flex-1 overflow-y-auto">
        <div v-if="loading" class="flex items-center justify-center py-12">
          <div class="animate-spin w-8 h-8 border-2 border-[#C9A962] border-t-transparent rounded-full"></div>
        </div>
        <div v-else-if="conversations.length === 0" class="flex flex-col items-center justify-center py-12 text-[#6B7C93]">
          <i class="fa-solid fa-inbox text-4xl mb-4"></i>
          <p>暂无私信</p>
        </div>
        <button
          v-for="conv in conversations"
          :key="conv.id"
          @click="openConversation(conv)"
          :class="[
            'w-full p-4 flex items-center gap-3 hover:bg-[#1E2532] transition-colors text-left border-b border-[#2D3748]/50',
            activeConversation?.id === conv.id ? 'bg-[#1E2532] border-l-2 border-l-[#C9A962]' : ''
          ]">
          <div class="relative flex-shrink-0">
            <img :src="conv.fromUser?.avatar || 'https://picsum.photos/80/80?random=1'" class="w-12 h-12 rounded-full object-cover" />
            <div v-if="conv.isRead === 0 && conv.fromUserId !== currentUserId" class="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-[#0F1C2D]"></div>
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between">
              <span class="text-white font-medium text-sm truncate">{{ conv.fromUser?.username || '用户' }}</span>
              <span class="text-[10px] text-[#6B7C93] ml-2">{{ formatTime(conv.createTime) }}</span>
            </div>
            <p class="text-[#6B7C93] text-xs truncate mt-1">{{ conv.content }}</p>
          </div>
        </button>
      </div>
    </div>

    <!-- 中间聊天窗口 -->
    <div class="flex-1 flex flex-col" :class="{ 'hidden md:flex': !activeConversation }">
      <template v-if="activeConversation">
        <div class="p-4 border-b border-[#2D3748] flex items-center gap-3">
          <button @click="activeConversation = null" class="md:hidden text-[#6B7C93] hover:text-white">
            <i class="fa-solid fa-arrow-left"></i>
          </button>
          <img :src="activeConversation.fromUser?.avatar || 'https://picsum.photos/80/80?random=1'" class="w-10 h-10 rounded-full object-cover" />
          <span class="text-white font-medium">{{ activeConversation.fromUser?.username || '用户' }}</span>
        </div>
        <div class="flex-1 overflow-y-auto p-4 space-y-4" ref="chatContainer">
          <div v-if="messagesLoading" class="flex items-center justify-center py-12">
            <div class="animate-spin w-8 h-8 border-2 border-[#C9A962] border-t-transparent rounded-full"></div>
          </div>
          <div
            v-for="msg in messages"
            :key="msg.id"
            :class="['flex', msg.fromUserId === currentUserId ? 'justify-end' : 'justify-start']">
            <div
              :class="[
                'max-w-[70%] px-4 py-3 rounded-2xl text-sm',
                msg.fromUserId === currentUserId
                  ? 'bg-gradient-to-r from-[#4A5F8B] to-[#63B3ED] text-white rounded-br-md'
                  : 'bg-[#2D3748] text-[#F5F7FA] rounded-bl-md'
              ]">
              {{ msg.content }}
            </div>
          </div>
        </div>
        <div class="p-4 border-t border-[#2D3748]">
          <div class="flex items-center gap-2">
            <input
              v-model="newMessage"
              @keydown.enter="handleSend"
              placeholder="输入消息..."
              class="flex-1 bg-[#1E2532] border border-[#4A5F8B]/30 rounded-xl px-4 py-3 text-white text-sm placeholder-[#6B7C93] focus:outline-none focus:border-[#C9A962] transition-colors" />
            <button
              @click="handleSend"
              :disabled="!newMessage.trim()"
              class="px-5 py-3 bg-gradient-to-r from-[#4A5F8B] to-[#63B3ED] text-white rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-[#4A5F8B]/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              <i class="fa-solid fa-paper-plane"></i>
            </button>
          </div>
        </div>
      </template>
      <div v-else class="flex-1 flex items-center justify-center text-[#6B7C93] md:hidden">
        <div class="text-center">
          <i class="fa-solid fa-comments text-4xl mb-4 block"></i>
          <p>选择一个会话开始聊天</p>
        </div>
      </div>
    </div>

    <!-- 右侧用户信息 -->
    <div class="w-64 border-l border-[#2D3748] p-6 flex-shrink-0 hidden lg:block" v-if="activeConversation">
      <div class="text-center">
        <img :src="activeConversation.fromUser?.avatar || 'https://picsum.photos/200/200?random=1'" class="w-20 h-20 rounded-full object-cover mx-auto mb-3 border-2 border-[#4A5F8B]" />
        <h3 class="text-white font-bold text-lg">{{ activeConversation.fromUser?.username || '用户' }}</h3>
        <p class="text-[#6B7C93] text-sm mt-1">{{ activeConversation.fromUser?.bio || '摄影爱好者' }}</p>
        <router-link
          :to="`/profile/${activeConversation.fromUser?.id}`"
          class="mt-4 inline-block px-4 py-2 rounded-lg bg-[#2D3748] text-[#B8C6D8] text-sm hover:bg-[#4A5F8B] hover:text-white transition-colors">
          查看主页
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue';
import { useRoute } from 'vue-router';
import { getConversations, getConversationMessages, sendMessage } from '../services/api';
import { useAuthStore } from '../store/authStore';

const route = useRoute();
const auth = useAuthStore();
const currentUserId = ref(Number(auth.user?.id) || 0);

const conversations = ref<any[]>([]);
const activeConversation = ref<any>(null);
const messages = ref<any[]>([]);
const newMessage = ref('');
const loading = ref(false);
const messagesLoading = ref(false);
const chatContainer = ref<HTMLElement | null>(null);

const formatTime = (time: string) => {
  if (!time) return '';
  const d = new Date(time);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  if (diff < 60000) return '刚刚';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`;
  return d.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
};

const loadConversations = async () => {
  loading.value = true;
  try {
    const res: any = await getConversations();
    if (res?.code === 0 && res.data) {
      conversations.value = res.data;
    }
  } catch (e) { /* ignore */ }
  finally { loading.value = false; }
};

const openConversation = async (conv: any) => {
  activeConversation.value = conv;
  messagesLoading.value = true;
  try {
    const targetUserId = conv.fromUserId === currentUserId.value ? conv.toUserId : conv.fromUserId;
    const res: any = await getConversationMessages(targetUserId);
    if (res?.code === 0 && res.data) {
      messages.value = res.data;
    }
    await nextTick();
    scrollToBottom();
  } catch (e) { /* ignore */ }
  finally { messagesLoading.value = false; }
};

const handleSend = async () => {
  if (!newMessage.value.trim() || !activeConversation.value) return;
  const targetUserId = activeConversation.value.fromUserId === currentUserId.value
    ? activeConversation.value.toUserId : activeConversation.value.fromUserId;
  try {
    const res: any = await sendMessage({ toUserId: targetUserId, content: newMessage.value.trim() });
    if (res?.code === 0) {
      messages.value.push({
        id: res.data,
        fromUserId: currentUserId.value,
        toUserId: targetUserId,
        content: newMessage.value.trim(),
        createTime: new Date().toISOString(),
      });
      newMessage.value = '';
      await nextTick();
      scrollToBottom();
    }
  } catch (e) { /* ignore */ }
};

const scrollToBottom = () => {
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
  }
};

onMounted(async () => {
  await loadConversations();
  const userId = route.query.userId;
  if (userId) {
    const conv = conversations.value.find(c =>
      c.fromUserId === Number(userId) || c.toUserId === Number(userId)
    );
    if (conv) {
      await openConversation(conv);
    }
  }
});
</script>