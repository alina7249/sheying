<template>
  <div class="p-4 md:p-6 space-y-6">
    <!-- 空状态 -->
    <template v-if="messages.length === 0">
      <div class="h-full flex flex-col items-center justify-center p-6 text-center">
        <div
          class="w-20 h-20 rounded-full flex items-center justify-center mb-4 transition-all duration-500"
          :class="theme === 'dark' ? 'bg-[#4A5F8B]' : 'bg-gray-100'"
        >
          <i class="fa-solid fa-robot text-3xl" :class="theme === 'dark' ? 'text-white' : 'text-gray-600'"></i>
        </div>
        <h3 class="text-xl font-semibold mb-2" :class="theme === 'dark' ? 'text-white' : 'text-gray-800'">
          欢迎使用AI助手
        </h3>
        <p class="max-w-md" :class="theme === 'dark' ? 'text-[#B8C6D8]' : 'text-gray-600'">
          我是您的智能摄影助手，有什么摄影相关的问题都可以问我。我可以提供器材建议、技术指导、后期处理技巧等。
        </p>

        <!-- 快速问题建议 -->
        <div class="mt-8 flex flex-wrap justify-center gap-2">
          <button
            v-for="(question, index) in quickQuestions"
            :key="index"
            class="px-4 py-2 text-sm rounded-full transition-colors"
            :class="theme === 'dark' ? 'bg-[#4A5F8B]/20 text-[#B8C6D8] hover:bg-[#4A5F8B]/40' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
            @click="handleQuickQuestion(question)"
          >
            {{ question }}
          </button>
        </div>
      </div>
    </template>

    <!-- 消息列表 -->
    <template v-else>
      <div
        v-for="(message, index) in messages"
        :key="message.id"
        class="flex transition-all duration-300"
        :class="[
          message.sender === 'user' ? 'justify-end' : 'justify-start',
          { 'opacity-0 translate-y-5': isEntering, 'opacity-100 translate-y-0': !isEntering }
        ]"
        :style="{ transitionDelay: `${index * 100}ms` }"
      >
        <!-- AI头像 -->
        <div v-if="message.sender !== 'user'" class="w-8 h-8 rounded-full overflow-hidden mr-2 flex-shrink-0 mt-1">
          <img :src="selectedRole?.avatar" alt="AI Avatar" class="w-full h-full object-cover" />
        </div>

        <!-- 消息内容 -->
        <div
          class="max-w-[80%] rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow duration-300"
          :class="[
            message.sender === 'user'
              ? theme === 'dark' ? 'bg-[#4A5F8B] text-white' : 'bg-blue-500 text-white'
              : theme === 'dark' ? 'bg-[#1E2532] text-[#F5F7FA] border border-[#4A5F8B]' : 'bg-gray-50 text-gray-800 border border-gray-200'
          ]"
        >
          <!-- 消息文本 -->
          <div v-if="message.sender === 'ai'" v-html="parseMarkdown(message.content)" class="prose dark:prose-invert max-w-none"></div>
          <p v-else>{{ message.content }}</p>

          <!-- 消息时间戳和操作 -->
          <div class="mt-2 flex justify-between items-center">
            <span class="text-xs opacity-70" :class="theme === 'dark' ? 'text-[#B8C6D8]' : 'text-gray-500'">
              {{ formatTime(message.timestamp) }}
            </span>

            <!-- 操作按钮 -->
            <div class="flex space-x-1">
              <button
                @click="toggleMessageFavorite(currentChatId!, message.id)"
                class="p-1 rounded-full text-xs transition-colors"
                :class="[
                  theme === 'dark'
                    ? message.isFavorite ? 'text-yellow-400' : 'hover:bg-[#6B7C93] text-[#B8C6D8]'
                    : message.isFavorite ? 'text-yellow-500' : 'hover:bg-gray-300 text-gray-600'
                ]"
                :title="message.isFavorite ? '取消收藏' : '收藏'"
              >
                <i class="fa-solid fa-star"></i>
              </button>

              <button
                @click="handleCopyMessage(message)"
                class="p-1 rounded-full text-xs transition-colors"
                :class="theme === 'dark' ? 'hover:bg-[#6B7C93] text-[#B8C6D8]' : 'hover:bg-gray-300 text-gray-600'"
                title="复制"
              >
                <i class="fa-solid fa-copy"></i>
              </button>

              <button
                @click="handleQuoteMessage(message)"
                class="p-1 rounded-full text-xs transition-colors"
                :class="theme === 'dark' ? 'hover:bg-[#6B7C93] text-[#B8C6D8]' : 'hover:bg-gray-300 text-gray-600'"
                title="引用"
              >
                <i class="fa-solid fa-quote-right"></i>
              </button>

              <button
                @click="handleShareMessage(message)"
                class="p-1 rounded-full text-xs transition-colors"
                :class="theme === 'dark' ? 'hover:bg-[#6B7C93] text-[#B8C6D8]' : 'hover:bg-gray-300 text-gray-600'"
                title="分享"
              >
                <i class="fa-solid fa-share-nodes"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- AI正在输入指示器 -->
      <div v-if="isTyping" class="flex justify-start">
        <div class="w-8 h-8 rounded-full overflow-hidden mr-2 flex-shrink-0 mt-1">
          <img :src="selectedRole?.avatar" alt="AI Avatar" class="w-full h-full object-cover" />
        </div>
        <div
          class="p-4 rounded-2xl"
          :class="theme === 'dark' ? 'bg-[#1E2532] text-[#F5F7FA] border border-[#4A5F8B]' : 'bg-gray-50 text-gray-800 border border-gray-200'"
        >
          <div class="flex space-x-1">
            <div
              class="w-2 h-2 rounded-full animate-bounce"
              :class="theme === 'dark' ? 'bg-[#4A5F8B]' : 'bg-gray-400'"
              style="animation-delay: -0.3s"
            ></div>
            <div
              class="w-2 h-2 rounded-full animate-bounce"
              :class="theme === 'dark' ? 'bg-[#4A5F8B]' : 'bg-gray-400'"
              style="animation-delay: -0.15s"
            ></div>
            <div
              class="w-2 h-2 rounded-full animate-bounce"
              :class="theme === 'dark' ? 'bg-[#4A5F8B]' : 'bg-gray-400'"
            ></div>
          </div>
        </div>
      </div>
    </template>

    <!-- 滚动锚点 -->
    <div ref="messagesEndRef" class="scroll-mt-16" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { toast } from 'vue-sonner';
import { useAuthStore } from '../../store/authStore';
import { useChatStore, Message } from '../../store/chatStore';

const authStore = useAuthStore();
const chatStore = useChatStore();

const messagesEndRef = ref<HTMLElement | null>(null);
const isEntering = ref(true);

const theme = computed(() => authStore.theme);
const currentChatId = computed(() => chatStore.currentChatId);
const chatHistories = computed(() => chatStore.chatHistories);
const isTyping = computed(() => chatStore.isTyping);
const selectedRole = computed(() => chatStore.selectedRole);

const messages = computed(() => {
  if (!currentChatId.value) return [];
  const currentChat = chatHistories.value.find(chat => chat.id === currentChatId.value);
  return currentChat?.messages || [];
});

const quickQuestions = [
  "推荐适合初学者的相机",
  "如何拍摄星空照片",
  "摄影构图技巧",
  "后期修图推荐"
];

const sanitizeText = (text: string): string => {
  const element = document.createElement('div');
  element.textContent = text;
  return element.innerHTML;
};

const parseMarkdown = (text: string): string => {
  let parsedText = sanitizeText(text);

  parsedText = parsedText.replace(/^### (.*$)/gm, '<h3 class="font-bold text-lg my-3">$1</h3>');
  parsedText = parsedText.replace(/^## (.*$)/gm, '<h2 class="font-bold text-xl my-4">$1</h2>');
  parsedText = parsedText.replace(/^# (.*$)/gm, '<h1 class="font-bold text-2xl my-5">$1</h1>');

  parsedText = parsedText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  parsedText = parsedText.replace(/__(.*?)__/g, '<strong>$1</strong>');

  parsedText = parsedText.replace(/\*(.*?)\*/g, '<em>$1</em>');
  parsedText = parsedText.replace(/_(.*?)_/g, '<em>$1</em>');

  parsedText = parsedText.replace(/`(.*?)`/g, '<code class="bg-gray-100 dark:bg-[#4A5F8B] px-1 py-0.5 rounded text-sm">$1</code>');

  parsedText = parsedText.replace(/```([^\n]*)\n([\s\S]*?)```/g, '<pre class="bg-gray-100 dark:bg-[#4A5F8B] p-4 rounded-lg overflow-x-auto text-sm my-3"><code>$2</code></pre>');

  parsedText = parsedText.replace(/^\d+\. (.*$)/gm, '<li>$1</li>');
  parsedText = parsedText.replace(/<li>(.*?)<\/li>/g, '<ul class="list-decimal list-inside ml-2">$&</ul>');
  parsedText = parsedText.replace(/<\/ul>\s*<ul class="list-decimal list-inside ml-2">/g, '');

  parsedText = parsedText.replace(/^\- (.*$)/gm, '<li>$1</li>');
  parsedText = parsedText.replace(/<li>(.*?)<\/li>/g, '<ul class="list-disc list-inside ml-2">$&</ul>');
  parsedText = parsedText.replace(/<\/ul>\s*<ul class="list-disc list-inside ml-2">/g, '');

  parsedText = parsedText.replace(/^> (.*$)/gm, '<blockquote class="border-l-4 border-blue-500 pl-3 italic my-3">$1</blockquote>');

  parsedText = parsedText.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-500 underline hover:text-blue-600">$1</a>');

  parsedText = parsedText.replace(/\n/g, '<br>');

  return parsedText;
};

const formatTime = (timestamp: Date) => {
  return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const handleCopyMessage = (message: Message) => {
  navigator.clipboard.writeText(message.content)
    .then(() => {
      toast.success('消息已复制到剪贴板');
    })
    .catch(err => {
      toast.error('复制失败，请重试');
      console.error('复制失败:', err);
    });
};

const handleQuoteMessage = (message: Message) => {
  toast.info('引用功能已触发');
};

const handleShareMessage = async (message: Message) => {
  try {
    await navigator.clipboard.writeText(message.content);
    toast.success('消息内容已复制到剪贴板');
  } catch (err) {
    toast.error('复制失败，请手动复制');
  }
};

const handleQuickQuestion = (question: string) => {
  toast.info(`已选择问题: ${question}`);
};

const toggleMessageFavorite = (chatId: string, messageId: string) => {
  chatStore.toggleMessageFavorite(chatId, messageId);
};

watch([messages, isTyping], () => {
  setTimeout(() => {
    if (messagesEndRef.value) {
      messagesEndRef.value.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }
  }, 100);
});

onMounted(() => {
  setTimeout(() => {
    isEntering.value = false;
  }, 10);
});
</script>