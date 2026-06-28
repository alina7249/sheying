<template>
  <div class="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
    <div class="bg-[#111827] border border-[rgba(255,255,255,0.08)] rounded-2xl p-8 w-full max-w-md mx-4">
      <h1 class="text-2xl font-bold mb-6 text-center">
        <i class="fa-solid fa-lock mr-2 text-[#d4a853]"></i>修改密码
      </h1>
      <form @submit.prevent="handleSubmit">
        <div class="mb-4">
          <label class="text-sm text-[#9ca3af] mb-2 block">旧密码</label>
          <input v-model="oldPassword" type="password" placeholder="请输入旧密码"
            class="w-full px-4 py-3 bg-[#0a0a0a] border border-[rgba(255,255,255,0.08)] rounded-xl text-white text-sm placeholder-[#6b7280] focus:outline-none focus:border-[#d4a853] transition-colors" />
        </div>
        <div class="mb-4">
          <label class="text-sm text-[#9ca3af] mb-2 block">新密码</label>
          <input v-model="newPassword" type="password" placeholder="请输入新密码（至少8位）"
            class="w-full px-4 py-3 bg-[#0a0a0a] border border-[rgba(255,255,255,0.08)] rounded-xl text-white text-sm placeholder-[#6b7280] focus:outline-none focus:border-[#d4a853] transition-colors" />
        </div>
        <div class="mb-6">
          <label class="text-sm text-[#9ca3af] mb-2 block">确认新密码</label>
          <input v-model="confirmPassword" type="password" placeholder="请再次输入新密码"
            class="w-full px-4 py-3 bg-[#0a0a0a] border border-[rgba(255,255,255,0.08)] rounded-xl text-white text-sm placeholder-[#6b7280] focus:outline-none focus:border-[#d4a853] transition-colors" />
        </div>
        <button type="submit" :disabled="submitting || !canSubmit"
          class="w-full py-3 rounded-xl bg-[#d4a853] text-[#0a0a0a] font-medium hover:shadow-lg hover:shadow-[#d4a853]/20 transition-all disabled:opacity-50">
          {{ submitting ? '提交中...' : '确认修改' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { changePassword } from '../services/api';
import { toast } from 'vue-sonner';
import { useAuthStore } from '../store/authStore';

const router = useRouter();
const authStore = useAuthStore();

const oldPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const submitting = ref(false);

const canSubmit = computed(() => {
  return oldPassword.value && newPassword.value.length >= 8 && confirmPassword.value;
});

const handleSubmit = async () => {
  if (newPassword.value !== confirmPassword.value) {
    toast.error('两次输入的密码不一致');
    return;
  }
  if (newPassword.value.length < 8) {
    toast.error('新密码至少8位');
    return;
  }
  submitting.value = true;
  try {
    await changePassword(oldPassword.value, newPassword.value);
    toast.success('密码修改成功，请重新登录');
    authStore.logout();
    router.push('/login');
  } catch (e: any) {
    toast.error(e?.message || '修改失败');
  } finally {
    submitting.value = false;
  }
};
</script>