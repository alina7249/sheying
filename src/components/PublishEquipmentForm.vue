<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" @click="$emit('close')">
        <div class="bg-[#2D3748] rounded-xl p-6 w-full max-w-2xl border border-[#4A5F8B] max-h-[90vh] overflow-y-auto" @click.stop>
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-xl font-bold text-white">发布二手器材</h3>
            <button @click="$emit('close')" class="text-[#B8C6D8] hover:text-white">
              <i class="fa-solid fa-times"></i>
            </button>
          </div>

          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div>
              <label class="text-sm text-[#B8C6D8] mb-1 block">器材名称 *</label>
              <input
                v-model="formData.name"
                type="text"
                placeholder="例如: Sony A7M4"
                class="w-full px-3 py-2 bg-[#1E2532] border border-[#4A5F8B] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#4A5F8B]"
              />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="text-sm text-[#B8C6D8] mb-1 block">类别 *</label>
                <select
                  v-model="formData.type"
                  class="w-full px-3 py-2 bg-[#1E2532] border border-[#4A5F8B] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#4A5F8B]"
                >
                  <option value="相机">相机</option>
                  <option value="镜头">镜头</option>
                  <option value="配件">配件</option>
                </select>
              </div>
              <div>
                <label class="text-sm text-[#B8C6D8] mb-1 block">品牌 *</label>
                <input
                  v-model="formData.brand"
                  type="text"
                  placeholder="例如: Sony"
                  class="w-full px-3 py-2 bg-[#1E2532] border border-[#4A5F8B] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#4A5F8B]"
                />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="text-sm text-[#B8C6D8] mb-1 block">价格(元) *</label>
                <input
                  v-model="formData.price"
                  type="number"
                  placeholder="0"
                  class="w-full px-3 py-2 bg-[#1E2532] border border-[#4A5F8B] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#4A5F8B]"
                />
              </div>
              <div>
                <label class="text-sm text-[#B8C6D8] mb-1 block">成色 *</label>
                <select
                  v-model="formData.condition"
                  class="w-full px-3 py-2 bg-[#1E2532] border border-[#4A5F8B] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#4A5F8B]"
                >
                  <option value="99新">99新</option>
                  <option value="95新">95新</option>
                  <option value="9成新">9成新</option>
                  <option value="8成新">8成新</option>
                  <option value="7成新以下">7成新以下</option>
                </select>
              </div>
            </div>

            <div>
              <label class="text-sm text-[#B8C6D8] mb-1 block">详细描述 *</label>
              <textarea
                v-model="formData.description"
                rows="4"
                placeholder="请详细描述器材状况，包括购买时间、使用频率、有无维修史等..."
                class="w-full px-3 py-2 bg-[#1E2532] border border-[#4A5F8B] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] resize-none"
              ></textarea>
            </div>

            <div class="flex gap-3 pt-4">
              <button type="button" @click="$emit('close')" class="flex-1 px-4 py-2 border border-[#4A5F8B] text-[#4A5F8B] rounded-lg hover:bg-[#4A5F8B]/10 transition-colors">
                取消
              </button>
              <button type="submit" class="flex-1 px-4 py-2 bg-[#4A5F8B] text-white rounded-lg hover:bg-[#6B7C93] transition-colors">
                发布
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { toast } from 'sonner';

interface Props {
  isOpen: boolean;
}

defineProps<Props>();
const emit = defineEmits(['close', 'submit']);

const formData = reactive({
  name: '',
  type: '相机',
  brand: '',
  price: '',
  condition: '95新',
  description: ''
});

const handleSubmit = () => {
  if (!formData.name || !formData.brand || !formData.price || !formData.description) {
    toast.error('请填写必填项');
    return;
  }
  emit('submit', formData);
  toast.success('发布成功');
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