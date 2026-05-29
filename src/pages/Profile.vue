<template>
  <div class="min-h-screen bg-[#0F1C2D]">
    <div class="relative h-64 md:h-80">
      <img :src="mockUser.coverImage" :alt="''" class="w-full h-full object-cover" />
      <div class="absolute inset-0 bg-gradient-to-t from-[#0F1C2D] via-transparent to-transparent"></div>
    </div>

    <div class="max-w-6xl mx-auto px-4 -mt-24 relative">
      <div class="flex flex-col md:flex-row gap-6">
        <div class="flex-shrink-0">
          <img :src="mockUser.avatar" :alt="mockUser.username" class="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-[#4A5F8B] object-cover" />
        </div>
        <div class="flex-1">
          <div class="flex flex-wrap items-center gap-3 mb-2">
            <h1 class="text-2xl md:text-3xl font-bold text-white">{{ mockUser.username }}</h1>
            <span class="px-3 py-1 bg-[#4A5F8B]/20 text-[#4A5F8B] text-sm rounded-full">
              {{ mockUser.level }}
            </span>
            <span class="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm rounded-full">
              {{ mockUser.memberStatus }}
            </span>
          </div>
          <p class="text-[#B8C6D8] mb-4">{{ mockUser.bio }}</p>
          
          <div class="flex flex-wrap items-center gap-6 mb-4">
            <div class="text-center">
              <p class="text-xl font-bold text-white">{{ mockUser.posts }}</p>
              <p class="text-xs text-[#6B7C93]">作品</p>
            </div>
            <div class="text-center">
              <p class="text-xl font-bold text-white">{{ mockUser.followers }}</p>
              <p class="text-xs text-[#6B7C93]">粉丝</p>
            </div>
            <div class="text-center">
              <p class="text-xl font-bold text-white">{{ mockUser.following }}</p>
              <p class="text-xs text-[#6B7C93]">关注</p>
            </div>
            <div class="text-center">
              <p class="text-xl font-bold text-white">{{ mockUser.memberDaysLeft }}</p>
              <p class="text-xs text-[#6B7C93]">会员剩余天数</p>
            </div>
          </div>

          <div class="flex flex-wrap gap-3">
            <button class="px-4 py-2 bg-[#4A5F8B] text-white rounded-lg hover:bg-[#6B7C93] transition-colors">
              <i class="fa-solid fa-plus mr-1"></i> 关注
            </button>
            <button class="px-4 py-2 border border-[#4A5F8B] text-[#4A5F8B] rounded-lg hover:bg-[#4A5F8B]/10 transition-colors">
              <i class="fa-solid fa-message-circle mr-1"></i> 私信
            </button>
            <button class="px-4 py-2 border border-[#4A5F8B] text-[#4A5F8B] rounded-lg hover:bg-[#4A5F8B]/10 transition-colors">
              <i class="fa-solid fa-ellipsis-h"></i>
            </button>
          </div>
        </div>
      </div>

      <div class="mt-8">
        <div class="flex items-center gap-2 mb-4">
          <div class="flex-1 h-1 bg-[#1E2532] rounded-full overflow-hidden">
            <div 
              class="h-full bg-gradient-to-r from-[#4A5F8B] to-blue-400 transition-all duration-500"
              :style="{ width: `${(mockUser.progress / mockUser.progressMax) * 100}%` }"
            ></div>
          </div>
          <span class="text-sm text-[#6B7C93]">{{ mockUser.progress }}/{{ mockUser.progressMax }} EXP</span>
        </div>
        <div class="flex items-center gap-2">
          <span v-for="i in 5" :key="i" :class="['w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold', i <= mockUser.levelNum ? 'bg-[#4A5F8B] text-white' : 'bg-[#1E2532] text-[#6B7C93]']">
            {{ i }}
          </span>
          <span class="ml-2 text-sm text-[#6B7C93]">{{ mockUser.tags }}</span>
        </div>
      </div>

      <div class="mt-8 border-t border-[#4A5F8B]/30">
        <div class="flex gap-8 mb-6">
          <button 
            v-for="tab in tabs" 
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="['py-3 border-b-2 transition-colors', activeTab === tab.id ? 'border-[#4A5F8B] text-[#4A5F8B]' : 'border-transparent text-[#6B7C93] hover:text-white']"
          >
            {{ tab.name }} <span class="text-xs">({{ tab.count }})</span>
          </button>
        </div>

        <div v-if="activeTab === 'works'" class="space-y-8">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-bold text-white">我的作品</h2>
            <div class="flex items-center gap-3">
              <button class="px-4 py-2 bg-[#4A5F8B] text-white rounded-lg hover:bg-[#6B7C93] transition-colors">
                <i class="fa-solid fa-plus mr-2"></i>发布作品
              </button>
              <div class="flex bg-[#1E2532] rounded-lg p-1">
                <button :class="['px-3 py-1 rounded', viewMode === 'grid' ? 'bg-[#4A5F8B] text-white' : 'text-[#B8C6D8]']" @click="viewMode = 'grid'">
                  <i class="fa-solid fa-th"></i>
                </button>
                <button :class="['px-3 py-1 rounded', viewMode === 'list' ? 'bg-[#4A5F8B] text-white' : 'text-[#B8C6D8]']" @click="viewMode = 'list'">
                  <i class="fa-solid fa-list"></i>
                </button>
              </div>
            </div>
          </div>
          
          <div v-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div 
              v-for="post in mockPhotographyPosts" 
              :key="post.id"
              class="group relative aspect-[4/3] rounded-lg overflow-hidden bg-[#1E2532] cursor-pointer"
            >
              <img :src="post.image" :alt="post.title" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div class="absolute bottom-4 left-4 right-4">
                  <h3 class="text-white font-medium mb-2">{{ post.title }}</h3>
                  <div class="flex items-center justify-between text-sm text-white/80">
                    <div class="flex items-center gap-4">
                      <span><i class="fa-solid fa-heart mr-1"></i>{{ post.likes }}</span>
                      <span><i class="fa-solid fa-comment mr-1"></i>{{ post.comments }}</span>
                      <span><i class="fa-solid fa-eye mr-1"></i>{{ post.views }}</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <button class="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
                        <i class="fa-solid fa-pencil"></i>
                      </button>
                      <button class="p-2 bg-red-500/20 rounded-full hover:bg-red-500/30 transition-colors">
                        <i class="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div class="absolute top-3 right-3">
                <span :class="['px-2 py-1 rounded-full text-xs', post.visibility === '公开' ? 'bg-green-500/80 text-white' : post.visibility === '仅好友可见' ? 'bg-yellow-500/80 text-white' : 'bg-red-500/80 text-white']">
                  {{ post.visibility }}
                </span>
              </div>
            </div>
          </div>
          
          <div v-if="viewMode === 'list'" class="space-y-4">
            <div 
              v-for="post in mockPhotographyPosts" 
              :key="post.id"
              class="flex items-center gap-4 bg-[#1E2532] rounded-lg p-4 hover:bg-[#2D3748] transition-colors cursor-pointer"
            >
              <img :src="post.image" :alt="post.title" class="w-32 h-24 object-cover rounded-lg flex-shrink-0" />
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between mb-2">
                  <h3 class="text-white font-medium truncate">{{ post.title }}</h3>
                  <span :class="['px-2 py-1 rounded-full text-xs', post.visibility === '公开' ? 'bg-green-500/20 text-green-400' : post.visibility === '仅好友可见' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400']">
                    {{ post.visibility }}
                  </span>
                </div>
                <p class="text-[#B8C6D8] text-sm mb-2 line-clamp-2">{{ post.description }}</p>
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-4 text-sm text-[#6B7C93]">
                    <span><i class="fa-solid fa-heart mr-1"></i>{{ post.likes }}</span>
                    <span><i class="fa-solid fa-comment mr-1"></i>{{ post.comments }}</span>
                    <span><i class="fa-solid fa-eye mr-1"></i>{{ post.views }}</span>
                    <span><i class="fa-solid fa-calendar mr-1"></i>{{ post.date }}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <button class="px-3 py-1 bg-[#4A5F8B] text-white rounded text-sm hover:bg-[#6B7C93] transition-colors">
                      <i class="fa-solid fa-pencil mr-1"></i>编辑
                    </button>
                    <button class="px-3 py-1 bg-red-500/20 text-red-400 rounded text-sm hover:bg-red-500/40 transition-colors">
                      <i class="fa-solid fa-trash mr-1"></i>删除
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="activeTab === 'stats'" class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="bg-[#1E2532] rounded-lg p-6">
            <h3 class="text-lg font-semibold text-white mb-4">作品数据趋势</h3>
            <div class="h-48">
              <ChartCanvas
                type="line"
                :data="monthlyStatsChartData"
                :options="monthlyStatsChartOptions"
              />
            </div>
          </div>

          <div class="space-y-4">
            <div class="bg-[#1E2532] rounded-lg p-6">
              <h3 class="text-lg font-semibold text-white mb-4">作品统计</h3>
              <div class="grid grid-cols-2 gap-4">
                <div class="text-center p-3 bg-[#4A5F8B]/10 rounded-lg">
                  <p class="text-2xl font-bold text-[#4A5F8B]">1.2万</p>
                  <p class="text-xs text-[#6B7C93]">总浏览量</p>
                </div>
                <div class="text-center p-3 bg-green-500/10 rounded-lg">
                  <p class="text-2xl font-bold text-green-500">3.5千</p>
                  <p class="text-xs text-[#6B7C93]">总获赞</p>
                </div>
                <div class="text-center p-3 bg-blue-500/10 rounded-lg">
                  <p class="text-2xl font-bold text-blue-500">456</p>
                  <p class="text-xs text-[#6B7C93]">总评论</p>
                </div>
                <div class="text-center p-3 bg-purple-500/10 rounded-lg">
                  <p class="text-2xl font-bold text-purple-500">234</p>
                  <p class="text-xs text-[#6B7C93]">总收藏</p>
                </div>
              </div>
            </div>

            <div class="bg-[#1E2532] rounded-lg p-6">
              <h3 class="text-lg font-semibold text-white mb-4">标签分布</h3>
              <div class="flex flex-wrap gap-2">
                <span v-for="tag in tagDistribution" :key="tag.name" :class="['px-3 py-1 rounded-full text-sm', tag.color]">
                  {{ tag.name }} ({{ tag.count }})
                </span>
              </div>
            </div>
          </div>
        </div>

        <div v-if="activeTab === 'collections'" class="space-y-4">
          <div v-for="collection in collections" :key="collection.id" class="bg-[#1E2532] rounded-lg p-4">
            <div class="flex items-center gap-4">
              <img :src="collection.cover" :alt="collection.name" class="w-20 h-20 rounded-lg object-cover" />
              <div class="flex-1">
                <h3 class="text-white font-medium">{{ collection.name }}</h3>
                <p class="text-sm text-[#6B7C93]">{{ collection.count }} 个作品</p>
              </div>
              <span class="text-[#6B7C93]">{{ collection.date }}</span>
            </div>
          </div>
        </div>

        <div v-if="activeTab === 'collections'" class="space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-white">我的收藏集</h3>
            <button class="px-4 py-2 bg-[#4A5F8B] text-white rounded-lg hover:bg-[#6B7C93] transition-colors">
              <i class="fa-solid fa-plus mr-2"></i>新建收藏集
            </button>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div 
              v-for="collection in collections" 
              :key="collection.id" 
              class="bg-[#1E2532] rounded-lg overflow-hidden hover:bg-[#2D3748] transition-colors cursor-pointer"
            >
              <div class="relative h-40">
                <img :src="collection.cover" :alt="collection.name" class="w-full h-full object-cover" />
                <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              </div>
              <div class="p-4">
                <h4 class="text-white font-medium mb-2">{{ collection.name }}</h4>
                <div class="flex items-center justify-between text-sm text-[#6B7C93]">
                  <span>{{ collection.count }} 个作品</span>
                  <span>{{ collection.date }}</span>
                </div>
                <div class="flex items-center gap-2 mt-3">
                  <button class="flex-1 px-3 py-1 bg-[#4A5F8B] text-white rounded text-sm hover:bg-[#6B7C93] transition-colors">
                    <i class="fa-solid fa-pencil mr-1"></i>编辑
                  </button>
                  <button class="flex-1 px-3 py-1 bg-red-500/20 text-red-400 rounded text-sm hover:bg-red-500/40 transition-colors">
                    <i class="fa-solid fa-trash mr-1"></i>删除
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="activeTab === 'about'" class="space-y-6">
          <div class="bg-[#1E2532] rounded-lg p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-white">关于我</h3>
              <button class="px-3 py-1 bg-[#4A5F8B] text-white rounded text-sm hover:bg-[#6B7C93] transition-colors">
                <i class="fa-solid fa-pencil mr-1"></i>编辑
              </button>
            </div>
            <div class="space-y-4 text-[#B8C6D8]">
              <p class="text-lg">{{ mockUser.bio }}</p>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#4A5F8B]/30">
                <div>
                  <p class="text-sm text-[#6B7C93] mb-1">加入时间</p>
                  <p class="text-white">{{ mockUser.joinDate }}</p>
                </div>
                <div>
                  <p class="text-sm text-[#6B7C93] mb-1">所在地</p>
                  <p class="text-white">上海市</p>
                </div>
                <div>
                  <p class="text-sm text-[#6B7C93] mb-1">擅长题材</p>
                  <div class="flex flex-wrap gap-2">
                    <span class="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">风光</span>
                    <span class="px-3 py-1 bg-pink-500/20 text-pink-400 rounded-full text-sm">人像</span>
                    <span class="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm">星空</span>
                  </div>
                </div>
                <div>
                  <p class="text-sm text-[#6B7C93] mb-1">常用器材</p>
                  <div class="flex flex-wrap gap-2">
                    <span class="px-3 py-1 bg-[#4A5F8B]/20 text-[#4A5F8B] rounded-full text-sm">Sony A7R IV</span>
                    <span class="px-3 py-1 bg-[#4A5F8B]/20 text-[#4A5F8B] rounded-full text-sm">Canon EOS R5</span>
                  </div>
                </div>
                <div class="md:col-span-2">
                  <p class="text-sm text-[#6B7C93] mb-1">代表作品</p>
                  <div class="grid grid-cols-3 gap-3 mt-2">
                    <div v-for="work in ['晨曦中的山峦', '城市剪影', '星空下的古堡']" :key="work" class="aspect-square bg-[#2D3748] rounded-lg overflow-hidden">
                      <img :src="`https://picsum.photos/400/400?random=${work.length}`" :alt="work" class="w-full h-full object-cover" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-[#1E2532] rounded-lg p-6">
            <h3 class="text-lg font-semibold text-white mb-4">荣誉与成就</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="flex items-start gap-3 p-4 bg-[#2D3748] rounded-lg">
                <div class="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center text-yellow-500 flex-shrink-0">
                  <i class="fa-solid fa-trophy text-xl"></i>
                </div>
                <div>
                  <h4 class="text-white font-medium">最佳风光摄影奖</h4>
                  <p class="text-sm text-[#6B7C93]">2023年国际摄影大赛</p>
                </div>
              </div>
              <div class="flex items-start gap-3 p-4 bg-[#2D3748] rounded-lg">
                <div class="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-500 flex-shrink-0">
                  <i class="fa-solid fa-medal text-xl"></i>
                </div>
                <div>
                  <h4 class="text-white font-medium">新锐摄影师</h4>
                  <p class="text-sm text-[#6B7C93]">平台认证荣誉</p>
                </div>
              </div>
              <div class="flex items-start gap-3 p-4 bg-[#2D3748] rounded-lg">
                <div class="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center text-green-500 flex-shrink-0">
                  <i class="fa-solid fa-fire text-xl"></i>
                </div>
                <div>
                  <h4 class="text-white font-medium">热门创作者</h4>
                  <p class="text-sm text-[#6B7C93]">作品浏览量超过10万</p>
                </div>
              </div>
              <div class="flex items-start gap-3 p-4 bg-[#2D3748] rounded-lg">
                <div class="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center text-purple-500 flex-shrink-0">
                  <i class="fa-solid fa-star text-xl"></i>
                </div>
                <div>
                  <h4 class="text-white font-medium">超级粉丝</h4>
                  <p class="text-sm text-[#6B7C93]">获得超过1000名粉丝</p>
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
import { ref, computed } from 'vue';
import ChartCanvas from '../components/common/ChartCanvas.vue';

const viewMode = ref<'grid' | 'list'>('grid');

const mockUser = {
  id: 'user-123',
  username: '@光影捕手',
  email: 'user@example.com',
  avatar: 'https://picsum.photos/400/400?random=127',
  bio: '热爱风光和人像摄影，喜欢探索城市中的几何美感和自然中的光影变化。',
  joinDate: '2023-01-15',
  followers: 123,
  following: 45,
  posts: 28,
  coverImage: 'https://picsum.photos/1280/720?random=128',
  level: '新锐摄影师',
  levelNum: 3,
  progress: 120,
  progressMax: 200,
  tags: '风光/人像双题材创作者',
  memberStatus: '银河会员·年卡',
  memberDaysLeft: 128
};

const mockPhotographyPosts = [
  {
    id: '1',
    title: '晨曦中的山峦',
    description: '捕捉清晨第一缕阳光洒在山峦上的壮丽景色',
    image: 'https://picsum.photos/1280/720?random=129',
    author: { id: 'user-123', name: '@光影捕手', avatar: '' },
    likes: 324,
    comments: 45,
    tags: ['风光', '日出', '云海', '自然'],
    date: '2023-10-25',
    views: 1256,
    format: 'RAW',
    visibility: '公开',
    copyrightType: '独家授权'
  },
  {
    id: '2',
    title: '城市剪影',
    description: '从高处俯瞰城市天际线',
    image: 'https://picsum.photos/1280/720?random=130',
    author: { id: 'user-123', name: '@光影捕手', avatar: '' },
    likes: 289,
    comments: 37,
    tags: ['城市', '建筑', '剪影', '夕阳'],
    date: '2023-10-22',
    views: 987,
    format: 'JPG',
    visibility: '公开',
    copyrightType: '非独家'
  },
  {
    id: '3',
    title: '海浪与礁石',
    description: '长时间曝光拍摄海浪拍打礁石',
    image: 'https://picsum.photos/1280/720?random=131',
    author: { id: 'user-123', name: '@光影捕手', avatar: '' },
    likes: 412,
    comments: 53,
    tags: ['海景', '慢门', '自然', '礁石'],
    date: '2023-10-18',
    views: 1452,
    format: 'RAW',
    visibility: '仅好友可见',
    copyrightType: '独家授权'
  },
  {
    id: '4',
    title: '森林晨雾',
    description: '在山间森林中捕捉晨雾弥漫的神秘氛围',
    image: 'https://picsum.photos/1280/720?random=132',
    author: { id: 'user-123', name: '@光影捕手', avatar: '' },
    likes: 387,
    comments: 49,
    tags: ['森林', '晨雾', '丁达尔', '自然'],
    date: '2023-10-15',
    views: 1123,
    format: 'RAW',
    visibility: '公开',
    copyrightType: '独家授权'
  },
  {
    id: '5',
    title: '古镇风情',
    description: '雨后的古镇石板路，倒映着古老的建筑',
    image: 'https://picsum.photos/1280/720?random=133',
    author: { id: 'user-123', name: '@光影捕手', avatar: '' },
    likes: 256,
    comments: 32,
    tags: ['古镇', '人文', '建筑', '雨天'],
    date: '2023-10-10',
    views: 876,
    format: 'JPG',
    visibility: '公开',
    copyrightType: '非独家'
  },
  {
    id: '6',
    title: '星空银河',
    description: '在远离城市光污染的山区拍摄璀璨银河',
    image: 'https://picsum.photos/1280/720?random=134',
    author: { id: 'user-123', name: '@光影捕手', avatar: '' },
    likes: 521,
    comments: 67,
    tags: ['星空', '银河', '深空', '夜景'],
    date: '2023-10-05',
    views: 1890,
    format: 'RAW',
    visibility: '公开',
    copyrightType: '独家授权'
  }
];

const monthlyStats = [
  { month: '1月', posts: 2, likes: 120, views: 500 },
  { month: '2月', posts: 3, likes: 180, views: 800 },
  { month: '3月', posts: 1, likes: 90, views: 400 },
  { month: '4月', posts: 4, likes: 320, views: 1200 },
  { month: '5月', posts: 2, likes: 200, views: 900 },
  { month: '6月', posts: 3, likes: 280, views: 1100 },
  { month: '7月', posts: 5, likes: 450, views: 1800 },
  { month: '8月', posts: 2, likes: 160, views: 700 },
  { month: '9月', posts: 3, likes: 310, views: 1300 },
  { month: '10月', posts: 3, likes: 350, views: 1500 }
];

const tagDistribution = [
  { name: '风光', count: 12, color: 'bg-blue-500/20 text-blue-400' },
  { name: '人像', count: 8, color: 'bg-pink-500/20 text-pink-400' },
  { name: '城市', count: 5, color: 'bg-gray-500/20 text-gray-400' },
  { name: '建筑', count: 4, color: 'bg-yellow-500/20 text-yellow-400' },
  { name: '夜景', count: 3, color: 'bg-purple-500/20 text-purple-400' }
];

const collections = [
  { id: '1', name: '风光作品集', cover: 'https://picsum.photos/1280/720?random=135', count: 12, date: '2023-06-01' },
  { id: '2', name: '城市探索', cover: 'https://picsum.photos/1280/720?random=136', count: 8, date: '2023-08-15' },
  { id: '3', name: '人像精选', cover: 'https://picsum.photos/1280/720?random=137', count: 6, date: '2023-09-20' }
];

const tabs = [
  { id: 'works', name: '作品', count: mockPhotographyPosts.length },
  { id: 'stats', name: '数据', count: 0 },
  { id: 'collections', name: '收藏集', count: collections.length },
  { id: 'about', name: '关于', count: 0 }
];

const activeTab = ref('works');

const monthlyStatsChartData = computed(() => ({
  labels: monthlyStats.map(d => d.month),
  datasets: [
    { label: '作品', data: monthlyStats.map(d => d.posts), borderColor: '#4A5F8B', backgroundColor: '#4A5F8B', tension: 0.3, pointRadius: 3, borderWidth: 2 },
    { label: '获赞', data: monthlyStats.map(d => d.likes), borderColor: '#63B3ED', backgroundColor: '#63B3ED', tension: 0.3, pointRadius: 3, borderWidth: 2 },
    { label: '浏览', data: monthlyStats.map(d => d.views), borderColor: '#48BB78', backgroundColor: '#48BB78', tension: 0.3, pointRadius: 3, borderWidth: 2 },
  ],
}));

const monthlyStatsChartOptions = {
  plugins: { legend: { labels: { color: '#B8C6D8' } } },
  scales: {
    x: { grid: { color: '#4A5F8B' }, ticks: { color: '#B8C6D8', font: { size: 12 } } },
    y: { grid: { color: '#4A5F8B' }, ticks: { color: '#B8C6D8', font: { size: 12 } } },
  },
};
</script>