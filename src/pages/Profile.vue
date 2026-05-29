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

        <div v-if="activeTab === 'works'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="post in mockPhotographyPosts" 
            :key="post.id"
            class="group relative aspect-[4/3] rounded-lg overflow-hidden bg-[#1E2532]"
          >
            <img :src="post.image" :alt="post.title" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <div class="absolute bottom-4 left-4 right-4">
                <h3 class="text-white font-medium mb-2">{{ post.title }}</h3>
                <div class="flex items-center gap-4 text-sm text-white/80">
                  <span><i class="fa-solid fa-heart mr-1"></i>{{ post.likes }}</span>
                  <span><i class="fa-solid fa-comment mr-1"></i>{{ post.comments }}</span>
                  <span><i class="fa-solid fa-eye mr-1"></i>{{ post.views }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="activeTab === 'stats'" class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="bg-[#1E2532] rounded-lg p-6">
            <h3 class="text-lg font-semibold text-white mb-4">作品数据趋势</h3>
            <div class="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyStats}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#4A5F8B" />
                  <XAxis dataKey="month" tick={{ fill: '#B8C6D8', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#B8C6D8' }} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="posts" stroke="#4A5F8B" strokeWidth={2} />
                  <Line type="monotone" dataKey="likes" stroke="#63B3ED" strokeWidth={2} />
                  <Line type="monotone" dataKey="views" stroke="#48BB78" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
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

        <div v-if="activeTab === 'about'" class="bg-[#1E2532] rounded-lg p-6">
          <h3 class="text-lg font-semibold text-white mb-4">关于我</h3>
          <div class="space-y-4 text-[#B8C6D8]">
            <p>{{ mockUser.bio }}</p>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-sm text-[#6B7C93]">加入时间</p>
                <p class="text-white">{{ mockUser.joinDate }}</p>
              </div>
              <div>
                <p class="text-sm text-[#6B7C93]">擅长题材</p>
                <p class="text-white">风光、人像</p>
              </div>
              <div>
                <p class="text-sm text-[#6B7C93]">常用器材</p>
                <p class="text-white">Sony A7R IV, Canon EOS R5</p>
              </div>
              <div>
                <p class="text-sm text-[#6B7C93]">代表作品</p>
                <p class="text-white">晨曦中的山峦、城市剪影</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const mockUser = {
  id: 'user-123',
  username: '@光影捕手',
  email: 'user@example.com',
  avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photographer%20avatar%20professional%20male%20portrait&sign=e53a45a0e2ef5ba23982d6db8693456b',
  bio: '热爱风光和人像摄影，喜欢探索城市中的几何美感和自然中的光影变化。',
  joinDate: '2023-01-15',
  followers: 123,
  following: 45,
  posts: 28,
  coverImage: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=photography%20studio%20background%20modern%20minimalist&sign=8848033bdf94e05818be4d57164ea015',
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
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=morning%20sunrise%20mountain%20landscape%20mist%20china&sign=a50c8d6084b10f76978cc2afb1ca29a9',
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
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=city%20skyline%20silhouette%20sunset%20urban%20architecture%20modern&sign=8de72287cf83cda70c057b89bfc1d186',
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
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=ocean%20waves%20crashing%20on%20rocks%20long%20exposure%20seascape&sign=e3c4cd3840caaaedc19f43f96183a958',
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
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=forest%20morning%20mist%20sunlight%20rays%20trees%20mystical&sign=0d866462637658cb7796789831e1cc68',
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
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=ancient%20town%20stone%20street%20reflection%20rain%20chinese%20architecture&sign=4e1f2c0a4a5f3c8b8e4d7a9c2b6e1d5f',
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
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=milky%20way%20galaxy%20stars%20night%20sky%20long%20exposure%20astrophotography&sign=7a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d',
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
  { id: '1', name: '风光作品集', cover: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=landscape%20photography%20collection&sign=1a2b3c4d5e6f7a8b9c0d1e2f', count: 12, date: '2023-06-01' },
  { id: '2', name: '城市探索', cover: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=urban%20exploration%20photography&sign=2a3b4c5d6e7f8a9b0c1d2e3f', count: 8, date: '2023-08-15' },
  { id: '3', name: '人像精选', cover: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=portrait%20photography%20collection&sign=3a4b5c6d7e8f9a0b1c2d3e4f', count: 6, date: '2023-09-20' }
];

const tabs = [
  { id: 'works', name: '作品', count: mockPhotographyPosts.length },
  { id: 'stats', name: '数据', count: 0 },
  { id: 'collections', name: '收藏集', count: collections.length },
  { id: 'about', name: '关于', count: 0 }
];

const activeTab = ref('works');
</script>