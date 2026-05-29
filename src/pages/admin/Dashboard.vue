<template>
  <div v-if="loading" class="flex items-center justify-center h-full">
    <div class="w-16 h-16 border-4 border-[#4A5F8B] border-t-transparent rounded-full animate-spin"></div>
  </div>

  <div v-else class="space-y-6">
    <div class="flex items-center justify-between">
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