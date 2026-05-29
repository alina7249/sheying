<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" @click="$emit('close')">
        <div class="bg-[#2D3748] rounded-xl p-6 w-full max-w-md border border-[#4A5F8B]" @click.stop>
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-xl font-bold text-white">联系卖家</h3>
            <button @click="$emit('close')" class="text-[#B8C6D8] hover:text-white">
              <i class="fa-solid fa-times"></i>
            </button>
          </div>

          <div class="mb-4 p-3 bg-[#1E2532] rounded-lg">
            <p class="text-[#B8C6D8] text-sm">正在联系: <span class="text-white font-medium">{{ seller?.name }}</span></p>
          </div>

          <div class="mb-4">
            <label class="text-sm text-[#B8C6D8] mb-1 block">发送消息</label>
            <textarea
              v-model="message"
              rows="4"
              placeholder="请输入您想咨询的内容..."
              class="w-full px-3 py-2 bg-[#1E2532] border border-[#4A5F8B] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] resize-none"
            ></textarea>
          </div>

          <div class="flex gap-3">
            <button @click="$emit('close')" class="flex-1 px-4 py-2 border border-[#4A5F8B] text-[#4A5F8B] rounded-lg hover:bg-[#4A5F8B]/10 transition-colors">
              取消
            </button>
            <button @click="handleSend" class="flex-1 px-4 py-2 bg-[#4A5F8B] text-white rounded-lg hover:bg-[#6B7C93] transition-colors">
              发送
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { toast } from 'sonner';

interface Props {
  isOpen: boolean;
  seller?: any;
}

defineProps<Props>();
const emit = defineEmits(['close']);

const message = ref('');

const handleSend = () => {
  if (!message.value.trim()) {
    toast.error('请输入消息内容');
    return;
  }
  toast.success('消息已发送');
  message.value = '';
  emit('close');
};
</script>

<style scoped>
.modal-enter-active, .modal-leave-active {
  transition: opacity 0.3s ease;
}
.modal-enter-from, .modal-leave-to {
  opacity: 0;
}
</style>