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
          <div class="flex gap-2 mb-6">
            <button 
              v-for="filter in filters" 
              :key="filter.id"
              @click="activeFilter = filter.id"
              :class="['px-4 py-2 rounded-lg transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4A5F8B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F1C2D] active:scale-95', activeFilter === filter.id ? 'bg-[#4A5F8B] text-white shadow-md' : 'bg-[#1E2532] text-[#6B7C93] hover:text-white hover:bg-[#2D3748]']"
              :aria-pressed="activeFilter === filter.id"
            >
              {{ filter.name }}
            </button>
          </div>

          <div v-for="post in communityPosts" :key="post.id" class="bg-[#1E2532] rounded-xl overflow-hidden transition-all duration-200 hover:shadow-lg">
            <div class="p-6">
              <div class="flex items-center gap-4 mb-4">
                <img :src="post.author.avatar" :alt="post.author.name" class="w-10 h-10 rounded-full border-2 border-transparent hover:border-[#4A5F8B] transition-colors" />
                <div>
                  <h3 class="font-medium text-white">{{ post.author.name }}</h3>
                  <p class="text-sm text-[#6B7C93]">{{ post.date }}</p>
                </div>
                <span class="ml-auto px-3 py-1 bg-[#4A5F8B]/30 text-[#4A5F8B] text-sm rounded">{{ post.category }}</span>
              </div>
              
              <h2 class="text-lg font-semibold text-white mb-2">{{ post.title }}</h2>
              <p class="text-[#B8C6D8] mb-4">{{ post.content }}</p>

              <div v-if="post.images && post.images.length > 0" class="grid grid-cols-2 gap-3 mb-4">
                <img 
                  v-for="(img, index) in post.images.slice(0, 2)" 
                  :key="index"
                  :src="img" 
                  :alt="`${post.title} - ${index + 1}`"
                  class="w-full h-48 object-cover rounded-lg transition-transform duration-300 hover:scale-[1.02]"
                  loading="lazy"
                />
                <div v-if="post.images.length > 2" class="col-span-1 row-span-2 bg-[#0F1C2D] rounded-lg flex items-center justify-center cursor-pointer hover:bg-[#1a293d] transition-colors">
                  <span class="text-[#6B7C93] text-lg font-semibold">+{{ post.images.length - 2 }}</span>
                </div>
              </div>

              <div class="flex items-center gap-6 text-sm text-[#6B7C93]">
                <button 
                  @click="handlePostAction('like', post.id)"
                  class="flex items-center gap-1 hover:text-red-400 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1E2532] rounded px-2 py-1 active:scale-90"
                  aria-label="点赞"
                >
                  <i class="fa-solid fa-heart"></i>
                  <span>{{ post.likes }}</span>
                </button>
                <button 
                  @click="handlePostAction('comment', post.id)"
                  class="flex items-center gap-1 hover:text-[#4A5F8B] transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4A5F8B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1E2532] rounded px-2 py-1 active:scale-90"
                  aria-label="评论"
                >
                  <i class="fa-solid fa-comment"></i>
                  <span>{{ post.comments }}</span>
                </button>
                <button 
                  @click="handlePostAction('bookmark', post.id)"
                  class="flex items-center gap-1 hover:text-yellow-400 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1E2532] rounded px-2 py-1 active:scale-90"
                  aria-label="收藏"
                >
                  <i class="fa-solid fa-bookmark"></i>
                  <span>{{ post.bookmarks }}</span>
                </button>
                <button 
                  @click="handlePostAction('share', post.id)"
                  class="flex items-center gap-1 hover:text-white transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#1E2532] rounded px-2 py-1 active:scale-90"
                  aria-label="分享"
                >
                  <i class="fa-solid fa-share"></i>
                  <span>分享</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="space-y-6">
          <div class="bg-[#1E2532] rounded-xl p-6">
            <h3 class="font-semibold text-white mb-4">热门话题</h3>
            <div class="space-y-3">
              <div 
                v-for="topic in trendingTopics" 
                :key="topic.id"
                class="flex items-center gap-3 p-3 bg-[#0F1C2D] rounded-lg hover:bg-[#4A5F8B]/30 transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4A5F8B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1E2532]"
                tabindex="0"
              >
                <span class="text-2xl">{{ topic.emoji }}</span>
                <div class="flex-1">
                  <p class="text-white text-sm">{{ topic.name }}</p>
                  <p class="text-[#6B7C93] text-xs">{{ topic.discussions }} 讨论</p>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-[#1E2532] rounded-xl p-6">
            <h3 class="font-semibold text-white mb-4">活跃用户</h3>
            <div class="space-y-3">
              <div 
                v-for="user in activeUsers" 
                :key="user.id"
                class="flex items-center gap-3"
              >
                <img :src="user.avatar" :alt="user.name" class="w-10 h-10 rounded-full hover:scale-110 transition-transform duration-200" />
                <div class="flex-1">
                  <p class="text-white text-sm">{{ user.name }}</p>
                  <p class="text-[#6B7C93] text-xs">{{ user.posts }} 帖子</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  @click="handleFollowUser(user.id)"
                  :ariaLabel="`关注 ${user.name}`"
                >
                  关注
                </Button>
              </div>
            </div>
          </div>

          <div class="bg-gradient-to-r from-green-600/20 to-blue-600/20 rounded-xl p-6 border border-green-500/30">
            <h3 class="font-semibold text-white mb-2">加入摄影挑战</h3>
            <p class="text-sm text-[#B8C6D8] mb-4">参与每周摄影挑战，赢取精美奖品</p>
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

const activeFilter = ref('latest');

// 模拟点击事件处理
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

const filters = [
  { id: 'latest', name: '最新' },
  { id: 'hot', name: '热门' },
  { id: 'follow', name: '关注' },
  { id: 'my', name: '我的' }
];

const communityPosts = [
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

const activeUsers = [
  { id: '1', name: '风光摄影大师', avatar: 'https://picsum.photos/400/400?random=272', posts: 567 },
  { id: '2', name: '人像摄影师小雅', avatar: 'https://picsum.photos/400/400?random=273', posts: 342 },
  { id: '3', name: '旅行摄影玩家', avatar: 'https://picsum.photos/400/400?random=274', posts: 423 }
];
</script>