<template>
  <div class="min-h-screen bg-[#1E2532]">
    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- 页面头部 -->
      <div class="page-header fade-in-up">
        <div class="header-content">
          <div>
            <h1 class="text-3xl font-bold text-white">摄影社区</h1>
            <p class="text-[#B8C6D8] mt-2">与全球摄影爱好者交流分享，一起探索摄影的无限可能</p>
          </div>
          <div class="header-actions">
            <Button @click="handleCreatePost" ariaLabel="发布新帖子">
              <i class="fa-solid fa-plus mr-2"></i>
              <span>发布帖子</span>
            </Button>
          </div>
        </div>
      </div>

      <!-- 统计数据卡片 -->
      <div class="stats-grid fade-in-up" style="animation-delay: 0.1s;">
        <div class="stat-card">
          <div class="stat-icon blue">
            <i class="fa-solid fa-users"></i>
          </div>
          <div>
            <p class="stat-value">12,456</p>
            <p class="stat-label">社区成员</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon green">
            <i class="fa-solid fa-images"></i>
          </div>
          <div>
            <p class="stat-value">89,234</p>
            <p class="stat-label">摄影作品</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon purple">
            <i class="fa-solid fa-comments"></i>
          </div>
          <div>
            <p class="stat-value">234,567</p>
            <p class="stat-label">讨论回复</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon orange">
            <i class="fa-solid fa-fire"></i>
          </div>
          <div>
            <p class="stat-value">1,234</p>
            <p class="stat-label">今日活跃</p>
          </div>
        </div>
      </div>

      <!-- 主要内容区 -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <!-- 左侧主内容 -->
        <div class="lg:col-span-2 space-y-6">
          <!-- 分类筛选 -->
          <div class="filter-section fade-in-up" style="animation-delay: 0.2s;">
            <div class="filter-header">
              <h3 class="text-white font-semibold">浏览分类</h3>
            </div>
            <div class="filter-buttons">
              <button
                v-for="filter in filters"
                :key="filter.id"
                @click="activeFilter = filter.id"
                class="filter-btn"
                :class="{ active: activeFilter === filter.id }"
                :aria-pressed="activeFilter === filter.id"
              >
                <i :class="filter.icon" class="mr-2"></i>
                {{ filter.name }}
              </button>
            </div>
          </div>

          <!-- 帖子列表 -->
          <div class="posts-list space-y-4">
            <PostCard
              v-for="(post, index) in filteredPosts"
              :key="post.id"
              :post="post"
              :style="{ animationDelay: `${0.3 + index * 0.1}s` }"
              class="fade-in-up"
              @click="handlePostClick"
              @like="(id: string) => handleLike(id)"
              @comment="(id: string) => showInfo('评论功能')"
              @bookmark="(id: string) => handleBookmark(id)"
              @share="(id: string) => handleShare()"
            />
          </div>

          <!-- 加载更多 -->
          <div class="load-more fade-in-up" style="animation-delay: 0.8s;">
            <Button variant="outline" @click="loadMore">
              <i class="fa-solid fa-spinner mr-2"></i>
              加载更多
            </Button>
          </div>
        </div>

        <!-- 右侧边栏 -->
        <div class="space-y-6">
          <!-- 搜索框 -->
          <div class="sidebar-section fade-in-up" style="animation-delay: 0.2s;">
            <div class="search-box">
              <i class="fa-solid fa-search search-icon"></i>
              <input
                type="text"
                v-model="searchQuery"
                placeholder="搜索帖子、话题或用户..."
                class="search-input"
              />
            </div>
          </div>

          <!-- 热门话题 -->
          <div class="sidebar-section fade-in-up" style="animation-delay: 0.3s;">
            <h3 class="section-title">
              <i class="fa-solid fa-fire mr-2"></i>
              热门话题
            </h3>
            <div class="topics-list">
              <div
                v-for="topic in trendingTopics"
                :key="topic.id"
                class="topic-item"
              >
                <span class="topic-emoji">{{ topic.emoji }}</span>
                <div class="topic-info">
                  <p class="topic-name">{{ topic.name }}</p>
                  <p class="topic-discussions">{{ topic.discussions }} 讨论</p>
                </div>
                <i class="fa-solid fa-chevron-right text-[#6B7C93]"></i>
              </div>
            </div>
            <button class="view-all-btn" @click="showInfo('查看全部话题')">
              查看全部话题 <i class="fa-solid fa-arrow-right ml-2"></i>
            </button>
          </div>

          <!-- 活跃用户 -->
          <div class="sidebar-section fade-in-up" style="animation-delay: 0.4s;">
            <h3 class="section-title">
              <i class="fa-solid fa-star mr-2"></i>
              活跃用户
            </h3>
            <div class="users-list">
              <UserCard
                v-for="user in activeUsers"
                :key="user.id"
                :user="user"
                @follow="handleFollowUser"
              />
            </div>
            <button class="view-all-btn" @click="showInfo('发现更多用户')">
              发现更多 <i class="fa-solid fa-arrow-right ml-2"></i>
            </button>
          </div>

          <!-- 摄影挑战 -->
          <div class="challenge-card fade-in-up" style="animation-delay: 0.5s;">
            <div class="challenge-header">
              <div class="challenge-icon">
                <i class="fa-solid fa-trophy"></i>
              </div>
              <span class="challenge-badge">进行中</span>
            </div>
            <h3 class="challenge-title">加入摄影挑战</h3>
            <p class="challenge-desc">本周主题：「城市微光」- 用镜头捕捉都市的迷人夜景</p>
            <div class="challenge-stats">
              <div class="challenge-stat">
                <span class="stat-number">892</span>
                <span class="stat-text">参与作品</span>
              </div>
              <div class="challenge-divider"></div>
              <div class="challenge-stat">
                <span class="stat-number">5</span>
                <span class="stat-text">天剩余</span>
              </div>
            </div>
            <Button variant="primary" class="challenge-btn" @click="handleJoinChallenge">
              立即参与
            </Button>
          </div>

          <!-- 社区公告 -->
          <div class="sidebar-section announcement fade-in-up" style="animation-delay: 0.6s;">
            <h3 class="section-title">
              <i class="fa-solid fa-bullhorn mr-2"></i>
              社区公告
            </h3>
            <div class="announcement-list">
              <div class="announcement-item">
                <div class="announcement-date">11月15日</div>
                <p class="announcement-text">📢 新版社区功能上线，快来体验吧！</p>
              </div>
              <div class="announcement-item">
                <div class="announcement-date">11月10日</div>
                <p class="announcement-text">🎨 「黑白影像」专题摄影展开始征集</p>
              </div>
              <div class="announcement-item">
                <div class="announcement-date">11月5日</div>
                <p class="announcement-text">🏆 10月优秀摄影师名单公布</p>
              </div>
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
import PostCard, { type PostItem } from '../components/PostCard.vue';
import UserCard, { type UserItem } from '../components/UserCard.vue';

const router = useRouter();
const {
  showInfo,
  handleFollow: followAction,
  handleCreate,
  handleJoin,
  handleLoadMore: loadMore,
  handleLike,
  handleBookmark,
  handleShare
} = useInteraction();

const searchQuery = ref('');
const activeFilter = ref('all');

const filters = [
  { id: 'all', name: '全部', icon: 'fa-solid fa-layer-group' },
  { id: 'works', name: '作品分享', icon: 'fa-solid fa-images' },
  { id: 'qa', name: '摄影问答', icon: 'fa-solid fa-question-circle' },
  { id: 'equipment', name: '器材讨论', icon: 'fa-solid fa-camera' },
  { id: 'tutorial', name: '教程技巧', icon: 'fa-solid fa-graduation-cap' },
  { id: 'activity', name: '活动约拍', icon: 'fa-solid fa-calendar-alt' }
];

const filteredPosts = computed(() => {
  if (activeFilter.value === 'all') return communityPosts;
  const filterMap: Record<string, string> = {
    works: '摄影作品',
    qa: '摄影问答',
    equipment: '器材讨论',
    tutorial: '教程技巧',
    activity: '活动约拍'
  };
  const target = filterMap[activeFilter.value];
  return target ? communityPosts.filter(p => p.category === target) : communityPosts;
});

const handleFollowUser = (userId: string) => {
  followAction(userId);
};

const handleCreatePost = () => {
  handleCreate();
};

const handleJoinChallenge = () => {
  handleJoin();
};

const handlePostClick = (post: PostItem) => {
  router.push(`/community/post/${post.id}`);
};

const communityPosts: PostItem[] = [
  {
    id: '1',
    title: '分享我的城市街头摄影作品集',
    content: '最近在城市里拍了一些街头摄影作品，尝试了不同的构图和光影效果。想听听大家的意见和建议。',
    category: '摄影作品',
    images: [
      'https://picsum.photos/1280/720?random=264',
      'https://picsum.photos/1280/720?random=265',
      'https://picsum.photos/1280/720?random=266'
    ],
    author: {
      name: '街头摄影师阿杰',
      avatar: 'https://picsum.photos/400/400?random=267'
    },
    date: '2小时前',
    likes: 342,
    comments: 48,
    bookmarks: 56
  },
  {
    id: '2',
    title: '新手请教：如何提高人像摄影技巧？',
    content: '刚接触人像摄影不久，想请教大家如何提高人像摄影技巧。特别是在光线运用和引导模特方面，有没有什么好的建议？',
    category: '摄影问答',
    images: [],
    author: {
      name: '摄影新手小李',
      avatar: 'https://picsum.photos/400/400?random=268'
    },
    date: '5小时前',
    likes: 89,
    comments: 32,
    bookmarks: 24
  },
  {
    id: '3',
    title: '新疆风光摄影之旅总结',
    content: '分享这次新疆摄影之旅的一些感悟和作品。新疆真的太美了，每一处都是大片！',
    category: '摄影作品',
    images: [
      'https://picsum.photos/1280/720?random=269',
      'https://picsum.photos/1280/720?random=270'
    ],
    author: {
      name: '风光摄影达人',
      avatar: 'https://picsum.photos/400/400?random=271'
    },
    date: '昨天',
    likes: 856,
    comments: 124,
    bookmarks: 234
  },
  {
    id: '4',
    title: '富士X-T5使用半年体验分享',
    content: '入手富士X-T5已经半年了，今天来跟大家分享一下使用体验。从画质到对焦，从机身设计到续航表现...',
    category: '器材讨论',
    images: [
      'https://picsum.photos/800/600?random=272'
    ],
    author: {
      name: '器材评测师',
      avatar: 'https://picsum.photos/400/400?random=273'
    },
    date: '2天前',
    likes: 423,
    comments: 89,
    bookmarks: 156
  },
  {
    id: '5',
    title: '【干货】夜景摄影长曝光技巧全解析',
    content: '今天来给大家详细讲解夜景摄影的长曝光技巧，包括器材准备、参数设置、构图要点等...',
    category: '教程技巧',
    images: [
      'https://picsum.photos/800/400?random=274',
      'https://picsum.photos/800/400?random=275'
    ],
    author: {
      name: '夜景大师',
      avatar: 'https://picsum.photos/400/400?random=276'
    },
    date: '3天前',
    likes: 1245,
    comments: 167,
    bookmarks: 567
  }
];

const trendingTopics = [
  { id: '1', name: '#城市街头摄影', discussions: 2341, emoji: '🌆' },
  { id: '2', name: '#人像摄影技巧', discussions: 1856, emoji: '📸' },
  { id: '3', name: '#风光摄影', discussions: 1478, emoji: '🏞️' },
  { id: '4', name: '#器材评测', discussions: 987, emoji: '📷' },
  { id: '5', name: '#后期修图', discussions: 765, emoji: '🎨' },
  { id: '6', name: '#胶片摄影', discussions: 543, emoji: '🎞️' }
];

const activeUsers: UserItem[] = [
  { id: '1', name: '风光摄影大师', avatar: 'https://picsum.photos/400/400?random=280', posts: 567 },
  { id: '2', name: '人像摄影师小雅', avatar: 'https://picsum.photos/400/400?random=281', posts: 432 },
  { id: '3', name: '旅行摄影玩家', avatar: 'https://picsum.photos/400/400?random=282', posts: 389 },
  { id: '4', name: '街头扫街客', avatar: 'https://picsum.photos/400/400?random=283', posts: 321 },
  { id: '5', name: '自然探索者', avatar: 'https://picsum.photos/400/400?random=284', posts: 278 }
];
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

.filter-section {
  background: #2D3748;
  border: 1px solid #4A5F8B;
  border-radius: 16px;
  padding: 20px;
}

.filter-header {
  margin-bottom: 16px;
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

.posts-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
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

.search-box {
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

.topics-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 16px;
}

.topic-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #1E2532;
  border-radius: 12px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.topic-item:hover {
  background: rgba(74, 95, 139, 0.2);
  transform: translateX(4px);
}

.topic-emoji {
  font-size: 24px;
}

.topic-info {
  flex: 1;
  min-width: 0;
}

.topic-name {
  font-size: 14px;
  font-weight: 600;
  color: #F5F7FA;
  margin: 0 0 2px 0;
}

.topic-discussions {
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

.users-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 16px;
}

.challenge-card {
  background: linear-gradient(135deg, rgba(72, 187, 120, 0.15) 0%, rgba(74, 95, 139, 0.15) 100%);
  border: 1px solid rgba(72, 187, 120, 0.3);
  border-radius: 16px;
  padding: 24px;
}

.challenge-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.challenge-icon {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: linear-gradient(135deg, #48BB78, #38A169);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  color: #F5F7FA;
}

.challenge-badge {
  padding: 4px 12px;
  background: rgba(72, 187, 120, 0.2);
  color: #48BB78;
  font-size: 11px;
  font-weight: 600;
  border-radius: 20px;
}

.challenge-title {
  font-size: 18px;
  font-weight: 700;
  color: #F5F7FA;
  margin: 0 0 8px 0;
}

.challenge-desc {
  font-size: 13px;
  color: #B8C6D8;
  line-height: 1.6;
  margin: 0 0 20px 0;
}

.challenge-stats {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.challenge-stat {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.stat-number {
  font-size: 20px;
  font-weight: 700;
  color: #48BB78;
  margin-bottom: 2px;
}

.stat-text {
  font-size: 12px;
  color: #B8C6D8;
}

.challenge-divider {
  width: 1px;
  height: 32px;
  background: rgba(74, 95, 139, 0.3);
}

.challenge-btn {
  width: 100%;
  background: linear-gradient(135deg, #48BB78, #38A169);
  border: none;
}

.challenge-btn:hover {
  background: linear-gradient(135deg, #38A169, #2F855A);
}

.announcement {
  border-color: rgba(246, 173, 85, 0.3);
}

.announcement-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.announcement-item {
  padding: 12px;
  background: #1E2532;
  border-radius: 10px;
}

.announcement-date {
  font-size: 11px;
  color: #F6AD55;
  font-weight: 500;
  margin-bottom: 4px;
}

.announcement-text {
  font-size: 13px;
  color: #B8C6D8;
  margin: 0;
  line-height: 1.5;
}
</style>
