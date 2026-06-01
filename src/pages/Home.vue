<template>
  <div class="home-page">
    <div class="grain-overlay"></div>
    
    <div class="container mx-auto px-4 py-8">
      <Banner />

      <!-- 摄影天气与摄影建议 -->
      <div class="weather-widget fade-in-up" style="animation-delay: 0.2s;">
        <div class="weather-header">
          <div class="location-info">
            <div class="location-icon">
              <i class="fa-solid fa-cloud-sun"></i>
            </div>
            <div>
              <h3 class="location-name">北京市 - 今天</h3>
              <p class="location-time">2025年11月17日 17:41</p>
            </div>
          </div>
          <div class="temp-display">
            <span class="current-temp">15°C</span>
            <div class="temp-range">
              <div class="temp-item">
                <i class="fa-solid fa-temperature-low" aria-hidden="true"></i>
                <span>10°C</span>
              </div>
              <span class="temp-divider">/</span>
              <div class="temp-item">
                <i class="fa-solid fa-temperature-high"></i>
                <span>18°C</span>
              </div>
            </div>
          </div>
        </div>

        <div class="weather-grid">
          <div class="weather-stat-card">
            <div class="stat-icon">
              <i class="fa-solid fa-tint" aria-hidden="true"></i>
            </div>
            <div class="stat-info">
              <p class="stat-label">湿度</p>
              <p class="stat-value">45%</p>
            </div>
          </div>
          <div class="weather-stat-card">
            <div class="stat-icon">
              <i class="fa-solid fa-wind" aria-hidden="true"></i>
            </div>
            <div class="stat-info">
              <p class="stat-label">风速</p>
              <p class="stat-value">3级</p>
            </div>
          </div>
          <div class="weather-stat-card">
            <div class="stat-icon">
              <i class="fa-solid fa-sun" aria-hidden="true"></i>
            </div>
            <div class="stat-info">
              <p class="stat-label">紫外线</p>
              <p class="stat-value">弱</p>
            </div>
          </div>
          <div class="weather-stat-card">
            <div class="stat-icon">
              <i class="fa-solid fa-sunrise" aria-hidden="true"></i>
            </div>
            <div class="stat-info">
              <p class="stat-label">日出日落</p>
              <p class="stat-value">06:58/17:05</p>
            </div>
          </div>
        </div>

        <div class="photo-tip-section">
          <div class="tip-header">
            <i class="fa-solid fa-lightbulb" aria-hidden="true"></i>
            <h4>今日摄影建议</h4>
          </div>
          <p class="tip-text">
            今日天气晴朗，微风，非常适合户外摄影。下午光线柔和，是拍摄人像和风光的黄金时段。
          </p>
          <div class="tip-ratings">
            <div class="rating-item" v-for="(rating, index) in photoRatings" :key="index">
              <p class="rating-label">{{ rating.label }}</p>
              <div class="stars">
                <i 
                  v-for="star in 5" 
                  :key="star" 
                  :class="['fa-solid fa-star', star <= rating.value ? 'star-filled' : 'star-empty']"
                  aria-hidden="true"
                ></i>
              </div>
            </div>
          </div>
        </div>

        <div class="forecast-section">
          <h4 class="forecast-title">未来天气预报</h4>
          <div class="forecast-scroll">
            <div
              v-for="(day, index) in dailyForecast"
              :key="index"
              class="forecast-card"
            >
              <p class="forecast-day">{{ day.day }}</p>
              <div class="forecast-icon">
                <i :class="['fa-solid', day.icon]" aria-hidden="true"></i>
              </div>
              <p class="forecast-weather">{{ day.weather }}</p>
              <p class="forecast-temp">{{ day.temp }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 特色功能区 -->
      <Feature />

      <!-- 精选专题 -->
      <div class="section-header fade-in-up" style="animation-delay: 0.35s;">
        <div class="section-title-wrapper">
          <h2 class="section-title">精选专题</h2>
          <div class="title-line"></div>
        </div>
        <p class="section-subtitle">探索精心策划的摄影主题</p>
      </div>
      
      <div class="featured-topics fade-in-up" style="animation-delay: 0.4s;">
        <div v-for="(topic, index) in featuredTopics" :key="topic.id" class="topic-card" :style="{ animationDelay: `${index * 0.1}s` }" role="button" tabindex="0" @click="router.push(`/topics/${topic.id}`)" @keydown.enter="router.push(`/topics/${topic.id}`)">
          <LazyImage :src="topic.image" :alt="topic.title" class="topic-image" />
          <div class="topic-overlay">
            <div class="topic-content">
              <span class="topic-badge">{{ topic.badge }}</span>
              <h3 class="topic-title">{{ topic.title }}</h3>
              <p class="topic-desc">{{ topic.description }}</p>
              <div class="topic-meta">
                <span><i class="fa-solid fa-images" aria-hidden="true"></i> {{ topic.photos }} 作品</span>
                <span><i class="fa-solid fa-users" aria-hidden="true"></i> {{ topic.photographers }} 摄影师</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 灵感专栏 -->
      <div class="section-header fade-in-up" style="animation-delay: 0.5s;">
        <div class="section-title-wrapper">
          <h2 class="section-title">灵感专栏</h2>
          <div class="title-line"></div>
        </div>
        <p class="section-subtitle">探索来自全球摄影师的创意灵感</p>
      </div>

      <div class="inspiration-scroll fade-in-up" style="animation-delay: 0.6s;">
        <div
          v-for="(item, index) in inspirationItems"
          :key="item.id"
          class="inspiration-card"
          :style="{ animationDelay: `${index * 0.1}s` }"
          role="button"
          tabindex="0"
          @click="router.push(`/inspiration/${item.id}`)"
          @keydown.enter="router.push(`/inspiration/${item.id}`)"
        >
          <div class="inspiration-image-wrapper">
            <LazyImage :src="item.image" :alt="item.title" />
            <div class="inspiration-overlay">
              <div class="overlay-content">
                <span class="inspiration-tag">创意灵感</span>
              </div>
            </div>
          </div>
          <div class="inspiration-content">
            <h3 class="inspiration-title">{{ item.title }}</h3>
            <p class="inspiration-desc">{{ item.description }}</p>
            <div class="inspiration-footer">
              <span class="author-name">by {{ item.author }}</span>
              <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- 活跃活动横幅 -->
      <div class="promo-banner fade-in-up cursor-pointer" style="animation-delay: 0.7s;" role="button" tabindex="0" @click="router.push('/membership')" @keydown.enter="router.push('/membership')">
        <div class="promo-content">
          <div class="promo-text">
            <span class="promo-badge">🎉 热门活动</span>
            <h2 class="promo-title">2023秋季风光摄影大赛</h2>
            <p class="promo-desc">参与大赛赢取丰厚奖金和专业摄影器材，展示你的摄影才华</p>
            <div class="promo-stats">
              <div class="stat">
                <span class="stat-num">1,256</span>
                <span class="stat-label">参赛者</span>
              </div>
              <div class="stat">
                <span class="stat-num">¥5,000</span>
                <span class="stat-label">一等奖</span>
              </div>
              <div class="stat">
                <span class="stat-num">15</span>
                <span class="stat-label">天倒计时</span>
              </div>
            </div>
            <Button variant="primary" class="promo-btn" @click.stop="handleJoin">
              立即参与
              <i class="fa-solid fa-arrow-right ml-2" aria-hidden="true"></i>
            </Button>
          </div>
          <div class="promo-image">
            <LazyImage src="https://picsum.photos/800/600?random=300" alt="摄影大赛" />
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2">
          <div class="filter-section fade-in-up" style="animation-delay: 0.8s;">
            <div class="filter-buttons">
              <button
                v-for="(category, index) in categories"
                :key="category.id"
                @click="selectedCategory = category.id"
                :class="['filter-btn', { active: selectedCategory === category.id }]"
                :aria-pressed="selectedCategory === category.id"
              >
                {{ category.name }}
              </button>
            </div>
          </div>

          <div class="photo-grid">
            <div
              v-for="(post, index) in filteredPosts"
              :key="post.id"
              class="photo-card-wrapper fade-in-up"
              :style="{ animationDelay: `${0.9 + index * 0.1}s` }"
            >
              <PhotographyCard :post="post" />
            </div>
          </div>

          <div class="load-more-section fade-in-up" style="animation-delay: 1.4s;">
            <Button variant="outline" @click="handleLoadMore" ariaLabel="加载更多摄影作品">
              <i class="fa-solid fa-inbox mr-2"></i>
              加载更多作品
            </Button>
          </div>
        </div>

        <div class="lg:col-span-1 space-y-8">
          <div class="search-section fade-in-up" style="animation-delay: 1s;">
            <div class="search-wrapper">
              <i class="fa-solid fa-search search-icon" aria-hidden="true"></i>
              <input
                type="search"
                name="search"
                autocomplete="off"
                v-model="searchQuery"
                placeholder="搜索作品、摄影师或风格…"
                class="search-input"
              />
            </div>
          </div>

          <div class="sidebar-card fade-in-up" style="animation-delay: 1.1s;">
            <h3 class="sidebar-title">
              <i class="fa-solid fa-fire mr-2" aria-hidden="true"></i>
              热门风格
            </h3>
            <div class="tags-cloud">
              <router-link
                v-for="tag in popularTags"
                :key="tag.id"
                :to="`/search?tag=${tag.name}`"
                class="tag-chip"
              >
                #{{ tag.name }}
                <span class="tag-count">({{ tag.count }})</span>
              </router-link>
            </div>
          </div>

          <div class="sidebar-card fade-in-up" style="animation-delay: 1.2s;">
            <h3 class="sidebar-title">
              <i class="fa-solid fa-trophy mr-2" aria-hidden="true"></i>
              本周新星
            </h3>
            <div class="leaderboard">
              <div v-for="(user, index) in weeklyLeaders" :key="user.id" class="leader-item">
                <div class="leader-rank" :class="{'top-three': index < 3}">
                  <span v-if="index < 3">{{ index + 1 }}</span>
                  <i v-else class="fa-solid fa-user" aria-hidden="true"></i>
                </div>
                <img :src="user.avatar" :alt="user.name" class="leader-avatar" />
                <div class="leader-info">
                  <p class="leader-name">{{ user.name }}</p>
                  <p class="leader-stats">{{ user.likes }} 获赞</p>
                </div>
              </div>
            </div>
          </div>

          <div class="sidebar-card fade-in-up" style="animation-delay: 1.3s;">
            <h3 class="sidebar-title">
              <i class="fa-solid fa-users mr-2" aria-hidden="true"></i>
              推荐艺术家
            </h3>
            <div class="photographers-list">
              <div v-for="photographer in featuredPhotographers" :key="photographer.id" class="photographer-item" role="button" tabindex="0" @click="router.push(`/profile/${photographer.id}`)" @keydown.enter="router.push(`/profile/${photographer.id}`)">
                <div class="photographer-info">
                  <img
                    :src="photographer.avatar"
                    :alt="photographer.name"
                    class="photographer-avatar"
                  />
                  <div class="photographer-details">
                    <p class="photographer-name">{{ photographer.name }}</p>
                    <span class="photographer-level">{{ photographer.level }}</span>
                    <p class="photographer-stats">
                      {{ photographer.followers.toLocaleString() }}粉丝 · {{ photographer.posts }}作品
                    </p>
                  </div>
                </div>
                <Button variant="primary" size="sm" @click="handleFollow(photographer.name)">
                  关注
                </Button>
              </div>
            </div>
          </div>

          <div class="sidebar-card special-card fade-in-up" style="animation-delay: 1.4s;">
            <div class="special-content">
              <h3 class="special-title">黑白影像专题</h3>
              <p class="special-desc">探索黑白摄影的艺术魅力，感受光影交织的视觉语言和情感表达</p>
              <div class="special-image-wrapper">
                <LazyImage src="https://picsum.photos/800/600?random=207" alt="黑白影像专题" />
              </div>
              <Button variant="primary" class="special-btn" @click="handleJoin">
                探索专题
                <i class="fa-solid fa-arrow-right ml-2" aria-hidden="true"></i>
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
import Banner from '../components/Banner.vue';
import Feature from '../components/Feature.vue';
import PhotographyCard from '../components/PhotographyCard.vue';
import Button from '../components/common/Button.vue';
import LazyImage from '../components/LazyImage.vue';
import '../components/Animations.vue';

const categories = [
  { id: 'all', name: '全部' },
  { id: '极简主义', name: '极简主义' },
  { id: '黑白', name: '黑白' },
  { id: '胶片', name: '胶片质感' },
  { id: '暗调', name: '暗调氛围' }
];

const photoRatings = [
  { label: '风光摄影', value: 4 },
  { label: '人像摄影', value: 5 },
  { label: '街拍', value: 4 },
  { label: '夜景摄影', value: 3 }
];

const photographyPosts = [
  {
    id: '1',
    title: '黑白光影',
    description: 'Leica Q2 Monochrom | 光圈: f/2.8 | 快门: 1/125s | ISO: 800\n极简主义黑白摄影，通过光影对比展现建筑的几何美感。',
    image: 'https://picsum.photos/1280/720?random=208',
    author: {
      id: '1',
      name: '极简摄影师林风',
      avatar: 'https://picsum.photos/400/400?random=209'
    },
    likes: 342,
    comments: 42,
    collections: 28,
    tags: ['极简主义', '黑白', '建筑', '徕卡'],
    date: '2023-10-25'
  },
  {
    id: '2',
    title: '胶片质感人像',
    description: 'Canon AE-1 + 50mm f/1.4 | 光圈: f/2.0 | 快门: 1/125s | ISO: 400\n使用复古胶片相机拍摄的人像作品，自然柔和的色调与颗粒感。',
    image: 'https://picsum.photos/600/800?random=210',
    author: {
      id: '2',
      name: '胶片摄影师安娜',
      avatar: 'https://picsum.photos/400/400?random=211'
    },
    likes: 412,
    comments: 56,
    collections: 35,
    tags: ['人像', '胶片', '复古', '自然光'],
    date: '2023-10-24'
  },
  {
    id: '3',
    title: '暗调氛围',
    description: 'Sony A7R IV + 35mm f/1.4 GM | 光圈: f/2.8 | 快门: 1/60s | ISO: 1600\n营造神秘而富有故事感的暗调氛围人像，强调光影层次与情绪表达。',
    image: 'https://picsum.photos/800/600?random=212',
    author: {
      id: '3',
      name: '情绪摄影师李明',
      avatar: 'https://picsum.photos/400/400?random=213'
    },
    likes: 389,
    comments: 49,
    collections: 31,
    tags: ['暗调', '氛围', '情绪', '人像'],
    date: '2023-10-23'
  },
  {
    id: '4',
    title: '极简静物',
    description: 'Fujifilm GFX 100S + 120mm f/4 Macro | 光圈: f/5.6 | 快门: 1/125s | ISO: 200\n通过简洁的构图和柔和的光线，展现日常物品的质感与美感。',
    image: 'https://picsum.photos/400/400?random=214',
    author: {
      id: '4',
      name: '静物摄影师王静',
      avatar: 'https://picsum.photos/400/400?random=215'
    },
    likes: 276,
    comments: 32,
    collections: 22,
    tags: ['静物', '极简', '中画幅', '富士'],
    date: '2023-10-22'
  },
  {
    id: '5',
    title: '城市几何',
    description: 'iPhone 15 Pro + 原生相机 | 光圈: f/2.2 | 快门: 1/1000s | ISO: 25\n从独特视角发现城市中的几何美感，手机摄影也能创造艺术作品。',
    image: 'https://picsum.photos/1280/720?random=216',
    author: {
      id: '5',
      name: '手机摄影师张强',
      avatar: 'https://picsum.photos/400/400?random=217'
    },
    likes: 321,
    comments: 41,
    collections: 25,
    tags: ['城市', '几何', '手机摄影', '极简'],
    date: '2023-10-21'
  },
  {
    id: '6',
    title: '黑白纪实',
    description: 'Canon EOS R6 + 24-70mm f/2.8 | 光圈: f/4 | 快门: 1/250s | ISO: 800\n用黑白影像记录城市中的人文瞬间，展现生活的真实与温度。',
    image: 'https://picsum.photos/1280/720?random=218',
    author: {
      id: '6',
      name: '纪实摄影师陈默',
      avatar: 'https://picsum.photos/400/400?random=219'
    },
    likes: 398,
    comments: 52,
    collections: 33,
    tags: ['黑白', '纪实', '人文', '街头'],
    date: '2023-10-20'
  }
];

const popularTags = [
  { id: 1, name: '极简主义', count: 1456 },
  { id: 2, name: '黑白', count: 1245 },
  { id: 3, name: '胶片质感', count: 987 },
  { id: 4, name: '暗调氛围', count: 765 },
  { id: 5, name: '建筑', count: 654 },
  { id: 6, name: '人像', count: 543 },
  { id: 7, name: '城市几何', count: 432 },
  { id: 8, name: '静物', count: 321 }
];

const featuredPhotographers = [
  {
    id: '101',
    name: '黑白影像达人',
    avatar: 'https://picsum.photos/400/400?random=220',
    followers: 12543,
    posts: 324,
    level: '新锐艺术家'
  },
  {
    id: '102',
    name: '胶片艺术师',
    avatar: 'https://picsum.photos/400/400?random=221',
    followers: 8765,
    posts: 213,
    level: '资深摄影师'
  },
  {
    id: '103',
    name: '建筑几何控',
    avatar: 'https://picsum.photos/400/400?random=222',
    followers: 6543,
    posts: 187,
    level: '创意摄影师'
  }
];

const inspirationItems = [
  {
    id: '1',
    title: '黑白摄影的光影艺术',
    author: '林风',
    description: '探索如何通过光影对比创造出富有情感和深度的黑白影像作品...',
    image: 'https://picsum.photos/600/800?random=223'
  },
  {
    id: '2',
    title: '胶片摄影的复兴与现代应用',
    author: '安娜',
    description: '探讨胶片摄影在数字时代的独特魅力和应用场景，以及如何将传统技术融入现代创作...',
    image: 'https://picsum.photos/600/800?random=224'
  },
  {
    id: '3',
    title: '极简主义摄影的构图法则',
    author: '李明',
    description: '解析极简主义摄影的核心构图原则，帮助你创造简洁而有力的视觉表达...',
    image: 'https://picsum.photos/600/800?random=225'
  },
  {
    id: '4',
    title: '暗房技术与现代数字暗房',
    author: '张强',
    description: '比较传统暗房技术与现代数字暗房的异同，以及如何在后期制作中保留胶片质感...',
    image: 'https://picsum.photos/600/800?random=226'
  }
];

const dailyForecast = [
  { day: '明天', weather: '多云', temp: '12°/17°', icon: 'fa-cloud' },
  { day: '周一', weather: '晴', temp: '10°/19°', icon: 'fa-sun' },
  { day: '周二', weather: '晴转多云', temp: '9°/18°', icon: 'fa-cloud-sun' },
  { day: '周三', weather: '小雨', temp: '8°/15°', icon: 'fa-cloud-rain' },
  { day: '周四', weather: '阴', temp: '7°/14°', icon: 'fa-cloud' }
];

const featuredTopics = [
  {
    id: '1',
    title: '城市风光摄影',
    description: '捕捉都市天际线的独特魅力',
    badge: '热门专题',
    photos: 2847,
    photographers: 456,
    image: 'https://picsum.photos/800/600?random=250'
  },
  {
    id: '2',
    title: '自然生态',
    description: '探索大自然的奇妙生灵',
    badge: '精选',
    photos: 1923,
    photographers: 312,
    image: 'https://picsum.photos/800/600?random=251'
  },
  {
    id: '3',
    title: '人像艺术',
    description: '用镜头讲述人物故事',
    badge: '精选',
    photos: 3456,
    photographers: 567,
    image: 'https://picsum.photos/800/600?random=252'
  }
];

const weeklyLeaders = [
  { id: '1', name: '光影魔法师', avatar: 'https://picsum.photos/400/400?random=280', likes: 3456 },
  { id: '2', name: '瞬间捕手', avatar: 'https://picsum.photos/400/400?random=281', likes: 2890 },
  { id: '3', name: '色彩大师', avatar: 'https://picsum.photos/400/400?random=282', likes: 2456 },
  { id: '4', name: '城市漫步者', avatar: 'https://picsum.photos/400/400?random=283', likes: 1890 },
  { id: '5', name: '自然探索者', avatar: 'https://picsum.photos/400/400?random=284', likes: 1567 }
];

const router = useRouter();
const { handleFollow, handleJoin, handleLoadMore: loadMore } = useInteraction();

const searchQuery = ref('');
const selectedCategory = ref('all');

const filteredPosts = computed(() => {
  if (selectedCategory.value === 'all') {
    return photographyPosts;
  }
  return photographyPosts.filter(post => post.tags.includes(selectedCategory.value));
});

const handleLoadMore = () => {
  loadMore();
};
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  background: #1E2532;
  position: relative;
  overflow-x: hidden;
}

.grain-overlay {
  position: fixed;
  inset: 0;
  pointer-events: none;
  opacity: 0.04;
  z-index: 1;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
}

.home-page > .container {
  position: relative;
  z-index: 2;
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

.weather-widget {
  background: linear-gradient(135deg, #2D3748 0%, #1E2532 100%);
  border: 1px solid #4A5F8B;
  border-radius: 20px;
  padding: 28px;
  margin-bottom: 40px;
  box-shadow: 0 10px 40px -12px rgba(74, 95, 139, 0.2);
}

.weather-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 20px;
}

.location-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.location-icon {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4A5F8B, #3A4B6F);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #F5F7FA;
  font-size: 24px;
}

.location-name {
  font-size: 20px;
  font-weight: 700;
  color: #F5F7FA;
  margin: 0 0 4px 0;
}

.location-time {
  font-size: 14px;
  color: #B8C6D8;
  margin: 0;
}

.temp-display {
  display: flex;
  align-items: center;
  gap: 20px;
}

.current-temp {
  font-size: 48px;
  font-weight: 700;
  color: #F5F7FA;
  line-height: 1;
}

.temp-range {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #B8C6D8;
  font-size: 14px;
}

.temp-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.temp-divider {
  color: #4A5F8B;
}

.weather-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.weather-stat-card {
  background: #1E2532;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: transform 0.3s ease, background-color 0.3s ease;
}

.weather-stat-card:hover {
  transform: translateY(-2px);
  background: rgba(74, 95, 139, 0.2);
}

.stat-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: linear-gradient(135deg, #4A5F8B, #3A4B6F);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #F5F7FA;
  font-size: 16px;
}

.stat-label {
  font-size: 12px;
  color: #B8C6D8;
  margin: 0 0 2px 0;
}

.stat-value {
  font-size: 16px;
  font-weight: 600;
  color: #F5F7FA;
  margin: 0;
}

.photo-tip-section {
  background: #1E2532;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
}

.tip-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.tip-header i {
  color: #4A5F8B;
  font-size: 18px;
}

.tip-header h4 {
  font-size: 15px;
  font-weight: 600;
  color: #F5F7FA;
  margin: 0;
}

.tip-text {
  font-size: 14px;
  color: #B8C6D8;
  line-height: 1.6;
  margin: 0 0 16px 0;
}

.tip-ratings {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
}

.rating-item {
  text-align: center;
  padding: 12px;
  background: rgba(74, 95, 139, 0.1);
  border: 1px solid #4A5F8B;
  border-radius: 10px;
}

.rating-label {
  font-size: 11px;
  color: #B8C6D8;
  margin: 0 0 8px 0;
}

.stars {
  display: flex;
  justify-content: center;
  gap: 2px;
}

.star-filled {
  color: #4A5F8B;
  font-size: 12px;
}

.star-empty {
  color: #1E2532;
  font-size: 12px;
}

.forecast-section {
  border-top: 1px solid rgba(74, 95, 139, 0.2);
  padding-top: 20px;
}

.forecast-title {
  font-size: 15px;
  font-weight: 600;
  color: #F5F7FA;
  margin: 0 0 16px 0;
}

.forecast-scroll {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding-bottom: 8px;
  scrollbar-width: none;
}

.forecast-scroll::-webkit-scrollbar {
  display: none;
}

.forecast-card {
  flex-shrink: 0;
  width: 88px;
  background: #1E2532;
  border-radius: 12px;
  padding: 16px 12px;
  text-align: center;
  transition: transform 0.3s ease, background-color 0.3s ease;
}

.forecast-card:hover {
  transform: translateY(-3px);
  background: rgba(74, 95, 139, 0.2);
}

.forecast-day {
  font-size: 13px;
  font-weight: 600;
  color: #F5F7FA;
  margin: 0 0 12px 0;
}

.forecast-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(74, 95, 139, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 12px;
  color: #4A5F8B;
  font-size: 18px;
}

.forecast-weather {
  font-size: 11px;
  color: #B8C6D8;
  margin: 0 0 6px 0;
}

.forecast-temp {
  font-size: 12px;
  font-weight: 600;
  color: #F5F7FA;
  margin: 0;
}

.section-header {
  margin: 48px 0 24px;
}

.section-title-wrapper {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 8px;
}

.section-title {
  font-size: 26px;
  font-weight: 700;
  color: #F5F7FA;
  margin: 0;
}

.title-line {
  flex: 1;
  height: 2px;
  background: linear-gradient(90deg, #4A5F8B, transparent);
  border-radius: 2px;
}

.section-subtitle {
  font-size: 14px;
  color: #B8C6D8;
  margin: 0;
}

.featured-topics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
}

.topic-card {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  height: 280px;
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.topic-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px -12px rgba(74, 95, 139, 0.4);
}

.topic-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.topic-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(30, 37, 50, 0.95) 0%, rgba(30, 37, 50, 0.3) 50%, transparent 100%);
  display: flex;
  align-items: flex-end;
  padding: 24px;
}

.topic-content {
  width: 100%;
}

.topic-badge {
  display: inline-block;
  padding: 4px 12px;
  background: #4A5F8B;
  color: #F5F7FA;
  font-size: 11px;
  font-weight: 600;
  border-radius: 20px;
  margin-bottom: 12px;
}

.topic-title {
  font-size: 20px;
  font-weight: 700;
  color: #F5F7FA;
  margin: 0 0 8px 0;
}

.topic-desc {
  font-size: 13px;
  color: #B8C6D8;
  margin: 0 0 12px 0;
}

.topic-meta {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: #B8C6D8;
}

.topic-meta span {
  display: flex;
  align-items: center;
  gap: 6px;
}

.inspiration-scroll {
  display: flex;
  gap: 24px;
  overflow-x: auto;
  padding-bottom: 16px;
  scrollbar-width: none;
  margin-bottom: 40px;
}

.inspiration-scroll::-webkit-scrollbar {
  display: none;
}

.inspiration-card {
  flex-shrink: 0;
  width: 320px;
  background: #2D3748;
  border: 1px solid #4A5F8B;
  border-radius: 16px;
  overflow: hidden;
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.inspiration-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px -12px rgba(74, 95, 139, 0.3);
}

.inspiration-image-wrapper {
  position: relative;
  aspect-ratio: 4/3;
  overflow: hidden;
}

.inspiration-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(30, 37, 50, 0.9) 0%, transparent 50%);
  display: flex;
  align-items: flex-end;
  padding: 20px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.inspiration-card:hover .inspiration-overlay {
  opacity: 1;
}

.inspiration-tag {
  display: inline-block;
  padding: 6px 14px;
  background: #4A5F8B;
  color: #F5F7FA;
  font-size: 11px;
  font-weight: 600;
  border-radius: 20px;
}

.inspiration-content {
  padding: 20px;
}

.inspiration-title {
  font-size: 18px;
  font-weight: 700;
  color: #F5F7FA;
  margin: 0 0 8px 0;
}

.inspiration-desc {
  font-size: 13px;
  color: #B8C6D8;
  line-height: 1.6;
  margin: 0 0 16px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.inspiration-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.author-name {
  font-size: 13px;
  color: #4A5F8B;
  font-weight: 500;
}

.inspiration-footer i {
  color: #4A5F8B;
  font-size: 12px;
  transition: transform 0.3s ease;
}

.inspiration-card:hover .inspiration-footer i {
  transform: translateX(4px);
}

.promo-banner {
  background: linear-gradient(135deg, rgba(74, 95, 139, 0.2) 0%, rgba(138, 80, 255, 0.2) 100%);
  border: 1px solid rgba(74, 95, 139, 0.3);
  border-radius: 20px;
  padding: 32px;
  margin-bottom: 40px;
  overflow: hidden;
}

.promo-content {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 32px;
  align-items: center;
}

.promo-badge {
  display: inline-block;
  padding: 6px 14px;
  background: linear-gradient(135deg, #4A5F8B, #8a50ff);
  color: #F5F7FA;
  font-size: 12px;
  font-weight: 600;
  border-radius: 20px;
  margin-bottom: 16px;
}

.promo-title {
  font-size: 28px;
  font-weight: 700;
  color: #F5F7FA;
  margin: 0 0 12px 0;
}

.promo-desc {
  font-size: 15px;
  color: #B8C6D8;
  line-height: 1.6;
  margin: 0 0 24px 0;
}

.promo-stats {
  display: flex;
  gap: 32px;
  margin-bottom: 24px;
}

.promo-stats .stat {
  display: flex;
  flex-direction: column;
}

.stat-num {
  font-size: 24px;
  font-weight: 700;
  color: #4A5F8B;
}

.stat-label {
  font-size: 12px;
  color: #B8C6D8;
}

.promo-btn {
  background: linear-gradient(135deg, #4A5F8B, #8a50ff);
  border: none;
}

.promo-image {
  border-radius: 16px;
  overflow: hidden;
  aspect-ratio: 4/3;
}

.filter-section {
  margin-bottom: 28px;
}

.filter-buttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 10px 20px;
  background: #2D3748;
  color: #B8C6D8;
  border: 1px solid #4A5F8B;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: border-color 0.3s cubic-bezier(0.16, 1, 0.3, 1), transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.3s cubic-bezier(0.16, 1, 0.3, 1), color 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.filter-btn:hover {
  border-color: #6B7C93;
  transform: translateY(-2px);
}

.filter-btn.active {
  background: #4A5F8B;
  color: #F5F7FA;
  border-color: #4A5F8B;
  box-shadow: 0 6px 20px -8px rgba(74, 95, 139, 0.5);
}

.photo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.load-more-section {
  text-align: center;
}

.search-section {
  position: relative;
}

.search-wrapper {
  position: relative;
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
  background: #2D3748;
  border: 1px solid #4A5F8B;
  color: #F5F7FA;
  border-radius: 12px;
  font-size: 14px;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.search-input:focus {
  outline: 2px solid #6B7C93;
  outline-offset: 2px;
  border-color: #6B7C93;
  box-shadow: 0 0 0 3px rgba(74, 95, 139, 0.2);
}

.search-input::placeholder {
  color: #B8C6D8;
}

.sidebar-card {
  background: #2D3748;
  border: 1px solid #4A5F8B;
  border-radius: 16px;
  padding: 24px;
}

.sidebar-title {
  font-size: 16px;
  font-weight: 700;
  color: #F5F7FA;
  margin: 0 0 20px 0;
  display: flex;
  align-items: center;
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
  transition: background-color 0.3s ease, color 0.3s ease, transform 0.3s ease;
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

.leaderboard {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.leader-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px;
  background: #1E2532;
  border-radius: 10px;
  transition: background-color 0.3s ease;
}

.leader-item:hover {
  background: rgba(74, 95, 139, 0.2);
}

.leader-rank {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(74, 95, 139, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #B8C6D8;
  font-size: 14px;
  font-weight: 600;
}

.leader-rank.top-three {
  background: linear-gradient(135deg, #4A5F8B, #8a50ff);
  color: #F5F7FA;
}

.leader-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #4A5F8B;
}

.leader-info {
  flex: 1;
  min-width: 0;
}

.leader-name {
  font-size: 14px;
  font-weight: 600;
  color: #F5F7FA;
  margin: 0 0 2px 0;
}

.leader-stats {
  font-size: 12px;
  color: #B8C6D8;
  margin: 0;
}

.photographers-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.photographer-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.photographer-info {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;
}

.photographer-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #4A5F8B;
  transition: transform 0.3s ease;
}

.photographer-item:hover .photographer-avatar {
  transform: scale(1.05);
}

.photographer-details {
  flex: 1;
  min-width: 0;
}

.photographer-name {
  font-size: 14px;
  font-weight: 600;
  color: #F5F7FA;
  margin: 0 0 2px 0;
}

.photographer-level {
  display: inline-block;
  font-size: 10px;
  color: #4A5F8B;
  font-weight: 500;
  padding: 2px 8px;
  background: rgba(74, 95, 139, 0.1);
  border-radius: 8px;
  margin-bottom: 4px;
}

.photographer-stats {
  font-size: 12px;
  color: #B8C6D8;
  margin: 0;
}

.special-card {
  background: linear-gradient(135deg, #2D3748 0%, #1E2532 100%);
  border-color: #48BB78;
  overflow: hidden;
}

.special-content {
  text-align: center;
}

.special-title {
  font-size: 18px;
  font-weight: 700;
  color: #F5F7FA;
  margin: 0 0 8px 0;
}

.special-desc {
  font-size: 13px;
  color: #B8C6D8;
  line-height: 1.6;
  margin: 0 0 20px 0;
}

.special-image-wrapper {
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 20px;
  aspect-ratio: 16/9;
}

.special-btn {
  width: 100%;
  background: linear-gradient(135deg, #48BB78, #38A169);
  border: none;
}

.special-btn:hover {
  background: linear-gradient(135deg, #38A169, #2F855A);
}
</style>
