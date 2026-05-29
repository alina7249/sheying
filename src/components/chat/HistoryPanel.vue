<template>
  <div
    class="flex flex-col h-[calc(100vh-160px)] rounded-xl shadow-xl overflow-hidden border"
    :class="theme === 'dark' ? 'bg-[#2D3748] border-[#4A5F8B]' : 'bg-white border-gray-200'"
  >
    <div
      class="p-4 border-b flex justify-between items-center"
      :class="theme === 'dark' ? 'border-[#4A5F8B] bg-[#1E2532]' : 'border-gray-200 bg-gray-50'"
    >
      <h3 :class="['font-semibold', theme === 'dark' ? 'text-white' : 'text-gray-800']">对话历史</h3>
      <button
        @click="createNewChat"
        :class="[
          'p-2 rounded-full transition-colors',
          theme === 'dark' ? 'hover:bg-[#4A5F8B] text-[#B8C6D8]' : 'hover:bg-gray-200 text-gray-600'
        ]"
        title="新建对话"
      >
        <i class="fa-solid fa-plus"></i>
      </button>
    </div>

    <div :class="['p-3 border-b', theme === 'dark' ? 'border-[#4A5F8B]' : 'border-gray-200']">
      <div class="relative">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="搜索对话历史..."
          :class="[
            'w-full pl-9 pr-4 py-2 rounded-lg text-sm',
            theme === 'dark'
              ? 'bg-[#1E2532] text-white border-none focus:outline-none focus:ring-2 focus:ring-[#4A5F8B]'
              : 'bg-gray-100 text-gray-800 border-none focus:outline-none focus:ring-2 focus:ring-gray-300'
          ]"
        />
        <i :class="['fa-solid fa-search absolute left-3 top-1/2 transform -translate-y-1/2', theme === 'dark' ? 'text-[#6B7C93]' : 'text-gray-500']"></i>
      </div>
    </div>

    <div class="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-rounded-full scrollbar-track-transparent scrollbar-thumb-opacity-50 hover:scrollbar-thumb-opacity-100">
      <template v-if="filteredChats.length === 0">
        <div class="flex flex-col items-center justify-center h-full p-6 text-center">
          <div
            class="w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-all duration-500"
            :class="theme === 'dark' ? 'bg-[#4A5F8B]' : 'bg-gray-100'"
          >
            <i :class="['fa-solid', searchQuery.trim() === '' ? 'fa-history' : 'fa-search', 'text-xl', theme === 'dark' ? 'text-white' : 'text-gray-600']"></i>
          </div>
          <p :class="theme === 'dark' ? 'text-[#B8C6D8]' : 'text-gray-600'">
            {{ searchQuery.trim() === '' ? '暂无对话历史，开始您的第一次对话吧！' : `没有找到包含"${searchQuery}"的对话` }}
          </p>
          <button
            v-if="searchQuery.trim() !== ''"
            @click="searchQuery = ''"
            :class="[
              'mt-4 px-4 py-2 rounded-lg text-sm transition-colors',
              theme === 'dark'
                ? 'bg-[#4A5F8B]/20 text-[#B8C6D8] hover:bg-[#4A5F8B]/40'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
          >
            清除搜索
          </button>
        </div>
      </template>

      <template v-else>
        <div class="p-2">
          <template v-for="(chat, index) in filteredChats" :key="chat.id">
            <div
              v-if="isNewDateGroup(index)"
              class="mt-2 pt-2 border-t border-dashed text-center"
            >
              <span
                :class="[
                  'text-xs font-medium px-2 py-0.5 rounded-full',
                  theme === 'dark' ? 'bg-[#4A5F8B] text-[#B8C6D8]' : 'bg-gray-100 text-gray-600'
                ]"
              >
                {{ formatDate(chat.lastActive) }}
              </span>
            </div>

            <div
              class="p-3 rounded-lg mb-1 cursor-pointer transition-all duration-300 group"
              :class="[
                currentChatId === chat.id
                  ? theme === 'dark'
                    ? 'bg-[#4A5F8B]/30 border-l-2 border-[#4A5F8B] translate-x-1'
                    : 'bg-blue-50 border-l-2 border-blue-500 translate-x-1'
                  : theme === 'dark'
                    ? 'hover:bg-[#4A5F8B]/10 hover:translate-x-1'
                    : 'hover:bg-gray-50 hover:translate-x-1'
              ]"
              @click="setCurrentChat(chat.id)"
            >
              <div v-if="editingChatId === chat.id" class="flex items-center w-full">
                <input
                  type="text"
                  v-model="editingTitle"
                  @keydown.enter="handleSaveTitle(chat.id)"
                  @keydown.escape="handleCancelEdit"
                  :class="[
                    'flex-1 px-2 py-1 rounded text-sm',
                    theme === 'dark'
                      ? 'bg-[#4A5F8B] text-white border-none focus:outline-none focus:ring-2 focus:ring-[#6B7C93]'
                      : 'bg-gray-200 text-gray-800 border-none focus:outline-none focus:ring-2 focus:ring-gray-300'
                  ]"
                  autofocus
                />
                <div class="flex space-x-1">
                  <button
                    @click.stop="handleSaveTitle(chat.id)"
                    :class="[
                      'p-1 rounded text-xs',
                      theme === 'dark' ? 'text-white hover:bg-[#6B7C93]' : 'text-gray-700 hover:bg-gray-300'
                    ]"
                  >
                    <i class="fa-solid fa-check"></i>
                  </button>
                  <button
                    @click.stop="handleCancelEdit"
                    :class="[
                      'p-1 rounded text-xs',
                      theme === 'dark' ? 'text-white hover:bg-[#6B7C93]' : 'text-gray-700 hover:bg-gray-300'
                    ]"
                  >
                    <i class="fa-solid fa-times"></i>
                  </button>
                </div>
              </div>

              <div v-else class="flex justify-between items-center w-full">
                <span :class="[
                  'font-medium truncate',
                  currentChatId === chat.id
                    ? theme === 'dark' ? 'text-white' : 'text-gray-800'
                    : theme === 'dark' ? 'text-[#B8C6D8]' : 'text-gray-600'
                ]">
                  {{ chat.title }}
                </span>
                <div class="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    @click.stop="handleEditTitle(chat.id, chat.title)"
                    :class="[
                      'p-1 rounded text-xs',
                      theme === 'dark' ? 'text-[#B8C6D8] hover:text-white' : 'text-gray-500 hover:text-gray-800'
                    ]"
                    title="编辑标题"
                  >
                    <i class="fa-solid fa-pen"></i>
                  </button>
                  <button
                    @click.stop="handleDeleteChat(chat.id)"
                    :class="[
                      'p-1 rounded text-xs',
                      theme === 'dark' ? 'text-[#B8C6D8] hover:text-white' : 'text-gray-500 hover:text-gray-800'
                    ]"
                    title="删除对话"
                  >
                    <i class="fa-solid fa-trash-can"></i>
                  </button>
                </div>
              </div>

              <div v-if="chat.messages.length > 0" class="mt-1 flex items-center justify-between">
                <p :class="[
                  'text-xs truncate flex-1',
                  theme === 'dark' ? 'text-[#6B7C93]' : 'text-gray-500'
                ]">
                  <span class="mr-1">
                    <i :class="['fa-solid', chat.messages[chat.messages.length - 1].sender === 'user' ? 'fa-user' : 'fa-robot', 'text-xs']"></i>
                  </span>
                  {{ chat.messages[chat.messages.length - 1].content.substring(0, 50) }}
                  {{ chat.messages[chat.messages.length - 1].content.length > 50 ? '...' : '' }}
                </p>
                <span :class="['text-xs', theme === 'dark' ? 'text-[#6B7C93]' : 'text-gray-500']">
                  {{ formatTime(chat.lastActive) }}
                </span>
              </div>

              <div v-if="chat.messages.some(msg => msg.isFavorite)" class="absolute right-8 top-3">
                <i class="fa-solid fa-star text-yellow-400 text-xs"></i>
              </div>
            </div>
          </template>
        </div>
      </template>
    </div>

    <div
      class="p-4 border-t"
      :class="theme === 'dark' ? 'border-[#4A5F8B] bg-[#1E2532]' : 'border-gray-200 bg-gray-50'"
    >
      <div class="grid grid-cols-2 gap-3">
        <button
          @click="handleClearAll"
          :class="[
            'w-full text-sm py-2 rounded-lg transition-colors',
            theme === 'dark' ? 'text-[#B8C6D8] hover:bg-[#4A5F8B]/20' : 'text-gray-600 hover:bg-gray-200'
          ]"
        >
          <i class="fa-solid fa-trash-can mr-2"></i> 清空所有
        </button>

        <button
          @click="handleSettings"
          :class="[
            'w-full text-sm py-2 rounded-lg transition-colors',
            theme === 'dark' ? 'text-[#B8C6D8] hover:bg-[#4A5F8B]/20' : 'text-gray-600 hover:bg-gray-200'
          ]"
        >
          <i class="fa-solid fa-cog mr-2"></i> 设置
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useAuthStore } from '../../store/authStore';
import { useChatStore } from '../../store/chatStore';
import { toast } from 'vue-sonner';

const authStore = useAuthStore();
const chatStore = useChatStore();

const theme = computed(() => authStore.theme);
const chatHistories = computed(() => chatStore.chatHistories);
const currentChatId = computed(() => chatStore.currentChatId);

const editingChatId = ref<string | null>(null);
const editingTitle = ref('');
const searchQuery = ref('');

const filteredChats = ref(chatHistories.value);

watch([searchQuery, chatHistories], () => {
  if (searchQuery.value.trim() === '') {
    filteredChats.value = chatHistories.value;
  } else {
    const query = searchQuery.value.toLowerCase();
    filteredChats.value = chatHistories.value.filter(chat =>
      chat.title.toLowerCase().includes(query) ||
      chat.messages.some(msg => msg.content.toLowerCase().includes(query))
    );
  }
}, { immediate: true });

const createNewChat = () => {
  chatStore.createNewChat();
};

const setCurrentChat = (chatId: string) => {
  chatStore.setCurrentChat(chatId);
};

const handleEditTitle = (chatId: string, title: string) => {
  editingChatId.value = chatId;
  editingTitle.value = title;
};

const handleSaveTitle = (chatId: string) => {
  if (editingTitle.value.trim()) {
    chatStore.updateChatTitle(chatId, editingTitle.value.trim());
    toast.success('标题已更新');
  }
  editingChatId.value = null;
  editingTitle.value = '';
};

const handleCancelEdit = () => {
  editingChatId.value = null;
  editingTitle.value = '';
};

const handleDeleteChat = (chatId: string) => {
  if (confirm('确定要删除这个对话吗？')) {
    chatStore.deleteChat(chatId);
    toast.success('对话已删除');
  }
};

const handleClearAll = () => {
  if (confirm('确定要清空所有对话历史吗？此操作不可恢复。')) {
    chatHistories.value.forEach(chat => chatStore.deleteChat(chat.id));
    chatStore.createNewChat();
    toast.success('所有对话已清空');
  }
};

const handleSettings = () => {
  toast.info('设置功能已触发');
};

const formatTime = (date: Date) => {
  return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const formatDate = (date: Date) => {
  const today = new Date();
  const messageDate = new Date(date);

  if (messageDate.toDateString() === today.toDateString()) {
    return '今天';
  }

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (messageDate.toDateString() === yesterday.toDateString()) {
    return '昨天';
  }

  return messageDate.toLocaleDateString();
};

const isNewDateGroup = (index: number) => {
  if (index === 0) return true;
  return formatDate(filteredChats.value[index].lastActive) !== formatDate(filteredChats.value[index - 1].lastActive);
};

onMounted(() => {
  if (chatHistories.value.length === 0) {
    chatStore.createNewChat();
  }
});
</script>