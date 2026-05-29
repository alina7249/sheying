<template>
  <div v-if="loading" class="flex items-center justify-center h-full">
    <div class="w-16 h-16 border-4 border-[#4A5F8B] border-t-transparent rounded-full animate-spin"></div>
  </div>

  <div v-else class="space-y-6">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-[#F5F7FA]">仪表盘</h1>
        <p class="text-[#B8C6D8] mt-1">欢迎回来，查看系统运行情况</p>
      </div>
      <div class="flex items-center space-x-3">
        <div class="flex bg-[#2D3748] rounded-lg overflow-hidden">
          <button
            v-for="range in timeRanges"
            :key="range.value"
            @click="timeRange = range.value"
            :class="[
              'px-4 py-2 text-sm transition-colors',
              timeRange === range.value
                ? 'bg-[#4A5F8B] text-[#F5F7FA]'
                : 'text-[#B8C6D8] hover:bg-[#4A5F8B]/20'
            ]"
          >
            {{ range.label }}
          </button>
        </div>
        <Button @click="refreshData" :loading="loadingRefreshing">
          <i class="fa-solid fa-arrows-rotate mr-2"></i>
          刷新
        </Button>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatsCard
        title="总用户数"
        icon="fa-users"
        value="12,580"
        trend="up"
        trendValue="+5.2%"
        description="较上月增长"
      />
      <StatsCard
        title="新增用户"
        icon="fa-user-plus"
        value="1,245"
        trend="up"
        trendValue="+8.7%"
        description="本月新增"
      />
      <StatsCard
        title="内容总数"
        icon="fa-images"
        value="8,762"
        trend="up"
        trendValue="+3.1%"
        description="包括作品和帖子"
      />
      <StatsCard
        title="订单收入"
        icon="fa-coins"
        value="¥15,620"
        trend="up"
        trendValue="+12.3%"
        description="本月收入"
      />
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatsCard
        title="活跃用户"
        icon="fa-user-check"
        value="2,845"
        trend="up"
        trendValue="+12.5%"
        description="今日活跃"
      />
      <StatsCard
        title="新作品数"
        icon="fa-camera"
        value="342"
        trend="up"
        trendValue="+6.8%"
        description="今日新增"
      />
      <StatsCard
        title="评论数"
        icon="fa-comments"
        value="1,523"
        trend="down"
        trendValue="-3.2%"
        description="今日评论"
      />
      <StatsCard
        title="系统运行率"
        icon="fa-server"
        value="99.8%"
        trend="up"
        trendValue="+0.1%"
        description="系统状态"
      />
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 bg-[#2D3748] rounded-xl p-6 border border-[#4A5F8B]">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-bold text-[#F5F7FA]">用户增长趋势</h2>
          <div class="flex space-x-2">
            <div class="flex items-center">
              <span class="w-3 h-3 bg-[#4A5F8B] rounded-full mr-1"></span>
              <span class="text-xs text-[#B8C6D8]">总用户</span>
            </div>
            <div class="flex items-center">
              <span class="w-3 h-3 bg-[#6B7C93] rounded-full mr-1"></span>
              <span class="text-xs text-[#B8C6D8]">新增用户</span>
            </div>
          </div>
        </div>
        <div class="h-80">
          <ChartCanvas
            type="line"
            :data="userGrowthChartData"
            :options="lineChartOptions"
          />
        </div>
      </div>

      <div class="bg-[#2D3748] rounded-xl p-6 border border-[#4A5F8B]">
        <h2 class="text-lg font-bold text-[#F5F7FA] mb-4">内容分布</h2>
        <div class="h-60">
          <ChartCanvas
            type="pie"
            :data="contentStatsChartData"
            :options="pieChartOptions"
          />
        </div>
        <div class="grid grid-cols-2 gap-2 mt-4">
          <div v-for="(item, index) in contentStatsData" :key="index" class="flex items-center">
            <span
              class="w-3 h-3 rounded-full mr-2"
              :style="{ backgroundColor: COLORS[index % COLORS.length] }"
            ></span>
            <span class="text-sm text-[#B8C6D8]">{{ item.name }}</span>
            <span class="ml-auto text-sm font-medium text-[#F5F7FA]">{{ item.value }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="bg-[#2D3748] rounded-xl p-6 border border-[#4A5F8B]">
        <h2 class="text-lg font-bold text-[#F5F7FA] mb-4">订单收入</h2>
        <div class="h-60">
          <ChartCanvas
            type="bar"
            :data="orderStatsChartData"
            :options="barChartOptions"
          />
        </div>
      </div>

      <div class="lg:col-span-2 bg-[#2D3748] rounded-xl p-6 border border-[#4A5F8B]">
        <h2 class="text-lg font-bold text-[#F5F7FA] mb-4">最近活动</h2>
        <div class="space-y-4">
          <div
            v-for="activity in recentActivities"
            :key="activity.id"
            class="flex items-start p-3 bg-[#1E2532] rounded-lg border border-[#4A5F8B] hover:border-[#6B7C93] transition-colors"
          >
            <div class="w-10 h-10 rounded-full bg-[#4A5F8B]/20 flex items-center justify-center text-[#4A5F8B] mr-3 flex-shrink-0">
              <i :class="['fa-solid', getActivityIcon(activity.type)]"></i>
            </div>
            <div class="flex-1">
              <div class="flex items-center justify-between mb-1">
                <div class="flex items-center">
                  <span class="font-medium text-[#F5F7FA]">{{ activity.user }}</span>
                  <span class="mx-2 text-[#6B7C93]">•</span>
                  <span class="text-sm text-[#6B7C93]">{{ activity.time }}</span>
                </div>
                <span :class="['text-xs px-2 py-0.5 rounded-full', getActivityBadgeClass(activity.type)]">
                  {{ activity.type }}
                </span>
              </div>
              <p class="text-[#B8C6D8]">{{ activity.action }}</p>
            </div>
          </div>
        </div>
        <div class="mt-4 text-center">
          <button class="text-sm text-[#4A5F8B] hover:text-[#6B7C93] transition-colors">
            查看全部活动
            <i class="fa-solid fa-chevron-right ml-1 text-xs"></i>
          </button>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="bg-[#2D3748] rounded-xl p-6 border border-[#4A5F8B]">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-bold text-[#F5F7FA]">热门作品</h2>
          <button class="text-sm text-[#4A5F8B] hover:text-[#6B7C93]">查看全部</button>
        </div>
        <div class="space-y-4">
          <div v-for="work in topWorks" :key="work.id" class="flex items-center gap-4 p-3 bg-[#1E2532] rounded-lg">
            <img :src="work.thumbnail" :alt="work.title" class="w-16 h-16 rounded-lg object-cover" />
            <div class="flex-1 min-w-0">
              <h4 class="text-white font-medium truncate">{{ work.title }}</h4>
              <p class="text-sm text-[#6B7C93]">{{ work.author }}</p>
            </div>
            <div class="text-right">
              <div class="flex items-center gap-4 text-sm text-[#B8C6D8]">
                <span><i class="fa-solid fa-heart text-red-400 mr-1"></i>{{ work.likes }}</span>
                <span><i class="fa-solid fa-eye text-blue-400 mr-1"></i>{{ work.views }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-[#2D3748] rounded-xl p-6 border border-[#4A5F8B]">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-bold text-[#F5F7FA]">系统状态</h2>
          <button class="text-sm text-[#4A5F8B] hover:text-[#6B7C93]">详情</button>
        </div>
        <div class="space-y-4">
          <div class="space-y-2">
            <div class="flex justify-between text-sm">
              <span class="text-[#B8C6D8]">CPU使用率</span>
              <span class="text-white">45%</span>
            </div>
            <div class="h-2 bg-[#1E2532] rounded-full overflow-hidden">
              <div class="h-full bg-blue-500 rounded-full" style="width: 45%"></div>
            </div>
          </div>
          <div class="space-y-2">
            <div class="flex justify-between text-sm">
              <span class="text-[#B8C6D8]">内存使用率</span>
              <span class="text-white">68%</span>
            </div>
            <div class="h-2 bg-[#1E2532] rounded-full overflow-hidden">
              <div class="h-full bg-green-500 rounded-full" style="width: 68%"></div>
            </div>
          </div>
          <div class="space-y-2">
            <div class="flex justify-between text-sm">
              <span class="text-[#B8C6D8]">磁盘空间</span>
              <span class="text-white">32%</span>
            </div>
            <div class="h-2 bg-[#1E2532] rounded-full overflow-hidden">
              <div class="h-full bg-purple-500 rounded-full" style="width: 32%"></div>
            </div>
          </div>
          <div class="space-y-2">
            <div class="flex justify-between text-sm">
              <span class="text-[#B8C6D8]">数据库连接</span>
              <span class="text-green-400">正常</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="bg-[#2D3748] rounded-xl p-6 border border-[#4A5F8B]">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-bold text-[#F5F7FA]">热门标签</h2>
        </div>
        <div class="flex flex-wrap gap-2">
          <span v-for="tag in topTags" :key="tag.name" :class="['px-3 py-2 rounded-full text-sm', tag.color]">
            #{{ tag.name }}
            <span class="text-xs text-white/60 ml-1">({{ tag.count }})</span>
          </span>
        </div>
      </div>

      <div class="bg-[#2D3748] rounded-xl p-6 border border-[#4A5F8B]">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-bold text-[#F5F7FA]">热门用户</h2>
          <button class="text-sm text-[#4A5F8B] hover:text-[#6B7C93]">查看全部</button>
        </div>
        <div class="space-y-3">
          <div v-for="user in topUsers" :key="user.id" class="flex items-center gap-4 p-2 bg-[#1E2532] rounded-lg">
            <img :src="user.avatar" :alt="user.name" class="w-10 h-10 rounded-full object-cover" />
            <div class="flex-1 min-w-0">
              <h4 class="text-white font-medium truncate">{{ user.name }}</h4>
              <p class="text-sm text-[#6B7C93]">{{ user.followers }} 粉丝</p>
            </div>
            <span :class="['px-2 py-1 rounded-full text-xs', user.badge]">
              {{ user.title }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import StatsCard from '../../components/common/StatsCard.vue'
import Button from '../../components/common/Button.vue'
import ChartCanvas from '../../components/common/ChartCanvas.vue'

const timeRanges = [
  { value: 'day' as const, label: '今日' },
  { value: 'week' as const, label: '本周' },
  { value: 'month' as const, label: '本月' },
]

const timeRange = ref<'day' | 'week' | 'month'>('month')
const loading = ref(true)
const loadingRefreshing = ref(false)

let loadTimer: ReturnType<typeof setTimeout> | null = null

onMounted(() => {
  loadTimer = setTimeout(() => {
    loading.value = false
  }, 1000)
})

onUnmounted(() => {
  if (loadTimer) clearTimeout(loadTimer)
})

function refreshData() {
  loadingRefreshing.value = true
  setTimeout(() => {
    loadingRefreshing.value = false
  }, 800)
}

const userGrowthData = [
  { date: '1月', users: 4000, newUsers: 2400 },
  { date: '2月', users: 3000, newUsers: 1398 },
  { date: '3月', users: 2000, newUsers: 9800 },
  { date: '4月', users: 2780, newUsers: 3908 },
  { date: '5月', users: 1890, newUsers: 4800 },
  { date: '6月', users: 2390, newUsers: 3800 },
  { date: '7月', users: 3490, newUsers: 4300 }
]

const contentStatsData = [
  { name: '摄影作品', value: 400 },
  { name: '社区帖子', value: 300 },
  { name: '评论', value: 300 },
  { name: '小组', value: 200 }
]

const orderStatsData = [
  { month: '1月', amount: 2400 },
  { month: '2月', amount: 1398 },
  { month: '3月', amount: 9800 },
  { month: '4月', amount: 3908 },
  { month: '5月', amount: 4800 },
  { month: '6月', amount: 3800 },
  { month: '7月', amount: 4300 }
]

const COLORS = ['#4A5F8B', '#6B7C93', '#38B2AC', '#68D391']

const topWorks = [
  { id: '1', title: '晨曦中的山峦', author: '光影捕手', thumbnail: 'https://picsum.photos/1280/720?random=190', likes: 2345, views: 15678 },
  { id: '2', title: '城市剪影', author: '城市摄影师', thumbnail: 'https://picsum.photos/1280/720?random=191', likes: 1876, views: 12345 },
  { id: '3', title: '海浪与礁石', author: '风光达人', thumbnail: 'https://picsum.photos/1280/720?random=192', likes: 1543, views: 9876 },
  { id: '4', title: '森林晨雾', author: '自然探索者', thumbnail: 'https://picsum.photos/1280/720?random=193', likes: 1234, views: 8765 },
]

const topTags = [
  { name: '风光', count: 3456, color: 'bg-blue-500/20 text-blue-400' },
  { name: '人像', count: 2345, color: 'bg-pink-500/20 text-pink-400' },
  { name: '城市', count: 1876, color: 'bg-purple-500/20 text-purple-400' },
  { name: '夜景', count: 1543, color: 'bg-yellow-500/20 text-yellow-400' },
  { name: '街拍', count: 1234, color: 'bg-green-500/20 text-green-400' },
  { name: '建筑', count: 987, color: 'bg-red-500/20 text-red-400' },
  { name: '星空', count: 765, color: 'bg-indigo-500/20 text-indigo-400' },
  { name: '微距', count: 543, color: 'bg-cyan-500/20 text-cyan-400' },
]

const topUsers = [
  { id: '1', name: '光影捕手', avatar: 'https://picsum.photos/400/400?random=180', followers: 12543, title: '热门摄影师', badge: 'bg-yellow-500/20 text-yellow-400' },
  { id: '2', name: '城市摄影师', avatar: 'https://picsum.photos/400/400?random=181', followers: 8765, title: '新晋红人', badge: 'bg-purple-500/20 text-purple-400' },
  { id: '3', name: '风光达人', avatar: 'https://picsum.photos/400/400?random=182', followers: 6543, title: '活跃创作者', badge: 'bg-green-500/20 text-green-400' },
  { id: '4', name: '自然探索者', avatar: 'https://picsum.photos/400/400?random=183', followers: 4321, title: '创作新星', badge: 'bg-blue-500/20 text-blue-400' },
]

const recentActivities = [
  { id: 1, type: '用户注册', user: '张三', time: '10分钟前', action: '注册了新账号' },
  { id: 2, type: '作品发布', user: '李四', time: '25分钟前', action: '发布了新作品《城市风光》' },
  { id: 3, type: '评论', user: '王五', time: '45分钟前', action: '评论了作品《山水之间》' },
  { id: 4, type: '订单', user: '赵六', time: '1小时前', action: '购买了会员服务' },
  { id: 5, type: '小组创建', user: '孙七', time: '2小时前', action: '创建了新小组《人像摄影爱好者》' },
  { id: 6, type: '点赞', user: '周八', time: '3小时前', action: '点赞了作品《星空》' }
]

function getActivityIcon(type: string) {
  if (type === '用户注册') return 'fa-user-plus'
  if (type === '作品发布') return 'fa-image'
  if (type === '评论') return 'fa-comment'
  if (type === '订单') return 'fa-shopping-cart'
  if (type === '小组创建') return 'fa-users'
  return 'fa-heart'
}

function getActivityBadgeClass(type: string) {
  if (type === '用户注册') return 'bg-[#38B2AC]/20 text-[#38B2AC]'
  if (type === '作品发布') return 'bg-[#4A5F8B]/20 text-[#4A5F8B]'
  if (type === '评论') return 'bg-[#6B7C93]/20 text-[#6B7C93]'
  if (type === '订单') return 'bg-[#F6AD55]/20 text-[#F6AD55]'
  if (type === '小组创建') return 'bg-[#9F7AEA]/20 text-[#9F7AEA]'
  return 'bg-[#F687B3]/20 text-[#F687B3]'
}

const userGrowthChartData = computed(() => ({
  labels: userGrowthData.map(d => d.date),
  datasets: [
    {
      label: '总用户',
      data: userGrowthData.map(d => d.users),
      borderColor: '#4A5F8B',
      backgroundColor: '#4A5F8B',
      tension: 0.3,
      pointRadius: 4,
      pointHoverRadius: 6,
      borderWidth: 2,
    },
    {
      label: '新增用户',
      data: userGrowthData.map(d => d.newUsers),
      borderColor: '#6B7C93',
      backgroundColor: '#6B7C93',
      tension: 0.3,
      pointRadius: 4,
      pointHoverRadius: 6,
      borderWidth: 2,
    },
  ],
}))

const contentStatsChartData = computed(() => ({
  labels: contentStatsData.map(d => d.name),
  datasets: [
    {
      data: contentStatsData.map(d => d.value),
      backgroundColor: contentStatsData.map((_, i) => COLORS[i % COLORS.length]),
      borderWidth: 0,
    },
  ],
}))

const orderStatsChartData = computed(() => ({
  labels: orderStatsData.map(d => d.month),
  datasets: [
    {
      label: '收入',
      data: orderStatsData.map(d => d.amount),
      backgroundColor: '#4A5F8B',
      borderRadius: 4,
    },
  ],
}))

const lineChartOptions = {
  plugins: {
    legend: { display: false },
  },
  scales: {
    x: {
      grid: { color: '#4A5F8B', drawBorder: false },
      ticks: { color: '#B8C6D8' },
    },
    y: {
      grid: { color: '#4A5F8B', drawBorder: false },
      ticks: { color: '#B8C6D8' },
    },
  },
}

const pieChartOptions = {
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (ctx: any) => {
          const total = ctx.dataset.data.reduce((a: number, b: number) => a + b, 0)
          const pct = ((ctx.raw / total) * 100).toFixed(0)
          return `${ctx.label}: ${ctx.raw} (${pct}%)`
        },
      },
    },
  },
}

const barChartOptions = {
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (ctx: any) => `¥${ctx.raw}`,
      },
    },
  },
  scales: {
    x: {
      grid: { color: '#4A5F8B', drawBorder: false },
      ticks: { color: '#B8C6D8' },
    },
    y: {
      grid: { color: '#4A5F8B', drawBorder: false },
      ticks: { color: '#B8C6D8' },
    },
  },
}
</script>