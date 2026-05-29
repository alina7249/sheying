<template>
  <div
    class="flex flex-col h-[calc(100vh-160px)] rounded-xl shadow-xl overflow-hidden border transition-all duration-500"
    :class="[
      theme === 'dark' ? 'bg-[#2D3748] border-[#4A5F8B]' : 'bg-white border-gray-200',
      { 'opacity-0 translate-y-5': isEntering, 'opacity-100 translate-y-0': !isEntering }
    ]"
  >
    <!-- 聊天头部 -->
    <div
      class="p-4 border-b flex justify-between items-center"
      :class="theme === 'dark' ? 'border-[#4A5F8B] bg-[#1E2532]' : 'border-gray-200 bg-gray-50'"
    >
      <div class="flex items-center space-x-3">
        <!-- AI角色头像 -->
        <div v-if="selectedRole" class="w-10 h-10 rounded-full overflow-hidden border-2 border-[#4A5F8B]">
          <img :src="selectedRole.avatar" :alt="selectedRole.name" class="w-full h-full object-cover" />
        </div>
        <div>
          <h2 :class="['text-lg font-semibold', theme === 'dark' ? 'text-white' : 'text-gray-800']">
            {{ selectedRole?.name || '智能摄影助手' }}
          </h2>
          <div class="flex items-center">
            <span :class="['inline-flex items-center text-xs', theme === 'dark' ? 'text-[#B8C6D8]' : 'text-gray-500']">
              <template v-if="isTyping">
                <div class="flex items-center">
                  <span class="mr-1">正在输入...</span>
                  <div class="flex space-x-0.5">
                    <div
                      class="w-1.5 h-1.5 rounded-full animate-bounce"
                      :class="theme === 'dark' ? 'bg-[#4A5F8B]' : 'bg-gray-400'"
                      style="animation-delay: -0.3s"
                    ></div>
                    <div
                      class="w-1.5 h-1.5 rounded-full animate-bounce"
                      :class="theme === 'dark' ? 'bg-[#4A5F8B]' : 'bg-gray-400'"
                      style="animation-delay: -0.15s"
                    ></div>
                    <div
                      class="w-1.5 h-1.5 rounded-full animate-bounce"
                      :class="theme === 'dark' ? 'bg-[#4A5F8B]' : 'bg-gray-400'"
                    ></div>
                  </div>
                </div>
              </template>
              <template v-else>
                为您解答摄影相关问题，提供专业建议
              </template>
            </span>
          </div>
        </div>
      </div>
      <div class="flex space-x-2">
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
        <button
          @click="clearCurrentChat"
          :class="[
            'p-2 rounded-full transition-colors',
            theme === 'dark' ? 'hover:bg-[#4A5F8B] text-[#B8C6D8]' : 'hover:bg-gray-200 text-gray-600'
          ]"
          title="清空对话"
        >
          <i class="fa-solid fa-trash-can"></i>
        </button>
        <button
          :class="[
            'p-2 rounded-full transition-colors',
            theme === 'dark' ? 'hover:bg-[#4A5F8B] text-[#B8C6D8]' : 'hover:bg-gray-200 text-gray-600'
          ]"
          title="更多选项"
        >
          <i class="fa-solid fa-ellipsis-vertical"></i>
        </button>
      </div>
    </div>

    <!-- 消息列表区域 -->
    <div
      ref="messageListRef"
      class="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-rounded-full scrollbar-track-transparent scrollbar-thumb-opacity-50 hover:scrollbar-thumb-opacity-100"
      :style="{ scrollBehavior: 'smooth', minHeight: 0 }"
    >
      <MessageList />
    </div>

    <!-- 输入区域 -->
    <div :class="['p-4 border-t', theme === 'dark' ? 'border-[#4A5F8B]' : 'border-gray-200']">
      <InputArea />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useAuthStore } from '../../store/authStore';
import { useChatStore } from '../../store/chatStore';
import MessageList from './MessageList.vue';
import InputArea from './InputArea.vue';

const authStore = useAuthStore();
const chatStore = useChatStore();

const messageListRef = ref<HTMLElement | null>(null);
const isEntering = ref(true);

const theme = computed(() => authStore.theme);
const currentChatId = computed(() => chatStore.currentChatId);
const isTyping = computed(() => chatStore.isTyping);
const selectedRole = computed(() => chatStore.selectedRole);

const createNewChat = () => {
  chatStore.createNewChat();
};

const clearCurrentChat = () => {
  chatStore.clearCurrentChat();
};

onMounted(() => {
  if (!currentChatId.value) {
    createNewChat();
  }
  
  setTimeout(() => {
    isEntering.value = false;
  }, 10);
});

watch(currentChatId, () => {
  setTimeout(() => {
    if (messageListRef.value) {
      messageListRef.value.scrollTop = messageListRef.value.scrollHeight;
    }
  }, 100);
});
</script>