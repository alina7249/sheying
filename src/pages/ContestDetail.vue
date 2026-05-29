<template>
  <div class="container mx-auto px-4 py-8 bg-[#1E2532] star-texture min-h-screen">
    <div v-if="loading" class="flex items-center justify-center min-h-screen">
      <div class="w-16 h-16 border-4 border-[#4A5F8B] border-t-transparent rounded-full animate-spin"></div>
    </div>

    <div v-else-if="!contest" class="min-h-screen">
      <div class="flex flex-col items-center justify-center h-[60vh] text-center">
        <div class="w-16 h-16 bg-[#4A5F8B] rounded-full flex items-center justify-center text-[#F5F7FA] mb-4">
          <i class="fa-solid fa-exclamation-circle text-2xl"></i>
        </div>
        <h2 class="text-2xl font-bold text-[#F5F7FA] mb-2">未找到该赛事</h2>
        <p class="text-[#B8C6D8] mb-6 max-w-md">抱歉，您访问的赛事不存在或已被删除</p>
        <router-link to="/photography-contests" class="px-6 py-3 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#3A4B6F] transition-colors">
          返回赛事列表
        </router-link>
      </div>
    </div>

    <div v-else>
      <div class="mb-6">
        <router-link to="/photography-contests" class="inline-flex items-center space-x-1 text-[#B8C6D8]/70 hover:text-[#B8C6D8] transition-colors">
          <i class="fa-solid fa-arrow-left"></i>
          <span>返回赛事列表</span>
        </router-link>
      </div>

      <div class="relative rounded-xl overflow-hidden mb-8 bg-[#2D3748] border border-[#4A5F8B]">
        <img :src="contest.image" :alt="contest.title" class="w-full h-[50vh] object-cover" />
        <div class="absolute inset-0 bg-gradient-to-t from-[#1E2532] to-transparent"></div>
        <div class="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <div class="flex flex-wrap items-center gap-2 mb-3">
            <span class="px-3 py-1 bg-[#4A5F8B] text-[#F5F7FA] text-sm rounded-full">{{ contest.type }}</span>
            <span :class="['px-3 py-1 text-sm rounded-full', contest.status === '进行中' ? 'bg-[#38B2AC] text-[#F5F7FA]' : contest.status === '已截止' ? 'bg-[#6B7C93] text-[#F5F7FA]' : 'bg-[#2D3748] text-[#F5F7FA]']">
              {{ contest.status }}
            </span>
            <span v-if="contest.status === '进行中'" class="px-3 py-1 bg-[#ED8936] text-[#F5F7FA] text-sm rounded-full">
              还剩 {{ daysLeft }} 天截止
            </span>
          </div>
          <h1 class="text-2xl md:text-3xl lg:text-4xl font-bold text-[#F5F7FA] mb-2">{{ contest.title }}</h1>
          <div v-if="contest.organizer" class="flex items-center text-sm text-[#B8C6D8]">
            <i class="fa-solid fa-building mr-2"></i>
            <span>主办方：{{ contest.organizer }}</span>
          </div>
        </div>
      </div>

      <div class="flex flex-col sm:flex-row justify-between items-center bg-[#2D3748] rounded-xl p-6 mb-8 border border-[#4A5F8B]">
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
          <div class="text-center">
            <h3 class="text-lg font-medium text-[#B8C6D8] mb-1">参与人数</h3>
            <p class="text-3xl font-bold text-[#F5F7FA]">{{ contest.participants }}</p>
          </div>
          <div class="text-center">
            <h3 class="text-lg font-medium text-[#B8C6D8] mb-1">作品数量</h3>
            <p class="text-3xl font-bold text-[#F5F7FA]">{{ contest.worksCount }}</p>
          </div>
          <div class="text-center">
            <h3 class="text-lg font-medium text-[#B8C6D8] mb-1">截止日期</h3>
            <p class="text-xl font-bold text-[#F5F7FA]">{{ contest.deadline }}</p>
          </div>
        </div>
        <div class="mt-4 sm:mt-0">
          <button
            @click="handleJoinContest"
            :class="['px-8 py-3 rounded-lg font-medium transition-colors border', contest.status === '进行中' ? 'bg-[#4A5F8B] text-[#F5F7FA] hover:bg-[#6B7C93] border-[#4A5F8B]' : 'bg-[#6B7C93] text-[#B8C6D8] cursor-not-allowed border-[#6B7C93]']"
            :disabled="contest.status !== '进行中'"
          >
            {{ contest.status === '进行中' ? '立即参赛' : '已截止' }}
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 space-y-8">
          <div class="bg-[#2D3748] rounded-xl p-6 border border-[#4A5F8B]">
            <h2 class="text-xl font-bold text-[#F5F7FA] mb-4">赛事详情</h2>
            <p class="text-[#B8C6D8] leading-relaxed">{{ contest.description }}</p>
            <div class="flex flex-wrap gap-2 mt-6">
              <span v-for="(category, index) in contest.categories" :key="index" class="px-3 py-1 bg-[#1E2532] text-[#B8C6D8] rounded-full text-sm">
                {{ category }}
              </span>
            </div>
          </div>

          <div class="bg-[#2D3748] rounded-xl p-6 border border-[#4A5F8B]">
            <h2 class="text-xl font-bold text-[#F5F7FA] mb-4">奖项设置</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div v-for="(prize, index) in contest.prizes" :key="index" class="p-4 bg-[#1E2532] rounded-lg border border-[#4A5F8B]">
                <div class="flex justify-between items-center mb-2">
                  <h3 class="font-bold text-[#F5F7FA]">{{ prize.rank }}</h3>
                  <span class="text-sm text-[#4A5F8B]">{{ prize.count }}名</span>
                </div>
                <p class="text-xl font-medium text-[#B8C6D8]">{{ prize.value }}</p>
              </div>
            </div>
          </div>

          <div class="bg-[#2D3748] rounded-xl p-6 border border-[#4A5F8B]">
            <h2 class="text-xl font-bold text-[#F5F7FA] mb-4">参赛规则</h2>
            <ul class="space-y-3">
              <li v-for="(rule, index) in contest.rules" :key="index" class="flex items-start">
                <div class="w-8 h-8 rounded-full bg-[#4A5F8B]/20 flex items-center justify-center text-[#4A5F8B] mr-4 flex-shrink-0">
                  {{ index + 1 }}
                </div>
                <p class="text-[#B8C6D8]">{{ rule }}</p>
              </li>
            </ul>
          </div>
        </div>

        <div class="lg:col-span-1 space-y-6">
          <div class="bg-[#2D3748] rounded-xl p-6 border border-[#4A5F8B]">
            <h2 class="text-xl font-bold text-[#F5F7FA] mb-4">赛事日历</h2>
            <div class="p-4 bg-[#1E2532] rounded-lg text-center">
              <div class="text-sm text-[#B8C6D8] mb-1">截止日期</div>
              <div class="text-4xl font-bold text-[#4A5F8B]">{{ new Date(contest.deadline).getDate() }}</div>
              <div class="text-sm text-[#B8C6D8]">{{ ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'][new Date(contest.deadline).getMonth()] }}</div>
            </div>
            <div v-if="contest.status === '进行中'" class="mt-4 p-3 bg-[#ED8936]/20 border border-[#ED8936] rounded-lg">
              <div class="flex justify-between items-center mb-1">
                <span class="text-sm text-[#B8C6D8]">剩余时间</span>
                <span class="text-sm font-medium text-[#F5F7FA]">{{ daysLeft }} 天</span>
              </div>
              <div class="w-full h-2 bg-[#1E2532] rounded-full overflow-hidden">
                <div class="h-full bg-[#ED8936]" :style="{ width: `${Math.max(0, (daysLeft / 60) * 100)}%` }"></div>
              </div>
            </div>
          </div>

          <div class="bg-[#2D3748] rounded-xl p-6 border border-[#4A5F8B]">
            <h2 class="text-xl font-bold text-[#F5F7FA] mb-4">赛事标签</h2>
            <div class="flex flex-wrap gap-2">
              <span v-for="(tag, index) in contest.tags" :key="index" class="px-3 py-1 bg-[#1E2532] text-[#B8C6D8] rounded-full text-sm">
                #{{ tag }}
              </span>
            </div>
          </div>

          <div class="bg-[#2D3748] rounded-xl p-6 border border-[#4A5F8B]">
            <h2 class="text-xl font-bold text-[#F5F7FA] mb-4">分享赛事</h2>
            <div class="grid grid-cols-4 gap-3">
              <button @click="() => toast.info('请在微信中打开此链接进行分享')" class="w-full h-12 bg-[#1E2532] rounded-lg flex items-center justify-center text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors">
                <i class="fa-brands fa-weixin text-xl"></i>
              </button>
              <button @click="shareToWeibo" class="w-full h-12 bg-[#1E2532] rounded-lg flex items-center justify-center text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors">
                <i class="fa-brands fa-weibo text-xl"></i>
              </button>
              <button @click="shareToQQ" class="w-full h-12 bg-[#1E2532] rounded-lg flex items-center justify-center text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors">
                <i class="fa-brands fa-qq text-xl"></i>
              </button>
              <button @click="copyLink" class="w-full h-12 bg-[#1E2532] rounded-lg flex items-center justify-center text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors">
                <i class="fa-solid fa-link text-xl"></i>
              </button>
            </div>
          </div>

          <div class="bg-[#2D3748] rounded-xl p-6 border border-[#4A5F8B]">
            <h2 class="text-xl font-bold text-[#F5F7FA] mb-4">参赛须知</h2>
            <div class="space-y-4">
              <div>
                <h3 class="font-medium text-[#F5F7FA] mb-1">如何提交作品？</h3>
                <p class="text-sm text-[#B8C6D8]">点击"立即参赛"按钮，按照指引上传作品并填写相关信息即可完成报名。</p>
              </div>
              <div>
                <h3 class="font-medium text-[#F5F7FA] mb-1">作品有什么格式要求？</h3>
                <p class="text-sm text-[#B8C6D8]">支持JPG、PNG格式，文件大小不超过20MB，请确保保留作品的EXIF信息。</p>
              </div>
              <div>
                <h3 class="font-medium text-[#F5F7FA] mb-1">如何查询比赛结果？</h3>
                <p class="text-sm text-[#B8C6D8]">比赛结果将在截止日后15个工作日内公布，您可以在赛事页面或个人中心查看结果。</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-[#2D3748] rounded-xl p-6 border border-[#4A5F8B] mt-8">
        <CommentSection :postId="contest.id" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { toast } from 'vue-sonner'
import { useAuthStore } from '@/store/authStore'
import { storeToRefs } from 'pinia'
import CommentSection from '@/components/CommentSection.vue'

const route = useRoute()
const store = useAuthStore()
const { isAuthenticated, user } = storeToRefs(store)

const mockContests = [
  {
    id: 'c1', title: '2023年度黑白摄影大赛', type: '官方主办',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=black%20and%20white%20photography%20contest%20banner%20minimalist&sign=5958a9112dbd48d52283b3d3b68c22df',
    deadline: '2023-12-31', status: '进行中', entries: 1254, worksCount: 3458, participants: 1254,
    prizes: [{ rank: '一等奖', value: '20000元', count: 1 }, { rank: '二等奖', value: '10000元', count: 2 }, { rank: '三等奖', value: '5000元', count: 3 }, { rank: '优秀奖', value: '1000元', count: 10 }],
    description: '展现黑白摄影的独特魅力，通过光影、构图和情感表达，呈现经典而永恒的视觉艺术作品。',
    categories: ['风光', '人像', '纪实', '创意'],
    rules: ['参赛作品必须为黑白照片', '每位参赛者最多提交5幅作品', '作品必须为原创，不得抄袭', '保留EXIF信息，便于评审', '投稿即视为同意主办方拥有作品使用权'],
    tags: ['黑白', '年度', '官方', '奖金', '全球'],
  },
  {
    id: 'c2', title: '索尼Alpha创意摄影挑战赛', type: '合作赛事', organizer: '索尼中国',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=sony%20alpha%20creative%20photography%20challenge%20banner&sign=38f14ccad69f3dbb399991f5317127ce',
    deadline: '2023-11-15', status: '进行中', entries: 876, worksCount: 2156, participants: 876,
    prizes: [{ rank: '金奖', value: '索尼A7R V相机一台', count: 1 }, { rank: '银奖', value: '索尼FE 24-70mm F2.8 GM镜头', count: 2 }, { rank: '铜奖', value: '索尼ZV-1相机一台', count: 3 }, { rank: '入围奖', value: '索尼相机包一个', count: 20 }],
    description: '使用索尼Alpha系列相机创作，展示你的创意视角和摄影才华。',
    categories: ['不限'],
    rules: ['参赛作品必须使用索尼Alpha系列相机拍摄', '每位参赛者最多提交8幅作品', '作品可进行后期处理', '保留原始文件，获奖后需提供验证', '投稿即视为同意活动规则和版权条款'],
    tags: ['索尼', '创意', '器材', '相机', '合作'],
  },
  {
    id: 'c3', title: '城市人文纪实摄影大赛', type: '官方主办',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=urban%20documentary%20photography%20contest%20banner%20street%20life&sign=818fdf65887ba3b9c9d321794542006b',
    deadline: '2023-11-30', status: '进行中', entries: 654, worksCount: 1890, participants: 654,
    prizes: [{ rank: '金奖', value: '15000元', count: 1 }, { rank: '银奖', value: '8000元', count: 2 }, { rank: '铜奖', value: '3000元', count: 3 }, { rank: '人气奖', value: '2000元', count: 1 }],
    description: '记录城市生活的瞬间，展现都市人文风情和社会变迁。',
    categories: ['人文', '纪实', '街拍'],
    rules: ['参赛作品必须为纪实摄影风格', '每位参赛者最多提交6幅作品', '可以是单幅或组照（组照不超过8张）', '作品需附带简短文字说明', '保留真实性，不得过度修改'],
    tags: ['城市', '人文', '纪实', '街拍', '官方'],
  },
  {
    id: 'c4', title: '自然生态摄影展', type: '官方主办',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=natural%20ecology%20photography%20exhibition%20banner%20wildlife&sign=c47d5cf3d76049534c98c3f640cbd2f0',
    deadline: '2023-10-15', status: '已截止', entries: 432, worksCount: 1256, participants: 432,
    prizes: [{ rank: '金奖', value: '12000元', count: 1 }, { rank: '银奖', value: '6000元', count: 2 }, { rank: '铜奖', value: '3000元', count: 3 }, { rank: '优秀奖', value: '1000元', count: 8 }],
    description: '展现大自然的美丽与神奇，记录生态环境和野生动植物的精彩瞬间。',
    categories: ['风光', '野生动物', '植物', '生态环境'],
    rules: ['参赛作品必须为自然生态主题', '每位参赛者最多提交5幅作品', '作品需注明拍摄地点和物种信息', '不得伤害或干扰拍摄对象', '严禁摆拍和人为干预自然行为'],
    tags: ['自然', '生态', '风光', '野生动物', '环保'],
  },
]

const contest = ref<any>(null)
const loading = ref(true)

const daysLeft = computed(() => {
  if (!contest.value || contest.value.status !== '进行中') return 0
  const now = new Date()
  const deadline = new Date(contest.value.deadline)
  return Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
})

onMounted(() => {
  const id = route.params.id as string
  const foundContest = mockContests.find(c => c.id === id)
  if (foundContest) contest.value = foundContest
  loading.value = false
})

const handleJoinContest = () => {
  if (!isAuthenticated.value) {
    window.location.href = '/login'
    return
  }
  toast.success(`已成功参加 ${contest.value?.title}`)
}

const shareToWeibo = () => {
  const url = `https://service.weibo.com/share/share.php?url=${encodeURIComponent(`${window.location.origin}/contest/${route.params.id}`)}&title=${encodeURIComponent(contest.value?.title || '')}`
  window.open(url, '_blank', 'width=600,height=400')
}

const shareToQQ = () => {
  const url = `https://connect.qq.com/widget/shareqq/index.html?url=${encodeURIComponent(`${window.location.origin}/contest/${route.params.id}`)}&title=${encodeURIComponent(contest.value?.title || '')}`
  window.open(url, '_blank', 'width=600,height=400')
}

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(`${window.location.origin}/contest/${route.params.id}`)
    toast.success('链接已复制到剪贴板')
  } catch {
    toast.error('复制失败，请手动复制')
  }
}
</script>