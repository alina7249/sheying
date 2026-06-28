<template>
  <div class="home-page">
    <!-- 1. Full-screen Hero Section -->
    <section class="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div class="absolute inset-0">
        <img
          :src="heroImage"
          alt="Hero"
          class="w-full h-full object-cover"
        />
        <div class="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-[#0a0a0a]"></div>
      </div>
      <div class="relative z-10 text-center px-4">
        <h1 class="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 tracking-tight">
          光影视界
        </h1>
        <p class="text-lg md:text-xl text-[#9ca3af] mb-10 max-w-xl mx-auto leading-relaxed">
          发现摄影之美，记录世界瞬间
        </p>
        <div class="flex flex-wrap gap-4 justify-center">
          <button
            @click="scrollToGallery"
            class="px-8 py-3.5 rounded-xl font-semibold text-[#0a0a0a] bg-[#d4a853] hover:bg-[#c49a43] transition-colors duration-300 shadow-lg shadow-[#d4a853]/20"
          >
            探索作品
          </button>
          <router-link
            to="/publish"
            class="px-8 py-3.5 rounded-xl font-semibold text-white border border-white/30 hover:border-white/60 hover:bg-white/10 transition-all duration-300"
          >
            上传作品
          </router-link>
        </div>
      </div>
    </section>

    <!-- 2. Hot Posts Horizontal Scroll -->
    <section v-if="hotPosts.length > 0" class="py-16 px-4">
      <div class="max-w-7xl mx-auto">
        <h2 class="text-2xl font-bold text-white mb-8 flex items-center gap-2">
          <i class="fa-solid fa-fire text-orange-500"></i>
          热门推荐
        </h2>
        <div class="hot-scroll flex gap-4 overflow-x-auto pb-4">
          <router-link
            v-for="post in hotPosts"
            :key="post.id"
            :to="`/photo-detail/${post.id}`"
            class="flex-shrink-0 w-[200px] rounded-2xl overflow-hidden group"
          >
            <div class="h-[140px] overflow-hidden">
              <img
                :src="post.coverImage || post.imageUrl || 'https://picsum.photos/400/300?random=' + post.id"
                :alt="post.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div class="p-3 bg-[#111827]">
              <h3 class="text-white text-sm font-medium truncate">{{ post.title }}</h3>
              <div class="flex items-center gap-2 mt-1.5">
                <img
                  :src="post.user?.userAvatar || 'https://picsum.photos/40/40?random=user' + post.userId"
                  class="w-4 h-4 rounded-full object-cover"
                />
                <span class="text-[#9ca3af] text-xs">{{ post.user?.userName || '用户' }}</span>
              </div>
            </div>
          </router-link>
        </div>
      </div>
    </section>

    <!-- 3. Category Filter -->
    <section class="pb-8 px-4">
      <div class="max-w-7xl mx-auto">
        <div class="flex flex-wrap gap-2 justify-center">
          <button
            v-for="category in categories"
            :key="category.id"
            @click="handleCategoryChange(category.id)"
            :class="[
              'px-6 py-2 rounded-full text-sm font-medium transition-all duration-200',
              selectedCategory === category.id
                ? 'bg-[#d4a853] text-[#0a0a0a]'
                : 'border border-[rgba(255,255,255,0.08)] text-[#9ca3af] hover:border-white/30'
            ]"
          >
            {{ category.name }}
          </button>
        </div>
      </div>
    </section>

    <!-- 4. Masonry Waterfall Grid -->
    <section ref="gallerySection" class="pb-16 px-4">
      <div class="max-w-7xl mx-auto">
        <!-- Loading skeletons -->
        <div v-if="loading" class="masonry-grid">
          <div v-for="n in 6" :key="n" class="masonry-item">
            <div class="skeleton rounded-xl" :style="{ height: 200 + (n % 3) * 80 + 'px' }"></div>
          </div>
        </div>

        <!-- Empty state -->
        <div v-else-if="photographyPosts.length === 0" class="text-center py-20">
          <i class="fa-regular fa-image text-6xl text-[#374151] mb-4 block"></i>
          <p class="text-[#9ca3af] text-lg">暂无作品</p>
        </div>

        <!-- Masonry grid -->
        <div v-else class="masonry-grid">
          <div
            v-for="(post, index) in photographyPosts"
            :key="post.id"
            class="masonry-item staggered-card"
            :style="{ animationDelay: `${index * 0.08}s` }"
          >
            <router-link
              :to="`/photo-detail/${post.id}`"
              class="block rounded-xl overflow-hidden relative group cursor-pointer"
            >
              <img
                :src="post.imageUrl || 'https://picsum.photos/600/400?random=' + post.id"
                :alt="post.title"
                class="w-full h-auto block"
              />
              <div class="overlay absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-4">
                <h3 class="text-white font-semibold text-sm truncate">{{ post.title }}</h3>
                <div class="flex items-center gap-2 mt-1.5">
                  <img
                    :src="post.user?.userAvatar || 'https://picsum.photos/40/40?random=user' + post.userId"
                    class="w-5 h-5 rounded-full object-cover"
                  />
                  <span class="text-[#d1d5db] text-xs">{{ post.user?.userName || '用户' }}</span>
                </div>
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- 5. Load More -->
    <section v-if="hasMore && !loading" class="pb-20 px-4 text-center">
      <button
        @click="handleLoadMore"
        :disabled="loadingMore"
        class="px-10 py-3.5 rounded-xl font-medium text-[#9ca3af] border border-[rgba(255,255,255,0.08)] hover:border-[#d4a853] hover:text-[#d4a853] transition-all duration-300 disabled:opacity-50"
      >
        <i v-if="loadingMore" class="fa-solid fa-circle-notch fa-spin mr-2"></i>
        {{ loadingMore ? '加载中…' : '加载更多' }}
      </button>
    </section>

    <!-- Loading more skeletons -->
    <section v-if="loadingMore" class="pb-20 px-4">
      <div class="max-w-7xl mx-auto">
        <div class="masonry-grid">
          <div v-for="n in 4" :key="n" class="masonry-item">
            <div class="skeleton rounded-xl" :style="{ height: 200 + (n % 3) * 80 + 'px' }"></div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { getPostList, getHotPosts } from '../services/api';

const categories = [
  { id: 'all', name: '全部' },
  { id: '风光', name: '风光' },
  { id: '人像', name: '人像' },
  { id: '街拍', name: '街拍' },
  { id: '建筑', name: '建筑' }
];

const hotPosts = ref<any[]>([]);
const photographyPosts = ref<any[]>([]);
const loading = ref(true);
const loadingMore = ref(false);
const currentPage = ref(1);
const pageSize = 12;
const total = ref(0);
const selectedCategory = ref('all');

const gallerySection = ref<HTMLElement | null>(null);

const heroImage = ref('https://picsum.photos/1600/900?random=hero');

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

const loadHotPosts = async () => {
  try {
    const res: any = await getHotPosts(1, 8);
    if (res?.code === 0 && res.data?.records) {
      hotPosts.value = res.data.records;
      // Use first hot post image as hero background
      if (res.data.records.length > 0) {
        const first = res.data.records[0];
        heroImage.value = first.coverImage || first.imageUrl || 'https://picsum.photos/1600/900?random=hero';
      }
    }
  } catch (e) {
    /* ignore */
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

const scrollToGallery = () => {
  gallerySection.value?.scrollIntoView({ behavior: 'smooth' });
};

onMounted(() => {
  loadPosts(1, false);
  loadHotPosts();
});
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  background: #0a0a0a;
  position: relative;
  overflow-x: hidden;
}

.masonry-grid {
  columns: 2;
  column-gap: 1.5rem;
}

@media (max-width: 768px) {
  .masonry-grid {
    columns: 1;
  }
}

.masonry-item {
  break-inside: avoid;
  margin-bottom: 1.5rem;
}

.masonry-item img {
  transition: transform 0.5s ease;
}

.masonry-item:hover img {
  transform: scale(1.03);
}

.masonry-item .overlay {
  opacity: 0;
  transition: opacity 0.3s ease;
}

.masonry-item:hover .overlay {
  opacity: 1;
}

.hot-scroll::-webkit-scrollbar {
  display: none;
}
.hot-scroll {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.skeleton {
  background: #1f2937;
  animation: shimmer 2s infinite;
  background-size: 200% 100%;
  background-image: linear-gradient(90deg, #1f2937 0%, #374151 50%, #1f2937 100%);
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.staggered-card {
  opacity: 0;
  transform: translateY(20px);
  animation: cardEnter 0.5s ease forwards;
}

@keyframes cardEnter {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>