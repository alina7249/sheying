<template>
  <div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#0F1C2D]">
    <div class="max-w-md w-full space-y-8 bg-[#1E2A3A] p-8 rounded-xl shadow-xl border border-[#4A5F8B]">
      <div class="text-center relative">
        <div class="absolute inset-0 bg-[url('https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=galaxy%20background%20stars%20purple%20blue&sign=9a9229c82aef2e4f5ac40648383863bf')] bg-cover opacity-10 rounded-full w-20 h-20 mx-auto -mt-12"></div>
        <div class="relative inline-flex items-center justify-center mb-4 text-3xl text-[#B8C6D8]">
          <i class="fa-solid fa-camera"></i>
        </div>
        <h1 class="text-2xl font-bold text-[#FFFFFF]">注册 影研社</h1>
        <p class="mt-2 text-sm text-[#E2E8F0]">
          加入专业摄影创作与交流平台
        </p>
      </div>

      <RegisterForm />

      <div class="text-center mt-6">
        <p class="text-sm text-[#718096]">
          已有账号？{' '}
          <router-link
            to="/login"
            class="font-medium text-[#63B3ED] hover:text-[#63B3ED] transition-colors"
          >
            立即登录
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import RegisterForm from '../components/common/RegisterForm.vue';
</script>