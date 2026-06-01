<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
    <div
      v-for="feature in features"
      :key="feature.id"
      :class="[getBgClass(), 'rounded-xl overflow-hidden shadow-sm transition-transform duration-300 hover:-translate-y-2']"
      :style="{ boxShadow: hoveredFeature === feature.id ? getShadowClass() : 'none' }"
      @mouseenter="hoveredFeature = feature.id"
      @mouseleave="hoveredFeature = null"
    >
      <div class="h-48 overflow-hidden relative">
        <img
          :src="feature.image"
          :alt="feature.title"
          class="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
        />
        <div :class="['absolute inset-0 bg-gradient-to-t', theme === 'dark' ? 'from-[#1E2532]/80' : 'from-black/60', 'to-transparent transition-opacity duration-300 flex items-end', hoveredFeature === feature.id ? 'opacity-100' : 'opacity-0']">
          <div class="p-6">
            <h3 class="text-xl font-bold text-white mb-2">{{ feature.title }}</h3>
            <p class="text-gray-300">{{ feature.description }}</p>
          </div>
        </div>
      </div>
      <div class="p-6">
        <div class="flex items-center space-x-4">
          <div :class="['w-12 h-12 rounded-full', getIconBgClass(), 'flex items-center justify-center']">
            <i :class="['fa-solid', feature.icon, 'text-xl']"></i>
          </div>
          <div>
            <h3 :class="['text-lg font-bold', getTextClass(true)]">{{ feature.title }}</h3>
            <p :class="['text-sm', getTextClass(false)]">{{ feature.description }}</p>
          </div>
        </div>
        <router-link
          :to="feature.link"
          :class="[getLinkClass(), 'mt-6 inline-block font-medium transition-colors']"
        >
          探索更多 <i class="fa-solid fa-chevron-right ml-1 text-xs"></i>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface FeatureItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  link: string;
  image: string;
}

const theme = 'dark';
const hoveredFeature = ref<string | null>(null);

const features: FeatureItem[] = [
  {
    id: '1',
    title: '艺术新作',
    description: '探索最新的艺术摄影作品，感受创作者的独特视角',
    icon: 'fa-images',
    link: '/new-artworks',
    image: '/branded/风光摄影.jpg'
  },
  {
    id: '2',
    title: '黑白影像',
    description: '专注黑白摄影作品，欣赏光影、线条与质感的艺术表达',
    icon: 'fa-monochrome',
    link: '/black-white',
    image: '/branded/黑白光影.jpg'
  },
  {
    id: '3',
    title: '商业案例',
    description: '浏览专业摄影师的商业摄影作品，获取创作灵感',
    icon: 'fa-briefcase',
    link: '/commercial',
    image: '/branded/人像摄影.jpg'
  }
];

const getBgClass = () => {
  return theme === 'dark'
    ? 'bg-[#2D3748] border border-[#4A5F8B]'
    : 'bg-white border border-gray-200';
};

const getTextClass = (isPrimary: boolean) => {
  return isPrimary
    ? (theme === 'dark' ? 'text-[#F5F7FA]' : 'text-[#1E2532]')
    : (theme === 'dark' ? 'text-[#B8C6D8]' : 'text-[#6B7C93]');
};

const getIconBgClass = () => {
  return theme === 'dark' ? 'bg-[#4A5F8B]/20 text-[#4A5F8B]' : 'bg-gray-100 text-[#63B3ED]';
};

const getLinkClass = () => {
  return theme === 'dark'
    ? 'text-[#4A5F8B] hover:text-[#6B7C93]'
    : 'text-[#63B3ED] hover:text-[#4299E1]';
};

const getShadowClass = () => {
  return theme === 'dark'
    ? '0 10px 25px -5px rgba(74, 95, 139, 0.2)'
    : '0 10px 25px -5px rgba(0, 0, 0, 0.1)';
};
</script>