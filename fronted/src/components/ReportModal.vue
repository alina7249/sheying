<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="visible" class="fixed inset-0 z-50 flex items-center justify-center">
        <div class="absolute inset-0 bg-black/60" @click="close"></div>
        <div class="relative bg-[#1a1a2e] border border-[rgba(255,255,255,0.08)] rounded-2xl p-6 w-full max-w-md mx-4">
          <h3 class="text-white text-lg font-bold mb-4">举报内容</h3>
          <div class="mb-4">
            <label class="text-sm text-[#9ca3af] mb-2 block">举报原因</label>
            <div class="space-y-2">
              <label v-for="opt in reasonOptions" :key="opt.value" 
                :class="['flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-colors',
                  selectedReason === opt.value ? 'border-[#d4a853] bg-[#d4a853]/10' : 'border-[rgba(255,255,255,0.08)] hover:border-[#d4a853]/50']">
                <input type="radio" v-model="selectedReason" :value="opt.value" class="hidden" />
                <div :class="['w-4 h-4 rounded-full border-2 flex items-center justify-center',
                  selectedReason === opt.value ? 'border-[#d4a853]' : 'border-[#6b7280]']">
                  <div v-if="selectedReason === opt.value" class="w-2 h-2 rounded-full bg-[#d4a853]"></div>
                </div>
                <span class="text-white text-sm">{{ opt.label }}</span>
              </label>
            </div>
          </div>
          <div class="mb-6">
            <label class="text-sm text-[#9ca3af] mb-2 block">补充说明（可选）</label>
            <textarea v-model="description" rows="3" placeholder="请描述具体原因..."
              class="w-full px-4 py-3 bg-[#111827] border border-[rgba(255,255,255,0.08)] rounded-xl text-white text-sm placeholder-[#6b7280] focus:outline-none focus:border-[#d4a853] transition-colors resize-none"></textarea>
          </div>
          <div class="flex gap-3">
            <button @click="close" class="flex-1 py-3 rounded-xl border border-[rgba(255,255,255,0.08)] text-[#9ca3af] hover:text-white transition-colors">取消</button>
            <button @click="handleSubmit" :disabled="!selectedReason || submitting"
              class="flex-1 py-3 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors font-medium disabled:opacity-50">
              {{ submitting ? '提交中...' : '提交举报' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { submitReport } from '../services/api';
import { toast } from 'vue-sonner';

const props = defineProps<{
  visible: boolean;
  targetId: number;
  targetType: string;
}>();

const emit = defineEmits<{
  (e: 'update:visible', val: boolean): void;
  (e: 'submitted'): void;
}>();

const reasonOptions = [
  { value: 'spam', label: '垃圾信息' },
  { value: 'inappropriate', label: '不当内容' },
  { value: 'stolen', label: '盗用作品' },
  { value: 'other', label: '其他' },
];

const selectedReason = ref('');
const description = ref('');
const submitting = ref(false);

const close = () => emit('update:visible', false);

const handleSubmit = async () => {
  if (!selectedReason.value) return;
  submitting.value = true;
  try {
    await submitReport({
      targetId: props.targetId,
      targetType: props.targetType,
      reason: selectedReason.value,
      description: description.value || undefined,
    });
    toast.success('举报已提交，感谢你的反馈');
    emit('submitted');
    close();
  } catch (e: any) {
    toast.error(e?.message || '举报失败');
  } finally {
    submitting.value = false;
  }
};
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: all 0.3s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-from > div:last-child, .modal-leave-to > div:last-child { transform: scale(0.9); }
</style>