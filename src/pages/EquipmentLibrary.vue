<template>
  <div class="container mx-auto px-4 py-8 bg-[#1E2532] star-texture min-h-screen">
    <div>
      <!-- 标题区域 -->
      <div class="mb-8">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 class="text-3xl font-bold text-[#F5F7FA] mb-2">摄影器材库</h1>
            <p class="text-[#B8C6D8]">选购专业摄影器材，满足你的各种拍摄需求</p>
          </div>
          <router-link to="/equipment-database" class="mt-4 md:mt-0 px-6 py-3 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#3A4B6F] transition-colors border border-[#4A5F8B] inline-flex items-center">
            <i class="fa-solid fa-database mr-2"></i> 我的器材数据库
          </router-link>
        </div>
      </div>

      <!-- 搜索和筛选 -->
      <div class="bg-[#2D3748] rounded-xl p-6 mb-8 border border-[#4A5F8B]">
        <div class="flex flex-col md:flex-row gap-4">
          <div class="flex-1 relative">
            <i class="fa-solid fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-[#B8C6D8]"></i>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="搜索器材名称、品牌、型号..."
              class="w-full pl-10 pr-4 py-3 bg-[#1E2532] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all"
            />
          </div>
          <select v-model="selectedCategory"
            class="px-4 py-3 bg-[#1E2532] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all">
            <option value="all">全部类别</option>
            <option value="camera">相机</option>
            <option value="lens">镜头</option>
            <option value="accessory">配件</option>
          </select>
          <select v-model="selectedBrand"
            class="px-4 py-3 bg-[#1E2532] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all">
            <option value="all">全部品牌</option>
            <option v-for="(count, brand) in brandCounts" :key="brand" :value="brand">{{ brand }} ({{ count }})</option>
          </select>
        </div>
      </div>

      <!-- 结果统计 -->
      <div class="mb-6 flex justify-between items-center">
        <p class="text-[#B8C6D8]">
          找到 <span class="font-bold text-[#F5F7FA]">{{ filteredProducts.length }}</span> 个商品
        </p>
        <div class="flex items-center space-x-2">
          <span class="text-sm text-[#B8C6D8]">排序：</span>
          <select v-model="sortOrder"
            class="px-3 py-1 bg-[#1E2532] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none text-sm">
            <option value="recommended">推荐</option>
            <option value="priceLow">价格从低到高</option>
            <option value="priceHigh">价格从高到低</option>
            <option value="rating">评分最高</option>
          </select>
        </div>
      </div>

      <!-- 分类快捷导航 -->
      <div class="flex flex-wrap gap-2 mb-8">
        <button
          v-for="cat in categories"
          :key="cat.id"
          @click="selectedCategory = selectedCategory === cat.id ? 'all' : cat.id"
          :class="[
            'px-4 py-2 rounded-full text-sm font-medium border transition-colors',
            selectedCategory === cat.id
              ? 'bg-[#4A5F8B] text-[#F5F7FA] border-[#4A5F8B]'
              : 'bg-[#1E2532] text-[#B8C6D8] border-[#4A5F8B] hover:bg-[#4A5F8B] hover:text-[#F5F7FA]'
          ]"
        >
          <i :class="`fa-solid ${cat.icon} mr-1`"></i> {{ cat.name }}
        </button>
      </div>

      <!-- 产品列表 -->
      <div v-if="sortedProducts.length > 0">
        <div v-for="(category, catIdx) in uniqueCategories" :key="catIdx">
          <h2 v-if="sortedProducts.some(p => p.category === category)" class="text-xl font-bold text-[#F5F7FA] mb-4 mt-8">
            {{ categoryText(category) }}
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <div
              v-for="product in sortedProducts.filter(p => p.category === category)"
              :key="product.id"
              class="bg-[#2D3748] border border-[#4A5F8B] rounded-xl overflow-hidden group hover:-translate-y-1 hover:shadow-lg hover:border-[#4A5F8B] transition-all duration-300"
            >
              <div class="relative h-48 overflow-hidden">
                <img :src="product.image" :alt="product.name" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div class="absolute top-3 left-3">
                  <span class="px-2 py-1 bg-[#2D3748]/90 text-[#B8C6D8] rounded-full text-xs font-medium">{{ product.brand }}</span>
                </div>
                <button
                  class="absolute top-3 right-3 w-9 h-9 bg-[#2D3748]/90 rounded-full flex items-center justify-center text-[#F56565] hover:bg-[#F56565]/20 transition-colors"
                  :title="product.isFav ? '取消收藏' : '加入收藏'"
                >
                  <i :class="['fa-heart', product.isFav ? 'fa-solid' : 'fa-regular']"></i>
                </button>
              </div>
              <div class="p-5">
                <div class="flex justify-between items-start mb-2">
                  <div>
                    <h3 class="font-bold text-[#F5F7FA] group-hover:text-[#4A5F8B] transition-colors">{{ product.name }}</h3>
                    <p class="text-xs text-[#B8C6D8]">{{ product.model }}</p>
                  </div>
                  <div class="flex items-center text-yellow-400">
                    <i class="fa-solid fa-star text-sm mr-1"></i>
                    <span class="text-sm font-medium text-[#B8C6D8]">{{ product.rating }}</span>
                  </div>
                </div>
                <p class="text-sm text-[#B8C6D8] line-clamp-2 mb-4">{{ product.description }}</p>
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-xl font-bold text-[#F5F7FA]">¥{{ product.price.toLocaleString() }}</p>
                    <p v-if="product.originalPrice" class="text-xs text-[#F56565] line-through">¥{{ product.originalPrice.toLocaleString() }}</p>
                  </div>
                  <button
                    class="px-4 py-2 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors text-sm flex items-center border border-[#4A5F8B] active:scale-95 transition-transform"
                  >
                    <i class="fa-solid fa-cart-shopping mr-1"></i> 购买
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 无结果 -->
      <div v-else class="p-16 text-center">
        <div class="w-20 h-20 bg-[#4A5F8B] rounded-full flex items-center justify-center mx-auto mb-6">
          <i class="fa-solid fa-box-open text-3xl text-[#F5F7FA]"></i>
        </div>
        <h3 class="text-xl font-bold text-[#F5F7FA] mb-3">未找到相关器材</h3>
        <p class="text-[#B8C6D8] mb-6">尝试调整搜索条件或筛选器</p>
        <button @click="resetFilters" class="px-6 py-3 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#3A4B6F] transition-colors">
          重置筛选条件
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onUnmounted } from 'vue'
import { toast } from 'sonner'
import { useAuthStore } from '@/store/authStore'

const store = useAuthStore()

const authState = reactive({
  isAuthenticated: store.getState().isAuthenticated,
  user: store.getState().user,
})

const unsubscribe = store.subscribe((state) => {
  authState.isAuthenticated = state.isAuthenticated
  authState.user = state.user
})

onUnmounted(() => {
  unsubscribe()
})

interface Product {
  id: string
  category: string
  name: string
  brand: string
  model: string
  price: number
  originalPrice?: number
  rating: number
  description: string
  image: string
  isFav: boolean
}

const searchQuery = ref('')
const selectedCategory = ref('all')
const selectedBrand = ref('all')
const sortOrder = ref('recommended')

const categories = [
  { id: 'camera', name: '相机', icon: 'fa-camera' },
  { id: 'lens', name: '镜头', icon: 'fa-video' },
  { id: 'accessory', name: '配件', icon: 'fa-gem' },
]

const products: Product[] = [
  {
    id: 'p1', category: 'camera', name: '索尼A7R5', brand: '索尼', model: 'A7R5', price: 26999, rating: 4.9,
    description: '6100万像素全画幅无反相机，AI智能对焦系统，8K视频录制，专业摄影师首选',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=sony%20a7r5%20camera%20product%20on%20white&sign=1e65898af80db8ffbab3f4831adf1087', isFav: false
  },
  {
    id: 'p2', category: 'camera', name: '索尼A7 IV', brand: '索尼', model: 'A7 IV', price: 16999, originalPrice: 17999, rating: 4.8,
    description: '3300万像素全画幅无反相机，10张/秒连拍，多种高速传输，可翻转触控屏',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=sony%20a7iv%20camera%20product%20on%20white&sign=bb4d53e95cfc74e7ea163c606224e7dd', isFav: true
  },
  {
    id: 'p3', category: 'camera', name: '索尼A1', brand: '索尼', model: 'A1', price: 44999, rating: 5.0,
    description: '5010万像素全画幅无反相机，30张/秒连拍，8K30p视频，专业体育和生态摄影',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=sony%20a1%20camera%20product%20on%20white&sign=00cbc08ca9a22e6215654b4c3e1c47a8', isFav: false
  },
  {
    id: 'p4', category: 'camera', name: '佳能EOS R5', brand: '佳能', model: 'EOS R5', price: 22999, rating: 4.7,
    description: '4500万像素全画幅无反相机，最高8级防抖，8K30p视频录制，专业级表现',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=canon%20eos%20r5%20camera%20product%20on%20white&sign=f9c2a8fd38d06d86a795f46ac0ba3296', isFav: false
  },
  {
    id: 'p5', category: 'camera', name: '索尼FX3', brand: '索尼', model: 'FX3', price: 29999, rating: 4.6,
    description: '专业视频拍摄无反相机，全画幅，5轴防抖，专业视频录像，4K120p慢动作',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=sony%20fx3%20camera%20product%20on%20white&sign=7dcd355ed888a37cf44828b4c4bb650f', isFav: false
  },
  {
    id: 'l1', category: 'lens', name: '索尼FE 24-70mm F2.8 GM II', brand: '索尼', model: 'FE 24-70mm F2.8 GM II', price: 13999, originalPrice: 14999, rating: 4.9,
    description: '索尼G大师系列恒定大光圈变焦镜头，画面中心和边缘都具有出色的分辨率',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=sony%20fe%2024%2070%20mm%20lens%20product%20on%20white&sign=ba2e6116a41c2802edd63c7077872c2c', isFav: true
  },
  {
    id: 'l2', category: 'lens', name: '索尼FE 70-200mm F2.8 GM II', brand: '索尼', model: 'FE 70-200mm F2.8 GM II', price: 16999, rating: 4.8,
    description: '新设计的70-200mm f/2.8镜头，更轻更小，画质卓越，快速精准对焦',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=sony%20fe%2070%20200%20mm%20lens%20product%20on%20white&sign=d2c1ccb7ebebe3d7dae8c7189cbc75b8', isFav: false
  },
  {
    id: 'l3', category: 'lens', name: '索尼FE 50mm F1.2 GM', brand: '索尼', model: 'FE 50mm F1.2 GM', price: 12999, rating: 4.7,
    description: '50mm焦距的F1.2大光圈标准定焦，极致虚化，人像摄影的完美选择',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=sony%20fe%2050%20mm%20f1.2%20lens%20product%20on%20white&sign=8d9064d65b5d53b8ece956d3749f1509', isFav: false
  },
  {
    id: 'l4', category: 'lens', name: '索尼FE 16-35mm F2.8 GM II', brand: '索尼', model: 'FE 16-35mm F2.8 GM II', price: 15999, rating: 4.5,
    description: '新款广角变焦G大师镜头，轻巧便携，适合风光与建筑摄影',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=sony%20fe%2016%2035%20mm%20lens%20product%20on%20white&sign=cbcb4a32cbcb019efe8f1cf36cb8eec5', isFav: false
  },
  {
    id: 'a1', category: 'accessory', name: 'DJI RS 3 Pro稳定器', brand: '大疆', model: 'RS 3 Pro', price: 5499, rating: 4.8,
    description: '专业3轴手持稳定器，承重更大，功能更全，轻松实现创意拍摄',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=dji%20rs3%20pro%20gimbal%20product%20on%20white&sign=48560fad2ed4e0cb90f08541fe3a33d0', isFav: false
  },
  {
    id: 'a2', category: 'accessory', name: 'GoPro HERO12 Black', brand: 'GoPro', model: 'HERO12 Black', price: 3199, rating: 4.6,
    description: '5.3K高清运动相机，防水设计，HyperSmooth 5.0视频防抖，卓越性能',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=gopro%20hero12%20black%20camera%20product%20on%20white&sign=1bf4fc6bef099d9ed62defc8aff01a6c', isFav: false
  },
  {
    id: 'a3', category: 'accessory', name: 'Sony ECM-B1M枪麦', brand: '索尼', model: 'ECM-B1M', price: 2299, rating: 4.4,
    description: '数字音频接口枪形麦克风，多种指向性，清晰录音，适用于视频创作',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=sony%20shotgun%20microphone%20product%20on%20white&sign=5978cc8730a99751bc3f74b98c645206', isFav: false
  },
]

const brandCounts = computed(() => {
  const counts: Record<string, number> = {}
  products.forEach(p => { counts[p.brand] = (counts[p.brand] || 0) + 1 })
  return counts
})

const filteredProducts = computed(() => {
  let result = products
  if (selectedCategory.value !== 'all') {
    result = result.filter(p => p.category === selectedCategory.value)
  }
  if (selectedBrand.value !== 'all') {
    result = result.filter(p => p.brand === selectedBrand.value)
  }
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    result = result.filter(p =>
      p.name.toLowerCase().includes(query) ||
      p.model.toLowerCase().includes(query) ||
      p.brand.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query)
    )
  }
  return result
})

const uniqueCategories = computed(() => {
  return [...new Set(filteredProducts.value.map(p => p.category))]
})

const sortedProducts = computed(() => {
  const result = [...filteredProducts.value]
  switch (sortOrder.value) {
    case 'priceLow': result.sort((a, b) => a.price - b.price); break
    case 'priceHigh': result.sort((a, b) => b.price - a.price); break
    case 'rating': result.sort((a, b) => b.rating - a.rating); break
    default: break
  }
  return result
})

const categoryText = (cat: string) => {
  const map: Record<string, string> = { camera: '相机', lens: '镜头', accessory: '配件' }
  return map[cat] || cat
}

const resetFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = 'all'
  selectedBrand.value = 'all'
  sortOrder.value = 'recommended'
  toast.success('筛选条件已重置')
}
</script>