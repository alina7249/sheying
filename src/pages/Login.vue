<template>
  <div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#0F1C2D]">
    <div class="max-w-md w-full space-y-8 bg-[#1E2A3A] p-8 rounded-xl shadow-xl border border-[#4A5F8B]">
      <div class="text-center relative">
        <div class="absolute inset-0 bg-[url('https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=galaxy%20background%20stars%20purple%20blue&sign=9a9229c82aef2e4f5ac40648383863bf')] bg-cover opacity-10 rounded-full w-20 h-20 mx-auto -mt-12"></div>
        <div class="relative inline-flex items-center justify-center mb-4 text-3xl text-[#B8C6D8]">
          <i class="fa-solid fa-camera"></i>
        </div>
        <h1 class="text-2xl font-bold text-[#FFFFFF]">登录 影研社</h1>
        <p class="mt-2 text-sm text-[#E2E8F0]">
          专业摄影创作与交流平台，连接全球摄影人
        </p>
      </div>

      <LoginForm />

      <div class="mt-6 relative">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-[#4A5F8B]"></div>
        </div>
        <div class="relative flex justify-center text-sm">
          <span class="px-2 bg-[#1E2A3A] text-[#718096]">
            或通过以下方式登录
          </span>
        </div>
      </div>

      <div class="mt-6 grid grid-cols-3 gap-3">
        <button class="inline-flex justify-center items-center px-4 py-2 border border-[#4A5F8B] rounded-lg bg-[#1E2A3A] text-[#E2E8F0] hover:bg-[#4A5F8B] transition-colors">
          <i class="fa-brands fa-weixin text-green-500"></i>
        </button>

        <button class="inline-flex justify-center items-center px-4 py-2 border border-[#4A5F8B] rounded-lg bg-[#1E2A3A] text-[#E2E8F0] hover:bg-[#4A5F8B] transition-colors">
          <i class="fa-brands fa-weibo text-red-500"></i>
        </button>

        <button class="inline-flex justify-center items-center px-4 py-2 border border-[#4A5F8B] rounded-lg bg-[#1E2A3A] text-[#E2E8F0] hover:bg-[#4A5F8B] transition-colors">
          <i class="fa-brands fa-qq text-blue-400"></i>
        </button>
      </div>

      <div class="text-center mt-6">
        <p class="text-sm text-[#718096]">
          还没有账号？{' '}
          <router-link
            to="/register"
            class="font-medium text-[#63B3ED] hover:text-[#63B3ED] transition-colors"
          >
            立即注册
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import LoginForm from '../components/common/LoginForm.vue';

const router = useRouter();

const isLoggedIn = ref(false);

const checkAuthStatus = () => {
  return localStorage.getItem('user') !== null;
};

onMounted(() => {
  isLoggedIn.value = checkAuthStatus();
  
  const urlParams = new URLSearchParams(window.location.search);
  const redirectUrl = urlParams.get('redirect') || '/';

  if (isLoggedIn.value) {
    router.push(redirectUrl);
  }
});
</script>