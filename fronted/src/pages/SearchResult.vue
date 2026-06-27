<template>
  <div class="min-h-screen bg-[#0a0f1a] text-white">
    <div class="fixed inset-0 bg-gradient-to-br from-[#0a0f1a] via-[#0F1C2D] to-[#050810] pointer-events-none z-0"></div>
    
    <div class="relative z-10">
      <div class="container mx-auto px-4 py-12">
        <div class="mb-8 text-center">
          <h1 class="text-3xl font-bold text-white mb-2">搜索结果</h1>
          <p v-if="!loading && query" class="text-[#B8C6D8]">
            找到 {{ total }} 个关于 "{{ query }}" 的结果
          </p>
          <p v-else class="text-[#B8C6D8]">请输入搜索关键词</p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div class="lg:col-span-2 space-y-6">
            <div class="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <div class="relative flex-1">
                <form @submit.prevent="handleSearch">
                  <input type="text" v-model="searchTerm" placeholder="继续搜索…" class="w-full px-4 py-3 pl-12 bg-[#1E2532] border border-[#4A5F8B] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all placeholder:text-[#B8C6D8]" />
                  <i class="fa-solid fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-[#B8C6D8]"></i>
                </form>
              </div>
              <select v-model="sortBy" class="px-4 py-3 bg-[#1E2532] border border-[#4A5F8B] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all appearance-none cursor-pointer">
                <option value="relevance">相关度</option>
                <option value="date">按日期</option>
                <option value="popularity">受欢迎度</option>
              </select>
            </div>

            <div v-if="loading" class="space-y-4">
              <div v-for="n in 5" :key="n" class="bg-[#1E2532] rounded-xl h-48 animate-pulse"></div>
            </div>

            <div v-else-if="!query" class="p-8 bg-[#1E2532] rounded-xl border border-[#4A5F8B] text-center">
              <div class="w-16 h-16 bg-[#0F1C2D] rounded-full flex items-center justify-center text-[#4A5F8B] mx-auto mb-4 border border-[#4A5F8B]"><i class="fa-solid fa-search text-2xl"></i></div>
              <h3 class="text-lg font-medium text-white mb-2">请输入搜索关键词</h3>
              <p class="text-[#B8C6D8]">在上方搜索框中输入关键词开始搜索</p>
            </div>

            <div v-else-if="posts.length === 0" class="p-8 bg-[#1E2532] rounded-xl border border-[#4A5F8B] text-center">
              <div class="w-16 h-16 bg-[#0F1C2D] rounded-full flex items-center justify-center text-[#4A5F8B] mx-auto mb-4 border border-[#4A5F8B]"><i class="fa-solid fa-search-minus text-2xl"></i></div>
              <h3 class="text-lg font-medium text-white mb-2">未找到相关结果</h3>
              <p class="text-[#B8C6D8]">请尝试调整搜索条件或使用不同的关键词</p>
            </div>

            <div v-else class="space-y-6">
              <div v-for="post in posts" :key="post.id" class="bg-[#1E2532] rounded-xl overflow-hidden border border-[#4A5F8B] transition-all cursor-pointer hover:border-[#63B3ED] hover:shadow-lg hover:shadow-[#4A5F8B]/10" @click="router.push(`/photo-detail/${post.id}`)">
                <div class="md:flex">
                  <div class="md:w-1/3">
                    <img :src="post.imageUrl" :alt="post.title" class="w-full h-48 md:h-full object-cover" />
                  </div>
                  <div class="p-5 md:w-2/3">
                    <div class="flex items-center justify-between mb-2">
                      <span class="px-2 py-1 bg-[#0F1C2D] text-[#63B3ED] rounded-full text-xs border border-[#4A5F8B]">作品</span>
                    </div>
                    <h3 class="text-lg font-bold text-white mb-2">{{ post.title }}</h3>
                    <p class="text-sm text-[#B8C6D8] mb-4 line-clamp-2 leading-relaxed">{{ post.content }}</p>
                    <div class="flex items-center justify-between mb-4">
                      <div class="flex items-center">
                        <img :src="post.user?.userAvatar || 'https://picsum.photos/400/400?random=' + post.userId" :alt="post.user?.userName" class="w-6 h-6 rounded-full mr-2 object-cover border border-[#B8C6D8]" />
                        <span class="text-sm text-[#B8C6D8]">{{ post.user?.userName || '匿名用户' }}</span>
                      </div>
                      <span class="text-sm text-[#6B7C93]">发布于 {{ formatDate(post.createTime) }}</span>
                    </div>
                    <div class="flex items-center space-x-3">
                      <div class="flex items-center gap-4 text-sm text-[#6B7C93]">
                        <span class="flex items-center gap-1">
                          <i class="fa-regular fa-heart"></i>
                          {{ post.thumbNum || 0 }}
                        </span>
                        <span class="flex items-center gap-1">
                          <i class="fa-regular fa-bookmark"></i>
                          {{ post.favourNum || 0 }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="hasMore" class="flex justify-center">
              <button @click="loadMore" :disabled="loadingMore" class="px-6 py-3 bg-[#1E2532] border border-[#4A5F8B] text-[#B8C6D8] rounded-lg hover:bg-[#4A5F8B]/10 hover:text-white transition-colors">
                <i v-if="loadingMore" class="fa-solid fa-circle-notch fa-spin mr-2"></i>
                {{ loadingMore ? '加载中…' : '加载更多' }}
              </button>
            </div>
          </div>

          <div class="lg:col-span-1 space-y-6">
            <div class="bg-[#1E2532] rounded-xl p-6 shadow-sm border border-[#4A5F8B]">
              <h3 class="text-lg font-bold mb-4 text-white">热门搜索</h3>
              <div class="flex flex-wrap gap-2">
                <button v-for="keyword in hotKeywords" :key="keyword" @click="doSearch(keyword)" class="px-3 py-1 rounded-full text-sm transition-colors" :class="searchTerm === keyword ? 'bg-[#4A5F8B] text-white' : 'bg-[#0F1C2D] text-[#B8C6D8] border border-[#4A5F8B] hover:bg-[#4A5F8B]/50'">#{{ keyword }}</button>
              </div>
            </div>

            <div class="bg-[#1E2532] rounded-xl p-6 shadow-sm border border-[#4A5F8B]">
              <h3 class="text-lg font-bold mb-4 text-white">搜索建议</h3>
              <div class="space-y-3">
                <div v-for="(tip, idx) in searchTips" :key="idx" class="flex items-start">
                  <span class="text-[#4A5F8B] mt-0.5 mr-2 text-lg">•</span>
                  <p class="text-sm text-[#B8C6D8]">{{ tip }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { searchPosts } from '../services/api';

const route = useRoute();
const router = useRouter();

interface PostVO {
  id: number;
  title: string;
  content: string;
  thumbNum: number;
  favourNum: number;
  userId: number;
  createTime: string;
  tagList: string[];
  imageUrl: string;
  camera?: string;
  lens?: string;
  user?: {
    id: number;
    userName: string;
    userAvatar: string;
  };
}

const query = ref(route.query.q as string || '');
const searchTerm = ref(query.value);
const sortBy = ref('relevance');
const posts = ref<PostVO[]>([]);
const loading = ref(false);
const loadingMore = ref(false);
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

const hotKeywords = ['风光摄影', '人像摄影', '黑白', '街拍', '建筑', '胶片', '夜景', '极简'];

const searchTips = [
  '使用更具体的词汇能够缩小搜索范围',
  '可以对搜索结果进行排序',
  '搜索标签能够找到相关主题内容',
  '输入设备型号可以找到相关器材'
];

const hasMore = computed(() => {
  return posts.value.length < total.value;
});

const formatDate = (dateStr: string): string => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('zh-CN');
};

const doSearch = (keyword: string) => {
  searchTerm.value = keyword;
  query.value = keyword;
  router.push({ path: '/search-result', query: { q: keyword } });
  performSearch(1, false);
};

const handleSearch = () => {
  if (!searchTerm.value.trim()) return;
  query.value = searchTerm.value.trim();
  router.push({ path: '/search-result', query: { q: query.value } });
  performSearch(1, false);
};

const performSearch = async (page: number, append: boolean) => {
  if (!query.value.trim()) return;
  
  if (append) {
    loadingMore.value = true;
  } else {
    loading.value = true;
  }
  
  try {
    const res: any = await searchPosts(query.value.trim(), page, pageSize.value);
    
    if (res && res.data) {
      const records = res.data.records || [];
      if (append) {
        posts.value = [...posts.value, ...records];
      } else {
        posts.value = records;
      }
      total.value = res.data.total || 0;
      currentPage.value = page;
    }
  } catch (error) {
    console.error('Search error:', error);
  } finally {
    loading.value = false;
    loadingMore.value = false;
  }
};

const loadMore = () => {
  if (loadingMore.value || !hasMore.value) return;
  performSearch(currentPage.value + 1, true);
};

watch(() => route.query.q, (newQ) => {
  const q = newQ as string;
  if (q && q !== query.value) {
    query.value = q;
    searchTerm.value = q;
    performSearch(1, false);
  }
});

onMounted(() => {
  if (query.value) {
    performSearch(1, false);
  }
});
</script>
