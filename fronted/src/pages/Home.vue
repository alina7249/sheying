<template>
  <div class="home-page">
    <div class="fixed inset-0 bg-gradient-to-br from-[#0a0f1a] via-[#0F1C2D] to-[#050810] pointer-events-none z-0"></div>
    <div class="fixed inset-0 opacity-[0.03] pointer-events-none z-0" style="background-image: url(&quot;data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E&quot;);"></div>
    <div class="fixed top-0 left-1/4 w-96 h-96 bg-[#4A5F8B]/10 rounded-full blur-3xl pointer-events-none z-0"></div>
    <div class="fixed bottom-0 right-1/4 w-[28rem] h-[28rem] bg-purple-500/5 rounded-full blur-3xl pointer-events-none z-0"></div>
    
    <div class="relative z-10">
      <div class="container mx-auto px-4 py-12">
        <section class="relative mb-24 overflow-hidden rounded-3xl">
          <div class="absolute inset-0 bg-gradient-to-br from-[#4A5F8B]/20 via-transparent to-purple-900/10"></div>
          <div class="relative px-8 py-20 md:py-28">
            <div class="max-w-4xl">
              <div class="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full mb-6">
                <span class="w-2 h-2 rounded-full bg-[#48BB78] animate-pulse"></span>
                <span class="text-sm text-[#B8C6D8] tracking-wide">摄影爱好者社区</span>
              </div>
              <h1 class="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6 tracking-tight">
                用光影
                <span class="text-transparent bg-clip-text bg-gradient-to-r from-[#63B3ED] via-[#4A5F8B] to-purple-400">
                  讲述故事
                </span>
              </h1>
              <p class="text-xl text-[#B8C6D8] mb-10 max-w-2xl leading-relaxed">
                加入专业摄影师社区，分享你的作品，学习大师技巧，探索无限可能
              </p>
              <div class="flex flex-wrap gap-4">
                <Button variant="primary" size="lg" class="!px-8 !py-4 !rounded-xl !bg-gradient-to-r !from-[#4A5F8B] !to-[#63B3ED] !shadow-lg !shadow-[#4A5F8B]/30">
                  开始创作
                  <i class="fa-solid fa-arrow-right ml-2"></i>
                </Button>
                <Button variant="outline" size="lg" class="!px-8 !py-4 !rounded-xl !border-white/20 !text-white hover:!bg-white/10">
                  探索作品
                </Button>
              </div>
            </div>
          </div>
        </section>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div class="lg:col-span-2">
            <div class="filter-section fade-in-up mb-8" style="animation-delay: 0.8s;">
              <div class="flex items-center justify-between mb-6">
                <div class="flex items-center gap-3">
                  <span class="w-1 h-8 bg-gradient-to-b from-[#48BB78] to-emerald-600 rounded-full"></span>
                  <h2 class="text-2xl font-bold text-white">精选作品</h2>
                </div>
              </div>
              <div class="filter-buttons flex flex-wrap gap-3">
                <button v-for="category in categories" :key="category.id" @click="handleCategoryChange(category.id)" :class="['px-6 py-3 rounded-2xl font-medium transition-all duration-300', selectedCategory === category.id ? 'bg-gradient-to-r from-[#4A5F8B] to-[#63B3ED] text-white shadow-lg shadow-[#4A5F8B]/30' : 'bg-[#1E2532] text-[#B8C6D8] border border-[#4A5F8B]/20 hover:border-[#4A5F8B]/50 hover:bg-[#2D3748]']" :aria-pressed="selectedCategory === category.id">
                  {{ category.name }}
                </button>
              </div>
            </div>

            <div v-if="loading" class="photo-grid grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <div v-for="n in 6" :key="n" class="bg-[#1E2532] rounded-2xl h-80 animate-pulse"></div>
            </div>

            <div v-else-if="photographyPosts.length === 0" class="text-center py-20">
              <i class="fa-regular fa-image text-6xl text-[#6B7C93] mb-4"></i>
              <p class="text-[#B8C6D8] text-lg">暂无作品</p>
            </div>

            <div v-else class="photo-grid grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <div v-for="(post, index) in photographyPosts" :key="post.id" class="photo-card-wrapper fade-in-up" :style="{ animationDelay: `${0.9 + index * 0.1}s` }">
                <PhotographyCard :post="post" @update="handlePostUpdate" />
              </div>
            </div>

            <div v-if="hasMore" class="load-more-section fade-in-up text-center" style="animation-delay: 1.4s;">
              <Button variant="outline" size="lg" :disabled="loadingMore" class="!px-10 !py-4 !rounded-2xl !border-[#4A5F8B]/30 !text-[#B8C6D8] hover:!bg-[#4A5F8B]/10 hover:!border-[#4A5F8B]/60 hover:!text-white" @click="handleLoadMore" aria-label="加载更多摄影作品">
                <i v-if="loadingMore" class="fa-solid fa-circle-notch fa-spin mr-2"></i>
                <i v-else class="fa-solid fa-inbox mr-2"></i>
                {{ loadingMore ? '加载中…' : '加载更多作品' }}
              </Button>
            </div>
          </div>

          <div class="space-y-8">
            <div class="search-section fade-in-up" style="animation-delay: 1s;">
              <form @submit.prevent="handleSearch" class="search-wrapper relative">
                <i class="fa-solid fa-search absolute left-5 top-1/2 -translate-y-1/2 text-[#6B7C93] text-lg"></i>
                <input type="search" name="search" autocomplete="off" v-model="searchQuery" placeholder="搜索作品、摄影师或风格…" class="w-full pl-14 pr-5 py-4 bg-[#1E2532] border border-[#4A5F8B]/20 text-white placeholder-[#6B7C93] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#4A5F8B]/50 focus:border-[#4A5F8B]/50 transition-all" />
              </form>
            </div>

            <div class="sidebar-card fade-in-up bg-gradient-to-br from-[#1E2532] to-[#2D3748] border border-[#4A5F8B]/20 rounded-3xl p-7" style="animation-delay: 1.1s;">
              <h3 class="sidebar-title text-lg font-bold text-white mb-6 flex items-center gap-2">
                <i class="fa-solid fa-fire text-orange-400"></i>
                热门标签
              </h3>
              <div v-if="loadingTags" class="space-y-3">
                <div v-for="n in 6" :key="n" class="h-8 w-20 bg-[#0F1C2D] rounded-full animate-pulse inline-block mr-2"></div>
              </div>
              <div v-else class="tags-cloud flex flex-wrap gap-2">
                <router-link v-for="tag in popularTags" :key="tag.name" :to="`/search-result?q=${encodeURIComponent(tag.name)}`" class="tag-chip px-4 py-2.5 bg-[#0F1C2D]/60 text-[#B8C6D8] border border-[#4A5F8B]/10 rounded-full text-sm font-medium hover:bg-[#4A5F8B] hover:text-white hover:border-[#4A5F8B] transition-all duration-300">
                  #{{ tag.name }}
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import PhotographyCard, { type PostVO } from '../components/PhotographyCard.vue';
import Button from '../components/common/Button.vue';
import { getPostList, getHotTags } from '../services/api';
import '../components/Animations.vue';

const router = useRouter();

const categories = [
  { id: 'all', name: '全部' },
  { id: '风光', name: '风光' },
  { id: '人像', name: '人像' },
  { id: '街拍', name: '街拍' },
  { id: '建筑', name: '建筑' }
];

interface HotTag {
  name: string;
  count: number;
}

const popularTags = ref<HotTag[]>([]);
const loadingTags = ref(true);

const photographyPosts = ref<PostVO[]>([]);
const loading = ref(true);
const loadingMore = ref(false);
const currentPage = ref(1);
const pageSize = 12;
const total = ref(0);
const searchQuery = ref('');
const selectedCategory = ref('all');

const hasMore = computed(() => {
  return photographyPosts.value.length < total.value;
});

const loadPosts = async (page: number = 1, append: boolean = false) => {
  if (append) {
    loadingMore.value = true;
  } else {
    loading.value = true;
  }
  
  try {
    const params: any = {
      current: page,
      pageSize: pageSize,
    };

    if (selectedCategory.value !== 'all') {
      params.tags = [selectedCategory.value];
    }

    const res: any = await getPostList(params);
    
    if (res && res.data) {
      const records = res.data.records || [];
      if (append) {
        photographyPosts.value = [...photographyPosts.value, ...records];
      } else {
        photographyPosts.value = records;
      }
      total.value = res.data.total || 0;
      currentPage.value = page;
    }
  } catch (error) {
    console.error('Failed to load posts:', error);
  } finally {
    loading.value = false;
    loadingMore.value = false;
  }
};

const loadHotTags = async () => {
  loadingTags.value = true;
  try {
    const res: any = await getHotTags();
    if (res && res.data) {
      popularTags.value = res.data;
    }
  } catch (error) {
    console.error('Failed to load hot tags:', error);
  } finally {
    loadingTags.value = false;
  }
};

const handleCategoryChange = (categoryId: string) => {
  selectedCategory.value = categoryId;
  currentPage.value = 1;
  loadPosts(1, false);
};

const handleLoadMore = () => {
  if (loadingMore.value || !hasMore.value) return;
  loadPosts(currentPage.value + 1, true);
};

const handleSearch = () => {
  if (!searchQuery.value.trim()) return;
  router.push(`/search-result?q=${encodeURIComponent(searchQuery.value.trim())}`);
};

const handlePostUpdate = (updatedPost: PostVO) => {
  const index = photographyPosts.value.findIndex(p => p.id === updatedPost.id);
  if (index !== -1) {
    photographyPosts.value[index] = updatedPost;
  }
};

onMounted(() => {
  loadPosts(1, false);
  loadHotTags();
});
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
}

.fade-in-up {
  opacity: 0;
  animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .fade-in-up {
    animation: none;
    opacity: 1;
  }
  
  .topic-card:hover,
  .photographer-avatar:hover {
    transform: none !important;
  }
  
  .topic-image {
    transition: none !important;
  }
}
</style>
