<template>
  <div :class="['min-h-screen transition-colors duration-300', theme === 'dark' ? 'bg-[#1E2532]' : 'bg-gray-50']">
    <div class="container mx-auto px-4 py-8">
      <Transition appear name="fade">
        <div class="flex gap-6">
          <div class="hidden md:block w-80 lg:w-96 flex-shrink-0">
            <HistoryPanel />
          </div>
          <div class="flex-1">
            <ChatInterface />
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useAuthStore } from '../store/authStore'
import { useChatStore } from '../store/chatStore'
import { storeToRefs } from 'pinia'
import HistoryPanel from '../components/chat/HistoryPanel.vue'
import ChatInterface from '../components/chat/ChatInterface.vue'

const authStore = useAuthStore()
const chatStore = useChatStore()
const { theme } = storeToRefs(authStore)
const { chatHistories } = storeToRefs(chatStore)

onMounted(() => {
  if (chatHistories.value.length === 0) {
    chatStore.createNewChat()
  }

  if (chatHistories.value.length === 1 && chatHistories.value[0].messages.length === 0) {
    const welcomeChatId = chatHistories.value[0].id
    chatStore.addMessage(welcomeChatId, {
      content: '嗨！我是您的摄影助手，有什么摄影相关的问题都可以问我。我可以帮您选择相机、提供拍摄技巧、解答后期问题等。您想了解哪方面的内容呢？',
      sender: 'ai'
    })
  }
})
</script>

<style scoped>
.fade-enter-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from {
  opacity: 0;
}
</style>