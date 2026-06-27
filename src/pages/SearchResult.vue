<template>
  <div class="container mx-auto px-4 py-8 bg-[#1E2532] star-texture min-h-screen">
    <div class="mb-8 text-center">
      <h1 class="text-3xl font-bold text-[#F5F7FA] mb-2">搜索结果</h1>
      <p class="text-[#B8C6D8]">找到 {{ searchResults.length }} 个关于 "{{ query }}" 的结果，本次搜索耗时 {{ searchTime }} 秒</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2 space-y-6">
        <div class="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
          <div class="relative flex-1">
            <input type="text" v-model="searchTerm" placeholder="继续搜索…" class="w-full px-4 py-3 pl-12 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all placeholder:text-[#B8C6D8]" />
            <i class="fa-solid fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-[#B8C6D8]"></i>
          </div>
          <select v-model="sortBy" @change="showInfo(`排序方式：${sortBy === 'relevance' ? '相关度' : sortBy === 'date' ? '按日期' : '受欢迎度'}`)" class="px-4 py-3 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all appearance-none cursor-pointer">
            <option value="relevance">相关度</option>
            <option value="date">按日期</option>
            <option value="popularity">受欢迎度</option>
          </select>
        </div>

        <div class="flex flex-wrap gap-2">
          <button @click="filterType = 'all'; showInfo('显示全部结果')" class="px-4 py-2 rounded-lg border transition-colors" :class="filterType === 'all' ? 'bg-[#4A5F8B] text-[#F5F7FA] border-[#4A5F8B]' : 'bg-[#2D3748] text-[#B8C6D8] border-[#4A5F8B] hover:bg-[#4A5F8B]/50'">全部</button>
          <button @click="filterType = 'photos'; showInfo('筛选：作品')" class="px-4 py-2 rounded-lg border transition-colors" :class="filterType === 'photos' ? 'bg-[#4A5F8B] text-[#F5F7FA] border-[#4A5F8B]' : 'bg-[#2D3748] text-[#B8C6D8] border-[#4A5F8B] hover:bg-[#4A5F8B]/50'">作品</button>
          <button @click="filterType = 'users'; showInfo('筛选：用户')" class="px-4 py-2 rounded-lg border transition-colors" :class="filterType === 'users' ? 'bg-[#4A5F8B] text-[#F5F7FA] border-[#4A5F8B]' : 'bg-[#2D3748] text-[#B8C6D8] border-[#4A5F8B] hover:bg-[#4A5F8B]/50'">用户</button>
          <button @click="filterType = 'posts'; showInfo('筛选：帖子')" class="px-4 py-2 rounded-lg border transition-colors" :class="filterType === 'posts' ? 'bg-[#4A5F8B] text-[#F5F7FA] border-[#4A5F8B]' : 'bg-[#2D3748] text-[#B8C6D8] border-[#4A5F8B] hover:bg-[#4A5F8B]/50'">帖子</button>
          <button @click="filterType = 'equipment'; showInfo('筛选：器材')" class="px-4 py-2 rounded-lg border transition-colors" :class="filterType === 'equipment' ? 'bg-[#4A5F8B] text-[#F5F7FA] border-[#4A5F8B]' : 'bg-[#2D3748] text-[#B8C6D8] border-[#4A5F8B] hover:bg-[#4A5F8B]/50'">器材</button>
        </div>

        <div class="space-y-6">
          <div v-if="filteredResults.length === 0" class="p-8 bg-[#2D3748] rounded-xl border border-[#4A5F8B] text-center">
            <div class="w-16 h-16 bg-[#1E2A3A] rounded-full flex items-center justify-center text-[#4A5F8B] mx-auto mb-4 border border-[#4A5F8B]"><i class="fa-solid fa-search-minus text-2xl"></i></div>
            <h3 class="text-lg font-medium text-[#F5F7FA] mb-2">未找到相关结果</h3>
            <p class="text-[#B8C6D8]">请尝试调整搜索条件或使用不同的关键词</p>
          </div>

          <div v-for="item in paginatedResults" :key="item.id" class="bg-[#2D3748] rounded-xl overflow-hidden border border-[#4A5F8B] transition-all cursor-pointer" @click="router.push(item.link)">
            <div class="md:flex">
              <div class="md:w-1/3"><img :src="item.image" :alt="item.title" class="w-full h-48 md:h-full object-cover" /></div>
              <div class="p-5 md:w-2/3">
                <div class="flex items-center justify-between mb-2">
                  <span class="px-2 py-1 bg-[#2D3748] text-[#B8C6D8] rounded-full text-xs border border-[#4A5F8B]">{{ item.typeLabel }}</span>
                  <span v-if="item.relevance" class="text-xs text-[#6B7C93]">{{ item.relevance }}% 相关</span>
                </div>
                <h3 class="text-lg font-bold text-[#F5F7FA] mb-2">{{ item.title }}</h3>
                <p class="text-sm text-[#B8C6D8] mb-4 line-clamp-2">{{ item.description }}</p>
                <div class="flex items-center justify-between mb-4">
                  <div class="flex items-center">
                    <img :src="item.authorAvatar" :alt="item.authorName" class="w-6 h-6 rounded-full mr-2 object-cover border border-[#B8C6D8]" />
                    <span class="text-sm text-[#B8C6D8]">{{ item.authorName }}</span>
                  </div>
                  <span class="text-sm text-[#6B7C93]">发布于 {{ item.date }}</span>
                </div>
                <div class="flex items-center space-x-3">
                  <router-link :to="item.link" class="flex-1 py-2 text-center bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors">查看详情</router-link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="searchResults.length > 0" class="flex justify-center">
          <nav class="flex items-center space-x-1 bg-[#2D3748] p-2 rounded-lg border border-[#4A5F8B]">
            <button @click="handlePageChange(currentPage - 1)" :disabled="currentPage === 1" class="px-3 py-2 rounded border border-[#4A5F8B] transition-colors" :class="currentPage === 1 ? 'opacity-50 cursor-not-allowed text-[#6B7C93]' : 'text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA]'"><i class="fa-solid fa-chevron-left text-xs"></i></button>
            <button v-for="page in getPageRange()" :key="page" @click="handlePageChange(page)" class="px-3 py-2 rounded border border-[#4A5F8B] transition-colors" :class="currentPage === page ? 'bg-[#4A5F8B] text-[#F5F7FA]' : 'text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA]'">{{ page }}</button>
            <button @click="handlePageChange(currentPage + 1)" :disabled="currentPage === totalPages" class="px-3 py-2 rounded border border-[#4A5F8B] transition-colors" :class="currentPage === totalPages ? 'opacity-50 cursor-not-allowed text-[#6B7C93]' : 'text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA]'"><i class="fa-solid fa-chevron-right text-xs"></i></button>
            <span class="ml-2 px-3 py-2 text-sm text-[#B8C6D8]">{{ currentPage }}/{{ totalPages }} 页 ({{ filteredResults.length }} 条)</span>
          </nav>
        </div>
      </div>

      <div class="lg:col-span-1 space-y-6">
        <div class="bg-[#4A5F8B] rounded-xl p-6 shadow-sm border border-[#4A5F8B]">
          <h3 class="text-lg font-bold mb-4 text-[#F5F7FA]">热搜关键词</h3>
          <div class="flex flex-wrap gap-2">
            <button v-for="keyword in hotKeywords" :key="keyword.id" @click="searchTerm = keyword.name; query = keyword.name; showInfo(`搜索：${keyword.name}`)" class="px-3 py-1 rounded-full text-sm transition-colors" :class="searchTerm === keyword.name ? 'bg-[#F5F7FA] text-[#4A5F8B]' : 'bg-[#6B7C93] text-[#F5F7FA] border border-[#6B7C93]'">#{{ keyword.name }} ({{ keyword.count }})</button>
          </div>
        </div>

        <div class="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B]">
          <h3 class="text-lg font-bold mb-4 text-[#F5F7FA]">搜索建议</h3>
          <div class="space-y-3">
            <div v-for="(tip, idx) in searchTips" :key="idx" class="flex items-start">
              <span class="text-[#4A5F8B] mt-0.5 mr-2 text-lg">•</span>
              <p class="text-sm text-[#B8C6D8]">{{ tip }}</p>
            </div>
          </div>
        </div>

        <div v-if="relatedSearches.length > 0" class="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B]">
          <h3 class="text-lg font-bold mb-4 text-[#F5F7FA]">相关搜索</h3>
          <div class="flex flex-wrap gap-2">
            <button v-for="(rs, idx) in relatedSearches" :key="idx" @click="searchTerm = rs; query = rs; showInfo(`搜索：${rs}`)" class="px-3 py-2 bg-[#1E2A3A] text-[#B8C6D8] rounded-lg text-sm transition-colors border border-[#4A5F8B]">{{ rs }}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useInteraction } from '../composables/useInteraction';

const route = useRoute();
const router = useRouter();
const { showInfo, handleLoadMore } = useInteraction();
const query = ref(route.query.q as string || '');

const searchTerm = ref('');
const sortBy = ref('relevance');
const filterType = ref('all');
const currentPage = ref(1);
const pageSize = ref(10);
const searchTime = ref(0.32);

const hotKeywords = [
  { id: '1', name: '风光摄影', count: '1.2k' }, { id: '2', name: '佳能镜头', count: '892' }, { id: '3', name: '人像拍摄', count: '756' },
  { id: '4', name: '夜景技巧', count: '654' }, { id: '5', name: '索尼相机', count: '532' }, { id: '6', name: '极光拍摄', count: '432' },
  { id: '7', name: '秋季摄影', count: '398' }
];

const searchTips = [
  '使用更具体的词汇能够缩小搜索范围', '可以对搜索结果进行排序和筛选',
  '搜索标签能够找到相关主题内容', '输入设备型号可以找到相关器材'
];

const relatedSearches = ['风光摄影技巧', '佳能镜头推荐', '秋季摄影地点', '极光拍摄教程', '人像灯光设置'];

const searchResults = [
  {
    id: 'r1', title: '新疆喀纳斯秋季风光摄影团', type: 'posts', typeLabel: '活动', image: 'https://picsum.photos/1280/720?random=184',
    description: '跟随知名摄影师，深入新疆喀纳斯，拍摄秋季绝美风光。', authorName: '@亚历山大张', authorAvatar: 'https://picsum.photos/400/400?random=185',
    date: '2023-10-15', relevance: 98, link: '/events/1',
  },
  {
    id: 'r2', title: '晨曦中的山峦', type: 'photos', typeLabel: '作品', image: 'https://picsum.photos/1280/720?random=186',
    description: '捕捉清晨第一缕阳光洒在山峦上的壮丽景色，使用长曝光展现云海的流动感。', authorName: '@光影捕手', authorAvatar: 'https://picsum.photos/400/400?random=187',
    date: '2023-10-25', relevance: 85, link: '/photo/1',
  },
  {
    id: 'r3', title: '佳能EF 70-200mm f/2.8L IS III USM', type: 'equipment', typeLabel: '器材', image: 'https://picsum.photos/800/600?random=188',
    description: '佳能EF 70-200mm f/2.8L IS III USM 是一款经典的专业级长焦变焦镜头。', authorName: '@摄影器材评测', authorAvatar: 'https://picsum.photos/400/400?random=189',
    date: '2023-10-05', relevance: 82, link: '/equipment/1',
  },
  {
    id: 'r4', title: '@摄影达人小李', type: 'users', typeLabel: '用户', image: 'https://picsum.photos/1280/720?random=190',
    description: '风光摄影师，擅长拍摄中国西部风光，已有10年拍摄经验。粉丝 5.2K，作品 128。', authorName: '@摄影达人小李', authorAvatar: 'https://picsum.photos/400/400?random=191',
    date: '2023-01-15', relevance: 75, link: '/user/profile-1',
  },
  {
    id: 'r5', title: '秋季风光摄影全攻略', type: 'posts', typeLabel: '帖子', image: 'https://picsum.photos/1280/720?random=192',
    description: '分享秋季风光摄影的拍摄技巧，包括构图、用光、后期处理等。', authorName: '@摄影大师王老师', authorAvatar: 'https://picsum.photos/400/400?random=193',
    date: '2023-10-01', relevance: 68, link: '/community/post/5',
  }
];

onMounted(() => { searchTerm.value = query.value; });
watch([searchTerm, filterType], () => { currentPage.value = 1; });

const filteredResults = computed(() => {
  let results = [...searchResults];
  if (filterType.value !== 'all') results = results.filter(item => item.type === filterType.value);
  if (sortBy.value === 'relevance') results.sort((a, b) => (b.relevance || 0) - (a.relevance || 0));
  else if (sortBy.value === 'date') results.sort((a, b) => new Date(b.date || '').getTime() - new Date(a.date || '').getTime());
  return results;
});

const totalPages = computed(() => Math.ceil(filteredResults.value.length / pageSize.value));
const paginatedResults = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return filteredResults.value.slice(start, start + pageSize.value);
});

function getPageRange() {
  const range: number[] = [];
  let start = Math.max(1, currentPage.value - 2);
  let end = Math.min(totalPages.value, start + 4);
  if (end - start < 4 && start > 1) start = Math.max(1, end - 4);
  for (let i = start; i <= end; i++) range.push(i);
  return range;
}

function handlePageChange(page: number) { currentPage.value = page; handleLoadMore(); }
</script>