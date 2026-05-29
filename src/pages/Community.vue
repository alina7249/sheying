<template>
  <div class="min-h-screen bg-[#0F1C2D]">
    <div class="max-w-6xl mx-auto px-4 py-8">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 class="text-2xl font-bold text-white">摄影社区</h1>
          <p class="text-[#6B7C93]">与全球摄影爱好者交流分享</p>
        </div>
        <button class="px-4 py-2 bg-[#4A5F8B] text-white rounded-lg hover:bg-[#6B7C93] transition-colors flex items-center gap-2">
          <i class="fa-solid fa-plus"></i>
          <span>发布帖子</span>
        </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 space-y-6">
          <div class="flex gap-2 mb-6">
            <button 
              v-for="filter in filters" 
              :key="filter.id"
              @click="activeFilter = filter.id"
              :class="['px-4 py-2 rounded-lg transition-colors', activeFilter === filter.id ? 'bg-[#4A5F8B] text-white' : 'bg-[#1E2532] text-[#6B7C93] hover:text-white']"
            >
              {{ filter.name }}
            </button>
          </div>

          <div v-for="post in communityPosts" :key="post.id" class="bg-[#1E2532] rounded-xl overflow-hidden">
            <div class="p-6">
              <div class="flex items-center gap-4 mb-4">
                <img :src="post.author.avatar" :alt="post.author.name" class="w-10 h-10 rounded-full" />
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
                  class="w-full h-48 object-cover rounded-lg"
                />
                <div v-if="post.images.length > 2" class="col-span-1 row-span-2 bg-[#0F1C2D] rounded-lg flex items-center justify-center">
                  <span class="text-[#6B7C93]">+{{ post.images.length - 2 }}</span>
                </div>
              </div>

              <div class="flex items-center gap-6 text-sm text-[#6B7C93]">
                <button class="flex items-center gap-1 hover:text-white transition-colors">
                  <i class="fa-solid fa-heart"></i>
                  <span>{{ post.likes }}</span>
                </button>
                <button class="flex items-center gap-1 hover:text-white transition-colors">
                  <i class="fa-solid fa-comment"></i>
                  <span>{{ post.comments }}</span>
                </button>
                <button class="flex items-center gap-1 hover:text-white transition-colors">
                  <i class="fa-solid fa-bookmark"></i>
                  <span>{{ post.bookmarks }}</span>
                </button>
                <button class="flex items-center gap-1 hover:text-white transition-colors">
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
                class="flex items-center gap-3 p-3 bg-[#0F1C2D] rounded-lg hover:bg-[#4A5F8B]/30 transition-colors cursor-pointer"
              >
                <span class="text-2xl">{{ topic.emoji }}</span>
                <div>
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
                <img :src="user.avatar" :alt="user.name" class="w-10 h-10 rounded-full" />
                <div class="flex-1">
                  <p class="text-white text-sm">{{ user.name }}</p>
                  <p class="text-[#6B7C93] text-xs">{{ user.posts }} 帖子</p>
                </div>
                <button class="px-3 py-1 border border-[#4A5F8B] text-[#4A5F8B] text-sm rounded hover:bg-[#4A5F8B] hover:text-white transition-colors">
                  关注
                </button>
              </div>
            </div>
          </div>

          <div class="bg-gradient-to-r from-green-600/20 to-blue-600/20 rounded-xl p-6 border border-green-500/30">
            <h3 class="font-semibold text-white mb-2">加入摄影挑战</h3>
            <p class="text-sm text-[#B8C6D8] mb-4">参与每周摄影挑战，赢取精美奖品</p>
            <button class="w-full px-4 py-2 bg-[#4A5F8B] text-white rounded-lg hover:bg-[#6B7C93] transition-colors">
              立即参与
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const activeFilter = ref('latest');

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
      'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=street%20photography%20urban%20night&sign=f1e2d3c4b5a6f7e8d9c0b1a2e3f4d5c6',
      'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=street%20photography%20architecture&sign=a7b8c9d0e1f2a3b4c5d6a7b8c9d0e1f2',
      'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=street%20photography%20people%20urban&sign=b8c9d0e1f2a3b4c5d6a7b8c9d0e1f2a3'
    ],
    author: {
      name: '街头摄影师阿杰',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=male%20street%20photographer&sign=c9d0e1f2a3b4c5d6a7b8c9d0e1f2a3b4'
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
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=young%20male%20photographer&sign=d0e1f2a3b4c5d6a7b8c9d0e1f2a3b4c5'
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
      'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=xinjiang%20landscape%20mountains%20grassland&sign=e1f2a3b4c5d6a7b8c9d0e1f2a3b4c5d6',
      'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=xinjiang%20desert%20sunset%20sand&sign=f2a3b4c5d6a7b8c9d0e1f2a3b4c5d6a7'
    ],
    author: {
      name: '风光摄影达人',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=professional%20landscape%20photographer&sign=a3b4c5d6a7b8c9d0e1f2a3b4c5d6a7b8'
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
  { id: '1', name: '风光摄影大师', avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=professional%20photographer%20portrait&sign=b4c5d6a7b8c9d0e1f2a3b4c5d6a7b8c9', posts: 567 },
  { id: '2', name: '人像摄影师小雅', avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=female%20portrait%20photographer&sign=c5d6a7b8c9d0e1f2a3b4c5d6a7b8c9d0', posts: 342 },
  { id: '3', name: '旅行摄影玩家', avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=travel%20photographer%20portrait&sign=d6a7b8c9d0e1f2a3b4c5d6a7b8c9d0e1', posts: 423 }
];
</script>