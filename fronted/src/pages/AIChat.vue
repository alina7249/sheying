<template>
  <div class="min-h-screen bg-[#0F1C2D] flex flex-col">
    <div class="bg-[#1E2532] border-b border-[#2D3748] p-4">
      <div class="container mx-auto flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4A5F8B] to-[#63B3ED] flex items-center justify-center">
          <i class="fa-solid fa-robot text-white"></i>
        </div>
        <div>
          <h1 class="text-white font-bold">光影 AI 助手</h1>
          <p class="text-[#6B7C93] text-xs">基于智谱 AI · 摄影专业问答</p>
        </div>
      </div>
    </div>

    <div class="flex-1 overflow-y-auto container mx-auto px-4 py-6 space-y-4" ref="chatContainer">
      <div v-if="messages.length === 0 && !loading" class="flex flex-col items-center justify-center h-full text-[#6B7C93] py-20">
        <i class="fa-solid fa-robot text-5xl mb-4"></i>
        <p class="text-lg mb-2">有什么摄影问题想问我？</p>
        <p class="text-sm">我可以帮你解答摄影技巧、器材推荐、后期处理等问题</p>
        <div class="flex flex-wrap gap-2 mt-6 justify-center">
          <button v-for="q in quickQuestions" :key="q" @click="sendQuick(q)"
            class="px-4 py-2 rounded-full bg-[#1E2532] border border-[#2D3748] text-[#B8C6D8] text-sm hover:border-[#4A5F8B] hover:text-white transition-colors">
            {{ q }}
          </button>
        </div>
      </div>

      <div v-for="(msg, i) in messages" :key="i" :class="['flex', msg.role === 'user' ? 'justify-end' : 'justify-start']">
        <div :class="['max-w-[80%] md:max-w-[70%] px-5 py-3 rounded-2xl',
          msg.role === 'user'
            ? 'bg-gradient-to-r from-[#4A5F8B] to-[#63B3ED] text-white rounded-br-md'
            : 'bg-[#2D3748] text-[#F5F7FA] rounded-bl-md']">
          <div v-if="msg.role === 'assistant'" v-html="renderMarkdown(msg.content)" class="text-sm leading-relaxed"></div>
          <p v-else class="text-sm leading-relaxed">{{ msg.content }}</p>
        </div>
      </div>

      <div v-if="loading" class="flex justify-start">
        <div class="bg-[#2D3748] px-5 py-3 rounded-2xl rounded-bl-md">
          <div class="flex gap-1.5">
            <span class="w-2 h-2 bg-[#6B7C93] rounded-full animate-bounce" style="animation-delay: 0s"></span>
            <span class="w-2 h-2 bg-[#6B7C93] rounded-full animate-bounce" style="animation-delay: 0.2s"></span>
            <span class="w-2 h-2 bg-[#6B7C93] rounded-full animate-bounce" style="animation-delay: 0.4s"></span>
          </div>
        </div>
      </div>
    </div>

    <div class="border-t border-[#2D3748] p-4 bg-[#1E2532]">
      <div class="container mx-auto flex items-center gap-3">
        <input
          v-model="input"
          @keydown.enter="send"
          placeholder="输入你的摄影问题..."
          class="flex-1 bg-[#0F1C2D] border border-[#2D3748] rounded-xl px-5 py-3 text-white text-sm placeholder-[#6B7C93] focus:outline-none focus:border-[#C9A962] transition-colors" />
        <button
          @click="send"
          :disabled="!input.trim() || loading"
          class="px-5 py-3 bg-gradient-to-r from-[#4A5F8B] to-[#63B3ED] text-white rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-[#4A5F8B]/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
          <i class="fa-solid fa-paper-plane"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted } from 'vue';
import { chatWithAI, getAIHistory } from '../services/api';
import { toast } from 'vue-sonner';

const messages = ref<{ role: string; content: string }[]>([]);
const input = ref('');
const loading = ref(false);
const sessionId = ref<string | null>(localStorage.getItem('ai_session_id') || null);
const chatContainer = ref<HTMLElement | null>(null);

const quickQuestions = [
  '如何拍好夜景人像？',
  '推荐一款入门级微单',
  '风光摄影构图技巧',
  '后期调色基础教程',
];

const renderMarkdown = (text: string) => {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>')
    .replace(/- (.*?)(<br>|$)/g, '• $1$2');
};

const send = async () => {
  if (!input.value.trim() || loading.value) return;
  const msg = input.value.trim();
  input.value = '';
  messages.value.push({ role: 'user', content: msg });
  loading.value = true;
  await nextTick();
  scrollToBottom();

  try {
    const res: any = await chatWithAI(msg, sessionId.value || undefined);
    if (res?.code === 0 && res.data) {
      if (res.data.sessionId) {
        sessionId.value = res.data.sessionId;
        localStorage.setItem('ai_session_id', res.data.sessionId);
      }
      messages.value.push({ role: 'assistant', content: res.data.content || '抱歉，我没有理解你的问题。' });
    } else {
      messages.value.push({ role: 'assistant', content: '抱歉，AI 服务暂时不可用。' });
    }
  } catch (e: any) {
    messages.value.push({ role: 'assistant', content: '抱歉，AI 服务暂时不可用：' + (e?.message || '网络错误') });
  }
  finally {
    loading.value = false;
    await nextTick();
    scrollToBottom();
  }
};

const sendQuick = (q: string) => {
  input.value = q;
  send();
};

const scrollToBottom = () => {
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
  }
};

const loadHistory = async () => {
  if (!sessionId.value) return;
  try {
    const res: any = await getAIHistory(sessionId.value);
    if (res?.code === 0 && res.data) {
      messages.value = res.data.map((m: any) => ({ role: m.role, content: m.content }));
      await nextTick();
      scrollToBottom();
    }
  } catch (e) { /* ignore */ }
};

onMounted(() => {
  loadHistory();
});
</script>