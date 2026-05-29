<template>
  <div ref="slideRef" :class="['relative h-[60vh] overflow-hidden rounded-xl mb-12', getBgClass()]">
    <TransitionGroup name="fade">
      <div
        v-for="(slide, index) in slides"
        :key="slide.id"
        :class="['absolute inset-0 w-full h-full', index === currentSlide ? 'z-10' : 'z-0']"
      >
        <img
          :src="slide.image"
          :alt="slide.title"
          class="w-full h-full object-cover"
        />
        <div :class="['absolute bottom-0 left-0 right-0', getGradientClass(), 'p-8 h-1/2 flex flex-col justify-end']">
          <div class="flex items-center mb-2">
            <img
              :src="slide.avatar"
              :alt="slide.author"
              :class="['w-8 h-8 rounded-full mr-2 border-2', getAvatarBorderClass()]"
            />
            <span class="text-[#F5F7FA] text-sm">专访 {{ slide.author }}</span>
          </div>
          <h2 class="text-2xl md:text-3xl font-bold text-[#F5F7FA] mb-1">{{ slide.title }}</h2>
          <p class="text-[#B8C6D8]/70 mb-2">{{ slide.description }}</p>
          <router-link
            :to="slide.link"
            :class="[getButtonClass(), 'px-6 py-2 rounded-lg font-medium transition-colors self-start']"
          >
            阅读详情
          </router-link>
        </div>
      </div>
    </TransitionGroup>

    <button
      @click="prevSlide"
      class="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/30 hover:bg-black/50 text-white rounded-full flex items-center justify-center z-20 transition-all"
      aria-label="Previous slide"
    >
      <i class="fa-solid fa-chevron-left"></i>
    </button>

    <button
      @click="nextSlide"
      class="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/30 hover:bg-black/50 text-white rounded-full flex items-center justify-center z-20 transition-all"
      aria-label="Next slide"
    >
      <i class="fa-solid fa-chevron-right"></i>
    </button>

    <div class="absolute bottom-4 right-4 z-20 flex space-x-2">
      <button
        v-for="(_, index) in slides"
        :key="index"
        @click="goToSlide(index)"
        :class="['w-3 h-3 rounded-full transition-all', index === currentSlide ? `${getActiveDotClass()} w-8` : getInactiveDotClass()]"
        :aria-label="`Go to slide ${index + 1}`"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

interface BannerSlide {
  id: string;
  image: string;
  title: string;
  description: string;
  author: string;
  avatar: string;
  link: string;
}

const currentSlide = ref(0);
const slideRef = ref<HTMLDivElement | null>(null);
const theme = 'dark';
let timer: number | null = null;

const slides: BannerSlide[] = [
  {
    id: '1',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=minimalist%20black%20and%20white%20photography%20architecture%20geometric&sign=6a132f48365a1faa666584d6144957fd',
    title: '极简黑白建筑摄影展',
    description: '探索建筑中的几何美感与光影艺术',
    author: '林风',
    avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=minimalist%20photographer%20male%20serious&sign=fded36172bb86afa4dc326776156459c',
    link: '/exhibition/minimalist-architecture'
  },
  {
    id: '2',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=film%20photography%20portrait%20vintage%20style%20natural%20light&sign=04b4b9f4517dc870e3dfeac483c020d4',
    title: '胶片摄影的永恒魅力',
    description: '专访胶片摄影师安娜，探讨传统摄影的现代意义',
    author: '安娜',
    avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=film%20photographer%20female%20vintage%20style&sign=5ec915debce76b46483be485e236cee2',
    link: '/interview/film-photography'
  },
  {
    id: '3',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=moody%20dark%20portrait%20atmospheric%20lighting&sign=aa5713a64a57d8212d2c074cb9e608d2',
    title: '暗调摄影的情绪表达',
    description: '如何通过暗调摄影传达深沉的情感与故事',
    author: '李明',
    avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=moody%20photographer%20male%20creative&sign=b74f18a9e01693163824506fbbcc8c47',
    link: '/tutorial/moody-photography'
  }
];

onMounted(() => {
  timer = window.setInterval(() => {
    currentSlide.value = (currentSlide.value + 1) % slides.length;
  }, 5000);
});

onUnmounted(() => {
  if (timer) {
    clearInterval(timer);
  }
});

const goToSlide = (index: number) => {
  currentSlide.value = index;
};

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % slides.length;
};

const prevSlide = () => {
  currentSlide.value = (currentSlide.value - 1 + slides.length) % slides.length;
};

const getBgClass = () => {
  return theme === 'dark'
    ? 'bg-[#2D3748] border border-[#4A5F8B]'
    : 'bg-gray-100 border border-gray-200';
};

const getGradientClass = () => {
  return theme === 'dark'
    ? 'bg-gradient-to-t from-[#1E2532]/80 to-transparent'
    : 'bg-gradient-to-t from-black/60 to-transparent';
};

const getButtonClass = () => {
  return theme === 'dark'
    ? 'border-2 border-[#4A5F8B] bg-gradient-to-r from-[#4A5F8B] to-[#2D3748] text-[#F5F7FA] hover:from-[#6B7C93] hover:to-[#4A5F8B]'
    : 'border-2 border-[#63B3ED] bg-gradient-to-r from-[#63B3ED] to-[#4299E1] text-white hover:from-[#4299E1] hover:to-[#3182CE]';
};

const getAvatarBorderClass = () => {
  return theme === 'dark' ? 'border-[#4A5F8B]' : 'border-[#63B3ED]';
};

const getActiveDotClass = () => {
  return theme === 'dark' ? 'bg-[#4A5F8B]' : 'bg-[#63B3ED]';
};

const getInactiveDotClass = () => {
  return theme === 'dark' ? 'bg-[#6B7C93]/50' : 'bg-gray-400/50';
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>