<template>
  <div class="container mx-auto px-4 py-8 bg-[#1E2532] star-texture min-h-screen">
    <Banner />

    <div class="bg-[#2D3748] border border-[#4A5F8B] rounded-xl p-6 shadow-sm mb-12">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <div class="flex items-center mb-4 md:mb-0">
          <div class="w-16 h-16 rounded-full bg-[#4A5F8B] flex items-center justify-center mr-4">
            <i class="fa-solid fa-cloud-sun text-2xl text-[#F5F7FA]"></i>
          </div>
          <div>
            <h3 class="text-xl font-bold text-[#F5F7FA]">北京市 - 今天</h3>
            <p class="text-sm text-[#B8C6D8]">2025年11月17日 17:41</p>
          </div>
        </div>
        <div class="flex items-center">
          <span class="text-4xl font-bold text-[#F5F7FA] mr-2">15°C</span>
          <div class="flex items-center">
            <i class="fa-solid fa-temperature-low text-[#4A5F8B] mr-1"></i>
            <span class="text-[#B8C6D8]">10°C</span>
            <span class="mx-1 text-[#4A5F8B]">/</span>
            <i class="fa-solid fa-temperature-high text-[#4A5F8B] mr-1"></i>
            <span class="text-[#B8C6D8]">18°C</span>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div class="bg-[#1E2532] rounded-lg p-3 text-center">
          <p class="text-sm text-[#B8C6D8] mb-1">湿度</p>
          <p class="text-lg font-medium text-[#F5F7FA] flex items-center justify-center">
            <i class="fa-solid fa-tint mr-1 text-[#4A5F8B]"></i>45%
          </p>
        </div>
        <div class="bg-[#1E2532] rounded-lg p-3 text-center">
          <p class="text-sm text-[#B8C6D8] mb-1">风速</p>
          <p class="text-lg font-medium text-[#F5F7FA] flex items-center justify-center">
            <i class="fa-solid fa-wind mr-1 text-[#4A5F8B]"></i>3级
          </p>
        </div>
        <div class="bg-[#1E2532] rounded-lg p-3 text-center">
          <p class="text-sm text-[#B8C6D8] mb-1">紫外线</p>
          <p class="text-lg font-medium text-[#F5F7FA] flex items-center justify-center">
            <i class="fa-solid fa-sun mr-1 text-[#4A5F8B]"></i>弱
          </p>
        </div>
        <div class="bg-[#1E2532] rounded-lg p-3 text-center">
          <p class="text-sm text-[#B8C6D8] mb-1">日出日落</p>
          <p class="text-lg font-medium text-[#F5F7FA] flex items-center justify-center">
            <i class="fa-solid fa-sunrise mr-1 text-[#4A5F8B]"></i>06:58/17:05
          </p>
        </div>
      </div>

      <div class="bg-[#1E2532] rounded-lg p-4">
        <h4 class="text-base font-medium text-[#F5F7FA] mb-3 flex items-center">
          <i class="fa-solid fa-lightbulb text-[#4A5F8B] mr-2"></i>今日摄影建议
        </h4>
        <p class="text-sm text-[#B8C6D8] mb-4">今日天气晴朗，微风，非常适合户外摄影。下午光线柔和，是拍摄人像和风光的黄金时段。</p>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div class="p-3 rounded-lg text-center bg-[#4A5F8B]/20 border border-[#4A5F8B]">
            <p class="text-xs text-[#B8C6D8] mb-1">风光摄影</p>
            <div class="flex justify-center">
              <i v-for="i in 5" :key="i" :class="['fa-solid fa-star text-sm', i <= 4 ? 'text-[#4A5F8B]' : 'text-[#1E2532]']"></i>
            </div>
          </div>
          <div class="p-3 rounded-lg text-center bg-[#4A5F8B]/20 border border-[#4A5F8B]">
            <p class="text-xs text-[#B8C6D8] mb-1">人像摄影</p>
            <div class="flex justify-center">
              <i v-for="i in 5" :key="i" :class="['fa-solid fa-star text-sm', i <= 5 ? 'text-[#4A5F8B]' : 'text-[#1E2532]']"></i>
            </div>
          </div>
          <div class="p-3 rounded-lg text-center bg-[#4A5F8B]/20 border border-[#4A5F8B]">
            <p class="text-xs text-[#B8C6D8] mb-1">街拍摄影</p>
            <div class="flex justify-center">
              <i v-for="i in 5" :key="i" :class="['fa-solid fa-star text-sm', i <= 4 ? 'text-[#4A5F8B]' : 'text-[#1E2532]']"></i>
            </div>
          </div>
          <div class="p-3 rounded-lg text-center bg-[#4A5F8B]/20 border border-[#4A5F8B]">
            <p class="text-xs text-[#B8C6D8] mb-1">夜景摄影</p>
            <div class="flex justify-center">
              <i v-for="i in 5" :key="i" :class="['fa-solid fa-star text-sm', i <= 3 ? 'text-[#4A5F8B]' : 'text-[#1E2532]']"></i>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-4">
        <h4 class="text-base font-medium text-[#F5F7FA] mb-3">未来天气预报</h4>
        <div class="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide">
          <div
            v-for="(day, index) in dailyForecast"
            :key="index"
            class="flex-shrink-0 w-24 bg-[#1E2532] rounded-lg p-3 text-center"
          >
            <p class="text-sm text-[#F5F7FA] mb-2">{{ day.day }}</p>
            <div class="w-10 h-10 rounded-full bg-[#4A5F8B]/20 flex items-center justify-center mx-auto mb-2">
              <i :class="['fa-solid', day.icon, 'text-[#4A5F8B]']"></i>
            </div>
            <p class="text-xs text-[#B8C6D8] mb-1">{{ day.weather }}</p>
            <p class="text-xs text-[#F5F7FA]">{{ day.temp }}</p>
          </div>
        </div>
      </div>
    </div>

    <Feature />

    <div class="mb-12">
      <h2 class="text-2xl font-bold text-[#F5F7FA] mb-6">灵感专栏</h2>
      <div class="flex overflow-x-auto pb-4 scrollbar-hide space-x-6">
        <div
          v-for="item in inspirationItems"
          :key="item.id"
          class="flex-shrink-0 w-80 bg-[#2D3748] border border-[#4A5F8B] rounded-lg overflow-hidden shadow-sm inspiration-card"
        >
          <div class="h-48 overflow-hidden">
            <img :src="item.image" :alt="item.title" class="w-full h-full object-cover" />
          </div>
          <div class="p-4">
            <h3 class="text-lg font-bold text-[#F5F7FA] mb-2">{{ item.title }}</h3>
            <p class="text-sm text-[#B8C6D8] mb-3 line-clamp-2">{{ item.description }}</p>
            <div class="flex items-center text-sm text-[#4A5F8B]">
              <span>by {{ item.author }}</span>
              <i class="fa-solid fa-chevron-right ml-auto text-xs"></i>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2">
        <div class="mb-8 overflow-x-auto pb-2">
          <div class="flex space-x-2 min-w-max">
            <button
              @click="selectedCategory = 'all'"
              :class="selectedCategory === 'all' ? 'bg-[#4A5F8B] text-[#F5F7FA] shadow-md' : 'bg-[#2D3748] text-[#B8C6D8] border border-[#4A5F8B] hover:border-[#6B7C93]'"
              class="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4A5F8B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1E2532] active:scale-95"
              :aria-pressed="selectedCategory === 'all'"
            >
              全部
            </button>
            <button
              @click="selectedCategory = '极简主义'"
              :class="selectedCategory === '极简主义' ? 'bg-[#4A5F8B] text-[#F5F7FA] shadow-md' : 'bg-[#2D3748] text-[#B8C6D8] border border-[#4A5F8B] hover:border-[#6B7C93]'"
              class="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4A5F8B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1E2532] active:scale-95"
              :aria-pressed="selectedCategory === '极简主义'"
            >
              极简主义
            </button>
            <button
              @click="selectedCategory = '黑白'"
              :class="selectedCategory === '黑白' ? 'bg-[#4A5F8B] text-[#F5F7FA] shadow-md' : 'bg-[#2D3748] text-[#B8C6D8] border border-[#4A5F8B] hover:border-[#6B7C93]'"
              class="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4A5F8B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1E2532] active:scale-95"
              :aria-pressed="selectedCategory === '黑白'"
            >
              黑白
            </button>
            <button
              @click="selectedCategory = '胶片'"
              :class="selectedCategory === '胶片' ? 'bg-[#4A5F8B] text-[#F5F7FA] shadow-md' : 'bg-[#2D3748] text-[#B8C6D8] border border-[#4A5F8B] hover:border-[#6B7C93]'"
              class="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4A5F8B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1E2532] active:scale-95"
              :aria-pressed="selectedCategory === '胶片'"
            >
              胶片质感
            </button>
            <button
              @click="selectedCategory = '暗调'"
              :class="selectedCategory === '暗调' ? 'bg-[#4A5F8B] text-[#F5F7FA] shadow-md' : 'bg-[#2D3748] text-[#B8C6D8] border border-[#4A5F8B] hover:border-[#6B7C93]'"
              class="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4A5F8B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1E2532] active:scale-95"
              :aria-pressed="selectedCategory === '暗调'"
            >
              暗调氛围
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            v-for="post in filteredPosts"
            :key="post.id"
            class="photo-card-appear"
          >
            <PhotographyCard :post="post" />
          </div>
        </div>

        <div class="mt-10 text-center">
          <Button variant="outline" @click="handleLoadMore" ariaLabel="加载更多摄影作品">
            加载更多作品
          </Button>
        </div>
      </div>

      <div class="lg:col-span-1 space-y-8">
        <div class="relative">
          <input
            type="text"
            placeholder="搜索作品、摄影师或风格..."
            class="w-full px-4 py-3 pl-12 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all placeholder:text-[#B8C6D8]"
          />
          <i class="fa-solid fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-[#B8C6D8]"></i>
        </div>

        <div class="bg-[#2D3748] border border-[#4A5F8B] rounded-lg p-6">
          <h3 class="text-lg font-bold mb-4 text-[#F5F7FA]">热门风格</h3>
          <div class="flex flex-wrap gap-2">
            <router-link
              v-for="tag in popularTags"
              :key="tag.id"
              :to="`/search?tag=${tag.name}`"
              class="px-3 py-1 bg-[#2D3748] text-[#B8C6D8] rounded-full text-sm hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors border border-[#4A5F8B]"
            >
              #{{ tag.name }}({{ tag.count }})
            </router-link>
          </div>
        </div>

        <div class="bg-[#2D3748] border border-[#4A5F8B] rounded-lg p-6">
          <h3 class="text-lg font-bold mb-4 text-[#F5F7FA]">推荐艺术家</h3>
          <div class="space-y-4">
            <div v-for="photographer in featuredPhotographers" :key="photographer.id" class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <img
                  :src="photographer.avatar"
                  :alt="photographer.name"
                  class="w-12 h-12 rounded-full object-cover border border-[#B8C6D8]"
                />
                <div>
                  <p class="font-medium text-[#F5F7FA]">{{ photographer.name }}</p>
                  <p class="text-xs text-[#4A5F8B]">{{ photographer.level }}</p>
                  <p class="text-sm text-[#B8C6D8]">
                    {{ photographer.followers.toLocaleString() }}粉丝 · {{ photographer.posts }}作品
                  </p>
                </div>
              </div>
              <button class="px-3 py-1 text-xs font-medium text-[#F5F7FA] bg-[#4A5F8B] hover:bg-[#3A4B6F] rounded-full transition-colors">
                关注
              </button>
            </div>
          </div>
        </div>

        <div class="bg-[#2D3748] border border-[#4A5F8B] rounded-lg p-6">
          <h3 class="text-lg font-bold mb-3 text-[#F5F7FA]">黑白影像专题</h3>
          <p class="text-sm text-[#B8C6D8] mb-4">探索黑白摄影的艺术魅力，感受光影交织的视觉语言和情感表达</p>
          <img
            src="https://picsum.photos/800/600?random=207"
            alt="黑白影像专题"
            class="w-full h-40 object-cover rounded-lg mb-4"
          />
          <button class="w-full py-2 bg-gradient-to-r from-[#4A5F8B] to-[#2D3748] text-[#F5F7FA] rounded-lg font-medium transition-colors border border-[#4A5F8B]">
            探索专题
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Banner from '../components/Banner.vue'
import Feature from '../components/Feature.vue'
import PhotographyCard from '../components/PhotographyCard.vue'
import Button from '../components/common/Button.vue'

const photographyPosts = [{
  id: "1",
  title: "黑白光影",
  description: "Leica Q2 Monochrom | 光圈: f/2.8 | 快门: 1/125s | ISO: 800\n极简主义黑白摄影，通过光影对比展现建筑的几何美感。",
  image: "https://picsum.photos/1280/720?random=208",
  author: {
    id: "1",
    name: "极简摄影师林风",
    avatar: "https://picsum.photos/400/400?random=209"
  },
  likes: 342,
  comments: 42,
  collections: 28,
  tags: ["极简主义", "黑白", "建筑", "徕卡"],
  date: "2023-10-25"
}, {
  id: "2",
  title: "胶片质感人像",
  description: "Canon AE-1 + 50mm f/1.4 | 光圈: f/2.0 | 快门: 1/125s | ISO: 400\n使用复古胶片相机拍摄的人像作品，自然柔和的色调与颗粒感。",
  image: "https://picsum.photos/600/800?random=210",
  author: {
    id: "2",
    name: "胶片摄影师安娜",
    avatar: "https://picsum.photos/400/400?random=211"
  },
  likes: 412,
  comments: 56,
  collections: 35,
  tags: ["人像", "胶片", "复古", "自然光"],
  date: "2023-10-24"
}, {
  id: "3",
  title: "暗调氛围",
  description: "Sony A7R IV + 35mm f/1.4 GM | 光圈: f/2.8 | 快门: 1/60s | ISO: 1600\n营造神秘而富有故事感的暗调氛围人像，强调光影层次与情绪表达。",
  image: "https://picsum.photos/800/600?random=212",
  author: {
    id: "3",
    name: "情绪摄影师李明",
    avatar: "https://picsum.photos/400/400?random=213"
  },
  likes: 389,
  comments: 49,
  collections: 31,
  tags: ["暗调", "氛围", "情绪", "人像"],
  date: "2023-10-23"
}, {
  id: "4",
  title: "极简静物",
  description: "Fujifilm GFX 100S + 120mm f/4 Macro | 光圈: f/5.6 | 快门: 1/125s | ISO: 200\n通过简洁的构图和柔和的光线，展现日常物品的质感与美感。",
  image: "https://picsum.photos/400/400?random=214",
  author: {
    id: "4",
    name: "静物摄影师王静",
    avatar: "https://picsum.photos/400/400?random=215"
  },
  likes: 276,
  comments: 32,
  collections: 22,
  tags: ["静物", "极简", "中画幅", "富士"],
  date: "2023-10-22"
}, {
  id: "5",
  title: "城市几何",
  description: "iPhone 15 Pro + 原生相机 | 光圈: f/2.2 | 快门: 1/1000s | ISO: 25\n从独特视角发现城市中的几何美感，手机摄影也能创造艺术作品。",
  image: "https://picsum.photos/1280/720?random=216",
  author: {
    id: "5",
    name: "手机摄影师张强",
    avatar: "https://picsum.photos/400/400?random=217"
  },
  likes: 321,
  comments: 41,
  collections: 25,
  tags: ["城市", "几何", "手机摄影", "极简"],
  date: "2023-10-21"
}, {
  id: "6",
  title: "黑白纪实",
  description: "Canon EOS R6 + 24-70mm f/2.8 | 光圈: f/4 | 快门: 1/250s | ISO: 800\n用黑白影像记录城市中的人文瞬间，展现生活的真实与温度。",
  image: "https://picsum.photos/1280/720?random=218",
  author: {
    id: "6",
    name: "纪实摄影师陈默",
    avatar: "https://picsum.photos/400/400?random=219"
  },
  likes: 398,
  comments: 52,
  collections: 33,
  tags: ["黑白", "纪实", "人文", "街头"],
  date: "2023-10-20"
}]

const popularTags = [{
  id: 1,
  name: "极简主义",
  count: 1456
}, {
  id: 2,
  name: "黑白",
  count: 1245
}, {
  id: 3,
  name: "胶片质感",
  count: 987
}, {
  id: 4,
  name: "暗调氛围",
  count: 765
}, {
  id: 5,
  name: "建筑",
  count: 654
}, {
  id: 6,
  name: "人像",
  count: 543
}, {
  id: 7,
  name: "城市几何",
  count: 432
}, {
  id: 8,
  name: "静物",
  count: 321
}]

const featuredPhotographers = [{
  id: "101",
  name: "黑白影像达人",
  avatar: "https://picsum.photos/400/400?random=220",
  followers: 12543,
  posts: 324,
  level: "新锐艺术家"
}, {
  id: "102",
  name: "胶片艺术师",
  avatar: "https://picsum.photos/400/400?random=221",
  followers: 8765,
  posts: 213,
  level: "资深摄影师"
}, {
  id: "103",
  name: "建筑几何控",
  avatar: "https://picsum.photos/400/400?random=222",
  followers: 6543,
  posts: 187,
  level: "创意摄影师"
}]

const inspirationItems = [{
  id: "1",
  title: "黑白摄影的光影艺术",
  author: "林风",
  description: "探索如何通过光影对比创造出富有情感和深度的黑白影像作品...",
  image: "https://picsum.photos/600/800?random=223"
}, {
  id: "2",
  title: "胶片摄影的复兴与现代应用",
  author: "安娜",
  description: "探讨胶片摄影在数字时代的独特魅力和应用场景，以及如何将传统技术融入现代创作...",
  image: "https://picsum.photos/600/800?random=224"
}, {
  id: "3",
  title: "极简主义摄影的构图法则",
  author: "李明",
  description: "解析极简主义摄影的核心构图原则，帮助你创造简洁而有力的视觉表达...",
  image: "https://picsum.photos/600/800?random=225"
}, {
  id: "4",
  title: "暗房技术与现代数字暗房",
  author: "张强",
  description: "比较传统暗房技术与现代数字暗房的异同，以及如何在后期制作中保留胶片质感...",
  image: "https://picsum.photos/600/800?random=226"
}]

const dailyForecast = [{
  day: "明天",
  weather: "多云",
  temp: "12°/17°",
  icon: "fa-cloud"
}, {
  day: "周一",
  weather: "晴",
  temp: "10°/19°",
  icon: "fa-sun"
}, {
  day: "周二",
  weather: "晴转多云",
  temp: "9°/18°",
  icon: "fa-cloud-sun"
}, {
  day: "周三",
  weather: "小雨",
  temp: "8°/15°",
  icon: "fa-cloud-rain"
}, {
  day: "周四",
  weather: "阴",
  temp: "7°/14°",
  icon: "fa-cloud"
}]

const selectedCategory = ref("all")

const filteredPosts = computed(() => {
  if (selectedCategory.value === "all") {
    return photographyPosts
  }
  return photographyPosts.filter(post => post.tags.includes(selectedCategory.value))
})

const handleLoadMore = () => {
  // 加载更多功能逻辑
  console.log('加载更多作品')
}
</script>

<style scoped>
.inspiration-card {
  transition: transform 0.3s ease;
}
.inspiration-card:hover {
  transform: translateY(-5px);
}

.photo-card-appear {
  animation: fadeInUp 0.5s ease both;
}

.load-more-btn {
  transition: transform 0.2s ease;
}
.load-more-btn:hover {
  transform: scale(1.05);
}
.load-more-btn:active {
  transform: scale(0.95);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>