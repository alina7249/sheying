<template>
  <div class="container mx-auto px-4 py-8 bg-[#1E2532] star-texture min-h-screen">
    <div v-if="routeId && isDetailView" class="space-y-6">
      <div class="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <div class="relative flex-1">
          <input type="text" v-model="searchQuery" placeholder="搜索课程、教程或资源..." class="w-full px-4 py-3 pl-12 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all placeholder:text-[#B8C6D8]" />
          <i class="fa-solid fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-[#B8C6D8]"></i>
        </div>
      </div>
    </div>

    <div v-if="!routeId || !isDetailView">
      <div class="mb-6 text-center">
        <h1 class="text-3xl font-bold text-[#F5F7FA] mb-2">教程与资源</h1>
        <p class="text-[#B8C6D8] max-w-2xl mx-auto">学习摄影知识，下载实用资源，提升您的摄影技能</p>
      </div>

      <div class="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
        <div class="relative flex-1">
          <input type="text" v-model="searchQuery" placeholder="搜索教程..." class="w-full px-4 py-3 pl-12 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all placeholder:text-[#B8C6D8]" />
          <i class="fa-solid fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-[#B8C6D8]"></i>
        </div>
      </div>

      <div class="flex flex-wrap gap-2 mb-8">
        <button v-for="cat in categories" :key="cat" @click="activeCategory = cat" class="px-4 py-2 rounded-lg border transition-colors" :class="activeCategory === cat ? 'bg-[#4A5F8B] text-[#F5F7FA] border-[#4A5F8B]' : 'bg-[#2D3748] text-[#B8C6D8] border-[#4A5F8B] hover:bg-[#4A5F8B]/50'">{{ cat }}</button>
      </div>

      <div v-if="activeCategory === '全部' || activeCategory === '视频教程'" class="mb-12">
        <h2 class="text-2xl font-bold text-[#F5F7FA] mb-6">热门视频教程</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <router-link v-for="video in filteredVideoTutorials" :key="video.id" :to="`/tutorial-detail/${video.id}`" class="bg-[#2D3748] rounded-xl overflow-hidden border border-[#4A5F8B] transition-all shadow-sm block cursor-pointer">
            <div class="relative"><img :src="video.thumbnail" :alt="video.title" class="w-full h-48 object-cover" /><div class="absolute bottom-2 right-2 bg-[#1E2532]/80 text-[#F5F7FA] text-xs py-1 px-2 rounded">{{ video.duration }}</div></div>
            <div class="p-4"><h3 class="font-medium text-[#F5F7FA] mb-2 line-clamp-2">{{ video.title }}</h3><p class="text-sm text-[#B8C6D8] mb-3 line-clamp-2">{{ video.description }}</p><div class="flex items-center justify-between"><div class="text-sm text-[#4A5F8B]">{{ video.author }}</div><div class="text-sm text-[#6B7C93]">{{ video.views }}次观看</div></div></div>
          </router-link>
        </div>
        <div v-if="filteredVideoTutorials.length === 0" class="p-8 bg-[#2D3748] rounded-xl border border-[#4A5F8B] text-center">
          <div class="w-16 h-16 bg-[#1E2A3A] rounded-full flex items-center justify-center text-[#4A5F8B] mx-auto mb-4 border border-[#4A5F8B]"><i class="fa-solid fa-search-minus text-2xl"></i></div><h3 class="text-lg font-medium text-[#F5F7FA] mb-2">未找到相关视频</h3><p class="text-[#B8C6D8]">请尝试调整搜索条件或选择不同的分类</p>
        </div>
      </div>

      <div v-if="activeCategory === '全部' || activeCategory === '图文教程'" class="mb-12">
        <h2 class="text-2xl font-bold text-[#F5F7FA] mb-6">图文教程</h2>
        <div class="space-y-4">
          <div v-for="article in filteredArticleTutorials" :key="article.id" class="bg-[#2D3748] rounded-xl p-5 shadow-sm border border-[#4A5F8B]">
            <div class="md:flex"><div class="md:w-2/3"><h3 class="font-medium text-[#F5F7FA] mb-2">{{ article.title }}</h3><p class="text-sm text-[#B8C6D8] mb-4 line-clamp-2">{{ article.excerpt }}</p><div class="flex items-center justify-between"><div class="text-sm text-[#4A5F8B]">{{ article.author }}</div><span class="text-sm text-[#6B7C93]">{{ article.date }}</span></div></div><div class="md:w-1/3 mt-4 md:mt-0 md:ml-4"><img :src="article.thumbnail" :alt="article.title" class="w-full h-32 object-cover rounded" /></div></div>
          </div>
        </div>
      </div>

      <div v-if="activeCategory === '全部' || activeCategory === '资源下载'" class="mb-12">
        <h2 class="text-2xl font-bold text-[#F5F7FA] mb-6">资源下载</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="resource in filteredResources" :key="resource.id" class="bg-[#2D3748] rounded-xl p-5 shadow-sm border border-[#4A5F8B]">
            <div class="flex items-center mb-3"><div class="w-12 h-12 bg-[#1E2A3A] rounded flex items-center justify-center text-[#4A5F8B] mr-3"><i :class="resource.icon"></i></div><div><h3 class="font-medium text-[#F5F7FA]">{{ resource.title }}</h3><span class="text-xs px-2 py-1 bg-[#2D3748] text-[#B8C6D8] rounded-full border border-[#4A5F8B]">{{ resource.fileType }}</span></div></div>
            <p class="text-sm text-[#B8C6D8] mb-4 line-clamp-2">{{ resource.description }}</p>
            <div class="flex items-center justify-between"><span class="text-sm text-[#718096]">{{ resource.fileSize }} · {{ resource.downloads }}次下载</span><button @click="handleDownload(resource.id)" class="px-3 py-1.5 bg-[#4A5F8B] text-[#F5F7FA] rounded text-sm font-medium hover:bg-[#6B7C93] transition-colors">下载</button></div>
          </div>
        </div>
      </div>

      <div v-if="activeCategory === '全部' || activeCategory === '摄影书籍'" class="mb-12">
        <h2 class="text-2xl font-bold text-[#F5F7FA] mb-6">摄影书籍推荐</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="book in filteredBooks" :key="book.id" class="bg-[#2D3748] rounded-xl overflow-hidden border border-[#4A5F8B] transition-all shadow-sm">
            <img :src="book.coverImage" :alt="book.title" class="w-full h-64 object-cover" />
            <div class="p-5"><h3 class="text-lg font-bold text-[#F5F7FA] mb-2">{{ book.title }}</h3><p class="text-sm text-[#4A5F8B] mb-2">{{ book.author }}</p><p class="text-sm text-[#B8C6D8] mb-4 line-clamp-3">{{ book.description }}</p><div class="flex items-center justify-between mb-4"><span class="text-sm text-[#718096]">适合: {{ book.level }}</span><span class="text-sm text-[#4A5F8B]">评分: {{ book.rating }}</span></div><div class="text-sm text-[#718096] mb-4 flex flex-wrap space-x-2"><span v-for="tag in book.tags" :key="tag" class="px-2 py-1 bg-[#2D3748] rounded text-[#B8C6D8] text-xs">{{ tag }}</span></div><router-link :to="`/books/${book.id}`" class="w-full py-2 text-center bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors block">查看详情</router-link></div>
          </div>
        </div>
      </div>

      <div v-if="!routeId && searchQuery && !hasResults" class="p-8 bg-[#2D3748] rounded-xl border border-[#4A5F8B] text-center">
        <div class="w-16 h-16 bg-[#1E2A3A] rounded-full flex items-center justify-center text-[#4A5F8B] mx-auto mb-4 border border-[#4A5F8B]"><i class="fa-solid fa-search-minus text-2xl"></i></div><h3 class="text-lg font-medium text-[#F5F7FA] mb-2">未找到相关结果</h3><p class="text-[#B8C6D8]">请尝试调整搜索条件或选择不同的分类</p>
      </div>
    </div>

    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showDownloadModal" class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" @click.self="showDownloadModal = false">
          <div class="bg-[#2D3748] rounded-xl border border-[#4A5F8B] w-full max-w-md">
            <div class="flex justify-between items-center p-4 border-b border-[#4A5F8B]"><h3 class="text-lg font-bold text-[#F5F7FA]">下载资源</h3><button @click="showDownloadModal = false" class="text-[#B8C6D8] hover:text-[#F5F7FA]"><i class="fa-solid fa-times"></i></button></div>
            <div class="p-6"><p class="text-[#B8C6D8] mb-6">点击下方按钮开始下载选定的资源文件。</p><div class="flex justify-center space-x-3"><button @click="showDownloadModal = false" class="px-4 py-2 bg-[#1E2A3A] text-[#B8C6D8] rounded-lg hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors border border-[#4A5F8B]">取消</button><button @click="handleStartDownload" class="px-4 py-2 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors">确认下载</button></div></div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const routeId = computed(() => route.params.id as string | undefined);
const isDetailView = ref(false);

const searchQuery = ref('');
const activeCategory = ref('全部');
const showDownloadModal = ref(false);
const selectedDownloadId = ref('');

const categories = ['全部', '视频教程', '图文教程', '资源下载', '摄影书籍'];

const videoTutorials = [
  { id: 'vt1', title: '风光摄影基础入门', description: '从零开始学习风光摄影的基本技巧和构图方法', thumbnail: 'https://picsum.photos/1280/720?random=151', duration: '45:20', author: '国家地理摄影师张明', views: '1.2万', level: '初级', tags: ['风光','基础','入门'] },
  { id: 'vt2', title: '人像摄影用光技巧', description: '掌握人像摄影中光线运用的技巧，拍出自然生动的人像作品', thumbnail: 'https://picsum.photos/1280/720?random=152', duration: '38:15', author: '人像摄影师李华', views: '8.5k', level: '中级', tags: ['人像','光线','技巧'] },
  { id: 'vt3', title: '夜景摄影完全指南', description: '学会在低光环境下拍摄出色的夜景照片', thumbnail: 'https://picsum.photos/1280/720?random=153', duration: '52:30', author: '夜景摄影师王强', views: '6.8k', level: '进阶', tags: ['夜景','低光','技巧'] }
];

const articleTutorials = [
  { id: 'at1', title: 'RAW vs JPEG: 你应该选择哪个？', excerpt: '详细对比RAW和JPEG格式的优缺点，帮助您做出最佳选择', author: '摄影技术编辑小李', date: '2023-10-20', thumbnail: 'https://picsum.photos/800/600?random=154', tags: ['RAW','JPEG','格式'] },
  { id: 'at2', title: '黄金时间拍摄指南', excerpt: '了解如何在日出和日落时分捕捉最佳光线，拍摄出令人惊叹的照片', author: '风光摄影专家大卫', date: '2023-10-15', thumbnail: 'https://picsum.photos/800/600?random=155', tags: ['黄金时间','光线','风光'] }
];

const resources = [
  { id: 'r1', title: 'Lightroom预设包合集', description: '100款专业级Lightroom预设，适用于各种摄影风格', fileType: 'LR', fileSize: '125MB', downloads: 2340, icon: 'fa-solid fa-file-zipper', tags: ['Lightroom','预设','后期'] },
  { id: 'r2', title: 'Photoshop动作全集', description: '50款高效Photoshop动作，自动化常见修图流程', fileType: 'PS', fileSize: '89MB', downloads: 1890, icon: 'fa-solid fa-layer-group', tags: ['Photoshop','动作','效率'] }
];

const books = [
  { id: 'b1', title: '摄影构图学', author: '迈克尔·弗里曼', description: '系统介绍摄影构图的基本原则和技巧，帮助您提升作品的视觉表现力', rating: 4.8, level: '初中级', coverImage: 'https://picsum.photos/600/800?random=156', tags: ['构图','基础','必读'] },
  { id: 'b2', title: '美国摄影用光教程', author: '菲尔·亨特', description: '全面讲解摄影用光的原理和方法，从自然光到人工光', rating: 4.7, level: '中高级', coverImage: 'https://picsum.photos/600/800?random=157', tags: ['用光','闪光','影棚'] },
  { id: 'b3', title: '世界摄影史', author: '内奥米·罗森布拉姆', description: '全面回顾摄影艺术的发展历程，了解不同时期的重要摄影师和作品', rating: 4.9, level: '所有水平', coverImage: 'https://picsum.photos/600/800?random=158', tags: ['摄影史','艺术','经典'] }
];

const filteredVideoTutorials = computed(() => {
  if (!searchQuery.value) return videoTutorials;
  const q = searchQuery.value.toLowerCase();
  return videoTutorials.filter(v => v.title.toLowerCase().includes(q) || v.description.toLowerCase().includes(q) || v.author.toLowerCase().includes(q));
});

const filteredArticleTutorials = computed(() => {
  if (!searchQuery.value) return articleTutorials;
  const q = searchQuery.value.toLowerCase();
  return articleTutorials.filter(a => a.title.toLowerCase().includes(q) || a.excerpt.toLowerCase().includes(q) || a.author.toLowerCase().includes(q));
});

const filteredResources = computed(() => {
  if (!searchQuery.value) return resources;
  const q = searchQuery.value.toLowerCase();
  return resources.filter(r => r.title.toLowerCase().includes(q) || r.description.toLowerCase().includes(q));
});

const filteredBooks = computed(() => {
  if (!searchQuery.value) return books;
  const q = searchQuery.value.toLowerCase();
  return books.filter(b => b.title.toLowerCase().includes(q) || b.description.toLowerCase().includes(q) || b.author.toLowerCase().includes(q));
});

const hasResults = computed(() =>
  filteredVideoTutorials.value.length > 0 ||
  filteredArticleTutorials.value.length > 0 ||
  filteredResources.value.length > 0 ||
  filteredBooks.value.length > 0
);

function handleDownload(id: string) { selectedDownloadId.value = id; showDownloadModal.value = true; }
function handleStartDownload() { showDownloadModal.value = false; alert('下载完成'); }
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: opacity 0.3s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
</style>