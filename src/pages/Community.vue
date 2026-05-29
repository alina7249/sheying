<template>
  <div class="min-h-screen bg-[#0F1C2D]">
    <div class="max-w-6xl mx-auto px-4 py-8">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 class="text-2xl font-bold text-white">摄影社区</h1>
          <p class="text-[#6B7C93]">与全球摄影爱好者交流分享</p>
        </div>
        <Button @click="handleCreatePost" ariaLabel="发布新帖子">
          <i class="fa-solid fa-plus mr-2"></i>
          <span>发布帖子</span>
        </Button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 space-y-6">
          <div class="filter-buttons">
            <button
              v-for="filter in filters"
              :key="filter.id"
              @click="activeFilter = filter.id"
              class="filter-btn"
              :class="{ active: activeFilter === filter.id }"
              :aria-pressed="activeFilter === filter.id"
            >
              {{ filter.name }}
            </button>
          </div>

          <PostCard
            v-for="post in communityPosts"
            :key="post.id"
            :post="post"
            @click="handlePostClick"
            @like="handlePostAction"
            @comment="handlePostAction"
            @bookmark="handlePostAction"
            @share="handlePostAction"
          />
        </div>

        <div class="space-y-6">
          <div class="sidebar-section">
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
              </div>
            </div>
          </div>

          <div class="sidebar-section">
            <h3 class="section-title">
              <i class="fa-solid fa-users mr-2"></i>
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
          </div>

          <div class="challenge-card">
            <h3 class="challenge-title">加入摄影挑战</h3>
            <p class="challenge-desc">参与每周摄影挑战，赢取精美奖品</p>
            <Button variant="primary" @click="handleJoinChallenge" ariaLabel="立即参与摄影挑战">
              立即参与
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Button from '../components/common/Button.vue';
import PostCard, { type PostItem } from '../components/PostCard.vue';
import UserCard, { type UserItem } from '../components/UserCard.vue';

const activeFilter = ref('latest');

const handlePostAction = (action: string, postId: string) => {
  console.log(`${action} on post ${postId}`);
};

const handleFollowUser = (userId: string) => {
  console.log(`Follow user ${userId}`);
};

const handleCreatePost = () => {
  console.log('Create new post');
};

const handleJoinChallenge = () => {
  console.log('Join challenge');
};

const handlePostClick = (post: PostItem) => {
  console.log('Post clicked:', post);
};

const filters = [
  { id: 'latest', name: '最新' },
  { id: 'hot', name: '热门' },
  { id: 'follow', name: '关注' },
  { id: 'my', name: '我的' }
];

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
    likes: 128,
    comments: 24,
    bookmarks: 35
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
    likes: 45,
    comments: 18,
    bookmarks: 12
  },
  {
    id: '3',
    title: '新疆风光摄影之旅总结',
    content: '分享这次新疆摄影之旅的一些感悟和作品。新疆真的太美了，每一处都是大片！',
    category: '旅行摄影',
    images: [
      'https://picsum.photos/1280/720?random=269',
      'https://picsum.photos/1280/720?random=270'
    ],
    author: {
      name: '风光摄影达人',
      avatar: 'https://picsum.photos/400/400?random=271'
    },
    date: '昨天',
    likes: 256,
    comments: 45,
    bookmarks: 89
  }
];

const trendingTopics = [
  { id: '1', name: '#城市街头摄影', discussions: 1234, emoji: '🌆' },
  { id: '2', name: '#人像摄影技巧', discussions: 856, emoji: '📸' },
  { id: '3', name: '#风光摄影', discussions: 678, emoji: '🏞️' },
  { id: '4', name: '#器材评测', discussions: 432, emoji: '📷' }
];

const activeUsers: UserItem[] = [
  { id: '1', name: '风光摄影大师', avatar: 'https://picsum.photos/400/400?random=272', posts: 567 },
  { id: '2', name: '人像摄影师小雅', avatar: 'https://picsum.photos/400/400?random=273', posts: 342 },
  { id: '3', name: '旅行摄影玩家', avatar: 'https://picsum.photos/400/400?random=274', posts: 423 }
];
</script>

<style scoped>
.filter-buttons {
  display: flex;
  gap: 10px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 10px 20px;
  background: #1E2532;
  color: #6B7C93;
  border: 1px solid transparent;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-btn:hover {
  color: white;
  background: #2D3748;
}

.filter-btn.active {
  background: #4A5F8B;
  color: white;
  box-shadow: 0 4px 12px -4px rgba(74, 95, 139, 0.4);
}

.sidebar-section {
  background: #1E2532;
  border-radius: 16px;
  padding: 20px;
}

.section-title {
  font-size: 16px;
  font-weight: 700;
  color: white;
  margin: 0 0 16px 0;
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
}

.topic-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #0F1C2D;
  border-radius: 12px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.topic-item:hover {
  background: rgba(74, 95, 139, 0.2);
  transform: translateX(4px);
}

.topic-emoji {
  font-size: 28px;
}

.topic-info {
  flex: 1;
}

.topic-name {
  font-size: 14px;
  font-weight: 600;
  color: white;
  margin: 0 0 2px 0;
}

.topic-discussions {
  font-size: 12px;
  color: #6B7C93;
  margin: 0;
}

.users-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.challenge-card {
  background: linear-gradient(135deg, rgba(72, 187, 120, 0.15), rgba(66, 153, 225, 0.15));
  border: 1px solid rgba(72, 187, 120, 0.3);
  border-radius: 16px;
  padding: 20px;
}

.challenge-title {
  font-size: 16px;
  font-weight: 700;
  color: white;
  margin: 0 0 8px 0;
}

.challenge-desc {
  font-size: 14px;
  color: #B8C6D8;
  line-height: 1.5;
  margin: 0 0 16px 0;
}
</style>
