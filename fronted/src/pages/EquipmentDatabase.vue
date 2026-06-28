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
      <p class="text-[#B8C6D8] max-w-2xl mx-auto">浏览和管理您的摄影器材信息，寻找适合您的器材</p>
    </div>

    <!-- 加载中 -->
    <div v-if="loading" class="flex justify-center items-center py-20">
      <div class="flex flex-col items-center gap-3">
        <div class="w-10 h-10 border-4 border-[#4A5F8B]/30 border-t-[#C9A962] rounded-full animate-spin"></div>
        <span class="text-[#6B7C93] text-sm">加载器材数据...</span>
      </div>
    </div>

    <template v-else>
      <!-- 搜索和筛选 -->
      <div class="bg-[#2D3748] rounded-xl p-6 mb-8 border border-[#4A5F8B]">
        <div class="flex flex-col md:flex-row gap-4">
          <div class="flex-1 relative">
            <i class="fa-solid fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-[#B8C6D8]"></i>
            <input
              v-model="searchName"
              type="text"
              placeholder="搜索器材名称、型号..."
              class="w-full pl-10 pr-4 py-3 bg-[#1E2532] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all"
              @keyup.enter="handleSearch"
            />
          </div>
          <select
            v-model="selectedCategory"
            @change="handleFilterChange"
            class="px-4 py-3 bg-[#1E2532] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all"
          >
            <option value="">全部类型</option>
            <option v-for="cat in categoryList" :key="cat" :value="cat">{{ cat }}</option>
          </select>
          <select
            v-model="selectedBrand"
            @change="handleFilterChange"
            class="px-4 py-3 bg-[#1E2532] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all"
          >
            <option value="">全部品牌</option>
            <option v-for="brand in brandList" :key="brand" :value="brand">{{ brand }}</option>
          </select>
        </div>
      </div>

      <!-- 器材卡片列表 -->
      <div v-if="equipmentList.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div
          v-for="item in equipmentList"
          :key="item.id"
          class="bg-[#2D3748] rounded-xl overflow-hidden border border-[#4A5F8B] hover:-translate-y-1 hover:shadow-lg hover:shadow-[#4A5F8B]/20 transition-all duration-200 cursor-pointer"
          @click="handleItemClick(item)"
        >
          <div class="relative h-48 overflow-hidden">
            <img
              :src="item.coverImage || 'https://picsum.photos/800/600?random=default'"
              :alt="item.name"
              class="w-full h-full object-cover"
            />
            <div class="absolute top-3 left-3">
              <span class="px-2 py-1 bg-[#2D3748]/80 text-[#C9A962] rounded-full text-xs font-medium">{{ item.brand }}</span>
            </div>
            <div v-if="item.category" class="absolute top-3 right-3">
              <span class="px-2 py-1 bg-[#4A5F8B]/80 text-[#F5F7FA] rounded-full text-xs">{{ item.category }}</span>
            </div>
          </div>
          <div class="p-4">
            <h3 class="font-bold text-[#F5F7FA] mb-1 truncate">{{ item.name }}</h3>
            <div class="flex justify-between items-center">
              <span class="text-sm text-[#B8C6D8]">{{ item.brand }}</span>
              <span v-if="item.price" class="text-lg font-bold text-[#C9A962]">¥{{ item.price }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 无结果提示 -->
      <div v-if="equipmentList.length === 0 && !loading" class="p-16 text-center">
        <div class="w-20 h-20 bg-[#4A5F8B]/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <i class="fa-solid fa-camera-retro text-3xl text-[#4A5F8B]"></i>
        </div>
        <h3 class="text-xl font-bold text-[#F5F7FA] mb-3">暂无器材记录</h3>
        <p class="text-[#B8C6D8] mb-8 max-w-md mx-auto">当前筛选条件下没有找到器材，请尝试调整筛选条件</p>
      </div>

      <!-- 分页 -->
      <div v-if="totalPages > 1" class="flex justify-center mt-8">
        <nav class="flex items-center space-x-1 bg-[#2D3748] p-2 rounded-lg border border-[#4A5F8B]">
          <button
            @click="handlePageChange(currentPage - 1)"
            :disabled="currentPage === 1"
            class="px-3 py-2 rounded border border-[#4A5F8B] text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i class="fa-solid fa-chevron-left text-xs"></i>
          </button>
          <button
            v-for="page in totalPages"
            :key="page"
            @click="handlePageChange(page)"
            :class="['px-3 py-2 rounded border transition-colors', page === currentPage ? 'bg-[#4A5F8B] text-[#F5F7FA] border-[#4A5F8B]' : 'border-[#4A5F8B] text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA]']"
          >
            {{ page }}
          </button>
          <button
            @click="handlePageChange(currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="px-3 py-2 rounded border border-[#4A5F8B] text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i class="fa-solid fa-chevron-right text-xs"></i>
          </button>
        </nav>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getEquipmentList } from '../services/api'

const router = useRouter()

interface EquipmentItem {
  id: number
  name: string
  brand: string
  category: string
  price: number
  coverImage: string
}

const equipmentList = ref<EquipmentItem[]>([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = 9
const total = ref(0)
const searchName = ref('')
const selectedCategory = ref('')
const selectedBrand = ref('')

const brandList = ref<string[]>([])
const categoryList = ref<string[]>([])

const totalPages = computed(() => {
  return Math.ceil(total.value / pageSize)
})

const fetchEquipment = async () => {
  loading.value = true
  try {
    const params: any = { current: currentPage.value, pageSize }
    if (selectedBrand.value) params.brand = selectedBrand.value
    if (selectedCategory.value) params.category = selectedCategory.value
    if (searchName.value.trim()) params.name = searchName.value.trim()

    const res: any = await getEquipmentList(
      currentPage.value,
      pageSize,
      selectedBrand.value || undefined,
      selectedCategory.value || undefined,
      searchName.value.trim() || undefined
    )
    if (res?.code === 0 && res.data) {
      equipmentList.value = res.data.records || []
      total.value = res.data.total || 0

      // 提取品牌和分类列表用于筛选
      if (res.data.brandList) brandList.value = res.data.brandList
      if (res.data.categoryList) categoryList.value = res.data.categoryList
    }
  } catch (e) {
    /* ignore */
  } finally {
    loading.value = false
  }
}

const handleItemClick = (item: EquipmentItem) => {
  router.push(`/equipment-review/${item.id}`)
}

const handlePageChange = (page: number) => {
  currentPage.value = page
  fetchEquipment()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const handleSearch = () => {
  currentPage.value = 1
  fetchEquipment()
}

const handleFilterChange = () => {
  currentPage.value = 1
  fetchEquipment()
}

onMounted(() => {
  fetchEquipment()
})
</script>