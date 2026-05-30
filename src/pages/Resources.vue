<template>
  <div class="min-h-screen bg-[#1E2532]">
    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- 页面头部 -->
      <div class="page-header fade-in-up">
        <div class="header-content">
          <div>
            <h1 class="text-3xl font-bold text-white">资源中心</h1>
            <p class="text-[#B8C6D8] mt-2">发现和下载摄影相关的资源素材，提升你的创作效率</p>
          </div>
          <div class="header-actions">
            <Button variant="primary" @click="handleUpload">
              <i class="fa-solid fa-cloud-upload-alt mr-2"></i>
              <span>上传资源</span>
            </Button>
          </div>
        </div>
      </div>

      <!-- 统计数据卡片 -->
      <div class="stats-grid fade-in-up" style="animation-delay: 0.1s;">
        <div class="stat-card">
          <div class="stat-icon blue">
            <i class="fa-solid fa-layer-group"></i>
          </div>
          <div>
            <p class="stat-value">12,456</p>
            <p class="stat-label">资源总数</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon green">
            <i class="fa-solid fa-download"></i>
          </div>
          <div>
            <p class="stat-value">1.2M</p>
            <p class="stat-label">累计下载</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon purple">
            <i class="fa-solid fa-users"></i>
          </div>
          <div>
            <p class="stat-value">3,456</p>
            <p class="stat-label">贡献者</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon orange">
            <i class="fa-solid fa-star"></i>
          </div>
          <div>
            <p class="stat-value">4.8</p>
            <p class="stat-label">平均评分</p>
          </div>
        </div>
      </div>

      <!-- 主要内容区 -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <!-- 左侧主内容 -->
        <div class="lg:col-span-2 space-y-6">
          <!-- 搜索和筛选区 -->
          <div class="search-filter-section fade-in-up" style="animation-delay: 0.2s;">
            <div class="search-box">
              <i class="fa-solid fa-search search-icon"></i>
              <input
                type="text"
                v-model="searchQuery"
                placeholder="搜索资源名称、标签或描述..."
                class="search-input"
              />
            </div>
            <div class="filter-buttons">
              <button
                v-for="category in categories"
                :key="category.id"
                @click="activeCategory = category.id"
                class="filter-btn"
                :class="{ active: activeCategory === category.id }"
              >
                <i :class="category.icon" class="mr-2"></i>
                {{ category.name }}
              </button>
            </div>
          </div>

          <!-- 资源卡片网格 -->
          <div class="resources-grid fade-in-up" style="animation-delay: 0.3s;">
            <div
              v-for="(resource, index) in filteredResources"
              :key="resource.id"
              class="resource-card"
              :style="{ animationDelay: `${0.1 * index}s` }"
            >
              <div class="resource-icon">
                <i :class="['fa-solid text-2xl', resource.icon]"></i>
              </div>
              <div class="resource-content">
                <h3 class="resource-title">{{ resource.name }}</h3>
                <p class="resource-desc">{{ resource.description }}</p>
                <div class="resource-meta">
                  <span class="meta-item">
                    <i class="fa-solid fa-file-size"></i>
                    {{ resource.size }}
                  </span>
                  <span class="meta-item">
                    <i class="fa-solid fa-download"></i>
                    {{ formatNumber(resource.downloads) }} 下载
                  </span>
                  <span class="meta-item">
                    <i class="fa-solid fa-star"></i>
                    {{ resource.rating }}
                  </span>
                </div>
                <div class="resource-tags">
                  <span v-for="tag in resource.tags" :key="tag" class="tag">
                    {{ tag }}
                  </span>
                </div>
              </div>
              <div class="resource-actions">
                <Button size="sm" @click="handleDownload(resource)">
                  <i class="fa-solid fa-download mr-1"></i>
                  下载
                </Button>
                <button class="bookmark-btn" @click="handleBookmark(resource)">
                  <i :class="['fa-bookmark', bookmarkedIds.has(resource.id) ? 'fa-solid text-[#4A5F8B]' : 'fa-regular']"></i>
                </button>
              </div>
            </div>
          </div>

          <!-- 加载更多 -->
          <div class="load-more fade-in-up" style="animation-delay: 0.5s;">
            <Button variant="outline" @click="loadMore">
              <i class="fa-solid fa-spinner mr-2"></i>
              加载更多资源
            </Button>
          </div>
        </div>

        <!-- 右侧边栏 -->
        <div class="space-y-6">
          <!-- 热门资源 -->
          <div class="sidebar-section fade-in-up" style="animation-delay: 0.2s;">
            <h3 class="section-title">
              <i class="fa-solid fa-fire mr-2"></i>
              热门资源
            </h3>
            <div class="popular-list">
              <div
                v-for="(resource, index) in popularResources"
                :key="resource.id"
                class="popular-item"
              >
                <div class="popular-rank" :class="{ 'top-three': index < 3 }">
                  {{ index + 1 }}
                </div>
                <div class="popular-icon">
                  <i :class="['fa-solid', resource.icon]"></i>
                </div>
                <div class="popular-info">
                  <p class="popular-name">{{ resource.name }}</p>
                  <p class="popular-stats">{{ formatNumber(resource.downloads) }} 下载</p>
                </div>
              </div>
            </div>
            <button class="view-all-btn" @click="showInfo('查看全部热门资源')">
              查看全部 <i class="fa-solid fa-arrow-right ml-2"></i>
            </button>
          </div>

          <!-- 热门标签 -->
          <div class="sidebar-section fade-in-up" style="animation-delay: 0.3s;">
            <h3 class="section-title">
              <i class="fa-solid fa-tags mr-2"></i>
              热门标签
            </h3>
            <div class="tags-cloud">
              <router-link
                v-for="tag in popularTags"
                :key="tag.id"
                :to="`/resources?tag=${tag.name}`"
                class="tag-chip"
              >
                {{ tag.name }}
                <span class="tag-count">({{ tag.count }})</span>
              </router-link>
            </div>
          </div>

          <!-- 最新贡献者 -->
          <div class="sidebar-section fade-in-up" style="animation-delay: 0.4s;">
            <h3 class="section-title">
              <i class="fa-solid fa-user-plus mr-2"></i>
              最新贡献者
            </h3>
            <div class="contributors-list">
              <div
                v-for="contributor in recentContributors"
                :key="contributor.id"
                class="contributor-item"
              >
                <img :src="contributor.avatar" :alt="contributor.name" class="contributor-avatar" />
                <div class="contributor-info">
                  <p class="contributor-name">{{ contributor.name }}</p>
                  <p class="contributor-stats">{{ contributor.resources }} 资源</p>
                </div>
              </div>
            </div>
          </div>

          <!-- 升级VIP横幅 -->
          <div class="vip-banner fade-in-up" style="animation-delay: 0.5s;">
            <div class="vip-content">
              <div class="vip-icon">
                <i class="fa-solid fa-crown"></i>
              </div>
              <h3 class="vip-title">升级VIP会员</h3>
              <p class="vip-desc">解锁所有Premium资源，享受无限下载特权</p>
              <div class="vip-features">
                <div class="vip-feature">
                  <i class="fa-solid fa-check"></i>
                  <span>无限次下载</span>
                </div>
                <div class="vip-feature">
                  <i class="fa-solid fa-check"></i>
                  <span>独家Premium资源</span>
                </div>
                <div class="vip-feature">
                  <i class="fa-solid fa-check"></i>
                  <span>无广告体验</span>
                </div>
              </div>
              <Button class="vip-btn" @click="router.push('/membership')">
                立即升级
                <i class="fa-solid fa-arrow-right ml-2"></i>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useInteraction } from '../composables/useInteraction';
import Button from '../components/common/Button.vue';

const router = useRouter();
const { showInfo, handleUpload: doUpload, handleDownload: doDownload, handleBookmark: doBookmark, handleLoadMore: loadMore } = useInteraction();

const searchQuery = ref('');
const activeCategory = ref('all');
const bookmarkedIds = ref(new Set<string>());

const categories = [
  { id: 'all', name: '全部', icon: 'fa-layer-group' },
  { id: 'presets', name: '预设', icon: 'fa-sliders-h' },
  { id: 'templates', name: '模板', icon: 'fa-file-image' },
  { id: 'fonts', name: '字体', icon: 'fa-font' },
  { id: 'actions', name: '动作', icon: 'fa-magic' },
  { id: 'brushes', name: '笔刷', icon: 'fa-paint-brush' },
  { id: 'textures', name: '纹理', icon: 'fa-th' },
  { id: 'overlays', name: '叠层', icon: 'fa-images' }
];

const resources = ref([
  {
    id: '1',
    name: '电影色调LR预设包',
    description: '包含30种专业电影级色调的Lightroom预设，适合风光和人像摄影',
    icon: 'fa-image',
    size: '15.2 MB',
    downloads: 12456,
    rating: 4.9,
    category: 'presets',
    tags: ['LR预设', '电影色调', '风光', '人像'],
    premium: false
  },
  {
    id: '2',
    name: '日系小清新预设合集',
    description: '15款精选日系小清新色调预设，让照片更加清新自然',
    icon: 'fa-sun',
    size: '8.5 MB',
    downloads: 8934,
    rating: 4.8,
    category: 'presets',
    tags: ['日系', '小清新', '人像', '自然光'],
    premium: false
  },
  {
    id: '3',
    name: '婚礼相册PSD模板',
    description: '专业婚礼相册模板，包含20页精美设计，易于编辑',
    icon: 'fa-book',
    size: '245 MB',
    downloads: 6543,
    rating: 4.7,
    category: 'templates',
    tags: ['婚礼', '相册', 'PSD模板'],
    premium: true
  },
  {
    id: '4',
    name: '摄影作品集展示模板',
    description: '现代简约风格的摄影作品集模板，适合商业展示',
    icon: 'fa-folder-open',
    size: '156 MB',
    downloads: 5432,
    rating: 4.6,
    category: 'templates',
    tags: ['作品集', '展示', '商业'],
    premium: false
  },
  {
    id: '5',
    name: '优雅衬线字体包',
    description: '精选12款高端衬线字体，适合标题和海报设计',
    icon: 'fa-font',
    size: '32 MB',
    downloads: 23456,
    rating: 4.9,
    category: 'fonts',
    tags: ['衬线字体', '优雅', '标题'],
    premium: false
  },
  {
    id: '6',
    name: '手写艺术字体合集',
    description: '20款精美手写字体，为你的设计增添艺术感',
    icon: 'fa-pen-fancy',
    size: '45 MB',
    downloads: 18765,
    rating: 4.8,
    category: 'fonts',
    tags: ['手写', '艺术', '创意'],
    premium: true
  },
  {
    id: '7',
    name: '人像磨皮PS动作',
    description: '一键磨皮美肤动作，保留皮肤质感的同时提升照片效果',
    icon: 'fa-magic',
    size: '2.1 MB',
    downloads: 15678,
    rating: 4.7,
    category: 'actions',
    tags: ['人像', '磨皮', '美肤'],
    premium: false
  },
  {
    id: '8',
    name: '风光调色PS动作集',
    description: '30种专业风光调色动作，快速提升风景照片效果',
    icon: 'fa-mountain',
    size: '3.5 MB',
    downloads: 12345,
    rating: 4.6,
    category: 'actions',
    tags: ['风光', '调色', '风景'],
    premium: false
  }
]);

const popularResources = [
  { id: '1', name: '优雅衬线字体包', icon: 'fa-font', downloads: 23456 },
  { id: '2', name: '电影色调LR预设包', icon: 'fa-image', downloads: 12456 },
  { id: '3', name: '手写艺术字体合集', icon: 'fa-pen-fancy', downloads: 18765 },
  { id: '4', name: '人像磨皮PS动作', icon: 'fa-magic', downloads: 15678 },
  { id: '5', name: '日系小清新预设合集', icon: 'fa-sun', downloads: 8934 }
];

const popularTags = [
  { id: 1, name: 'LR预设', count: 2341 },
  { id: 2, name: 'PSD模板', count: 1856 },
  { id: 3, name: '字体', count: 1678 },
  { id: 4, name: '人像', count: 1245 },
  { id: 5, name: '风光', count: 1098 },
  { id: 6, name: '电影色调', count: 876 },
  { id: 7, name: '婚礼', count: 765 },
  { id: 8, name: '日系', count: 654 }
];

const recentContributors = [
  { id: '1', name: '设计达人', avatar: 'https://picsum.photos/400/400?random=301', resources: 45 },
  { id: '2', name: '光影大师', avatar: 'https://picsum.photos/400/400?random=302', resources: 38 },
  { id: '3', name: '创意工作室', avatar: 'https://picsum.photos/400/400?random=303', resources: 32 },
  { id: '4', name: '调色专家', avatar: 'https://picsum.photos/400/400?random=304', resources: 28 },
  { id: '5', name: '字体爱好者', avatar: 'https://picsum.photos/400/400?random=305', resources: 24 }
];

const filteredResources = computed(() => {
  let filtered = resources.value;
  
  if (activeCategory.value !== 'all') {
    filtered = filtered.filter(r => r.category === activeCategory.value);
  }
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(r => 
      r.name.toLowerCase().includes(query) || 
      r.description.toLowerCase().includes(query) ||
      r.tags.some(tag => tag.toLowerCase().includes(query))
    );
  }
  
  return filtered;
});

const formatNumber = (num: number) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

const handleUpload = () => {
  doUpload();
};

const handleDownload = (resource: any) => {
  doDownload(resource.name);
};

const handleBookmark = (resource: any) => {
  doBookmark(resource.name);
  if (bookmarkedIds.value.has(resource.id)) {
    bookmarkedIds.value.delete(resource.id);
  } else {
    bookmarkedIds.value.add(resource.id);
  }
  bookmarkedIds.value = new Set(bookmarkedIds.value);
};
</script>

<style scoped>
.fade-in-up {
  opacity: 0;
  animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.page-header {
  background: linear-gradient(135deg, rgba(74, 95, 139, 0.15) 0%, rgba(138, 80, 255, 0.1) 100%);
  border: 1px solid rgba(74, 95, 139, 0.3);
  border-radius: 20px;
  padding: 32px;
  margin-bottom: 24px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 16px;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.stat-card {
  background: #2D3748;
  border: 1px solid #4A5F8B;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px -8px rgba(74, 95, 139, 0.3);
}

.stat-icon {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  color: #F5F7FA;
}

.stat-icon.blue {
  background: linear-gradient(135deg, #4A5F8B, #3A4B6F);
}

.stat-icon.green {
  background: linear-gradient(135deg, #48BB78, #38A169);
}

.stat-icon.purple {
  background: linear-gradient(135deg, #8a50ff, #6b3fd4);
}

.stat-icon.orange {
  background: linear-gradient(135deg, #F6AD55, #DD6B20);
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #F5F7FA;
  margin: 0 0 4px 0;
}

.stat-label {
  font-size: 13px;
  color: #B8C6D8;
  margin: 0;
}

.search-filter-section {
  background: #2D3748;
  border: 1px solid #4A5F8B;
  border-radius: 16px;
  padding: 20px;
}

.search-box {
  position: relative;
  margin-bottom: 16px;
}

.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #B8C6D8;
  font-size: 16px;
}

.search-input {
  width: 100%;
  padding: 14px 16px 14px 48px;
  background: #1E2532;
  border: 1px solid #4A5F8B;
  color: #F5F7FA;
  border-radius: 12px;
  font-size: 14px;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #6B7C93;
  box-shadow: 0 0 0 3px rgba(74, 95, 139, 0.2);
}

.search-input::placeholder {
  color: #B8C6D8;
}

.filter-buttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 10px 18px;
  background: #1E2532;
  color: #B8C6D8;
  border: 1px solid rgba(74, 95, 139, 0.3);
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
}

.filter-btn:hover {
  color: #F5F7FA;
  background: rgba(74, 95, 139, 0.2);
  border-color: #4A5F8B;
}

.filter-btn.active {
  background: #4A5F8B;
  color: #F5F7FA;
  border-color: #4A5F8B;
  box-shadow: 0 4px 12px -4px rgba(74, 95, 139, 0.4);
}

.resources-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100%, 1fr));
  gap: 16px;
}

.resource-card {
  background: #2D3748;
  border: 1px solid #4A5F8B;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  gap: 16px;
  transition: all 0.3s ease;
}

.resource-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px -8px rgba(74, 95, 139, 0.3);
  border-color: #6B7C93;
}

.resource-icon {
  width: 64px;
  height: 64px;
  border-radius: 14px;
  background: linear-gradient(135deg, rgba(74, 95, 139, 0.3), rgba(74, 95, 139, 0.1));
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4A5F8B;
  flex-shrink: 0;
}

.resource-content {
  flex: 1;
  min-width: 0;
}

.resource-title {
  font-size: 16px;
  font-weight: 600;
  color: #F5F7FA;
  margin: 0 0 6px 0;
}

.resource-desc {
  font-size: 13px;
  color: #B8C6D8;
  margin: 0 0 12px 0;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.resource-meta {
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #B8C6D8;
}

.meta-item i {
  color: #4A5F8B;
}

.resource-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tag {
  padding: 4px 10px;
  background: rgba(74, 95, 139, 0.2);
  color: #4A5F8B;
  border-radius: 8px;
  font-size: 11px;
}

.resource-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-end;
}

.bookmark-btn {
  width: 36px;
  height: 36px;
  border: 1px solid rgba(74, 95, 139, 0.3);
  background: transparent;
  border-radius: 10px;
  color: #B8C6D8;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bookmark-btn:hover {
  background: rgba(74, 95, 139, 0.2);
  border-color: #4A5F8B;
  color: #4A5F8B;
}

.load-more {
  text-align: center;
  padding: 20px;
}

.sidebar-section {
  background: #2D3748;
  border: 1px solid #4A5F8B;
  border-radius: 16px;
  padding: 24px;
}

.section-title {
  font-size: 16px;
  font-weight: 700;
  color: #F5F7FA;
  margin: 0 0 20px 0;
  display: flex;
  align-items: center;
}

.section-title i {
  color: #4A5F8B;
}

.popular-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
}

.popular-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #1E2532;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.popular-item:hover {
  background: rgba(74, 95, 139, 0.2);
  transform: translateX(4px);
}

.popular-rank {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: rgba(74, 95, 139, 0.2);
  color: #B8C6D8;
  font-size: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.popular-rank.top-three {
  background: linear-gradient(135deg, #4A5F8B, #8a50ff);
  color: #F5F7FA;
}

.popular-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: rgba(74, 95, 139, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4A5F8B;
  flex-shrink: 0;
}

.popular-info {
  flex: 1;
  min-width: 0;
}

.popular-name {
  font-size: 13px;
  font-weight: 500;
  color: #F5F7FA;
  margin: 0 0 2px 0;
}

.popular-stats {
  font-size: 12px;
  color: #B8C6D8;
  margin: 0;
}

.view-all-btn {
  width: 100%;
  padding: 10px 16px;
  background: transparent;
  border: 1px solid rgba(74, 95, 139, 0.3);
  color: #4A5F8B;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.view-all-btn:hover {
  background: rgba(74, 95, 139, 0.1);
  border-color: #4A5F8B;
}

.tags-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-chip {
  padding: 8px 14px;
  background: rgba(74, 95, 139, 0.1);
  color: #B8C6D8;
  border: 1px solid #4A5F8B;
  border-radius: 20px;
  font-size: 13px;
  text-decoration: none;
  transition: all 0.3s ease;
}

.tag-chip:hover {
  background: #4A5F8B;
  color: #F5F7FA;
  transform: translateY(-2px);
}

.tag-count {
  color: #6B7C93;
  margin-left: 2px;
}

.contributors-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.contributor-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px;
  background: #1E2532;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.contributor-item:hover {
  background: rgba(74, 95, 139, 0.2);
  transform: translateX(4px);
}

.contributor-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #4A5F8B;
}

.contributor-info {
  flex: 1;
  min-width: 0;
}

.contributor-name {
  font-size: 14px;
  font-weight: 500;
  color: #F5F7FA;
  margin: 0 0 2px 0;
}

.contributor-stats {
  font-size: 12px;
  color: #B8C6D8;
  margin: 0;
}

.vip-banner {
  background: linear-gradient(135deg, rgba(246, 173, 85, 0.15) 0%, rgba(237, 137, 54, 0.1) 100%);
  border: 1px solid rgba(246, 173, 85, 0.3);
  border-radius: 16px;
  padding: 24px;
}

.vip-content {
  text-align: center;
}

.vip-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(135deg, #F6AD55, #ED8936);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  color: #F5F7FA;
  margin: 0 auto 16px;
}

.vip-title {
  font-size: 18px;
  font-weight: 700;
  color: #F5F7FA;
  margin: 0 0 8px 0;
}

.vip-desc {
  font-size: 13px;
  color: #B8C6D8;
  line-height: 1.6;
  margin: 0 0 20px 0;
}

.vip-features {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
  text-align: left;
}

.vip-feature {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  color: #F5F7FA;
}

.vip-feature i {
  color: #48BB78;
}

.vip-btn {
  width: 100%;
  background: linear-gradient(135deg, #F6AD55, #ED8936);
  border: none;
}

.vip-btn:hover {
  background: linear-gradient(135deg, #ED8936, #DD6B20);
}
</style>
