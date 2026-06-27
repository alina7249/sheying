<template>
  <div class="min-h-screen bg-[#0a0f1a] text-white">
    <!-- Premium Background Effects -->
    <div class="fixed inset-0 bg-gradient-to-br from-[#0a0f1a] via-[#0F1C2D] to-[#050810] pointer-events-none z-0"></div>
    <div class="fixed inset-0 opacity-[0.02] pointer-events-none z-0" style="background-image: url(&quot;data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E&quot;);"></div>
    
    <div class="relative z-10">
      <div class="max-w-7xl mx-auto px-4 py-12">
        <!-- Page Header -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <div class="flex items-center gap-3 mb-4">
              <span class="w-1 h-8 bg-gradient-to-b from-[#4A5F8B] to-[#63B3ED] rounded-full"></span>
              <span class="text-sm font-medium text-[#63B3ED] tracking-widest uppercase">在线课程</span>
            </div>
            <h1 class="text-4xl md:text-5xl font-bold text-white mb-3">专业摄影课程</h1>
            <p class="text-[#B8C6D8] text-lg">学习专业摄影知识，提升你的摄影技能，从入门到精通</p>
          </div>
          <div class="flex gap-3">
            <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id" :class="['px-6 py-3 rounded-xl font-medium transition-all duration-300', activeTab === tab.id ? 'bg-gradient-to-r from-[#4A5F8B] to-[#63B3ED] text-white shadow-lg shadow-[#4A5F8B]/30' : 'bg-[#1E2532] text-[#6B7C93] hover:text-white hover:bg-[#2D3748] border border-[#4A5F8B]/20']">
              {{ tab.name }}
            </button>
          </div>
        </div>

        <!-- Hero Banner -->
        <div class="mb-12 relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0F1C2D] via-[#4A5F8B]/15 to-[#0F1C2D] border border-[#4A5F8B]/20">
          <div class="absolute top-0 right-0 w-72 h-72 bg-[#4A5F8B]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div class="absolute bottom-0 left-0 w-56 h-56 bg-purple-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
          <div class="relative p-10 md:p-12">
            <div class="flex flex-col md:flex-row items-center gap-10">
              <div class="flex-1">
                <span class="inline-flex items-center gap-2 px-4 py-1.5 bg-[#4A5F8B]/20 text-[#63B3ED] rounded-full text-sm font-medium mb-5 border border-[#4A5F8B]/20">
                  <i class="fa-solid fa-gem text-xs"></i>
                  本周特惠
                </span>
                <h2 class="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">新用户首月会员，立享全部课程</h2>
                <p class="text-[#B8C6D8] mb-7 max-w-xl text-lg leading-relaxed">现在加入会员，解锁平台所有优质课程，无限次学习，持续更新中</p>
                <div class="flex flex-wrap gap-4">
                  <button @click="router.push('/membership')" class="px-8 py-4 bg-gradient-to-r from-[#4A5F8B] to-[#63B3ED] text-white rounded-xl font-medium hover:shadow-lg hover:shadow-[#4A5F8B]/30 transition-all duration-300">
                    立即开通
                  </button>
                  <button class="px-8 py-4 bg-[#1E2532]/80 text-white rounded-xl font-medium border border-[#4A5F8B]/30 hover:bg-[#2D3748] hover:border-[#4A5F8B]/60 transition-all duration-300">
                    了解更多
                  </button>
                </div>
              </div>
              <div class="flex-shrink-0">
                <div class="w-44 h-44 md:w-52 md:h-52 bg-gradient-to-br from-[#4A5F8B] via-[#5B6FA0] to-[#63B3ED] rounded-3xl flex items-center justify-center shadow-2xl shadow-[#4A5F8B]/20 rotate-3">
                  <i class="fa-solid fa-graduation-cap text-6xl md:text-7xl text-white"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Search & Filter -->
        <div class="flex flex-col sm:flex-row gap-4 mb-10">
          <div class="relative flex-1">
            <i class="fa-solid fa-search absolute left-5 top-1/2 transform -translate-y-1/2 text-[#6B7C93] text-lg"></i>
            <input type="text" v-model="searchTerm" placeholder="搜索课程、讲师…" class="w-full pl-14 pr-5 py-4 bg-[#1E2532] border border-[#4A5F8B]/20 text-white rounded-2xl placeholder-[#6B7C93] focus:outline-none focus:ring-2 focus:ring-[#4A5F8B]/50 focus:border-[#4A5F8B]/50 transition-all duration-300 text-lg" />
          </div>
          <select v-model="sortBy" class="px-5 py-4 bg-[#1E2532] border border-[#4A5F8B]/20 text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#4A5F8B]/50 transition-all duration-300 cursor-pointer text-lg">
            <option value="popular">最热门</option>
            <option value="newest">最新上线</option>
            <option value="rating">评分最高</option>
            <option value="price-low">价格从低到高</option>
            <option value="price-high">价格从高到低</option>
          </select>
        </div>

        <!-- Course Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <router-link v-for="course in filteredCourses" :key="course.id" :to="'/course-detail/' + course.id" class="group bg-gradient-to-br from-[#1E2532] to-[#2D3748] rounded-3xl overflow-hidden border border-[#4A5F8B]/20 hover:border-[#4A5F8B]/60 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#4A5F8B]/20 transition-all duration-500 cursor-pointer block overflow-hidden">
            <div class="relative">
              <img :src="course.cover" :alt="course.title" class="w-full h-52 object-cover group-hover:scale-110 transition-transform duration-500" />
              <div class="absolute top-4 left-4 flex gap-2">
                <span class="px-4 py-1.5 bg-[#4A5F8B] text-white text-xs font-semibold rounded-full">{{ course.category }}</span>
                <span v-if="course.isNew" class="px-4 py-1.5 bg-pink-500 text-white text-xs font-semibold rounded-full">新课</span>
                <span v-if="course.isHot" class="px-4 py-1.5 bg-orange-500 text-white text-xs font-semibold rounded-full">🔥 热门</span>
              </div>
              <button @click.stop="handleFavorite(course)" class="absolute top-4 right-4 w-12 h-12 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-all duration-300 hover:scale-110">
                <i :class="['fa-heart text-xl', favoriteIds.has(course.id) ? 'fa-solid text-red-400' : 'fa-regular']"></i>
              </button>
              <div class="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm px-4 py-1.5 rounded-full text-white text-sm flex items-center gap-1">
                <i class="fa-regular fa-clock mr-1"></i>
                {{ course.duration }}
              </div>
            </div>
            <div class="p-7">
              <div class="flex items-center gap-2 mb-4">
                <div class="flex">
                  <i v-for="i in 5" :key="i" :class="['fa-solid fa-star text-sm', i <= Math.floor(course.rating) ? 'text-yellow-400' : 'text-[#6B7C93]']"></i>
                </div>
                <span class="text-sm text-[#6B7C93] ml-2">({{ course.reviewCount }})</span>
              </div>
              <h3 class="text-xl font-bold text-white mb-3 group-hover:text-[#63B3ED] transition-colors duration-300">{{ course.title }}</h3>
              <p class="text-[#B8C6D8] text-sm mb-5 line-clamp-2 leading-relaxed">{{ course.description }}</p>
              <div class="flex items-center gap-6 mb-6 text-sm text-[#6B7C93]">
                <span class="flex items-center gap-1">
                  <i class="fa-solid fa-book mr-1"></i>
                  {{ course.lessonCount }}课时
                </span>
                <span class="flex items-center gap-1">
                  <i class="fa-solid fa-users mr-1"></i>
                  {{ course.studentCount.toLocaleString() }}学员
                </span>
              </div>
              <div class="flex items-center justify-between pt-5 border-t border-[#4A5F8B]/20">
                <div class="flex items-center gap-4">
                  <img :src="course.instructor.avatar" :alt="course.instructor.name" class="w-11 h-11 rounded-full border-2 border-[#4A5F8B]" />
                  <div>
                    <p class="text-sm text-white font-semibold">{{ course.instructor.name }}</p>
                    <p class="text-xs text-[#6B7C93]">{{ course.instructor.title }}</p>
                  </div>
                </div>
                <div class="text-right">
                  <span v-if="course.isFree" class="text-2xl font-bold text-green-400">免费</span>
                  <div v-else>
                    <span v-if="course.originalPrice" class="text-sm text-[#6B7C93] line-through mr-2">¥{{ course.originalPrice }}</span>
                    <span class="text-2xl font-bold text-[#63B3ED]">¥{{ course.price }}</span>
                  </div>
                </div>
              </div>
            </div>
          </router-link>
        </div>

        <!-- Empty State -->
        <div v-if="filteredCourses.length === 0" class="text-center py-20">
          <div class="w-24 h-24 bg-[#1E2532] rounded-full flex items-center justify-center text-[#63B3ED] mx-auto mb-6">
            <i class="fa-solid fa-search text-4xl"></i>
          </div>
          <h3 class="text-2xl font-semibold text-white mb-3">未找到相关课程</h3>
          <p class="text-[#B8C6D8] text-lg">请尝试调整搜索条件或筛选条件</p>
        </div>

        <!-- Pagination -->
        <div class="flex justify-center mt-12">
          <nav class="flex items-center gap-3 bg-[#1E2532] p-2 rounded-2xl border border-[#4A5F8B]/20">
            <button class="px-6 py-3 rounded-xl text-[#6B7C93] hover:bg-[#4A5F8B]/10 hover:text-white transition-all duration-300">
              <i class="fa-solid fa-chevron-left"></i>
            </button>
            <button class="px-6 py-3 rounded-xl bg-gradient-to-r from-[#4A5F8B] to-[#63B3ED] text-white font-semibold shadow-lg shadow-[#4A5F8B]/30">1</button>
            <button class="px-6 py-3 rounded-xl text-[#6B7C93] hover:bg-[#4A5F8B]/10 hover:text-white transition-all duration-300">2</button>
            <button class="px-6 py-3 rounded-xl text-[#6B7C93] hover:bg-[#4A5F8B]/10 hover:text-white transition-all duration-300">3</button>
            <span class="px-2 text-[#6B7C93]">…</span>
            <button class="px-6 py-3 rounded-xl text-[#6B7C93] hover:bg-[#4A5F8B]/10 hover:text-white transition-all duration-300">10</button>
            <button class="px-6 py-3 rounded-xl text-[#6B7C93] hover:bg-[#4A5F8B]/10 hover:text-white transition-all duration-300">
              <i class="fa-solid fa-chevron-right"></i>
            </button>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useInteraction } from '../composables/useInteraction';

const router = useRouter();
const { handleLike } = useInteraction();

const activeTab = ref('all');
const searchTerm = ref('');
const sortBy = ref('popular');
const favoriteIds = ref(new Set<string>());

const handleFavorite = (course: any) => {
  if (favoriteIds.value.has(course.id)) {
    favoriteIds.value.delete(course.id);
  } else {
    favoriteIds.value.add(course.id);
    handleLike(course.title);
  }
  favoriteIds.value = new Set(favoriteIds.value);
};

const tabs = [
  { id: 'all', name: '全部' },
  { id: 'beginner', name: '入门' },
  { id: 'advanced', name: '进阶' },
  { id: 'professional', name: '专业' }
];

const courses = ref([
  {
    id: '1',
    title: '摄影入门：从零开始学摄影',
    description: '适合完全零基础的摄影爱好者，从相机操作开始学起，掌握基础构图和曝光知识',
    cover: 'https://images.unsplash.com/photo-1452587929214-ed600ccbc127?w=1200&h=800&fit=crop',
    category: '入门',
    isFree: true,
    price: 0,
    originalPrice: null,
    duration: '3小时',
    lessonCount: 15,
    studentCount: 12543,
    rating: 4.8,
    reviewCount: 1256,
    isNew: true,
    isHot: false,
    instructor: { name: '摄影老师小王', avatar: 'https://picsum.photos/200/200?random=228', title: '资深讲师' }
  },
  {
    id: '2',
    title: '人像摄影技巧与实践',
    description: '深入学习人像摄影的光线运用、构图技巧和模特引导，拍出专业级人像作品',
    cover: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=1200&h=800&fit=crop',
    category: '进阶',
    isFree: false,
    price: 199,
    originalPrice: 299,
    duration: '8小时',
    lessonCount: 32,
    studentCount: 8923,
    rating: 4.9,
    reviewCount: 892,
    isNew: false,
    isHot: true,
    instructor: { name: '人像摄影师Lisa', avatar: 'https://picsum.photos/200/200?random=230', title: '国际人像摄影大师' }
  },
  {
    id: '3',
    title: '风光摄影大师班',
    description: '掌握风光摄影的黄金时段、构图法则和后期处理技巧，拍出震撼风光作品',
    cover: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&h=800&fit=crop',
    category: '专业',
    isFree: false,
    price: 399,
    originalPrice: 599,
    duration: '12小时',
    lessonCount: 45,
    studentCount: 5678,
    rating: 4.9,
    reviewCount: 678,
    isNew: false,
    isHot: true,
    instructor: { name: '风光摄影大师', avatar: 'https://picsum.photos/200/200?random=232', title: '国家地理签约摄影师' }
  },
  {
    id: '4',
    title: '后期修图：Lightroom完全指南',
    description: '系统学习Lightroom的使用，掌握专业后期修图技巧，让你的作品更出色',
    cover: 'https://images.unsplash.com/photo-1516035069371-05c8c2e8e0c2?w=1200&h=800&fit=crop',
    category: '进阶',
    isFree: false,
    price: 299,
    originalPrice: 399,
    duration: '10小时',
    lessonCount: 38,
    studentCount: 9876,
    rating: 4.7,
    reviewCount: 567,
    isNew: false,
    isHot: false,
    instructor: { name: '后期达人阿杰', avatar: 'https://picsum.photos/200/200?random=234', title: '资深后期师' }
  },
  {
    id: '5',
    title: '街头摄影：捕捉城市瞬间',
    description: '学习街头摄影的观察技巧、构图方法和抓拍技巧，记录城市的精彩瞬间',
    cover: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=1200&h=800&fit=crop',
    category: '进阶',
    isFree: true,
    price: 0,
    originalPrice: null,
    duration: '5小时',
    lessonCount: 20,
    studentCount: 7654,
    rating: 4.6,
    reviewCount: 432,
    isNew: false,
    isHot: false,
    instructor: { name: '街头摄影师阿强', avatar: 'https://picsum.photos/200/200?random=236', title: '人文纪实摄影师' }
  },
  {
    id: '6',
    title: '商业摄影实战课程',
    description: '从布光到后期，全面掌握商业产品摄影技巧，开启商业摄影之路',
    cover: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=800&fit=crop',
    category: '专业',
    isFree: false,
    price: 599,
    originalPrice: 799,
    duration: '15小时',
    lessonCount: 50,
    studentCount: 3456,
    rating: 4.9,
    reviewCount: 345,
    isNew: true,
    isHot: true,
    instructor: { name: '商业摄影总监', avatar: 'https://picsum.photos/200/200?random=238', title: '4A广告公司总监' }
  },
  {
    id: '7',
    title: '无人机摄影与航拍',
    description: '学习无人机操作和航拍技巧，从空中视角捕捉独特的风景',
    cover: 'https://images.unsplash.com/photo-1473968512645-714ba06b306b?w=1200&h=800&fit=crop',
    category: '专业',
    isFree: false,
    price: 449,
    originalPrice: 599,
    duration: '8小时',
    lessonCount: 28,
    studentCount: 4567,
    rating: 4.8,
    reviewCount: 234,
    isNew: true,
    isHot: false,
    instructor: { name: '航拍专家', avatar: 'https://picsum.photos/200/200?random=240', title: '职业航拍师' }
  },
  {
    id: '8',
    title: '静物摄影入门到精通',
    description: '系统学习静物摄影的布光、构图和拍摄技巧，适合电商和产品摄影师',
    cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&h=800&fit=crop',
    category: '进阶',
    isFree: false,
    price: 249,
    originalPrice: 349,
    duration: '7小时',
    lessonCount: 25,
    studentCount: 6789,
    rating: 4.7,
    reviewCount: 345,
    isNew: false,
    isHot: false,
    instructor: { name: '静物摄影大师', avatar: 'https://picsum.photos/200/200?random=242', title: '电商摄影专家' }
  },
  {
    id: '9',
    title: '手机摄影入门',
    description: '用手机也能拍出大片！学习手机摄影的构图、光线和后期技巧',
    cover: 'https://images.unsplash.com/photo-1512499617640-c3f3580e100c?w=1200&h=800&fit=crop',
    category: '入门',
    isFree: true,
    price: 0,
    originalPrice: null,
    duration: '4小时',
    lessonCount: 18,
    studentCount: 15678,
    rating: 4.5,
    reviewCount: 890,
    isNew: false,
    isHot: true,
    instructor: { name: '手机摄影达人', avatar: 'https://picsum.photos/200/200?random=244', title: '华为合作摄影师' }
  }
]);

const filteredCourses = computed(() => {
  let filtered = courses.value;
  
  if (activeTab.value !== 'all') {
    filtered = filtered.filter(course => {
      if (activeTab.value === 'beginner') return course.category === '入门';
      if (activeTab.value === 'advanced') return course.category === '进阶';
      if (activeTab.value === 'professional') return course.category === '专业';
      return true;
    });
  }
  
  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase();
    filtered = filtered.filter(course => 
      course.title.toLowerCase().includes(term) || 
      course.description.toLowerCase().includes(term) ||
      course.instructor.name.toLowerCase().includes(term)
    );
  }
  
  if (sortBy.value === 'popular') {
    filtered = [...filtered].sort((a, b) => b.studentCount - a.studentCount);
  } else if (sortBy.value === 'newest') {
    filtered = [...filtered].sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
  } else if (sortBy.value === 'rating') {
    filtered = [...filtered].sort((a, b) => b.rating - a.rating);
  } else if (sortBy.value === 'price-low') {
    filtered = [...filtered].sort((a, b) => a.price - b.price);
  } else if (sortBy.value === 'price-high') {
    filtered = [...filtered].sort((a, b) => b.price - a.price);
  }
  
  return filtered;
});
</script>

<style scoped>
@media (prefers-reduced-motion: reduce) {
  .group {
    transition: none;
  }

  .group:hover {
    transform: none;
  }

  .group-hover\:scale-110 {
    transform: none;
  }
}
</style>
