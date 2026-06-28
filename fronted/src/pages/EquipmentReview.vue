<template>
  <div class="container mx-auto px-4 py-8 bg-[#1E2532] star-texture min-h-screen">
    <div class="mb-6">
      <router-link to="/equipment-database" class="inline-flex items-center space-x-1 text-[#B8C6D8]/70 hover:text-[#B8C6D8] transition-colors">
        <i class="fa-solid fa-arrow-left"></i>
        <span>返回器材库</span>
      </router-link>
    </div>

    <!-- 加载中 -->
    <div v-if="loading" class="flex justify-center items-center py-20">
      <div class="flex flex-col items-center gap-3">
        <div class="w-10 h-10 border-4 border-[#4A5F8B]/30 border-t-[#C9A962] rounded-full animate-spin"></div>
        <span class="text-[#6B7C93] text-sm">加载评测数据...</span>
      </div>
    </div>

    <template v-else>
      <!-- 器材信息头部 -->
      <div v-if="equipment" class="bg-[#2D3748] rounded-xl p-6 mb-8 border border-[#4A5F8B]">
        <div class="flex flex-col md:flex-row gap-6">
          <div class="w-full md:w-48 h-48 rounded-xl overflow-hidden flex-shrink-0">
            <img
              :src="equipment.coverImage || 'https://picsum.photos/400/400?random=default'"
              :alt="equipment.name"
              class="w-full h-full object-cover"
            />
          </div>
          <div class="flex-1">
            <h1 class="text-2xl font-bold text-[#F5F7FA] mb-2">{{ equipment.name }}</h1>
            <div class="flex items-center gap-3 mb-4">
              <span class="px-2 py-1 bg-[#4A5F8B]/20 text-[#C9A962] rounded-full text-xs">{{ equipment.brand }}</span>
              <span v-if="equipment.category" class="px-2 py-1 bg-[#2D3748] text-[#B8C6D8] rounded-full text-xs border border-[#4A5F8B]">{{ equipment.category }}</span>
              <span v-if="equipment.price" class="text-lg font-bold text-[#C9A962]">¥{{ equipment.price }}</span>
            </div>
            <div v-if="avgRating > 0" class="flex items-center gap-2 mb-4">
              <div class="flex items-center">
                <i v-for="n in 5" :key="n" :class="['fa-star text-sm', n <= Math.round(avgRating) ? 'fa-solid text-[#C9A962]' : 'fa-regular text-[#6B7C93]']"></i>
              </div>
              <span class="text-[#B8C6D8] text-sm">{{ avgRating.toFixed(1) }}（{{ reviews.length }} 条评测）</span>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- 评测列表 -->
        <div class="lg:col-span-2 space-y-6">
          <h2 class="text-xl font-bold text-[#F5F7FA] mb-4">评测列表</h2>

          <div v-if="reviews.length === 0" class="bg-[#2D3748] rounded-xl p-12 text-center border border-[#4A5F8B]">
            <i class="fa-solid fa-comment-slash text-4xl text-[#6B7C93] mb-4 block"></i>
            <p class="text-[#B8C6D8]">暂无评测，快来写第一条评测吧</p>
          </div>

          <div v-for="review in reviews" :key="review.id" class="bg-[#2D3748] rounded-xl p-6 border border-[#4A5F8B]">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-3">
                <img
                  :src="review.userAvatar || 'https://picsum.photos/400/400?random=avatar'"
                  :alt="review.userName"
                  class="w-10 h-10 rounded-full object-cover border border-[#4A5F8B]"
                />
                <div>
                  <p class="font-medium text-[#F5F7FA]">{{ review.userName }}</p>
                  <p class="text-xs text-[#6B7C93]">{{ formatTime(review.createTime) }}</p>
                </div>
              </div>
              <div class="flex items-center gap-1">
                <i v-for="n in 5" :key="n" :class="['fa-star text-xs', n <= review.rating ? 'fa-solid text-[#C9A962]' : 'fa-regular text-[#6B7C93]']"></i>
              </div>
            </div>
            <h3 class="font-bold text-[#F5F7FA] mb-2">{{ review.title }}</h3>
            <p class="text-[#B8C6D8] text-sm whitespace-pre-wrap">{{ review.content }}</p>
          </div>

          <!-- 分页 -->
          <div v-if="reviewTotalPages > 1" class="flex justify-center mt-8">
            <nav class="flex items-center space-x-1 bg-[#2D3748] p-2 rounded-lg border border-[#4A5F8B]">
              <button
                @click="handleReviewPageChange(reviewPage - 1)"
                :disabled="reviewPage === 1"
                class="px-3 py-2 rounded border border-[#4A5F8B] text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <i class="fa-solid fa-chevron-left text-xs"></i>
              </button>
              <button
                v-for="page in reviewTotalPages"
                :key="page"
                @click="handleReviewPageChange(page)"
                :class="['px-3 py-2 rounded border transition-colors', page === reviewPage ? 'bg-[#4A5F8B] text-[#F5F7FA] border-[#4A5F8B]' : 'border-[#4A5F8B] text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA]']"
              >
                {{ page }}
              </button>
              <button
                @click="handleReviewPageChange(reviewPage + 1)"
                :disabled="reviewPage === reviewTotalPages"
                class="px-3 py-2 rounded border border-[#4A5F8B] text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <i class="fa-solid fa-chevron-right text-xs"></i>
              </button>
            </nav>
          </div>
        </div>

        <!-- 侧边栏 - 写评测表单 -->
        <div class="lg:col-span-1">
          <div class="bg-[#2D3748] rounded-xl p-6 border border-[#4A5F8B] sticky top-24">
            <h3 class="text-lg font-bold text-[#F5F7FA] mb-4">写评测</h3>
            <div v-if="!isAuthenticated" class="text-center py-6">
              <p class="text-[#6B7C93] text-sm mb-3">请先登录后发表评测</p>
              <router-link to="/login" class="px-4 py-2 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg text-sm font-medium hover:bg-[#6B7C93] transition-colors inline-block">
                去登录
              </router-link>
            </div>
            <form v-else @submit.prevent="handleSubmitReview" class="space-y-4">
              <div>
                <label class="block text-sm text-[#B8C6D8] mb-1">标题</label>
                <input
                  v-model="reviewForm.title"
                  type="text"
                  placeholder="评测标题"
                  required
                  class="w-full px-4 py-2 bg-[#1E2532] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all placeholder:text-[#6B7C93] text-sm"
                />
              </div>
              <div>
                <label class="block text-sm text-[#B8C6D8] mb-1">评分</label>
                <div class="flex items-center gap-1">
                  <button
                    v-for="n in 5"
                    :key="n"
                    type="button"
                    @click="reviewForm.rating = n"
                    class="text-xl transition-colors"
                  >
                    <i :class="['fa-star', n <= reviewForm.rating ? 'fa-solid text-[#C9A962]' : 'fa-regular text-[#6B7C93] hover:text-[#C9A962]']"></i>
                  </button>
                </div>
              </div>
              <div>
                <label class="block text-sm text-[#B8C6D8] mb-1">内容</label>
                <textarea
                  v-model="reviewForm.content"
                  placeholder="写下您的使用体验..."
                  rows="5"
                  required
                  class="w-full px-4 py-2 bg-[#1E2532] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all placeholder:text-[#6B7C93] text-sm resize-none"
                ></textarea>
              </div>
              <button
                type="submit"
                :disabled="submitting"
                class="w-full py-2 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                <span v-if="submitting">
                  <i class="fa-solid fa-spinner fa-spin mr-2"></i>提交中...
                </span>
                <span v-else>提交评测</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getEquipmentDetail, getEquipmentReviews, addEquipmentReview } from '../services/api'
import { useAuthStore } from '../store/authStore'
import { storeToRefs } from 'pinia'

const route = useRoute()
const authStore = useAuthStore()
const { isAuthenticated } = storeToRefs(authStore)

const equipmentId = computed(() => Number(route.params.id))

const equipment = ref<any>(null)
const reviews = ref<any[]>([])
const loading = ref(false)
const submitting = ref(false)
const reviewPage = ref(1)
const reviewPageSize = 10
const reviewTotal = ref(0)

const reviewForm = ref({
  title: '',
  content: '',
  rating: 0,
})

const avgRating = computed(() => {
  if (reviews.value.length === 0) return 0
  const sum = reviews.value.reduce((acc, r) => acc + (r.rating || 0), 0)
  return sum / reviews.value.length
})

const reviewTotalPages = computed(() => {
  return Math.ceil(reviewTotal.value / reviewPageSize)
})

const fetchEquipmentDetail = async () => {
  try {
    const res: any = await getEquipmentDetail(equipmentId.value)
    if (res?.code === 0 && res.data) {
      equipment.value = res.data
    }
  } catch (e) {
    /* ignore */
  }
}

const fetchReviews = async () => {
  try {
    const res: any = await getEquipmentReviews(equipmentId.value, reviewPage.value, reviewPageSize)
    if (res?.code === 0 && res.data) {
      reviews.value = res.data.records || []
      reviewTotal.value = res.data.total || 0
    }
  } catch (e) {
    /* ignore */
  }
}

const loadAll = async () => {
  loading.value = true
  await Promise.all([fetchEquipmentDetail(), fetchReviews()])
  loading.value = false
}

const handleSubmitReview = async () => {
  if (!reviewForm.value.title.trim() || !reviewForm.value.content.trim() || reviewForm.value.rating === 0) return
  submitting.value = true
  try {
    const res: any = await addEquipmentReview({
      equipmentId: equipmentId.value,
      title: reviewForm.value.title.trim(),
      content: reviewForm.value.content.trim(),
      rating: reviewForm.value.rating,
    })
    if (res?.code === 0) {
      reviewForm.value = { title: '', content: '', rating: 0 }
      reviewPage.value = 1
      await fetchReviews()
    }
  } catch (e) {
    /* ignore */
  } finally {
    submitting.value = false
  }
}

const handleReviewPageChange = (page: number) => {
  reviewPage.value = page
  fetchReviews()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const formatTime = (time: string) => {
  if (!time) return ''
  const d = new Date(time)
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  if (diff < 60000) return '刚刚'
  if (diff < 3600000) return Math.floor(diff / 60000) + '分钟前'
  if (diff < 86400000) return Math.floor(diff / 3600000) + '小时前'
  return d.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
}

onMounted(() => {
  loadAll()
})
</script>