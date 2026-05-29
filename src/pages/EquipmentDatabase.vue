<template>
  <div class="container mx-auto px-4 py-8 bg-[#1E2532] star-texture min-h-screen">
    <div class="mb-6">
      <router-link to="/profile-center" class="inline-flex items-center space-x-1 text-[#B8C6D8]/70 hover:text-[#B8C6D8] transition-colors">
        <i class="fa-solid fa-arrow-left"></i>
        <span>返回个人中心</span>
      </router-link>
    </div>

    <div class="mb-8 text-center">
      <h1 class="text-3xl font-bold text-[#F5F7FA] mb-2">摄影器材数据库</h1>
      <p class="text-[#B8C6D8] max-w-2xl mx-auto">浏览和管理您的摄影器材信息，记录每件器材的购买日期和序列号</p>
    </div>

    <!-- 总览统计 -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="bg-[#2D3748] rounded-xl p-6 border border-[#4A5F8B] flex items-center">
        <div class="w-12 h-12 rounded-full bg-[#4A5F8B]/20 flex items-center justify-center text-[#4A5F8B] mr-4">
          <i class="fa-solid fa-camera text-xl"></i>
        </div>
        <div>
          <p class="text-sm text-[#B8C6D8]">相机机身</p>
          <p class="text-2xl font-bold text-[#F5F7FA]">{{ equipmentData.cameras.length }}</p>
        </div>
      </div>
      <div class="bg-[#2D3748] rounded-xl p-6 border border-[#4A5F8B] flex items-center">
        <div class="w-12 h-12 rounded-full bg-[#4A5F8B]/20 flex items-center justify-center text-[#4A5F8B] mr-4">
          <i class="fa-solid fa-video text-xl"></i>
        </div>
        <div>
          <p class="text-sm text-[#B8C6D8]">镜头</p>
          <p class="text-2xl font-bold text-[#F5F7FA]">{{ equipmentData.lenses.length }}</p>
        </div>
      </div>
      <div class="bg-[#2D3748] rounded-xl p-6 border border-[#4A5F8B] flex items-center">
        <div class="w-12 h-12 rounded-full bg-[#4A5F8B]/20 flex items-center justify-center text-[#4A5F8B] mr-4">
          <i class="fa-solid fa-gem text-xl"></i>
        </div>
        <div>
          <p class="text-sm text-[#B8C6D8]">配件</p>
          <p class="text-2xl font-bold text-[#F5F7FA]">{{ equipmentData.accessories.length }}</p>
        </div>
      </div>
    </div>

    <!-- 搜索和分类排序 -->
    <div class="bg-[#2D3748] rounded-xl p-6 mb-8 border border-[#4A5F8B]">
      <div class="flex flex-col md:flex-row gap-4">
        <div class="flex-1 relative">
          <i class="fa-solid fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-[#B8C6D8]"></i>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索器材名称、型号..."
            class="w-full pl-10 pr-4 py-3 bg-[#1E2532] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all"
          />
        </div>
        <select
          v-model="selectedType"
          class="px-4 py-3 bg-[#1E2532] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all"
        >
          <option value="all">全部类型</option>
          <option value="camera">相机</option>
          <option value="lens">镜头</option>
          <option value="accessory">配件</option>
        </select>
        <select
          v-model="selectedBrand"
          class="px-4 py-3 bg-[#1E2532] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all"
        >
          <option value="all">全部品牌</option>
          <option v-for="(count, brand) in brandCounts" :key="brand" :value="brand">{{ brand }} ({{ count }})</option>
        </select>
      </div>
    </div>

    <!-- 筛选结果统计 -->
    <div v-if="searchQuery || selectedType !== 'all' || selectedBrand !== 'all'" class="mb-4 text-sm text-[#B8C6D8]">
      找到 {{ filteredEquipment.length }} 件符合条件的器材
    </div>

    <!-- 器材列表 -->
    <div class="space-y-8">
      <!-- 相机 -->
      <div v-if="selectedType === 'all' || selectedType === 'camera'" class="bg-[#2D3748] rounded-xl p-6 border border-[#4A5F8B]">
        <h2 class="text-xl font-bold text-[#F5F7FA] mb-4">相机机身</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="camera in filteredEquipment.filter(e => e.type === 'camera')" :key="camera.id"
            class="bg-[#1E2532] rounded-xl overflow-hidden border border-[#4A5F8B] hover:-translate-y-1 hover:shadow-lg transition-all duration-200"
          >
            <div class="relative h-48 overflow-hidden">
              <img :src="camera.image" :alt="camera.name" class="w-full h-full object-cover" />
              <div class="absolute top-3 left-3">
                <span class="px-2 py-1 bg-[#2D3748] text-[#4A5F8B] rounded-full text-xs font-medium">{{ camera.brand }}</span>
              </div>
            </div>
            <div class="p-4">
              <h3 class="font-bold text-[#F5F7FA] mb-1">{{ camera.name }}</h3>
              <p class="text-sm text-[#B8C6D8] mb-2">{{ camera.model }}</p>
              <div class="flex justify-between items-center">
                <div>
                  <p class="text-xs text-[#6B7C93]">特征: {{ camera.feature }}</p>
                  <p class="text-xs text-[#6B7C93]">序列号: {{ camera.serialNumber }}</p>
                  <p class="text-xs text-[#6B7C93]">购买日期: {{ camera.purchaseDate }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 镜头 -->
      <div v-if="selectedType === 'all' || selectedType === 'lens'" class="bg-[#2D3748] rounded-xl p-6 border border-[#4A5F8B]">
        <h2 class="text-xl font-bold text-[#F5F7FA] mb-4">镜头</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="lens in filteredEquipment.filter(e => e.type === 'lens')" :key="lens.id"
            class="bg-[#1E2532] rounded-xl overflow-hidden border border-[#4A5F8B] hover:-translate-y-1 hover:shadow-lg transition-all duration-200"
          >
            <div class="relative h-48 overflow-hidden">
              <img :src="lens.image" :alt="lens.name" class="w-full h-full object-cover" />
              <div class="absolute top-3 left-3">
                <span class="px-2 py-1 bg-[#2D3748] text-[#4A5F8B] rounded-full text-xs font-medium">{{ lens.brand }}</span>
              </div>
            </div>
            <div class="p-4">
              <h3 class="font-bold text-[#F5F7FA] mb-1">{{ lens.name }}</h3>
              <p class="text-sm text-[#B8C6D8] mb-2">{{ lens.model }}</p>
              <div>
                <p class="text-xs text-[#6B7C93]">焦距: {{ lens.focalLength }}</p>
                <p class="text-xs text-[#6B7C93]">光圈: {{ lens.aperture }}</p>
                <p class="text-xs text-[#6B7C93]">序列号: {{ lens.serialNumber }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 配件 -->
      <div v-if="selectedType === 'all' || selectedType === 'accessory'" class="bg-[#2D3748] rounded-xl p-6 border border-[#4A5F8B]">
        <h2 class="text-xl font-bold text-[#F5F7FA] mb-4">配件</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="accessory in filteredEquipment.filter(e => e.type === 'accessory')" :key="accessory.id"
            class="bg-[#1E2532] rounded-xl overflow-hidden border border-[#4A5F8B] hover:-translate-y-1 hover:shadow-lg transition-all duration-200"
          >
            <div class="relative h-48 overflow-hidden">
              <img :src="accessory.image" :alt="accessory.name" class="w-full h-full object-cover" />
              <div class="absolute top-3 left-3">
                <span class="px-2 py-1 bg-[#2D3748] text-[#4A5F8B] rounded-full text-xs font-medium">{{ accessory.brand }}</span>
              </div>
            </div>
            <div class="p-4">
              <h3 class="font-bold text-[#F5F7FA] mb-1">{{ accessory.name }}</h3>
              <p class="text-sm text-[#B8C6D8] mb-2">{{ accessory.model }}</p>
              <div>
                <p class="text-xs text-[#6B7C93]">类型: {{ accessory.accessoryType }}</p>
                <p class="text-xs text-[#6B7C93]">序列号: {{ accessory.serialNumber }}</p>
                <p class="text-xs text-[#6B7C93]">购买日期: {{ accessory.purchaseDate }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 无结果提示 -->
    <div v-if="filteredEquipment.length === 0" class="p-16 text-center">
      <div class="w-20 h-20 bg-[#4A5F8B] rounded-full flex items-center justify-center mx-auto mb-6">
        <i class="fa-solid fa-camera-retro text-3xl text-[#F5F7FA]"></i>
      </div>
      <h3 class="text-xl font-bold text-[#F5F7FA] mb-3">暂无器材记录</h3>
      <p class="text-[#B8C6D8] mb-8 max-w-md mx-auto">您还没有添加任何摄影器材到数据库中，点击下方按钮开始添加</p>
      <router-link to="/equipment-library" class="px-8 py-3 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#3A4B6F] transition-colors border border-[#4A5F8B] inline-block">
        <i class="fa-solid fa-plus mr-2"></i>前往器材库添加
      </router-link>
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

interface EquipmentItem {
  id: string
  type: 'camera' | 'lens' | 'accessory'
  name: string
  brand: string
  model: string
  image: string
  serialNumber: string
  purchaseDate: string
  feature?: string
  focalLength?: string
  aperture?: string
  accessoryType?: string
}

const equipmentData = {
  cameras: [
    {
      id: 'c1', type: 'camera' as const, name: '索尼A7R5', brand: '索尼', model: 'A7R5',
      image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=sony%20a7r5%20camera%20product%20on%20white&sign=1e65898af80db8ffbab3f4831adf1087',
      serialNumber: 'SN001234', purchaseDate: '2023-05-15', feature: '6100万像素'
    },
    {
      id: 'c2', type: 'camera' as const, name: '索尼A7C II', brand: '索尼', model: 'A7C II',
      image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=sony%20a7c%20ii%20camera%20product%20on%20white&sign=c618aa5927cb08f9095b8ac7ff98bda1',
      serialNumber: 'SN005678', purchaseDate: '2024-01-20', feature: '3300万像素'
    },
    {
      id: 'c3', type: 'camera' as const, name: '索尼A1', brand: '索尼', model: 'A1',
      image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=sony%20a1%20camera%20product%20on%20white&sign=00cbc08ca9a22e6215654b4c3e1c47a8',
      serialNumber: 'SN009012', purchaseDate: '2023-09-10', feature: '5010万像素'
    },
  ],
  lenses: [
    {
      id: 'l1', type: 'lens' as const, name: '索尼FE 24-70mm F2.8 GM', brand: '索尼', model: 'FE 24-70mm F2.8 GM',
      image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=sony%20fe%2024%2070%20mm%20lens%20product%20on%20white&sign=ba2e6116a41c2802edd63c7077872c2c',
      serialNumber: 'LN029371', purchaseDate: '2023-11-01', focalLength: '24-70mm', aperture: 'f/2.8'
    },
    {
      id: 'l2', type: 'lens' as const, name: '索尼FE 70-200mm F2.8 GM', brand: '索尼', model: 'FE 70-200mm F2.8 GM',
      image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=sony%20fe%2070%20200%20mm%20lens%20product%20on%20white&sign=d2c1ccb7ebebe3d7dae8c7189cbc75b8',
      serialNumber: 'LN048291', purchaseDate: '2023-06-15', focalLength: '70-200mm', aperture: 'f/2.8'
    },
    {
      id: 'l3', type: 'lens' as const, name: '索尼FE 50mm F1.2 GM', brand: '索尼', model: 'FE 50mm F1.2 GM',
      image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=sony%20fe%2050%20mm%20f1.2%20lens%20product%20on%20white&sign=8d9064d65b5d53b8ece956d3749f1509',
      serialNumber: 'LN019384', purchaseDate: '2024-02-10', focalLength: '50mm', aperture: 'f/1.2'
    },
    {
      id: 'l4', type: 'lens' as const, name: '索尼FE 16-35mm F2.8 GM', brand: '索尼', model: 'FE 16-35mm F2.8 GM',
      image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=sony%20fe%2016%2035%20mm%20lens%20product%20on%20white&sign=cbcb4a32cbcb019efe8f1cf36cb8eec5',
      serialNumber: 'LN056789', purchaseDate: '2023-07-20', focalLength: '16-35mm', aperture: 'f/2.8'
    },
  ],
  accessories: [
    {
      id: 'a1', type: 'accessory' as const, name: 'DJI RS 3 Pro稳定器', brand: '大疆', model: 'RS 3 Pro',
      image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=dji%20rs3%20pro%20gimbal%20product%20on%20white&sign=48560fad2ed4e0cb90f08541fe3a33d0',
      serialNumber: 'SN082910', purchaseDate: '2023-09-01', accessoryType: '稳定器'
    },
    {
      id: 'a2', type: 'accessory' as const, name: 'GoPro HERO12 Black', brand: 'GoPro', model: 'HERO12 Black',
      image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=gopro%20hero12%20black%20camera%20product%20on%20white&sign=1bf4fc6bef099d9ed62defc8aff01a6c',
      serialNumber: 'SN074829', purchaseDate: '2023-12-01', accessoryType: '运动相机'
    },
  ],
}

const allEquipment = [
  ...equipmentData.cameras,
  ...equipmentData.lenses,
  ...equipmentData.accessories
]

const searchQuery = ref('')
const selectedType = ref('all')
const selectedBrand = ref('all')

const brandCounts = computed(() => {
  const counts: Record<string, number> = {}
  allEquipment.forEach(item => {
    counts[item.brand] = (counts[item.brand] || 0) + 1
  })
  return counts
})

const filteredEquipment = computed(() => {
  let result = allEquipment

  if (selectedType.value !== 'all') {
    result = result.filter(item => item.type === selectedType.value)
  }
  if (selectedBrand.value !== 'all') {
    result = result.filter(item => item.brand === selectedBrand.value)
  }
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    result = result.filter(
      item =>
        item.name.toLowerCase().includes(query) ||
        item.model.toLowerCase().includes(query) ||
        item.brand.toLowerCase().includes(query) ||
        item.serialNumber.toLowerCase().includes(query)
    )
  }
  return result
})
</script>