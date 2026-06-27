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
          <div class="stat-icon green">
            <i class="fa-solid fa-images"></i>
          </div>
          <div>
            <p class="stat-value" style="font-variant-numeric: tabular-nums">{{ total.toLocaleString() }}</p>
            <p class="stat-label">摄影作品</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon blue">
            <i class="fa-solid fa-users"></i>
          </div>
          <div>
            <p class="stat-value" style="font-variant-numeric: tabular-nums">{{ stats.users.toLocaleString() }}</p>
            <p class="stat-label">社区成员</p>
          </div>
        </div>
      </div>

      <!-- 主要内容区 -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <!-- 左侧主内容 -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Loading 骨架屏 -->
          <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div v-for="n in 6" :key="n" class="bg-[#2D3748] rounded-2xl overflow-hidden">
              <div class="h-56 bg-[#1E2532] animate-pulse"></div>
              <div class="p-5">
                <div class="flex items-center gap-3 mb-3">
                  <div class="w-10 h-10 rounded-full bg-[#1E2532] animate-pulse"></div>
                  <div class="flex-1">
                    <div class="h-4 w-24 bg-[#1E2532] rounded animate-pulse mb-2"></div>
                    <div class="h-3 w-16 bg-[#1E2532] rounded animate-pulse"></div>
                  </div>
                </div>
                <div class="h-5 w-3/4 bg-[#1E2532] rounded animate-pulse mb-2"></div>
                <div class="h-3 w-1/2 bg-[#1E2532] rounded animate-pulse"></div>
              </div>
            </div>
          </div>

          <!-- 空数据提示 -->
          <div v-else-if="posts.length === 0" class="text-center py-20 bg-[#2D3748] rounded-2xl border border-[#4A5F8B]/20">
            <i class="fa-regular fa-images text-6xl text-[#6B7C93] mb-6"></i>
            <p class="text-[#F5F7FA] text-xl font-semibold mb-3">暂无帖子</p>
            <p class="text-[#B8C6D8] mb-6">来做第一个发帖的人吧</p>
            <Button @click="handleCreatePost">
              <i class="fa-solid fa-plus mr-2"></i>
              发布作品
            </Button>
          </div>

          <!-- 帖子列表 -->
          <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div
              v-for="(post, index) in posts"
              :key="post.id"
              class="fade-in-up"
              :style="{ animationDelay: `${0.3 + index * 0.05}s` }"
            >
              <PhotographyCard :post="post" @update="handlePostUpdate" />
            </div>
          </div>

          <!-- 加载更多 -->
          <div v-if="posts.length < total && !loading" class="load-more fade-in-up text-center mt-8">
            <Button variant="outline" @click="handleLoadMore" :disabled="loadingMore">
              <i v-if="loadingMore" class="fa-solid fa-circle-notch fa-spin mr-2"></i>
              <i v-else class="fa-solid fa-plus mr-2"></i>
              {{ loadingMore ? '加载中…' : '加载更多' }}
            </Button>
          </div>
        </div>

        <!-- 右侧边栏 -->
        <div class="space-y-6">
          <!-- 搜索框 -->
          <div class="sidebar-section fade-in-up" style="animation-delay: 0.2s;">
            <form @submit.prevent="handleSearch" class="search-box">
              <i class="fa-solid fa-search search-icon"></i>
              <input
                type="text"
                v-model="searchQuery"
                placeholder="搜索作品、摄影师或标签…"
                class="search-input"
              />
            </form>
          </div>

          <!-- 热门话题 -->
          <div class="sidebar-section fade-in-up" style="animation-delay: 0.3s;">
            <h3 class="section-title">
              <i class="fa-solid fa-fire mr-2"></i>
              热门话题
            </h3>
            <div v-if="loadingHotTags" class="space-y-3">
              <div v-for="n in 6" :key="n" class="h-14 bg-[#1E2532] rounded-xl animate-pulse"></div>
            </div>
            <div v-else-if="hotTags.length === 0" class="text-center py-6 text-[#6B7C93]">
              <p class="text-sm">暂无热门话题</p>
            </div>
            <div v-else class="topics-list">
              <div
                v-for="(tag, idx) in hotTags"
                :key="tag.name"
                class="topic-item"
                :class="idx === 0 ? 'topic-item-top' : ''"
                @click="handleTagClick(tag.name)"
              >
                <span class="topic-rank" :class="idx < 3 ? 'topic-rank-hot' : ''">{{ idx + 1 }}</span>
                <span class="topic-tag">#</span>
                <div class="topic-info">
                  <p class="topic-name">{{ tag.name }}</p>
                  <p class="topic-discussions">{{ tag.count }} 作品</p>
                </div>
                <i class="fa-solid fa-chevron-right text-[#6B7C93]"></i>
              </div>
            </div>
          </div>

          <!-- 活跃用户 -->
          <div class="sidebar-section fade-in-up" style="animation-delay: 0.4s;">
            <h3 class="section-title">
              <i class="fa-solid fa-star mr-2"></i>
              活跃摄影师
            </h3>
            <div v-if="loadingActiveUsers" class="space-y-3">
              <div v-for="n in 4" :key="n" class="flex items-center gap-3 p-3 bg-[#1E2532] rounded-xl">
                <div class="w-10 h-10 rounded-full bg-[#1E2532] animate-pulse"></div>
                <div class="flex-1">
                  <div class="h-4 w-20 bg-[#1E2532] rounded animate-pulse mb-1"></div>
                  <div class="h-3 w-14 bg-[#1E2532] rounded animate-pulse"></div>
                </div>
              </div>
            </div>
            <div v-else-if="activeUsers.length === 0" class="text-center py-6 text-[#6B7C93]">
              <p class="text-sm">暂无活跃用户</p>
            </div>
            <div v-else class="users-list">
              <div
                v-for="(user, idx) in activeUsers"
                :key="user.id"
                class="user-item"
                @click="router.push(`/profile/${user.id}`)"
              >
                <div class="user-avatar-wrapper">
                  <img :src="user.avatar" :alt="user.name" class="user-avatar" />
                  <span v-if="idx < 3" class="user-rank" :class="`rank-${idx + 1}`">{{ idx + 1 }}</span>
                </div>
                <div class="user-info">
                  <p class="user-name">{{ user.name }}</p>
                  <p class="user-posts">{{ user.postCount }} 作品</p>
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
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { toast } from 'vue-sonner';
import Button from '../components/common/Button.vue';
import PhotographyCard, { type PostVO } from '../components/PhotographyCard.vue';
import { getPostList, getHotTags, searchPosts } from '../services/api';
import { useAuthStore } from '../store/authStore';

const router = useRouter();
const authStore = useAuthStore();

const searchQuery = ref('');
const posts = ref<PostVO[]>([]);
const loading = ref(true);
const loadingMore = ref(false);
const loadingHotTags = ref(true);
const loadingActiveUsers = ref(true);
const currentPage = ref(1);
const pageSize = 12;
const total = ref(0);

// 热门标签
interface HotTag {
  name: string;
  count: number;
}
const hotTags = ref<HotTag[]>([]);

// 活跃用户
interface ActiveUser {
  id: number;
  name: string;
  avatar: string;
  postCount: number;
}
const activeUsers = ref<ActiveUser[]>([]);

// 统计数据
const stats = reactive({
  users: 0
});

// 从帖子数据中提取热门标签
const extractHotTags = (postList: PostVO[]) => {
  const tagCount: Record<string, number> = {};
  postList.forEach(post => {
    if (post.tagList && Array.isArray(post.tagList)) {
      post.tagList.forEach(tag => {
        tagCount[tag] = (tagCount[tag] || 0) + 1;
      });
    }
  });

  // 按出现次数排序，取前10个
  hotTags.value = Object.entries(tagCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([name, count]) => ({ name, count }));

  loadingHotTags.value = false;
};

// 从帖子数据中统计活跃用户
const extractActiveUsers = (postList: PostVO[]) => {
  const userPostCount: Record<number, { name: string; avatar: string; count: number }> = {};

  postList.forEach(post => {
    const userId = post.userId;
    const userName = post.user?.userName || '匿名用户';
    const userAvatar = post.user?.userAvatar || `https://picsum.photos/400/400?random=${userId}`;

    if (!userPostCount[userId]) {
      userPostCount[userId] = { name: userName, avatar: userAvatar, count: 0 };
    }
    userPostCount[userId].count++;
  });

  // 按发帖数量排序，取前6个
  activeUsers.value = Object.entries(userPostCount)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 6)
    .map(([id, data]) => ({
      id: Number(id),
      name: data.name,
      avatar: data.avatar,
      postCount: data.count
    }));

  // 更新统计数据
  stats.users = Object.keys(userPostCount).length;

  loadingActiveUsers.value = false;
};

const loadPosts = async (page: number = 1, append: boolean = false) => {
  if (append) {
    loadingMore.value = true;
  } else {
    loading.value = true;
  }

  try {
    const res: any = await getPostList({
      current: page,
      pageSize: pageSize,
    });

    if (res && res.data) {
      const records = res.data.records || [];
      if (append) {
        posts.value = [...posts.value, ...records];
      } else {
        posts.value = records;
      }
      total.value = res.data.total || 0;
      currentPage.value = page;

      // 首次加载时提取热门标签和活跃用户
      if (page === 1 && !append) {
        extractHotTags(records);
        extractActiveUsers(records);
      }
    }
  } catch (error: any) {
    console.error('Failed to load posts:', error);
    toast.error(error.message || '加载失败');
  } finally {
    loading.value = false;
    loadingMore.value = false;
  }
};

const loadHotTags = async () => {
  loadingHotTags.value = true;
  try {
    const res: any = await getHotTags();
    if (res && res.data) {
      hotTags.value = res.data;
    }
  } catch (error: any) {
    console.error('Failed to load hot tags:', error);
  } finally {
    loadingHotTags.value = false;
  }
};

const handleLoadMore = () => {
  if (loadingMore.value || posts.value.length >= total.value) return;
  loadPosts(currentPage.value + 1, true);
};

const handleSearch = async () => {
  if (!searchQuery.value.trim()) {
    toast.warning('请输入搜索内容');
    return;
  }

  try {
    const res: any = await searchPosts(searchQuery.value.trim(), 1, 20);
    if (res && res.data && res.data.records) {
      router.push(`/search-result?q=${encodeURIComponent(searchQuery.value.trim())}`);
    }
  } catch (error: any) {
    console.error('Search failed:', error);
    toast.error('搜索失败');
  }
};

const handleTagClick = (tagName: string) => {
  router.push(`/search-result?q=${encodeURIComponent(tagName)}`);
};

const handleCreatePost = () => {
  if (!authStore.isAuthenticated) {
    toast.warning('请先登录');
    router.push('/login');
    return;
  }
  router.push('/publish');
};

const handlePostUpdate = (updatedPost: PostVO) => {
  const index = posts.value.findIndex(p => p.id === updatedPost.id);
  if (index !== -1) {
    posts.value[index] = updatedPost;
  }
};

onMounted(() => {
  loadPosts(1, false);
  loadHotTags();
});
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
  background: linear-gradient(135deg, rgba(45, 55, 72, 0.6), rgba(45, 55, 72, 0.3));
  border: 1px solid rgba(74, 95, 139, 0.15);
  border-radius: 16px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: border-color 0.3s ease;
}

.stat-card:hover {
  border-color: rgba(74, 95, 139, 0.4);
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

.topic-rank {
  font-size: 14px;
  font-weight: 700;
  color: #6B7C93;
  width: 22px;
  text-align: center;
  flex-shrink: 0;
  font-variant-numeric: tabular-nums;
}

.topic-rank-hot {
  color: #F6AD55;
}

.topic-item-top {
  background: linear-gradient(135deg, rgba(246, 173, 85, 0.08), rgba(74, 95, 139, 0.08));
  border: 1px solid rgba(246, 173, 85, 0.15);
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

.user-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #1E2532;
  border-radius: 12px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.user-item:hover {
  background: rgba(74, 95, 139, 0.2);
  transform: translateX(4px);
}

.user-avatar-wrapper {
  position: relative;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #4A5F8B;
}

.user-rank {
  position: absolute;
  top: -6px;
  right: -6px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  font-size: 10px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.user-rank.rank-1 {
  background: linear-gradient(135deg, #F6AD55, #DD6B20);
}

.user-rank.rank-2 {
  background: linear-gradient(135deg, #A0AEC0, #718096);
}

.user-rank.rank-3 {
  background: linear-gradient(135deg, #D69E2E, #B7791F);
}

.user-info {
  flex: 1;
  min-width: 0;
}

.user-name {
  font-size: 14px;
  font-weight: 600;
  color: #F5F7FA;
  margin: 0 0 2px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-posts {
  font-size: 12px;
  color: #6B7C93;
  margin: 0;
}

.topic-tag {
  font-size: 18px;
  color: #4A5F8B;
  font-weight: 700;
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
  font-variant-numeric: tabular-nums;
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

@media (prefers-reduced-motion: reduce) {
  .fade-in-up {
    animation: none;
    opacity: 1;
  }

  .stat-card,
  .topic-item,
  .filter-btn {
    transition: none;
  }
}
</style>
