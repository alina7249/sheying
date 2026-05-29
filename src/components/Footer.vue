<template>
  <footer :class="['w-full py-10 mt-12', getBgClass()]">
    <div class="container mx-auto px-4">
      <div class="h-4 bg-[#1E2A3A] rounded-t-xl mb-8"></div>

      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div class="space-y-4">
          <div class="flex items-center">
            <i :class="['fa-solid fa-camera text-2xl', getTextClass(true), 'mr-2']"></i>
            <span :class="['text-xl font-bold', getTextClass(true)]">
              影研社
            </span>
          </div>
          <p :class="getTextClass(false)">
            聚焦艺术摄影、商业创作及黑白影像领域，为追求质感的摄影师与爱好者，打造"深邃夜空"风格的专业交流空间。
          </p>
          <div class="flex space-x-4">
            <a href="#" :class="getSocialIconClass()">
              <i class="fa-brands fa-weibo"></i>
            </a>
            <a href="#" :class="getSocialIconClass()">
              <i class="fa-brands fa-weixin"></i>
            </a>
            <a href="#" :class="getSocialIconClass()">
              <i class="fa-brands fa-instagram"></i>
            </a>
            <a href="#" :class="getSocialIconClass()">
              <i class="fa-brands fa-twitter"></i>
            </a>
          </div>
        </div>

        <div :class="[getCardBgClass(), 'rounded-lg p-5 border']">
          <h4 :class="['text-lg font-bold mb-4', getTextClass(true)]">快速链接</h4>
          <ul class="space-y-2">
            <li>
              <router-link to="/" :class="['text-sm', getLinkClass(), 'transition-colors']">
                首页
              </router-link>
            </li>
            <li>
              <router-link to="/community" :class="['text-sm', getLinkClass(), 'transition-colors']">
                社区
              </router-link>
            </li>
            <li>
              <router-link to="/resources" :class="['text-sm', getLinkClass(), 'transition-colors']">
                资源
              </router-link>
            </li>
            <li>
              <router-link to="#" :class="['text-sm', getLinkClass(), 'transition-colors']">
                赛事
              </router-link>
            </li>
            <li>
              <router-link to="#" :class="['text-sm', getLinkClass(), 'transition-colors']">
                器材交易
              </router-link>
            </li>
          </ul>
        </div>

        <div :class="[getCardBgClass(), 'rounded-lg p-5 border']">
          <h4 :class="['text-lg font-bold mb-4', getTextClass(true)]">支持</h4>
          <ul class="space-y-2">
            <li>
              <router-link to="#" :class="['text-sm', getLinkClass(), 'transition-colors']">
                帮助中心
              </router-link>
            </li>
            <li>
              <router-link to="#" :class="['text-sm', getLinkClass(), 'transition-colors']">
                社区准则
              </router-link>
            </li>
            <li>
              <router-link to="#" :class="['text-sm', getLinkClass(), 'transition-colors']">
                隐私政策
              </router-link>
            </li>
            <li>
              <router-link to="#" :class="['text-sm', getLinkClass(), 'transition-colors']">
                服务条款
              </router-link>
            </li>
            <li>
              <router-link to="#" :class="['text-sm', getLinkClass(), 'transition-colors']">
                联系我们
              </router-link>
            </li>
          </ul>
        </div>

        <div :class="[getCardBgClass(), 'rounded-lg p-5 border']">
          <h4 :class="['text-lg font-bold mb-4', getTextClass(true)]">订阅更新</h4>
          <p :class="['text-sm mb-4', getTextClass(false)]">
            订阅我们的新闻通讯，获取最新的摄影技巧、赛事信息和社区动态。
          </p>
          <div class="flex">
            <input
              type="email"
              placeholder="您的邮箱地址"
              :class="['flex-1 px-4 py-2', getSubscribeInputClass(), 'rounded-l-lg focus:outline-none']"
            />
            <button :class="['px-4 py-2', getSubscribeButtonClass(), 'rounded-r-lg text-sm font-medium transition-colors']">
              订阅
            </button>
          </div>
        </div>
      </div>

      <div class="mt-10 pt-6 border-t border-gray-700 text-center">
        <p :class="getTextClass(false)">
          © 2025 影研社. 保留所有权利。
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAuthStore } from '../store/authStore';

const authStore = useAuthStore();
const theme = computed(() => authStore.theme);

const getBgClass = () => {
  return theme.value === 'dark' ? 'bg-[#1E2532]' : 'bg-gray-100';
};

const getTextClass = (isPrimary: boolean) => {
  return isPrimary
    ? (theme.value === 'dark' ? 'text-[#E0E5EC]' : 'text-[#1E2532]')
    : (theme.value === 'dark' ? 'text-[#718096]' : 'text-[#4A5F8B]');
};

const getCardBgClass = () => {
  return theme.value === 'dark' ? 'bg-[#1E2A3A] border-[#4A5568]' : 'bg-white border-gray-200';
};

const getLinkClass = () => {
  return theme.value === 'dark'
    ? 'text-[#E2E8F0] hover:text-[#63B3ED]'
    : 'text-[#4A5F8B] hover:text-[#63B3ED]';
};

const getSubscribeInputClass = () => {
  return theme.value === 'dark'
    ? 'bg-[#4A5568] text-[#FFFFFF] focus:ring-[#63B3ED]'
    : 'bg-white text-[#1E2532] border-gray-300 focus:ring-[#63B3ED] focus:border-[#63B3ED]';
};

const getSubscribeButtonClass = () => {
  return theme.value === 'dark'
    ? 'bg-[#63B3ED] text-[#0F1C2D] hover:bg-[#4299E1]'
    : 'bg-[#4A5F8B] text-white hover:bg-[#6B7C93]';
};

const getSocialIconClass = () => {
  return theme.value === 'dark'
    ? 'text-[#E2E8F0] hover:text-[#63B3ED]'
    : 'text-[#4A5F8B] hover:text-[#63B3ED]';
};
</script>